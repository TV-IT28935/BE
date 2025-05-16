import express from "express";

import { getAllShipments } from "../controller/shipment.controller.js";

const router = express.Router();

router.get("/list", getAllShipments);
// router.get("/detail", authIsAdminMiddleware, getVoucherById);
// router.post("/create", authIsAdminMiddleware, createVoucher);
// router.put("/update", authIsAdminMiddleware, updateVoucher);
// router.delete("/delete", authIsAdminMiddleware, deleteVoucher);

export default router;
