import express from "express";
import {
  createSale,
  deleteSale,
  getAllSale,
  getSaleById,
  updateSale,
} from "../controller/saleControler.js";

const router = express.Router();

router.get("/", getAllSale);
router.get("/:id", getSaleById);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

export default router;
