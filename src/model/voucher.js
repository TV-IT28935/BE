import mongoose from "mongoose";

const vouchersSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            require: true,
        },
        name: {
            type: String,
            require: true,
        },
        count: {
            type: Number,
            require: true,
        },
        discount: {
            type: Number,
            require: true,
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
