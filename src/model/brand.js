import mongoose from "mongoose";

const brandsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },
        image: {
            type: String,
            require: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Brand = mongoose.model("brand", brandsSchema);
export default Brand;
