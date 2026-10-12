import mongoose from "mongoose";

const PaintingSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        dimensions: {
            type: {
                length: Number,
                width: Number,
                depth: Number,
            },
            default: undefined,
        },
        date: { type: Number, default: undefined },
        paint: { type: String, default: undefined },
        canvas: { type: String, default: undefined },
        finish: { type: String, default: undefined },
        desc: { type: String, default: undefined },
        price: { type: Number, default: undefined },
        paymentLink: { type: String, default: undefined },
        mult: { type: Boolean, default: false },
        framed: { type: Boolean, default: false },
        sold: { type: Boolean, default: false },
        stripeCheckoutSessionId: { type: String, default: undefined },
        soldAt: { type: Date, default: undefined },
        saleEmailStatus: { type: String, default: undefined },
        saleEmailAttemptedAt: { type: Date, default: undefined },
    },
    { timestamps: true },
);

const Painting = mongoose.model("Painting", PaintingSchema);

export default Painting;
