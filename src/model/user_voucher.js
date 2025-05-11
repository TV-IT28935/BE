import mongoose from "mongoose";

const userVoucherSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        voucher: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
        usedAt: { type: Date },
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

const UserVoucher = mongoose.model("user_voucher", userVoucherSchema);
export default UserVoucher;
