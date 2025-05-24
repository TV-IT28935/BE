import express from "express";
import {
    getCartItemByAccountId,
    isEnoughCartItem,
    modifyCartItem,
    modifyCartItemFromDetail,
    modifyCartItemFromNotUserFromDetail,
    removeCartItem,
} from "../controller/cart.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/modify", authMiddleware, modifyCartItem);
router.post("/modify-from-detail", authMiddleware, modifyCartItemFromDetail);
router.post(
    "/modify-from-not-user-detail",
    authMiddleware,
    modifyCartItemFromNotUserFromDetail
);

router.get("/check-stock", authMiddleware, isEnoughCartItem);
router.get("/by-account", authMiddleware, getCartItemByAccountId);
router.post("/remove", authMiddleware, removeCartItem);

export default router;
