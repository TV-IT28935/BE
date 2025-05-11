import express from "express";
import {
  changePassword,
  forgotPassword,
  handleRefreshToken,
  loginUser,
  logout,
  resetPassword,
  sendOtp,
  sendOtpResetPassword,
} from "../controller/auth.controller.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", userAuth, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", handleRefreshToken);
router.put("/password", changePassword);
router.post("/send-otp", sendOtp);
router.post("/send-otp-reset", sendOtpResetPassword);

// router.post("/verify-otp", userAuth, verifyOtp);

export default router;
