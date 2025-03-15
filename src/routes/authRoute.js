import express from "express";
import {
  changePassword,
  forgotPasswordToken,
  handleRefreshToken,
  loginUser,
  logout,
  resetPassword,
  sendOtp,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", userAuth, logout);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.post("/refresh-token", handleRefreshToken);
router.put("/password", changePassword);
router.post("/send-otp", sendOtp);
// router.post("/verify-otp", userAuth, verifyOtp);

export default router;
