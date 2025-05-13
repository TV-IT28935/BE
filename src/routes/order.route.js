import express from "express";
import {
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
} from "../controller/order.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.post("/", authMiddleware, getOrderById);
router.post("/order-detail", authMiddleware, getOrderDetailByOrderId);
router.post("/order-status", authMiddleware, getAllOrderStatus);
router.post("/list", authMiddleware, getAllOrder);
router.post("/cancel", authMiddleware, cancelOrder);

// admin
router.post("/list/count", authMiddleware, countOrderByName);
router.post("/count", authMiddleware, countOrder);
router.post("/synthesis/year", authMiddleware, reportAmountYear);
router.post("/synthesis/product", authMiddleware, reportByProduct);
router.post(
    "/synthesis/order-by-year-month",
    authMiddleware,
    getOrderByOrderStatusAndYearAndMonth
);
router.post("/synthesis/order-by-product", authMiddleware, getOrderByProduct);
router.get("/synthesis/amount-month", authMiddleware, reportAmountMonth);
router.get("/update", authMiddleware, updateOrder);
router.post("/admin/cancel-order", authMiddleware, updateCancel);
router.post("/admin/update-process", authMiddleware, updateProcess);
router.post("/admin/update-shipment", authMiddleware, updateShip);
router.get("/", authMiddleware, updateSuccess);
router.get("/by-account", authMiddleware, getAllOrderAndPagination);
router.post("/remove", authMiddleware, getOrderByOrderStatusBetweenDate);
router.post("/remove", authMiddleware, getAllOrdersByPayment);
export default router;
