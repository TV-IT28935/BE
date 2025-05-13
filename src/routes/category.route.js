import express from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryAdmin,
    getCategoryById,
    updateCategory,
} from "../controller/category.controller.js";
import { authIsAdminMiddleware } from "../middleware/authMiddlewares.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";

const router = express.Router();

router.get("/list", getAllCategories);
router.get("/list-admin", authIsAdminMiddleware, getCategoryAdmin);
router.get("/detail", authIsAdminMiddleware, getCategoryById);
router.post(
    "/create",
    validate(categorySchemaJoi),
    authIsAdminMiddleware,
    createCategory
);
router.put(
    "/update",
    validate(categorySchemaJoi),
    authIsAdminMiddleware,
    updateCategory
);
router.delete("/delete", authIsAdminMiddleware, deleteCategory);

export default router;
