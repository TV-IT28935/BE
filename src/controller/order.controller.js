import mongoose from "mongoose";
import OrderDetail from "../model/orderDetail.js";
import OrderStatus from "../model/orderStatus.js";
import generateOrderCode from "../utils/generateOrderCode.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import Order from "../model/order.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import CartItem from "../model/cartItem.js";
import Attribute from "../model/attribute.js";

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            address,
            fullName,
            phone,
            email,
            note,
            total,
            isPending,
            payment,
            voucherId,
            orderDetails,
            shipment,
            shipDate,
        } = req.body;
        const user = req.user;

        let orderStatusId = null;

        if (payment === "COD") {
            const status = await OrderStatus.findOne({
                code: "PENDING_CONFIRM",
            }).session(session);
            orderStatusId = status?._id;

            console.log(status, "status");
        } else if (payment === "BANK" || payment === "VNPAY") {
            const status = await OrderStatus.findOne({
                code: "PROCESSING",
            }).session(session);
            console.log(status, "status");

            orderStatusId = status?._id;
        }

        console.log(orderStatusId, "orderStatusId");

        const newOrder = await Order.create(
            [
                {
                    code: generateOrderCode(),
                    address,
                    fullName,
                    phone,
                    email,
                    note,
                    total,
                    isPending,
                    shipment,
                    payment,
                    shipDate,
                    user: user._id,
                    orderStatus: orderStatusId,
                    voucher: voucherId,
                },
            ],
            { session }
        );

        const orderDetailsWithOrderId = orderDetails.map((item) => ({
            ...item,
            attribute: item.attributeId,
            order: newOrder[0]._id,
        }));

        await OrderDetail.insertMany(orderDetailsWithOrderId, { session });

        for (const item of orderDetails) {
            await Promise.all([
                CartItem.findOneAndUpdate(
                    { _id: item._id },
                    {
                        $set: {
                            isActive: false,
                        },
                    },
                    { session }
                ),

                Attribute.findOneAndUpdate(
                    {
                        _id: item.attributeId,
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                        },
                    },
                    { session }
                ),
            ]);
        }

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, "Tạo đơn hàng thành công!", newOrder[0]);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Transaction failed:", error);
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.query;
        const order = await Order.findById({ _id: id })
            .populate("orderStatus")
            .populate("user")
            .populate("voucher");

        if (!order) {
            return errorResponse400(res, "Không tìm thấy đơn hàng");
        }

        return successResponse(res, "Lấy đơn hàng thành công", order);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const getOrderDetailByOrderId = async (req, res) => {
    try {
        const { orderId } = req.query;

        const orderDetail = await OrderDetail.find({ order: orderId })
            .populate("attribute")
            .populate("order");

        if (!orderDetail) {
            return errorResponse400(res, "Không tìm thấy chi tiết đơn hàng");
        }

        return successResponseList(
            res,
            "Lấy chi tiết đơn hàng thành công",
            orderDetail
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const getAllOrderStatus = async (req, res) => {
    try {
        const orderStatus = await OrderStatus.find({
            isActive: true,
        });

        return successResponseList(
            res,
            "Lấy danh sách trạng thái đơn hàng thành công!",
            orderStatus
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const getAllOrder = async (req, res) => {
    try {
        const { accountId, orderStatusId, page, size } = req.query;
        const filter = {
            user: accountId,
        };

        if (!!orderStatusId) {
            filter.orderStatus = orderStatusId;
        }

        console.log(filter, "filter");

        const orders = await Order.find(filter)
            .skip(page * size)
            .limit(size);

        if (!orders) {
            return errorResponse400(res, "Không tìm thấy đơn hàng");
        }

        const total = await Order.countDocuments(filter);

        return successResponseList(
            res,
            "Lấy danh sách đơn hàng thành công",
            orders,
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
const cancelOrder = async (req, res) => {};
const countOrderByName = async (req, res) => {};
const countOrder = async (req, res) => {};
const reportAmountYear = async (req, res) => {};
const reportByProduct = async (req, res) => {};
const getOrderByOrderStatusAndYearAndMonth = async (req, res) => {};
const getOrderByProduct = async (req, res) => {};
const reportAmountMonth = async (req, res) => {};
const updateOrder = async (req, res) => {};
const updateCancel = async (req, res) => {};
const updateProcess = async (req, res) => {};
const updateShip = async (req, res) => {};
const updateSuccess = async (req, res) => {};
const getAllOrderAndPagination = async (req, res) => {};
const getOrderByOrderStatusBetweenDate = async (req, res) => {};
const getAllOrdersByPayment = async (req, res) => {};

export {
    cancelOrder,
    countOrder,
    countOrderByName,
    createOrder,
    getAllOrder,
    getAllOrderAndPagination,
    getAllOrdersByPayment,
    getAllOrderStatus,
    getOrderById,
    getOrderByOrderStatusAndYearAndMonth,
    getOrderByOrderStatusBetweenDate,
    getOrderByProduct,
    getOrderDetailByOrderId,
    reportAmountMonth,
    reportAmountYear,
    reportByProduct,
    updateCancel,
    updateOrder,
    updateProcess,
    updateShip,
    updateSuccess,
};
