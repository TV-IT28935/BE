import mongoose from "mongoose";

const productUserLikeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        liked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const ProductUserLike = mongoose.model(
    "product_user_like",
    productUserLikeSchema
);
export default ProductUserLike;
