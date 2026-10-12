/*
    Author: Connor Kippes

    Handles adding or updating a painting.
*/
let addPainting = false;
let curPainting = null;

async function ensureAdmin() {
    const res = await fetch("/auth/admin-status", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (!res.ok) {
        window.location.href = "/";
        return false;
    }
    return true;
}

(async () => {
    await ensureAdmin();
    await setupPage();
})();

async function setupPage() {
    const params = new URLSearchParams(window.location.search);
    const paintingName = params.get("name");

    if (paintingName === null) {
        addPainting = true;
        return;
    }

    const response = await fetch(
        `/painting/${encodeURIComponent(paintingName)}`,
    );
    const painting = await response.json();
    curPainting = painting;

    // populate text fields
    document.getElementById("name").value = painting.name;
    document.getElementById("length").value = painting.dimensions?.length || "";
    document.getElementById("width").value = painting.dimensions?.width || "";
    document.getElementById("depth").value = painting.dimensions?.depth || "";
    document.getElementById("paint").value = painting.paint || "";
    document.getElementById("canvas").value = painting.canvas || "";
    document.getElementById("finish").value = painting.finish || "";
    document.getElementById("price").value = painting.price || "";
    document.getElementById("payment-link").value = painting.paymentLink || "";
    document.getElementById("mult").checked = painting.mult;
    document.getElementById("framed").checked = painting.framed;
    document.getElementById("sold").checked = painting.sold;
    syncSquareLinkVisibility();
    document.getElementById("desc").value = painting.desc || "";

    // populate image boxes — store the S3 URL so the server can rename
    // (not re-compress) the file if the painting name changes or order shifts.
    const uploadBoxes = document.querySelectorAll(".upload-box");
    (painting.images || []).forEach((imgUrl, index) => {
        if (index >= uploadBoxes.length || !imgUrl) return;
        const box = uploadBoxes[index];
        const filename = extractFilename(imgUrl);

        const img = new Image();
        img.draggable = false;

        img.onload = () => {
            // only set state and populate box if the image actually exists
            box._state = {
                type: "existing",
                file: null,
                filename,
                url: imgUrl,
                blobUrl: null,
            };
            box.appendChild(img);
            box.querySelector(".placeholder").style.display = "none";
        };

        img.onerror = () => {
            // image doesn't exist in S3 — leave box empty
        };

        img.src = imgUrl;
    });
}

function handleCancel() {
    window.location.href = "/admin.html";
}

function titleCase(str) {
    return str.toLowerCase().replace(/(^|\s)[a-z]/g, (l) => l.toUpperCase());
}

document
    .getElementById("modify-painting-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = titleCase(document.getElementById("name").value.trim());
        const length = document.getElementById("length").value.trim();
        const width = document.getElementById("width").value.trim();
        const depth = document.getElementById("depth").value.trim();
        const paint = titleCase(document.getElementById("paint").value.trim());
        const canvas = titleCase(
            document.getElementById("canvas").value.trim(),
        );
        const finish = titleCase(
            document.getElementById("finish").value.trim(),
        );
        const price = document.getElementById("price").value.trim();
        const paymentLink = document
            .getElementById("payment-link")
            .value.trim();
        const mult = document.getElementById("mult").checked;
        const framed = document.getElementById("framed").checked;
        const sold = document.getElementById("sold").checked;
        const desc = document.getElementById("desc").value.trim();

        const boxes = [...document.querySelectorAll(".upload-box")];

        const imageSlots = boxes.map((box) => {
            const state = box._state;

            if (state.type === "new") {
                return { type: "new" };
            }

            if (state.type === "existing") {
                return {
                    type: "existing",
                    filename: state.filename,
                };
            }

            return { type: "empty" };
        });

        // required first slot image
        if (imageSlots[0]?.type === "empty") {
            showToast("Must add an image to the first box", "toast-error");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (length) formData.append("length", length);
        if (width) formData.append("width", width);
        if (depth) formData.append("depth", depth);
        if (paint) formData.append("paint", paint);
        if (canvas) formData.append("canvas", canvas);
        if (finish) formData.append("finish", finish);
        if (price) formData.append("price", price);
        formData.append("paymentLink", paymentLink);
        formData.append("mult", mult);
        formData.append("framed", framed);
        formData.append("sold", sold);
        if (desc) formData.append("desc", desc);
        formData.append("slots", JSON.stringify(imageSlots));

        for (const box of boxes) {
            if (box._state.type === "new") {
                formData.append("images", box._state.file);
            }
        }

        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        let url, method, successMessage;
        if (addPainting) {
            url = "/painting";
            method = "POST";
            successMessage = {
                message: `Painting "${name}" was added`,
                className: "toast-success",
            };
        } else {
            url = `/painting/${encodeURIComponent(curPainting.name)}`;
            method = "PUT";
            successMessage = {
                message: `Painting "${name}" was updated`,
                className: "toast-success",
            };
            if (name !== curPainting.name) {
                formData.append("newName", name);
            }
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: formData,
            });

            if (response.ok) {
                localStorage.setItem(
                    "pendingToast",
                    JSON.stringify(successMessage),
                );
                window.location.href = "/admin.html";
            } else {
                const errorText = await response.text();
                showToast(errorText || "Internal server error", "toast-error");
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Something went wrong", "toast-error");
        }
    });

