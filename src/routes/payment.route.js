import express from "express";
import {
    generatePaymentUrl,
    handlePaymentResponse,
} from "../controller/payment.controller.js";

const router = express.Router();

router.post("/generate-payment-url", generatePaymentUrl);

router.get("/handle-payment-response", handlePaymentResponse);

export default router;
