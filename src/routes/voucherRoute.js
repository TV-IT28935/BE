import express from "express";
import {
    createVoucher,
    deleteVoucher,
    getAllVouchers,
    getVoucherByCode,
    getVoucherById,
    updateVoucher,
} from "../controller/voucherController.js";
import validate from "../middleware/validate.js";
import categorySchemaJoi from "../validation/category.js";

const router = express.Router();

router.get("/list", getAllVouchers);
router.get("/detail", getVoucherById);
router.get("/by-code", getVoucherByCode);
router.post("/create", createVoucher);
router.put("/update", updateVoucher);
router.delete("/delete", deleteVoucher);

export default router;
