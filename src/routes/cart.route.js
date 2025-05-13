import express from "express";
import {
    getCartItemByAccountId,
    isEnoughCartItem,
    modifyCartItem,
    modifyCartItemFromDetail,
    removeCartItem,
} from "../controller/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/modify", authMiddleware, modifyCartItem);
router.post("/modify-from-detail", authMiddleware, modifyCartItemFromDetail);
router.get("/check-stock", authMiddleware, isEnoughCartItem);
router.get("/by-account", authMiddleware, getCartItemByAccountId);
router.post("/remove", authMiddleware, removeCartItem);

export default router;
