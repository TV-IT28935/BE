import express from "express";
import {
  createSale,
  deleteSale,
  getAllSale,
  getSaleById,
  updateSale,
} from "../controller/saleControler.js";

const router = express.Router();

router.get("/list", getAllSale);
router.get("/detail", getSaleById);
router.post("/create", createSale);
router.put("/update", updateSale);
router.delete("/delete", deleteSale);

export default router;
