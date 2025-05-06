import express from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAdmin,
} from "../controller/categoryController.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/list", getAllCategories);
router.get("/list-admin", authMiddleware, getCategoryAdmin);
router.get("/detail", authMiddleware, getCategoryById);
router.post(
    "/create",
    validate(categorySchemaJoi),
    authMiddleware,
    createCategory
);
router.put(
    "/update",
    validate(categorySchemaJoi),
    authMiddleware,
    updateCategory
);
router.delete("/delete", authMiddleware, deleteCategory);

export default router;
