import mongoose from "mongoose";

const userReviewAttributeSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        orderDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orderDetail",
        },
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "attribute" },

        review: { type: Number, default: 0, min: 0, max: 5 },
        description: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const UserReviewAttribute = mongoose.model(
    "user_review_attribute",
    userReviewAttributeSchema
);
export default UserReviewAttribute;
