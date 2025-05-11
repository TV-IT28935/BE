import express from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryAdmin,
} from "../controller/category.controller.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";

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
