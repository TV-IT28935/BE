import express from "express";
import {
    getAttribute,
    getAttributeById,
} from "../controller/attribute.controller.js";

const router = express.Router();

router.get("/get-by-product", getAttribute);
router.get("/", getAttributeById);

export default router;
