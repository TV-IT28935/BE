import aqp from "api-query-params";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import CartItem from "../model/cartItem.js";
import Attribute from "../model/attribute.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import mongoose from "mongoose";

const modifyCartItem = async (req, res) => {
    try {
        const { attributeId, quantity, lastPrice } = req.body;
        const user = req.user;
        validateMongoDbId(attributeId);
        const cartAttribute = await CartItem.findOne({
            userId: user._id,
            attributeId: new mongoose.Types.ObjectId(attributeId),
        });

        if (!cartAttribute) {
            await CartItem.create({
                userId: user._id,
                attributeId,
                quantity,
                lastPrice,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return successResponse(res, "Đã thêm vào giỏ hàng");
        } else {
            await CartItem.findByIdAndUpdate(cartAttribute._id, {
                $set: {
                    quantity,
                    updatedAt: new Date(),
                },
            });

            return successResponse(res, "Cập nhật số lượng thành công");
        }
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const modifyCartItemFromDetail = async (req, res) => {
    try {
        const { attributeId, quantity, lastPrice } = req.body;
        const user = req.user;
        validateMongoDbId(attributeId);
        const cartAttribute = await CartItem.findOne({
            userId: user._id,
            attributeId: new mongoose.Types.ObjectId(attributeId),
        });

        if (!cartAttribute) {
            await CartItem.create({
                userId: user._id,
                attributeId,
                quantity,
                lastPrice,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return successResponse(res, "Đã thêm vào giỏ hàng");
        } else {
            const attribute = await Attribute.findById(attributeId);
            const newQuantity = cartAttribute.quantity + quantity;

            if (newQuantity > attribute.stock) {
                return errorResponse400(res, "Số lượng không hợp lệ");
            }
            await CartItem.findByIdAndUpdate(cartAttribute._id, {
                $set: {
                    quantity: newQuantity,
                    updatedAt: new Date(),
                },
            });

            return successResponse(res, "Cập nhật số lượng thành công");
        }
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const isEnoughCartItem = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const user = req.user;
        const { id, quantity } = filter;
        const cartAttribute = await CartItem.findOne({
            userId: user._id,
            attributeId: new mongoose.Types.ObjectId(id),
        });

        console.log(cartAttribute, "cartAttribute");

        if (!cartAttribute) {
            return successResponse(res);
        } else {
            const attribute = await Attribute.findOne({
                _id: new mongoose.Types.ObjectId(id),
            });

            console.log(attribute, "attribute");
            if (cartAttribute.quantity + quantity > attribute.stock) {
                return errorResponse400(
                    res,
                    `Giỏ hàng đã có ${cartAttribute.quantity} sản phẩm`
                );
            } else {
                return successResponse(res);
            }
        }
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const getCartItemByAccountId = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { id } = filter;
        validateMongoDbId(id);

        const cartUser = await CartItem.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $sort: {
                    updatedAt: -1,
                },
            },
            {
                $lookup: {
                    from: "attributes",
                    localField: "attributeId",
                    foreignField: "_id",
                    as: "attribute",
                },
            },
            {
                $unwind: {
                    path: "$attribute",
                    preserveNullAndEmptyArrays: true, // optional nếu có khả năng không có attribute
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "attribute.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: {
                    path: "$product",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    lastPrice: 1,
                    attribute: {
                        _id: 1,
                        size: 1,
                    },
                    product: {
                        _id: 1,
                        code: 1,
                        name: 1,
                    },
                },
            },
        ]);

        return successResponseList(
            res,
            "Lấy danh sách giỏ hàng thành công!",
            cartUser
        );
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const removeCartItem = async (req, res) => {
    try {
        const { attributeId, cartId, accountId, quantity } = req.body;
        validateMongoDbId(cartId);
        await CartItem.deleteOne({ _id: cartId });
        return successResponse(res, "Xóa sản phẩm khỏi giỏ hàng thành công!");
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
export {
    modifyCartItem,
    isEnoughCartItem,
    getCartItemByAccountId,
    removeCartItem,
    modifyCartItemFromDetail,
};