function syncSquareLinkVisibility() {
    document.getElementById("payment-link-container").hidden =
        document.getElementById("sold").checked;
}

document
    .getElementById("sold")
    .addEventListener("change", syncSquareLinkVisibility);
syncSquareLinkVisibility();

/* ── Upload box logic ── */

document.querySelectorAll(".upload-box").forEach((box) => {
    box.innerHTML = `
      <div class="placeholder">
        <svg width="30" height="30" fill="none" stroke="#aaa" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <span>Drop or click</span>
      </div>
      <input type="file" accept="image/*">
      <button type="button" class="remove">x</button>
    `;

    box._state = {
        type: "empty",
        file: null,
        filename: null,
        url: null,
        blobUrl: null,
    };

    const input = box.querySelector("input");
    const removeBtn = box.querySelector(".remove");

    input.addEventListener("change", () => {
        if (input.files?.[0]) {
            setBoxFile(box, input.files[0]);
            input.value = "";
        }
    });

    removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        clearBox(box);
    });

    box.addEventListener("click", () => input.click());

    enableDrag(box);
});

function enableDrag(box) {
    box.draggable = true;

    box.addEventListener("dragstart", (e) => {
        if (box._state.type === "empty") {
            e.preventDefault();
            return;
        }

        window.__draggingBox = box;

        const ghost = document.createElement("div");
        ghost.style.cssText =
            "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        box.addEventListener(
            "dragend",
            () => {
                ghost.remove();
            },
            { once: true },
        );
    });

    box.addEventListener("dragover", (e) => {
        e.preventDefault();
        box.classList.add("dragover");
    });

    box.addEventListener("dragleave", () => {
        box.classList.remove("dragover");
    });

    box.addEventListener("drop", (e) => {
        e.preventDefault();
        box.classList.remove("dragover");

        const from = window.__draggingBox;

        if (!from) {
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
                setBoxFile(box, file);
            }
            return;
        }

        if (from === box) return;

        swapStates(from, box);
        window.__draggingBox = null;
    });
}

/* ── Box state helpers ── */

function setBoxFile(box, file) {
    clearBox(box);
    const blobUrl = URL.createObjectURL(file);
    box._state = {
        type: "new",
        file,
        filename: null,
        url: null,
        blobUrl,
    };
    renderImage(box, blobUrl);
}

function setBoxExisting(box, url) {
    box._state = {
        type: "existing",
        file: null,
        filename: extractFilename(url),
        url,
        blobUrl: null,
    };
    renderImage(box, url);
}

function clearBox(box) {
    if (box._state?.blobUrl) {
        URL.revokeObjectURL(box._state.blobUrl);
    }
    box._state = {
        type: "empty",
        file: null,
        filename: null,
        url: null,
        blobUrl: null,
    };
    const img = box.querySelector("img");
    if (img) img.remove();
    box.querySelector(".placeholder").style.display = "flex";
}

function renderImage(box, src) {
    let img = box.querySelector("img");
    if (!img) {
        img = document.createElement("img");
        img.draggable = false;
        box.appendChild(img);
    }
    img.src = src;
    box.querySelector(".placeholder").style.display = "none";
}

function swapStates(a, b) {
    const tempA = a._state;
    const tempB = b._state;
    a._state = tempB;
    b._state = tempA;
    rerender(a);
    rerender(b);
}

function rerender(box) {
    const img = box.querySelector("img");
    if (img) img.remove();
    if (box._state.type === "empty") {
        box.querySelector(".placeholder").style.display = "flex";
        return;
    }
    const src = box._state.type === "new" ? box._state.blobUrl : box._state.url;
    renderImage(box, src);
}

// also used in s3-utils
function extractFilename(url) {
    if (!url) return null;

    if (url.includes(".amazonaws.com/")) {
        return url.split(".amazonaws.com/")[1].split("?")[0];
    }

    return url;
}
