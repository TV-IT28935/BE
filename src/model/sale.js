import mongoose from "mongoose";

const salesSchema = new mongoose.Schema(
  {
    discount: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Sale = mongoose.model("sale", salesSchema);
export default Sale;
