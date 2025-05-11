import express from "express";
import {
    createVoucher,
    deleteVoucher,
    getAllVouchers,
    getVoucherByCode,
    getVoucherById,
    updateVoucher,
} from "../controller/voucher.controller.js";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/list", authIsAdminMiddleware, getAllVouchers);
router.get("/detail", authIsAdminMiddleware, getVoucherById);
router.get("/by-code", authMiddleware, getVoucherByCode);
router.post("/create", authIsAdminMiddleware, createVoucher);
router.put("/update", authIsAdminMiddleware, updateVoucher);
router.delete("/delete", authIsAdminMiddleware, deleteVoucher);

export default router;
