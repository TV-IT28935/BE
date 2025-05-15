import express from "express";
import {
    getAllReviewAttributeByProductId,
    getAttribute,
    getAttributeById,
    reviewAttribute,
} from "../controller/attribute.controller.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.get("/get-by-product", getAttribute);
router.get("/", getAttributeById);
router.get("/review", getAllReviewAttributeByProductId);
router.post("/review", authMiddleware, reviewAttribute);
export default router;
