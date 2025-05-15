import aqp from "api-query-params";
import Attribute from "../model/attribute.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import UserReviewAttribute from "../model/user_review_attribute.js";

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
        const { review, description, attributeId, orderDetailId } = req.body;
        validateMongoDbId(userId);
        validateMongoDbId(attributeId);
        validateMongoDbId(orderDetailId);
        await UserReviewAttribute.create({
            user: userId,
            review,
            description,
            attribute: attributeId,
            orderDetail: orderDetailId,
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
        const { productId } = req.query;
        validateMongoDbId(productId);
        const reviews = await UserReviewAttribute.aggregate([
            {
                $lookup: {
                    from: "attributes",
                    localField: "attribute",
                    foreignField: "_id",
                    as: "attribute",
                },
            },
            {
                $unwind: "$attribute",
            },
            {
                $match: {
                    "attribute.product": productId,
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
            {
                $unwind: "$user",
            },
            {
                $project: {
                    _id: 1,
                    review: 1,
                    description: 1,
                    createdAt: 1,
                    user: {
                        _id: "$user._id",
                        name: "$user.name",
                        avatar: "$user.avatar",
                    },
                    attribute: {
                        _id: "$attribute._id",
                        name: "$attribute.name",
                        size: "$attribute.size",
                    },
                },
            },
        ]);
        return successResponse(res, "", reviews);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
