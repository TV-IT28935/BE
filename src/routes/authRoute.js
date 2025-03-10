import express from "express";
import {
  changePassword,
  forgotPasswordToken,
  handleRefreshToken,
  loginUser,
  logout,
  resetPassword,
} from "../controller/authController.js";

const router = express.Router();

router.post("/login", loginUser);
// router.post("/login-admin", loginAdmin);
router.post("/logout", logout);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.get("/refresh-token", handleRefreshToken);
router.put("/password", changePassword);

export default router;
