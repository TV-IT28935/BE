import mongoose from "mongoose";

const orderStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const OrderStatus = mongoose.model("orderStatus", orderStatusSchema);

export default OrderStatus;
