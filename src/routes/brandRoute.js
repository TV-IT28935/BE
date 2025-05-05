import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrandById,
  updateBrand,
} from "../controller/brandController.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";

const router = express.Router();

router.get("/list", getAllBrand);
router.get("/:id", getBrandById);
router.post("/", validate(categorySchemaJoi), createBrand);
router.put("/:id", validate(categorySchemaJoi), updateBrand);
router.delete("/:id", deleteBrand);

export default router;
