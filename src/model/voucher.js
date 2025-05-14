import mongoose from "mongoose";

const vouchersSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expireDate: {
            type: Date,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
const Voucher = mongoose.model("voucher", vouchersSchema);

export default Voucher;
