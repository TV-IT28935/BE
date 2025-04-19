import express from "express";
import {
  createOrderStatus,
  deleteOrderStatus,
  getAllOrderStatus,
  getOrderStatusById,
  updateOrderStatus,
} from "../controller/orderStatusController.js";

const router = express.Router();

router.get("/", getAllOrderStatus);
router.get("/:id", getOrderStatusById);
router.post("/", createOrderStatus);
router.put("/:id", updateOrderStatus);
router.delete("/:id", deleteOrderStatus);

export default router;
