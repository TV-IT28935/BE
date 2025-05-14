import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        discount: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);
const Sale = mongoose.model("sale", salesSchema);
export default Sale;
