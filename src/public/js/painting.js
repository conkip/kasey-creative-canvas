/*
    Author: Connor Kippes

    Handles setting up detailed view of a painting and like functionality.
*/

let curUser = null;
let curPainting = null;
const heart = document.getElementById("heart-icon");
heart.onclick = heartClicked;

function isStripePaymentLink(paymentLink) {
    if (!paymentLink) return false;

    try {
        return ["buy.stripe.com", "checkout.stripe.com"].includes(
            new URL(paymentLink).hostname,
        );
    } catch {
        return false;
    }
}

// this is to make it visible after everything loads up so it doesn't look buggy
const main = document.querySelector("main");

async function verifyUser() {
    try {
        await fetch(`/user/me`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const contentType = response.headers.get("Content-Type");

                if (contentType && contentType.includes("application/json")) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((data) => {
                console.log("User Data: " + data);
                curUser = data;
            })
            .catch((error) => console.error("Error:", error));
    } catch (error) {
        console.error("Error:", error);
    }
}

(async () => {
    await verifyUser();
    await setupPainting();
})();

// on mouse hover or click of a mini painting - put it into the main view
function changeBigPainting(newImageUrl) {
    const bigPainting = document.getElementById("big-painting");

    // fade out, swap src, then fade back in
    bigPainting.style.opacity = 0;

    setTimeout(() => {
        bigPainting.src = newImageUrl;
        bigPainting.onload = () => {
            bigPainting.style.opacity = 1;
        };
    }, 300);
}

/**
 * Builds a variant URL by inserting a number before the file extension.
 * Example: https://.../art.webp + 2 -> https://.../art2.webp
 */
function buildVariantImageUrl(baseUrl, number) {
    if (number == 1) {
        return baseUrl;
    }
    const [path, query] = baseUrl.split("?");
    const lastDot = path.lastIndexOf(".");
    if (lastDot === -1) return baseUrl;

    const prefix = path.slice(0, lastDot);
    const extension = path.slice(lastDot);
    const variant = `${prefix}${number}${extension}`;

    return query ? `${variant}?${query}` : variant;
}

// adds alternate images underneath the big painting (if they exist)
function addMiniPainting(baseImageUrl, number) {
    const variantUrl = buildVariantImageUrl(baseImageUrl, number);

    const miniPaintings = document.getElementById("mini-paintings");
    const container = document.createElement("div");
    container.classList.add("mini-painting-container");
    miniPaintings.appendChild(container);

    const newImg = document.createElement("img");
    newImg.id = `mini-painting${number}`;
    newImg.alt = `Mini Painting ${number}`;
    newImg.src = variantUrl;
    newImg.onclick = () => changeBigPainting(variantUrl);

    let hoverTimeout;
    newImg.addEventListener("mouseenter", () => {
        hoverTimeout = setTimeout(() => {
            changeBigPainting(variantUrl);
        }, 300);
    });
    newImg.addEventListener("mouseleave", () => {
        clearTimeout(hoverTimeout);
    });

    // Remove container if image fails to load
    newImg.addEventListener("error", () => {
        container.remove();
    });

    container.appendChild(newImg);
}

// 24x24x1 --> 24" L x 24" W x 1" D
function formatDimensions(dimensions) {
    const parts = [];
    if (dimensions.length != null) parts.push(dimensions.length + '" L');
    if (dimensions.width != null) parts.push(dimensions.width + '" W');
    if (dimensions.depth != null) parts.push(dimensions.depth + '" D');
    return parts.join(" x ");
}

async function setupPainting() {
    const params = new URLSearchParams(window.location.search);
    const paintingName = params.get("name");
    const response = await fetch(`/painting/${paintingName}`);
    const painting = await response.json();
    curPainting = painting;

    updateHeart();

    // add the big painting (image URL comes from the painting API)
    const bigPaintingContainer = document.getElementById(
        "big-painting-container",
    );
    const bigPainting = document.createElement("img");

    bigPainting.id = "big-painting";
    bigPainting.alt = "Big Painting";
    bigPainting.src = painting.image;

    bigPaintingContainer.appendChild(bigPainting);

    // add all the mini images underneath it if able
    for (let i = 1; i <= 5; i++) {
        addMiniPainting(painting.image, i);
    }

    // add the title
    document.getElementById("title").innerText = painting.name;

    // add the painting details

    const dimensionsElem = document.getElementById("dimensions");
    const dimStr = painting.dimensions
        ? formatDimensions(painting.dimensions)
        : "";
    if (dimStr) {
        let dimensions = dimStr;
        if (painting.mult) {
            dimensions += " Each";
        }
        dimensionsElem.innerText = dimensions;
    } else {
        dimensionsElem.classList.add("display-none");
    }

    const dateElem = document.getElementById("date");
    if (painting.date !== undefined) {
        dateElem.innerText = painting.date;
    } else {
        dateElem.classList.add("display-none");
    }

    const paintAndCanvasElem = document.getElementById("paint-and-canvas");
    if (painting.paint !== undefined) {
        let paintAndCanvas = "";
        paintAndCanvas += painting.paint + " Paint";
        if (painting.canvas !== undefined) {
            paintAndCanvas += " on " + painting.canvas;
        }
        paintAndCanvasElem.innerText = paintAndCanvas;
    } else {
        paintAndCanvasElem.classList.add("display-none");
    }

    const finishElem = document.getElementById("finish");
    if (painting.finish !== undefined) {
        finishElem.innerText = painting.finish;
    } else {
        finishElem.classList.add("display-none");
    }

    const framedStatusElem = document.getElementById("framed-status");
    if (painting.framed) {
        framedStatusElem.innerText = "Framed";
    } else {
        framedStatusElem.classList.add("display-none");
    }

    const priceElem = document.getElementById("price");
    if (painting.price !== undefined) {
        priceElem.innerText = "$" + painting.price;
    } else {
        priceElem.classList.add("display-none");
    }

    const buyButton = document.getElementById("buy-button");
    if (
        painting.paymentLink &&
        !painting.sold &&
        !isStripePaymentLink(painting.paymentLink)
    ) {
        buyButton.href = painting.paymentLink;
        buyButton.hidden = false;
    }

    const descriptionElem = document.getElementById("description");
    if (painting.desc !== undefined) {
        descriptionElem.innerText = painting.desc;
    } else {
        descriptionElem.classList.add("display-none");
    }
}

// wait until everything is loaded to make more seamless
window.addEventListener("load", () => {
    main.style.visibility = "visible";
    console.log("Page and all resources are fully loaded.");
});

// updates the heart image based on if the user has the painting favorited or not
function updateHeart() {
    if (curUser === null) {
        let foundPainting = false;

        fetch("/user/guest/likes", {
            credentials: "include",
        })
            .then((response) => response.text())
            .then((data) => {
                data = data.trim();
                let guestPaintings = data ? data.split(",") : [];
                for (let guestPaintingName of guestPaintings) {
                    if (guestPaintingName === curPainting.name) {
                        //change heart back to red
                        heart.style.fill = "var(--red)";
                        foundPainting = true;
                        break;
                    }
                }
                if (!foundPainting) {
                    heart.style.fill = "rgb(75, 75, 75)";
                }
            })
            .catch((error) => console.error("Error:", error));
    } else {
        let foundPainting = false;
        for (let userPaintingName of curUser.my_likes) {
            if (userPaintingName === curPainting.name) {
                //change heart back to red
                heart.style.fill = "var(--red)";
                foundPainting = true;
                break;
            }
        }
        if (!foundPainting) {
            heart.style.fill = "rgb(75, 75, 75)";
        }
    }
}

// when the heart is clicked add or remove it from the users favorites list
async function heartClicked() {
    const isLiked = heart.style.fill !== "rgb(75, 75, 75)";
    const method = isLiked ? "DELETE" : "POST";
    const route = curUser === null ? "/user/guest/likes" : "/user/me/likes";

    try {
        const response = await fetch(
            `${route}/${encodeURIComponent(curPainting.name)}`,
            {
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                ...(curUser === null ? { credentials: "include" } : {}),
            },
        );

        if (!response.ok) {
            throw new Error(
                `Like request failed with status ${response.status}`,
            );
        }

        heart.style.fill = isLiked ? "rgb(75, 75, 75)" : "var(--red)";
        if (!isLiked) {
            heart.style.transform = "scale(1.4)";
            setTimeout(() => {
                heart.style.transform = "";
            }, 200);
        }

        showToast(
            isLiked ? "Unliked painting" : "Liked painting",
            "toast-success",
        );
    } catch (error) {
        console.error("Like request error:", error);
        showToast(
            isLiked ? "Failed to unlike painting" : "Failed to like painting",
            "toast-error",
        );
    }
}
