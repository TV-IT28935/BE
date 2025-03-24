import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true },
    cache: { type: Number },
  },
  { timestamps: true }
);

const Attribute = mongoose.model("attribute", attributeSchema);

export default Attribute;
