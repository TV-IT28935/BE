import aqp from "api-query-params";
import Category from "../model/category.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";

export const getAllCategories = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive } = filter;
        const [categories, total] = await Promise.all([
            Category.aggregate([
                {
                    $match: {
                        isActive: true,
                    },
                },
                {
                    $skip: page * size,
                },
                {
                    $limit: size,
                },
            ]),
            Category.countDocuments({ isActive: true }),
        ]);
        return successResponseList(
            res,
            "Lấy danh sách danh mục thành công!",
            categories,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getCategoryAdmin = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive } = filter;
        const [categories, total] = await Promise.all([
            Category.aggregate([
                {
                    $match: {},
                },
                {
                    $skip: page * size,
                },
                {
                    $limit: size,
                },
            ]),
            Category.countDocuments({}),
        ]);
        return successResponseList(
            res,
            "Lấy danh sách danh mục thành công!",
            categories,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.query;
        validateMongoDbId(id);
        const category = await Category.findById(id).select(
            "-updatedAt -__v -createdAt"
        );

        if (!category || category.deletedAt) {
            return successResponse(res, "Không tìm thấy danh mục");
        }

        return successResponse(res, "Lấy danh mục thành công!", category);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const createCategory = async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        return res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { _id } = req.body;
        validateMongoDbId(id);
        const updatedCategory = await Category.findByIdAndUpdate(
            _id,
            req.body,
            {
                new: true,
            }
        );

        if (!updatedCategory) {
            return successResponse(res, "Không tìm thấy danh mục");
        }

        return res.json({ success: true, data: updatedCategory });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const category = await Category.findById(id);
        if (!category || category.deletedAt) {
            return successResponse(res, "Không tìm thấy danh mục");
        }

        category.deletedAt = new Date();
        await category.save();

        return res.json({ success: true, message: "Danh mục đã được xóa mềm" });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
