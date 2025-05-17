import express from "express";
import {
    createSale,
    deleteSale,
    getAllSale,
    getAllSaleAdmin,
    getSaleById,
    updateSale,
} from "../controller/sale.controller.js";
import { authIsAdminMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/list", authIsAdminMiddleware, getAllSale);
router.get("/list-admin", authIsAdminMiddleware, getAllSaleAdmin);

router.get("/detail", authIsAdminMiddleware, getSaleById);
router.post("/create", authIsAdminMiddleware, createSale);
router.put("/update", authIsAdminMiddleware, updateSale);
router.delete("/delete", authIsAdminMiddleware, deleteSale);

export default router;
