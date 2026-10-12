import Painting from "../model/painting.js";
import s3 from "../utils/s3-utils.js";
import crypto from "crypto";
import {
    normalizeString,
    buildImageFilename,
    processImageBuffer,
} from "../utils/painting-utils.js";

const toBoolean = (val) => val === "true" || val === true;

function normalizePaymentLink(value) {
    if (!value?.trim()) return undefined;

    let url;
    try {
        url = new URL(value.trim());
    } catch {
        throw Object.assign(new Error("Payment link must be a valid URL"), {
            status: 400,
        });
    }

    if (url.protocol !== "https:") {
        throw Object.assign(new Error("Payment link must use HTTPS"), {
            status: 400,
        });
    }

    url.searchParams.delete("client_reference_id");
    return url.toString();
}

function buildPaymentUrl(paymentLink, paintingId) {
    if (!paymentLink) return undefined;

    const url = new URL(paymentLink);
    if (
        ["buy.stripe.com", "checkout.stripe.com"].includes(url.hostname) &&
        process.env.STRIPE_REFERENCE_SECRET
    ) {
        const id = String(paintingId);
        const signature = crypto
            .createHmac("sha256", process.env.STRIPE_REFERENCE_SECRET)
            .update(id)
            .digest("hex");
        url.searchParams.set("client_reference_id", `${id}_${signature}`);
    }

    return url.toString();
}

function getUrlList(baseFilename, updatedAt) {
    if (!baseFilename) return [];
    const version = updatedAt ? `?v=${new Date(updatedAt).getTime()}` : "";
    const baseUrl = `${s3.S3_BASE_URL}${baseFilename}${version}`;
    const urls = [baseUrl];
    const [path, query] = baseUrl.split("?");
    const lastDot = path.lastIndexOf(".");
    if (lastDot === -1) return urls;
    const prefix = path.slice(0, lastDot);
    const extension = path.slice(lastDot);
    for (let i = 2; i <= 5; i++) {
        const variant = `${prefix}${i}${extension}`;
        urls.push(query ? `${variant}?${query}` : variant);
    }
    return urls;
}

function imageResponse(painting) {
    const urls = getUrlList(painting.image, painting.updatedAt);
    const { squareLink, ...paintingData } = painting;
    return {
        ...paintingData,
        image: urls[0] || null,
        images: urls,
        paymentLink: buildPaymentUrl(
            painting.paymentLink || squareLink,
            painting._id,
        ),
    };
}

/** Process and upload a single new file to S3. Throws with an appropriate status on failure. */
async function processAndUpload(file, filename) {
    let processedBuffer;
    try {
        processedBuffer = await processImageBuffer(file.buffer);
    } catch {
        throw Object.assign(
            new Error(
                `Failed to process image "${file.originalname}": unsupported format or corrupted file`,
            ),
            { status: 400 },
        );
    }
    try {
        await s3.uploadToS3(processedBuffer, filename, "image/webp");
    } catch {
        throw Object.assign(
            new Error(`Failed to upload image "${file.originalname}" to S3`),
            { status: 502 },
        );
    }
}

async function getAllPaintings() {
    const paintings = await Painting.find({})
        .collation({ locale: "en", strength: 2 })
        .sort({ name: 1 })
        .lean();

    return paintings.map(imageResponse);
}

async function getPaintingByName(name) {
    const painting = await Painting.findOne({ name }).lean();
    if (!painting) return null;
    return imageResponse(painting);
}

async function deletePainting(id) {
    const painting = await Painting.findById(id);
    if (!painting) return;

    for (let i = 0; i < 5; i++) {
        try {
            await s3.deleteFromS3(buildImageFilename(painting.name, i));
        } catch (_) {
            // Slot may not exist — that's fine
        }
    }
    await Painting.findByIdAndDelete(id);
}

async function createPainting({
    name,
    length,
    width,
    depth,
    date,
    paint,
    canvas,
    finish,
    desc,
    price,
    paymentLink,
    mult,
    framed,
    sold,
    files,
}) {
    const normalizedName = normalizeString(name);
    const existing = await Painting.findOne({ name: normalizedName });
    if (existing) {
        throw Object.assign(
            new Error(`A painting named "${normalizedName}" already exists`),
            { status: 409 },
        );
    }

    for (let i = 0; i < (files?.length || 0); i++) {
        await processAndUpload(files[i], buildImageFilename(normalizedName, i));
    }

    const painting = await Painting.create({
        name: normalizedName,
        image: buildImageFilename(normalizedName, 0),
        dimensions: {
            length: length ? Number(length) : undefined,
            width: width ? Number(width) : undefined,
            depth: depth ? Number(depth) : undefined,
        },
        date: date ? Number(date) : undefined,
        paint: normalizeString(paint),
        canvas: normalizeString(canvas),
        finish: normalizeString(finish),
        desc: desc ? desc.trim() : undefined,
        price: price ? Number(price) : undefined,
        paymentLink: normalizePaymentLink(paymentLink),
        mult: toBoolean(mult),
        framed: toBoolean(framed),
        sold: toBoolean(sold),
    });

    return imageResponse(painting.toObject());
}

