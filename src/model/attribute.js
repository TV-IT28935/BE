import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
    {
        price: { type: Number, required: true },
        size: { type: String, required: true },
        stock: { type: Number, required: true },
        cache: { type: Number },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    },
    { timestamps: true }
);

const Attribute = mongoose.model("attribute", attributeSchema);

export default Attribute;
