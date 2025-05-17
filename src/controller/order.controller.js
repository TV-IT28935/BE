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
import aqp from "api-query-params";

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
        const order = await Order.findById(id)
            .populate({
                path: "orderStatus",
                select: "_id name code",
            })
            .populate({
                path: "user",
                select: "_id email username",
            })
            .populate({
                path: "voucher",
                select: "_id code name discount",
            });

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
            .populate({
                path: "attribute",
                populate: {
                    path: "product",
                    select: "_id code name",
                },
            })
            .populate("order")
            .select("-__v -createdAt -updatedAt");

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

        const orders = await Order.find(filter)
            .populate({
                path: "orderStatus",
                select: "-isActive",
            })
            .populate({
                path: "shipment",
                select: "-isActive",
            })
            .skip(page * size)
            .limit(size)
            .sort({
                createdAt: -1,
            });

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
const countOrder = async (req, res) => {
    try {
        const orders = await Order.find({});

        return successResponse(res, "", orders.length);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const reportAmountYear = async (req, res) => {};
const reportByProduct = async (req, res) => {};
const getOrderByOrderStatusAndYearAndMonth = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, status, payment } = filter;
        const { month, year } = req.query;

        let matchFilter = {};

        if (status !== "ALL") {
            matchFilter["orderStatus.code"] = status;
        }
        if (payment !== "ALL") {
            matchFilter["payment"] = payment;
        }

        if (month && !year) {
            matchFilter.$expr = { $eq: [{ $month: "$createdAt" }, month] };
        }

        if (year && !month) {
            matchFilter.$expr = { $eq: [{ $year: "$createdAt" }, year] };
        }

        if (year && month) {
            matchFilter.$expr = {
                $and: [
                    { $eq: [{ $year: "$createdAt" }, year] },
                    { $eq: [{ $month: "$createdAt" }, month] },
                ],
            };
        }

        console.log(matchFilter, "matchFilter");

        const result = await Order.aggregate([
            {
                $lookup: {
                    from: "orderstatuses",
                    localField: "orderStatus",
                    foreignField: "_id",
                    as: "orderStatus",
                },
            },
            {
                $unwind: "$orderStatus",
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
                $match: matchFilter,
            },

            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    address: 1,
                    fullName: 1,
                    phone: 1,
                    email: 1,
                    note: 1,
                    total: 1,
                    isPending: 1,
                    payment: 1,
                    user: {
                        _id: 1,
                        email: 1,
                        username: 1,
                    },
                    orderStatus: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    voucher: 1,
                    createdAt: 1,
                },
            },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: +page * +size },
                        { $limit: +size },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);

        const orders = result[0]?.data || [];
        const total = result[0]?.total[0]?.count || 0;

        if (!orders) {
            return errorResponse400(res, "Không tìm thấy đơn hàng");
        }

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
const getOrderByProduct = async (req, res) => {};
const reportAmountMonth = async (req, res) => {};
const updateOrder = async (req, res) => {};

