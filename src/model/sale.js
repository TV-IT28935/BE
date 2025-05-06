import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
        },

        discount: {
            type: Number,
            require: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            require: true,
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
