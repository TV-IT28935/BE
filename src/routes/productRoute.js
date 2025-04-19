import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
  getProductById,
} from "../controller/productController.js";
import validate from "../middleware/validate.js";
import { productSchemaJoi } from "../validation/product.js";

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getProductById);
router.post("/", validate(productSchemaJoi), createProduct);
router.put("/", validate(productSchemaJoi), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
