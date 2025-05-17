import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        name: { type: String },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Image = mongoose.model("image", imageSchema);
export default Image;
