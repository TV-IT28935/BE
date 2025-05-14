import aqp from "api-query-params";
import mongoose from "mongoose";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import Product from "../model/product.js";
import Product_Category from "../model/product_category.js";
import ProductUserLike from "../model/product_user_like.js";
import {
    errorResponse400,
    errorResponse500,
    notFoundResponse,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import Attribute from "../model/attribute.js";

export const getAllProduct = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive, userId } = filter;
        let products = [];
        let result = [];

        products = await Product.aggregate([
            {
                $match: { isActive: isActive },
            },
            { $sort: { createdAt: -1 } },
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
                $lookup: {
                    from: "product_categories",
                    localField: "_id",
                    foreignField: "product",
                    as: "productCategories",
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "productCategories.category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $lookup: {
                    from: "attributes",
                    localField: "_id",
                    foreignField: "product",
                    as: "attributes",
                },
            },
            {
                $lookup: {
                    from: "product_user_likes",
                    localField: "_id",
                    foreignField: "product",
                    as: "likeQuantity",
                },
            },

            {
                $skip: page * size,
            },
            {
                $limit: size,
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    brand: {
                        _id: 1,
                        name: 1,
                    },
                    sale: {
                        _id: 1,
                        isActive: 1,
                        discount: 1,
                        description: 1,
                        name: 1,
                    },
                    view: 1,
                    categories: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    attributes: {
                        _id: 1,
                        price: 1,
                        size: 1,
                        stock: 1,
                        cache: 1,
                    },
                    likeQuantity: {
                        _id: 1,
                    },
                },
            },
        ]);
        if (userId !== "undefined") {
            const productUserLike = await ProductUserLike.find({
                user: userId,
            });

            result = products.map((product) => {
                const likedItem = productUserLike.find((item) => {
                    return item.product.equals(product._id);
                });
                return {
                    ...product,
                    liked: likedItem?.liked,
                };
            });
        } else {
            result = products;
        }

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
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
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
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            { $sort: { createdAt: -1 } },
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
                $lookup: {
                    from: "attributes",
                    localField: "_id",
                    foreignField: "product",
                    as: "attributes",
                },
            },
            {
                $lookup: {
                    from: "product_user_likes",
                    localField: "_id",
                    foreignField: "product",
                    as: "likeQuantity",
                },
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    name: 1,
                    description: 1,
                    isActive: 1,
                    brand: {
                        _id: 1,
                        name: 1,
                    },
                    sale: {
                        _id: 1,
                        discount: 1,
                    },
                    view: 1,
                    categories: {
                        _id: 1,
                        name: 1,
                    },
                    attributes: {
                        _id: 1,
                        price: 1,
                        size: 1,
                        stock: 1,
                        cache: 1,
                    },
                    likeQuantity: {
                        _id: 1,
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { category, attribute, ...productData } = req.body;
        const attributes = JSON.parse(attribute);
        const categories = JSON.parse(category);

        const newProduct = await Product.create([productData], { session });
        const product = newProduct[0];

        if (Array.isArray(categories) && categories.length > 0) {
            const relations = categories.map((item) => ({
                category: item,
                product: product._id,
            }));

            await Product_Category.insertMany(relations, { session });
        }

        if (Array.isArray(attributes) && attributes.length > 0) {
            const relations = attributes.map((item) => ({
                name: product.name,
                price: item.price,
                size: item.size,
                stock: item.quantity,
                cache: item.quantity,
                product: product._id,
            }));

            await Attribute.insertMany(relations, { session });
        }

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, "Tạo sản phẩm thành công!", product);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse500(res, "Lỗi khi tạo sản phẩm", error.message);
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

export const getAllProductByBrand = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        let { page = 0, size = 10, isActive = true, brandId } = filter;

        page = parseInt(page);
        size = parseInt(size);

        const activeFilter =
            isActive !== undefined
                ? { isActive: isActive === "true" || isActive === true }
                : {};

        const matchFilter = {
            ...activeFilter,
            ...(brandId && mongoose.Types.ObjectId.isValid(brandId)
                ? { brand: new mongoose.Types.ObjectId(brandId) }
                : {}),
        };

        const result = await Product.aggregate([
            { $match: matchFilter },
            { $sort: { createdAt: -1 } },
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
                $lookup: {
                    from: "product_categories",
                    localField: "_id",
                    foreignField: "product",
                    as: "productCategories",
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "productCategories.category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    code: 1,
                    description: 1,
                    isActive: 1,
                    brand: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    sale: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    view: 1,
                    categories: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                },
            },

            { $skip: page * size },
            { $limit: size },
        ]);

        const total = await Product.countDocuments(matchFilter);

        return successResponseList(
            res,
            "Lấy danh sách sản phẩm thành công!",
            result,
            {
                total,
                page,
                size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const countProduct = async (req, res) => {};

export const searchByKeyword = async (req, res) => {};

export const getListHot = async (req, res) => {};

export const getRecommendationById = async (req, res) => {};

export const relateProduct = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const {
            page,
            size,
            isActive = true,
            brandId,
            categoryId,
            id,
            userId,
        } = filter;
        let products = [];
        let result = [];

        products = await Product.aggregate([
            {
                $match: {
                    $and: [
                        { isActive },
                        ...(brandId
                            ? [{ brand: new mongoose.Types.ObjectId(brandId) }]
                            : []),
                        ...(categoryId
                            ? [{ "categories._id": categoryId }]
                            : []),
                    ],
                },
            },
            { $sort: { createdAt: -1 } },
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
                $lookup: {
                    from: "product_categories",
                    localField: "_id",
                    foreignField: "product",
                    as: "productCategories",
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "productCategories.category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $lookup: {
                    from: "attributes",
                    localField: "_id",
                    foreignField: "product",
                    as: "attributes",
                },
            },
            {
                $lookup: {
                    from: "product_user_likes",
                    localField: "_id",
                    foreignField: "product",
                    as: "likeQuantity",
                },
            },

            {
                $skip: page * size,
            },
            {
                $limit: size,
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    brand: {
                        _id: 1,
                        name: 1,
                    },
                    sale: {
                        _id: 1,
                        discount: 1,
                    },
                    view: 1,
                    categories: {
                        _id: 1,
                        name: 1,
                    },
                    attributes: {
                        _id: 1,
                        price: 1,
                        size: 1,
                        stock: 1,
                        cache: 1,
                    },
                    likeQuantity: {
                        _id: 1,
                    },
                },
            },
        ]);

        if (userId !== "undefined") {
            const productUserLike = await ProductUserLike.find({
                user: userId,
            });

            result = products.map((product) => {
                const likedItem = productUserLike.find((item) => {
                    return item.product.equals(product._id);
                });

                console.log(likedItem, "likedItem");
                return {
                    ...product,
                    liked: likedItem?.liked,
                };
            });
        } else {
            result = products;
        }

        const total = await Product.countDocuments({
            $and: [
                { isActive },
                ...(brandId
                    ? [{ brand: new mongoose.Types.ObjectId(brandId) }]
                    : []),
                ...(categoryId ? [{ "categories._id": categoryId }] : []),
            ],
        });

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
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
export const toggleLikeProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId, liked } = req.query;

    validateMongoDbId(productId);

    try {
        let record = await ProductUserLike.findOne({
            user: userId,
            product: productId,
        });

        if (!record) {
            record = new ProductUserLike({
                user: userId,
                product: productId,
                liked: true,
            });
        } else {
            record.liked = liked;
        }

        await record.save();

        return successResponse(
            res,
            record.liked
                ? "Yêu thích sản phẩm thành công!"
                : "Bỏ yêu thích sản phẩm thành công!"
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
export const getAllProductWishList = async (req, res) => {
    try {
        const userId = req.user._id;
        const { filter } = aqp(req.query);
        const { page, size, isActive = true } = filter;

        const products = await Product.aggregate([
            {
                $match: { isActive: isActive },
            },
            { $sort: { createdAt: -1 } },
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

        const productUserLike = await ProductUserLike.find({
            user: userId,
        });

        const result = products.filter((product) => {
            return !!productUserLike.find((item) => {
                return item.product.equals(product._id) && item.liked;
            });
        });

        const total = await Product.countDocuments({ isActive: isActive });

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
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const filterProducts = async (req, res) => {
    try {
        const { brandIds, categoryIds, max, min, size, page, userId } =
            req.body;
        const brandIdsNew = brandIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );
        const categoryIdsNew = categoryIds.map(
            (id) => new mongoose.Types.ObjectId(id)
        );

        const filter = {};
        if (brandIdsNew.length > 0) {
            filter.brand = { $in: brandIdsNew };
        }
        const products = await Product.aggregate([
            {
                $match: filter,
            },
            { $sort: { createdAt: -1 } },
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
                $lookup: {
                    from: "product_categories",
                    localField: "_id",
                    foreignField: "product",
                    as: "productCategories",
                },
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "productCategories.category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {
                $lookup: {
                    from: "attributes",
                    localField: "_id",
                    foreignField: "product",
                    as: "attributes",
                },
            },
            {
                $lookup: {
                    from: "product_user_likes",
                    localField: "_id",
                    foreignField: "product",
                    as: "likeQuantity",
                },
            },
            {
                $match: {
                    ...(categoryIdsNew.length > 0 && {
                        categories: {
                            $elemMatch: {
                                _id: { $in: categoryIdsNew },
                            },
                        },
                    }),
                    ...(min !== 0 &&
                        max !== 0 && {
                            attributes: {
                                $elemMatch: {
                                    price: { $gte: min, $lte: max },
                                },
                            },
                        }),
                },
            },
            {
                $skip: page * size,
            },
            {
                $limit: size,
            },
            {
                $project: {
                    name: 1,
                    code: 1,
                    brand: {
                        _id: 1,
                        name: 1,
                    },
                    sale: {
                        _id: 1,
                        isActive: 1,
                        discount: 1,
                        description: 1,
                        name: 1,
                    },
                    view: 1,
                    categories: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    attributes: {
                        _id: 1,
                        price: 1,
                        size: 1,
                        stock: 1,
                        cache: 1,
                    },
                    likeQuantity: {
                        _id: 1,
                    },
                },
            },
        ]);

        let result = [];

        if (userId !== "undefined") {
            const productUserLike = await ProductUserLike.find({
                user: userId,
            });

            result = products.map((product) => {
                const likedItem = productUserLike.find((item) => {
                    return item.product.equals(product._id);
                });
                return {
                    ...product,
                    liked: likedItem?.liked,
                };
            });
        } else {
            result = products;
        }

        result = products.filter((product) =>
            product.attributes.some((attr) => {
                const finalPrice =
                    attr.price - (attr.price * product.sale.discount) / 100;

                const isMinValid = min ? finalPrice > min : true;
                const isMaxValid = max ? finalPrice < max : true;

                return isMinValid && isMaxValid;
            })
        );

        return successResponseList(res, "Lọc danh sách thành công!", result);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getAvgReviewProduct = async (req, res) => {
    try {
        db.products.aggregate([
            // Bước 1: Join với attributes
            {
                $lookup: {
                    from: "attributes",
                    localField: "_id",
                    foreignField: "productId",
                    as: "attributes",
                },
            },
            // Bước 2: Unwind attributes
            { $unwind: "$attributes" },

            // Bước 3: Join với user_review_attribute theo attributeId
            {
                $lookup: {
                    from: "user_review_attribute",
                    localField: "attributes._id",
                    foreignField: "attributeId",
                    as: "reviews",
                },
            },
            // Bước 4: Unwind reviews
            { $unwind: "$reviews" },

            // Bước 5: Nhóm lại theo attributeId để tính avgReviewAttribute
            {
                $group: {
                    _id: {
                        productId: "$_id",
                        attributeId: "$attributes._id",
                    },
                    avgReviewAttribute: { $avg: "$reviews.review" },
                },
            },

            // Bước 6: Nhóm lại theo productId để tính avgReviewProduct
            {
                $group: {
                    _id: "$_id.productId",
                    avgReviewProduct: { $avg: "$avgReviewAttribute" },
                },
            },

            // Bước 7: Join lại với products để lấy full thông tin sản phẩm
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },

            // Bước 8: Merge kết quả
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            "$product",
                            { avgReviewProduct: "$avgReviewProduct" },
                        ],
                    },
                },
            },
        ]);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
