import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "brand" },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: "sale" },
    view: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);
export default Product;
