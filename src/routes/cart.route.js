import express from "express";
import {
    modifyCartItem,
    isEnoughCartItem,
    getCartItemByAccountId,
    removeCartItem,
    modifyCartItemFromDetail,
} from "../controller/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/modify", authMiddleware, modifyCartItem);
router.post("/modify-from-detail", authMiddleware, modifyCartItemFromDetail);
router.get("/check-stock", authMiddleware, isEnoughCartItem);
router.get("/by-account", authMiddleware, getCartItemByAccountId);
router.post("/remove", authMiddleware, removeCartItem);

export default router;
