import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxLength: 50 },
    description: { type: String },
    icon: { type: String, maxLength: 255 },
    deletedAt: { type: Date },
  },
  { timestamps: true } // Tự động tạo createdAt và updatedAt
);

const Category = mongoose.model("category", categorySchema);

export default Category;
