import mongoose from "mongoose";
import Category from "../model/category.js";
import { errorResponse500, successResponse } from "../utils/responseHandler.js";

// 1️⃣ Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deletedAt: null }).sort({
      createdAt: -1,
    });
    return successResponse(
      res,
      "Lấy danh sách danh mục thành công!",
      categories
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

// 2️⃣ Get Detail Category
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category || category.deletedAt) {
      return successResponse(res, "Không tìm thấy danh mục");
    }

    return successResponse(res, "Lấy danh mục thành công!", category);
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

// 3️⃣ Create Category
export const createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

// 4️⃣ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return successResponse(res, "Không tìm thấy danh mục");
    }

    return res.json({ success: true, data: updatedCategory });
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

// 5️⃣ Delete Category (Soft Delete)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return successResponse(res, "Không tìm thấy danh mục");
    }

    const category = await Category.findById(id);
    if (!category || category.deletedAt) {
      return successResponse(res, "Không tìm thấy danh mục");
    }

    category.deletedAt = new Date();
    await category.save();

    return res.json({ success: true, message: "Danh mục đã được xóa mềm" });
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};
