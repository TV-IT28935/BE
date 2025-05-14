import mongoose from "mongoose";
import Order from "./order";
import Attribute from "./attribute";

const orderDetailSchema = new mongoose.Schema(
    {
        originPrice: {
            type: String,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },
        sellPrice: {
            type: Boolean,
            default: true,
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
