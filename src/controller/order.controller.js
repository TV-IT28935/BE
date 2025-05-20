import aqp from "api-query-params";
import mongoose from "mongoose";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import Attribute from "../model/attribute.js";
import CartItem from "../model/cartItem.js";
import Order from "../model/order.js";
import OrderDetail from "../model/orderDetail.js";
import OrderStatus from "../model/orderStatus.js";
import generateOrderCode from "../utils/generateOrderCode.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";

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
            isPayment,
            payment,
            voucherId,
            orderDetails,
            shipment,
            shipDate,
        } = req.body;
        const user = req.user;

        let orderStatusId = null;

        if (payment) {
            const status = await OrderStatus.findOne({
                code: "PENDING_CONFIRM",
            }).session(session);
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
                    isPayment,
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

        const orderDetail = await OrderDetail.aggregate([
            {
                $match: {
                    order: new mongoose.Types.ObjectId(orderId),
                },
            },
            // Join attribute
            {
                $lookup: {
                    from: "attributes",
                    localField: "attribute",
                    foreignField: "_id",
                    as: "attribute",
                },
            },
            { $unwind: "$attribute" },

            // Join product from attribute
            {
                $lookup: {
                    from: "products",
                    localField: "attribute.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },

            // Join images from product
            {
                $lookup: {
                    from: "images",
                    localField: "product._id",
                    foreignField: "product",
                    as: "imageUrls",
                },
            },

            // Join order
            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "order",
                },
            },
            { $unwind: "$order" },

            // Optional: Chỉ lấy các trường cần thiết
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    sellPrice: 1,
                    originPrice: 1,
                    attribute: {
                        _id: "$attribute._id",
                        size: "$attribute.size",
                        price: "$attribute.price",
                    },
                    product: {
                        _id: "$product._id",
                        code: "$product.code",
                        name: "$product.name",
                    },
                    imageUrls: {
                        _id: 1,
                        url: 1,
                    },
                    order: {
                        _id: "$order._id",
                        status: "$order.status", // hoặc các field bạn muốn lấy
                        userId: "$order.userId",
                    },
                },
            },
        ]);

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
const cancelOrder = async (req, res) => {
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
                isPending: null,
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
const countOrderByName = async (req, res) => {
    db.orders.aggregate([
        // B1: Chỉ lấy các đơn đã thanh toán
        {
            $match: { isPending: false },
        },

        // B2: Join orderDetails
        {
            $lookup: {
                from: "orderDetails",
                localField: "_id",
                foreignField: "orderId",
                as: "orderDetails",
            },
        },
        { $unwind: "$orderDetails" },

        // B3: Join attributes
        {
            $lookup: {
                from: "attributes",
                localField: "orderDetails.attributeId",
                foreignField: "_id",
                as: "attribute",
            },
        },
        { $unwind: "$attribute" },

        // B4: Join products
        {
            $lookup: {
                from: "products",
                localField: "attribute.productId",
                foreignField: "_id",
                as: "product",
            },
        },
        { $unwind: "$product" },

        // B5: Join product_categories
        {
            $lookup: {
                from: "product_category",
                localField: "product._id",
                foreignField: "productId",
                as: "productCategory",
            },
        },
        { $unwind: "$productCategory" },

        // B6: Join categories
        {
            $lookup: {
                from: "categories",
                localField: "productCategory.categoryId",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: "$category" },

        // B7: Group theo category để tính tổng quantity và doanh thu
        {
            $group: {
                _id: "$category._id",
                categoryName: { $first: "$category.name" },
                totalQuantity: { $sum: "$orderDetails.quantity" },
                totalRevenue: {
                    $sum: {
                        $multiply: [
                            "$orderDetails.quantity",
                            "$orderDetails.sellPrice",
                        ],
                    },
                },
            },
        },

        // Optional: sắp xếp theo doanh thu
        {
            $sort: { totalRevenue: -1 },
        },
    ]);
};
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
const reportAmountYear = async (req, res) => {
    try {
        const result = await Order.aggregate([
            {
                $match: {
                    isPayment: true,
                },
            },
            {
                $addFields: {
                    year: {
                        $year: {
                            date: "$createdAt",
                            timezone: "Asia/Ho_Chi_Minh",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$year",
                    totalAmount: { $sum: "$total" },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    totalAmount: 1,
                },
            },
            {
                $sort: { year: 1 },
            },
        ]);

        return successResponse(res, "", result);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
const reportByProduct = async (req, res) => {
    try {
        const { page, size, sort } = req.query;
        const result = await OrderDetail.aggregate([
            {
                $lookup: {
                    from: "attributes",
                    localField: "attribute",
                    foreignField: "_id",
                    as: "attributeInfo",
                },
            },
            { $unwind: "$attributeInfo" },

            {
                $addFields: {
                    productId: "$attributeInfo.product",
                },
            },

            {
                $lookup: {
                    from: "orders",
                    localField: "order",
                    foreignField: "_id",
                    as: "orderInfo",
                },
            },
            { $unwind: "$orderInfo" },

            {
                $match: {
                    "orderInfo.isPayment": true,
                },
            },

            {
                $addFields: {
                    lineTotal: { $multiply: ["$quantity", "$sellPrice"] },
                },
            },

            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$lineTotal" },
                    orderDetailIds: { $push: "$_id" },
                    orderDetailLength: { $sum: 1 },
                },
            },

            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
            {
                $unwind: {
                    path: "$productInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },

            { $sort: { [sort]: -1 } },
            { $skip: +page * +size },
            { $limit: +size },
        ]);

        return successResponseList(res, "", result);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

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
                    isPayment: 1,
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
const reportAmountMonth = async (req, res) => {
    db.orders.aggregate([
        // B1: Lọc đơn đã thanh toán
        {
            $match: {
                isPending: false,
                updatedAt: { $type: "date" }, // Đảm bảo là date
            },
        },

        // B2: Join orderDetails
        {
            $lookup: {
                from: "orderDetails",
                localField: "_id",
                foreignField: "orderId",
                as: "orderDetails",
            },
        },
        { $unwind: "$orderDetails" },

        // B3: Tính tháng từ updatedAt
        {
            $addFields: {
                month: { $month: "$updatedAt" }, // Lấy tháng (1 → 12)
            },
        },

        // B4: Group theo tháng để tính tổng revenue
        {
            $group: {
                _id: "$month",
                totalRevenue: {
                    $sum: {
                        $multiply: [
                            "$orderDetails.quantity",
                            "$orderDetails.sellPrice",
                        ],
                    },
                },
                totalQuantity: { $sum: "$orderDetails.quantity" },
            },
        },

        // B5: Đổi tên _id thành month
        {
            $project: {
                month: "$_id",
                _id: 0,
                totalRevenue: 1,
                totalQuantity: 1,
            },
        },

        // B6: Sắp xếp theo tháng tăng dần
        {
            $sort: { month: 1 },
        },
    ]);
};
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
                isPayment: true,
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
                    isPayment: 1,
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
