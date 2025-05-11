import express from "express";
import {
    createBrand,
    deleteBrand,
    getAllBrand,
    getBrandById,
    updateBrand,
} from "../controller/brand.controller.js";
import { authIsAdminMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/list", getAllBrand);
router.get("/detail", authIsAdminMiddleware, getBrandById);
router.post("/create", authIsAdminMiddleware, createBrand);
router.put("/update", authIsAdminMiddleware, updateBrand);
router.delete("/delete", authIsAdminMiddleware, deleteBrand);

export default router;
