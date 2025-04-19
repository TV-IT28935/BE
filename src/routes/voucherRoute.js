import express from "express";
import {
  createVoucher,
  deleteVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
} from "../controller/voucherController.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";

const router = express.Router();

router.get("/", getAllVouchers);
router.get("/:id", getVoucherById);
router.post("/", createVoucher);
router.put("/:id", updateVoucher);
router.delete("/:id", deleteVoucher);

export default router;
