import mongoose from "mongoose";

const orderDetailSchema = new mongoose.Schema(
    {
        originPrice: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sellPrice: {
            type: Number,
            required: true,
        },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
        attribute: { type: mongoose.Schema.Types.ObjectId, ref: "attribute" },
    },
    {
        timestamps: true,
    }
);
const OrderDetail = mongoose.model("orderDetail", orderDetailSchema);
export default OrderDetail;
