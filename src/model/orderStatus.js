import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const OrderStatus = mongoose.model("orderStatus", orderStatusSchema);

export default OrderStatus;
