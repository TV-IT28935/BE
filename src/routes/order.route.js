import express from "express";
import {
    amountYear,
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
    getOrderByOrderYearAndMonth,
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
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrderById);
router.get("/order-detail", authMiddleware, getOrderDetailByOrderId);
router.get("/order-status", authMiddleware, getAllOrderStatus);
router.get("/list", authMiddleware, getAllOrder);
router.post("/cancel", authMiddleware, cancelOrder);

// admin
router.get("/list/count", authIsAdminMiddleware, countOrderByName);
router.get("/count", authIsAdminMiddleware, countOrder);
router.get("/synthesis/year", authIsAdminMiddleware, reportAmountYear);
router.get("/synthesis/amount-year", authIsAdminMiddleware, amountYear);

router.get("/synthesis/product", authIsAdminMiddleware, reportByProduct);
router.get(
    "/synthesis/order-by-year-month",
    authIsAdminMiddleware,
    getOrderByOrderStatusAndYearAndMonth
);
router.get(
    "/synthesis/order-year-month",
    authIsAdminMiddleware,
    getOrderByOrderYearAndMonth
);
router.get(
    "/synthesis/order-by-product",
    authIsAdminMiddleware,
    getOrderByProduct
);
router.get("/synthesis/amount-month", authIsAdminMiddleware, reportAmountMonth);
router.post("/update", authIsAdminMiddleware, updateOrder);
router.post("/admin/cancel-order", authIsAdminMiddleware, updateCancel);
router.post("/admin/update-process", authIsAdminMiddleware, updateProcess);
router.post("/admin/update-shipment", authIsAdminMiddleware, updateShip);
router.post("/admin/update-success", authIsAdminMiddleware, updateSuccess);
router.get("/page-admin", authIsAdminMiddleware, getAllOrderAndPagination);
router.get(
    "/page-orders-between-date",
    authIsAdminMiddleware,
    getOrderByOrderStatusBetweenDate
);
router.get("/payment", authIsAdminMiddleware, getAllOrdersByPayment);
export default router;
