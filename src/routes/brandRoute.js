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
router.get("/detail", getBrandById);
router.post("/create", createBrand);
router.put("/update", updateBrand);
router.delete("/delete", deleteBrand);

export default router;
