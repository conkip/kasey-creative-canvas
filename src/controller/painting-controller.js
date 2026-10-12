import paintingService from "../service/painting-service.js";

function sendPaintingError(res, err, fallbackMessage) {
    const status = err.status || 500;
    const message =
        status >= 500
            ? err.isS3Error || status === 502
                ? "S3 error"
                : "Server error"
            : err.message || fallbackMessage;

    res.status(status).send(message);
}

function parsePaintingBody(body) {
    const {
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
        mult,
        framed,
        sold,
    } = body;
    return {
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
        mult,
        framed,
        sold,
    };
}

async function getAllPaintings(req, res) {
    const paintings = await paintingService.getAllPaintings();
    res.json(paintings);
}

async function getPaintingByName(req, res) {
    const name = decodeURIComponent(req.params.name);
    const painting = await paintingService.getPaintingByName(name);
    res.json(painting);
}

async function deletePainting(req, res) {
    await paintingService.deletePainting(req.params.id);
    res.sendStatus(204);
}

async function createPainting(req, res) {
    try {
        const painting = await paintingService.createPainting({
            ...parsePaintingBody(req.body),
            files: req.files,
        });
        res.status(201).json(painting);
    } catch (err) {
        sendPaintingError(res, err, "Error adding painting");
    }
}

async function updatePainting(req, res) {
    try {
        const name = decodeURIComponent(req.params.name);
        const { name: newName } = req.body;
        const imageTypes = [].concat(req.body.imageTypes || []);
        const imageRefs = [].concat(req.body.imageRefs || []);
        const painting = await paintingService.updatePainting(name, {
            ...parsePaintingBody(req.body),
            newName,
            files: req.files,
            slots: req.body.slots,
        });
        if (!painting)
            return res.status(404).json({ error: "Painting not found" });
        res.json(painting);
    } catch (err) {
        sendPaintingError(res, err, "Error updating painting");
    }
}

export default {
    getAllPaintings,
    getPaintingByName,
    deletePainting,
    createPainting,
    updatePainting,
};