async function updatePainting(
    name,
    {
        newName,
        length,
        width,
        depth,
        date,
        paint,
        canvas,
        finish,
        desc,
        price,
        paymentLink,
        mult,
        framed,
        sold,
        files,
        slots,
    },
) {
    const parsedSlots = JSON.parse(slots || "[]");
    if (!parsedSlots[0] || parsedSlots[0].type === "empty") {
        throw Object.assign(new Error("First image slot is required"), {
            status: 400,
        });
    }

    const SLOT_COUNT = Math.max(5, parsedSlots.length);

    const painting = await Painting.findOne({ name });
    if (!painting) return null;

    const normalizedNewName = newName
        ? normalizeString(newName)
        : painting.name;

    const originalFilenames = new Set();
    const survivingFilenames = new Set();
    const renameOperations = []; // {oldFilename, newFilename}

    // old filenames
    for (let i = 0; i < SLOT_COUNT; i++) {
        originalFilenames.add(buildImageFilename(painting.name, i));
    }

    // collect rename operations and new-file slots separately
    // so we can do ALL renames before ANY uploads. This prevents
    // a new upload from overwriting an existing file that still
    // needs to be renamed (e.g. drag-swap existing + new image).
    const newFileSlots = []; // { file, newFilename }
    let fileIndex = 0;

    for (let slot = 0; slot < SLOT_COUNT; slot++) {
        const curSlot = parsedSlots[slot];
        const newFilename = buildImageFilename(normalizedNewName, slot);

        if (!curSlot || curSlot.type === "empty") {
            continue;
        }

        if (curSlot.type === "existing") {
            const oldFilename = curSlot.filename;

            survivingFilenames.add(newFilename);

            if (oldFilename && oldFilename !== newFilename) {
                renameOperations.push({
                    oldFilename,
                    newFilename,
                });
            }
        }

        if (curSlot.type === "new") {
            const file = files?.[fileIndex++];
            if (!file) continue;
            newFileSlots.push({ file, newFilename });
            survivingFilenames.add(newFilename);
        }
    }

    // =========================
    // SAFE RENAME (PHASE 2)
    // Run ALL renames before ANY uploads so a new file can't
    // overwrite an existing filename that still needs to be moved.
    // =========================

    const tempOps = [];

    for (const op of renameOperations) {
        const tempFilename = `temp-${crypto.randomUUID()}-${op.oldFilename}`;
        await s3.renameInS3(op.oldFilename, tempFilename, "image/webp");
        tempOps.push({
            tempFilename,
            newFilename: op.newFilename,
        });
    }

    for (const op of tempOps) {
        await s3.renameInS3(op.tempFilename, op.newFilename, "image/webp");
    }

    // =========================
    // UPLOAD NEW FILES
    // Done after renames so existing filenames are safely out of the way.
    // =========================

    for (const { file, newFilename } of newFileSlots) {
        await processAndUpload(file, newFilename);
    }

    // =========================
    // DELETE OLD UNUSED FILENAMES
    // =========================

    for (const filename of originalFilenames) {
        if (!survivingFilenames.has(filename)) {
            try {
                await s3.deleteFromS3(filename);
            } catch (_) {}
        }
    }

    // =========================
    // UPDATE MONGO
    // =========================

    painting.name = normalizedNewName;
    painting.image = buildImageFilename(normalizedNewName, 0);

    painting.dimensions = {
        length: length ? Number(length) : painting.dimensions?.length,
        width: width ? Number(width) : painting.dimensions?.width,
        depth: depth ? Number(depth) : painting.dimensions?.depth,
    };

    painting.date = date ? Number(date) : painting.date;

    painting.paint =
        paint !== undefined ? normalizeString(paint) : painting.paint;
    painting.canvas =
        canvas !== undefined ? normalizeString(canvas) : painting.canvas;
    painting.finish =
        finish !== undefined ? normalizeString(finish) : painting.finish;

    painting.desc = desc !== undefined ? desc.trim() : painting.desc;

    painting.price = price ? Number(price) : painting.price;
    if (paymentLink !== undefined) {
        painting.paymentLink = normalizePaymentLink(paymentLink);
    }

    painting.mult = toBoolean(mult);
    painting.framed = toBoolean(framed);
    painting.sold = toBoolean(sold);

    await painting.save();
    await Painting.updateOne(
        { _id: painting._id },
        { $unset: { squareLink: "" } },
    );

    return imageResponse(painting.toObject());
}

export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
    updatePainting,
};
