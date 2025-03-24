import mongoose from "mongoose";

const vouchersSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    discount: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Voucher = mongoose.model("voucher", vouchersSchema);

export default Voucher;