const updateCancel = async (req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const { id, status, shipDate, shipment, description } = req.body;

        const [orders, orderStatus] = await Promise.all([
            Order.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "orderdetails",
                        localField: "_id",
                        foreignField: "order",
                        as: "orderDetails",
                    },
                },
            ]),

            OrderStatus.findOne({ code: status }),
        ]);

        const order = orders[0];
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse400(res, "Đơn hàng không tồn tại!", false);
        }

        if (!orderStatus) {
            await session.abortTransaction();
            session.endSession();

            return errorResponse400(
                res,
                "Trạng thái đơn hàng không tồn tại!",
                false
            );
        }

        for (const orderDetail of order.orderDetails) {
            await Attribute.updateOne(
                { _id: orderDetail.attribute },
                { $inc: { stock: orderDetail.quantity } },
                { session }
            );
        }

        await Order.updateOne(
            { _id: id },
            {
                orderStatus: orderStatus._id,
                shipDate,
                shipment,
                updateAt: new Date(),
                reason: description,
            },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return successResponse(res, "Hủy đơn hàng thành công!", true);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }

        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const updateProcess = async (req, res) => {
    try {
        const { id, status } = req.body;

        const [order, orderStatus] = await Promise.all([
            await Order.findOne({
                _id: id,
            }),
            await OrderStatus.findOne({
                code: status,
            }),
        ]);

        if (!order) {
            return errorResponse400(res, "Đơn hàng không tồn tại!", false);
        }

        if (!orderStatus) {
            return errorResponse400(
                res,
                "Trạng thái đơn hàng không tồn tại!",
                false
            );
        }

        await Order.updateOne(
            {
                _id: id,
            },
            {
                ...order.toObject(),
                orderStatus: orderStatus._id,
                updateAt: new Date(),
            }
        );

        console.log(order, orderStatus, "orderxxx");

        return successResponse(res, "Cập nhật đơn hàng thành công!", true);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const updateShip = async (req, res) => {
    try {
        const { id, status, shipDate, shipment } = req.body;

        const [order, orderStatus] = await Promise.all([
            await Order.findOne({
                _id: id,
            }),
            await OrderStatus.findOne({
                code: status,
            }),
        ]);

        if (!order) {
            return errorResponse400(res, "Đơn hàng không tồn tại!", false);
        }

        if (!orderStatus) {
            return errorResponse400(
                res,
                "Trạng thái đơn hàng không tồn tại!",
                false
            );
        }

        await Order.updateOne(
            {
                _id: id,
            },
            {
                ...order.toObject(),
                orderStatus: orderStatus._id,
                shipDate,
                shipment,
                updateAt: new Date(),
            }
        );

        return successResponse(res, "Cập nhật đơn hàng thành công!", true);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const updateSuccess = async (req, res) => {
    try {
        const { id, status } = req.body;

        const [order, orderStatus] = await Promise.all([
            await Order.findOne({
                _id: id,
            }),
            await OrderStatus.findOne({
                code: status,
            }),
        ]);

        if (!order) {
            return errorResponse400(res, "Đơn hàng không tồn tại!", false);
        }

        if (!orderStatus) {
            return errorResponse400(
                res,
                "Trạng thái đơn hàng không tồn tại!",
                false
            );
        }

        await Order.updateOne(
            {
                _id: id,
            },
            {
                ...order.toObject(),
                orderStatus: orderStatus._id,
                isPending: true,
                updateAt: new Date(),
            }
        );

        console.log(order, orderStatus, "orderxxx");

        return successResponse(res, "Cập nhật đơn hàng thành công!", true);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const getAllOrderAndPagination = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, status, payment } = filter;
        const { from, to, month, year } = req.query;

        console.log(filter, "filter");

        let matchFilter = {};

        if (status !== "ALL") {
            matchFilter["orderStatus.code"] = status;
        }
        if (payment !== "ALL") {
            matchFilter["payment"] = payment;
        }

        if (from && !to) {
            const fromDate = new Date(from);
            const startOfDay = new Date(fromDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(fromDate.setHours(23, 59, 59, 999));

            matchFilter["createdAt"] = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        }
        if (to && !from) {
            const date = new Date(to);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            matchFilter["createdAt"] = {
                $gte: startOfDay,
                $lte: endOfDay,
            };
        }

        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);

            if (fromDate > toDate) {
                return errorResponse400(
                    res,
                    "Ngày bắt đầu không được lớn hơn ngày kết thúc"
                );
            }

            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);

            matchFilter["createdAt"] = {
                $gte: fromDate,
                $lte: toDate,
            };
        }

        const result = await Order.aggregate([
            {
                $lookup: {
                    from: "orderstatuses",
                    localField: "orderStatus",
                    foreignField: "_id",
                    as: "orderStatus",
                },
            },
            {
                $unwind: "$orderStatus",
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
                $match: matchFilter,
            },

            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    code: 1,
                    address: 1,
                    fullName: 1,
                    phone: 1,
                    email: 1,
                    note: 1,
                    total: 1,
                    isPending: 1,
                    payment: 1,
                    user: {
                        _id: 1,
                        email: 1,
                        username: 1,
                    },
                    orderStatus: {
                        _id: 1,
                        name: 1,
                        code: 1,
                    },
                    voucher: 1,
                    createdAt: 1,
                },
            },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: +page * +size },
                        { $limit: +size },
                    ],
                    total: [{ $count: "count" }],
                },
            },
        ]);

        const orders = result[0]?.data || [];
        const total = result[0]?.total[0]?.count || 0;

        if (!orders) {
            return errorResponse400(res, "Không tìm thấy đơn hàng");
        }

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
