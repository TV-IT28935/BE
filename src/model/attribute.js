import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
    {
        originPrice: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        stock: { type: Number, required: true },
        cache: { type: Number, required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    },
    { timestamps: true }
);

const Attribute = mongoose.model("attribute", attributeSchema);

export default Attribute;
