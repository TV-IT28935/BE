import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            require: true,
        },
        lastPrice: {
            type: Number,
            require: true,
        },
        isActive: {
            type: Boolean,
            require: true,
            default: true,
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        attributeId: { type: mongoose.Schema.Types.ObjectId, ref: "attribute" },
    },
    { timestamps: true }
);

const CartItem = mongoose.model("cartItem", cartItemSchema);
export default CartItem;
