import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Shipment = mongoose.model("shipment", shipmentSchema);

export default Shipment;
