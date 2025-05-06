import aqp from "api-query-params";
import mongoose from "mongoose";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import Product from "../model/product.js";
import Product_Category from "../model/product_category.js";
import { paginateModel } from "../utils/paginateModel.js";
import {
    errorResponse400,
    errorResponse500,
    notFoundResponse,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";

export const getAllProduct = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive } = filter;

        const result = await Product.aggregate([
            {
                $match: { isActive: isActive }, // hoặc điều kiện bạn cần
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brand",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            {
                $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "sales",
                    localField: "sale",
                    foreignField: "_id",
                    as: "sale",
                },
            },
            {
                $unwind: {
                    path: "$sale",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $skip: page * size,
            },
            {
                $limit: size,
            },
        ]);

        const total = await Product.countDocuments({ isActive: true });

        return successResponseList(
            res,
            "Lấy danh sách sản phẩm thành công!",
            result,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const product = await Product.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id), // Tìm sản phẩm theo _id
                },
            },
            {
                $lookup: {
                    from: "product_categories",
                    localField: "_id",
                    foreignField: "product",
                    as: "product_categories",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "product_categories.category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    name: 1,
                    description: 1,
                    isActive: 1,
                    brand: 1,
                    sale: 1,
                    view: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    categories: {
                        _id: 1,
                        title: 1,
                    },
                },
            },
        ]);

        if (!product || product.deletedAt) {
            return successResponse(res, "Không tìm thấy sản phẩm");
        }

        return successResponse(res, "Lấy sản phẩm thành công!", product[0]);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const createProduct = async (req, res) => {
    try {
        const { categoryIds, ...productData } = req.body;

        const newProduct = await Product.create(productData);

        if (categoryIds && categoryIds.length > 0) {
            const relations = categoryIds.map((categoryId) => ({
                category: categoryId,
                product: newProduct._id,
            }));

            await Product_Category.insertMany(relations);
        }

        return successResponse(res, "Tạo sản phẩm thành công!", newProduct);
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const updatedCategory = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedCategory) {
            return notFoundResponse(res, "Không tìm thấy sản phẩm");
        }

        return successResponse(
            res,
            "Cập nhật sản phẩm thành công!",
            updatedCategory
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (validateMongoDbId(id)) {
            return successResponse(res, "Không tìm thấy sản phẩm");
        }

        const category = await Product.findById(id);
        if (!category || category.deletedAt) {
            return successResponse(res, "Không tìm thấy sản phẩm");
        }

        category.deletedAt = new Date();
        await category.save();

        return res.json({ success: true, message: "sản phẩm đã được xóa mềm" });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getAllProductByBrand = async () => {};
export const countProduct = async () => {};
export const searchByKeyword = async () => {};
export const getListHot = async () => {};
export const getRecommendationById = async () => {};
export const relateProduct = async () => {};
export const toggleLikeProduct = async () => {};
export const getAllProductWishList = async () => {};

export const filterProducts = async () => {};
