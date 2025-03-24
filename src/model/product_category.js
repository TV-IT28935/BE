import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
});

const Product_Category = mongoose.model(
  "product_category",
  productCategorySchema
);

export default Product_Category;
