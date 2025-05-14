import mongoose from "mongoose";

const userReviewProductSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "attribute" },
        review: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const UserVoucher = mongoose.model("user_review_product", userVoucherSchema);
export default UserVoucher;
