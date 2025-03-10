import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", validate(categorySchemaJoi), createCategory);
router.put("/:id", validate(categorySchemaJoi), updateCategory);
router.delete("/:id", deleteCategory);

export default router;
