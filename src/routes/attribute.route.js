import express from "express";
import {
    getAllReviewAttributeByProductId,
    getAttribute,
    getAttributeById,
    getReviewAttributeByOrderDetailId,
    reviewAttribute,
} from "../controller/attribute.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/get-by-product", getAttribute);
router.get("/", getAttributeById);
router.get("/review", getAllReviewAttributeByProductId);
router.get("/review-detail", getReviewAttributeByOrderDetailId);
router.post("/review", authMiddleware, reviewAttribute);
export default router;
