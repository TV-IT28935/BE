import aqp from "api-query-params";
import Attribute from "../model/attribute.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import UserReviewAttribute from "../model/user_review_attribute.js";
import mongoose from "mongoose";

export const getAttribute = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { productId, size } = filter;
        validateMongoDbId(productId);
        const attributes = await Attribute.findOne({
            $and: [
                {
                    product: productId,
                },
                {
                    size,
                },
            ],
        });
        return successResponse(
            res,
            "Lấy danh sách thuộc tính thành công!",
            attributes
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getAttributeById = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const attribute = await Attribute.findById(id);
        return successResponse(res, "", attribute);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const reviewAttribute = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rating, description, attributeId, orderDetailId, productId } =
            req.body;
        validateMongoDbId(userId);
        validateMongoDbId(attributeId);
        validateMongoDbId(orderDetailId);
        await UserReviewAttribute.create({
            user: userId,
            rating,
            description,
            attribute: attributeId,
            orderDetail: orderDetailId,
            product: productId,
        });

        return successResponse(res, "Đánh giá thuộc tính thành công!", true);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getAllReviewAttributeByProductId = async (req, res) => {
    try {
        let { productId, page, size } = req.query;
        validateMongoDbId(productId);
        page = parseInt(page);
        size = parseInt(size);

        const [reviews, total] = await Promise.all([
            await UserReviewAttribute.aggregate([
                {
                    $match: {
                        product: new mongoose.Types.ObjectId(productId),
                    },
                },

                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                { $unwind: "$user" },
                {
                    $lookup: {
                        from: "userdetails",
                        localField: "user._id",
                        foreignField: "userId",
                        as: "userDetail",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetail",
                        preserveNullAndEmptyArrays: true,
                    },
                },

                {
                    $lookup: {
                        from: "attributes",
                        localField: "attribute",
                        foreignField: "_id",
                        as: "attribute",
                    },
                },
                { $unwind: "$attribute" },

                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                { $unwind: "$product" },

                {
                    $project: {
                        _id: 1,
                        comment: 1,
                        rating: 1,
                        description: 1,
                        createdAt: 1,
                        user: {
                            _id: "$user._id",
                            username: "$user.username",
                            avatar: "$userDetail.avatar",
                        },
                        attribute: {
                            _id: 1,
                            size: 1,
                        },
                        product: {
                            _id: 1,
                            name: 1,
                        },
                    },
                },

                { $skip: page * size },
                { $limit: size },
            ]),

            await UserReviewAttribute.countDocuments({ product: productId }),
        ]);
        return successResponseList(res, "", reviews, {
            total,
            page: page,
            size: size,
            totalPages: Math.ceil(total / size),
        });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getReviewAttributeByOrderDetailId = async (req, res) => {
    try {
        const { orderDetailId } = req.query;
        console.log(orderDetailId, "orderDetailId");
        validateMongoDbId(orderDetailId);
        const reviews = await UserReviewAttribute.findOne({
            orderDetail: orderDetailId,
        });
        return successResponse(res, "", reviews);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
