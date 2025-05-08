import express from "express";
import {
    createUser,
    deleteUserById,
    getAccountByRole,
    getAllUser,
    getUserById,
    getUserDetail,
    updateUserById,
} from "../controller/userController.js";
import validate from "../middleware/validate.js";
import userSchemaJoi from "../validation/user.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";
import {
    changePassword,
    forgotPassword,
    handleRefreshToken,
    loginUser,
    logout,
    resetPassword,
    sendOtp,
    sendOtpResetPassword,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/create", validate(userSchemaJoi), createUser);
router.get("/admin/account/find-all", authMiddleware, getAllUser);

router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authMiddleware, deleteUserById);
router.put(
    "/update-profile",
    authMiddleware,
    validate(userSchemaJoi),
    updateUserById
);
router.get("/admin/account/by-role", authMiddleware, getAccountByRole);

router.post("/login", loginUser);
router.post("/logout", userAuth, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", handleRefreshToken);
router.put("/change-password", changePassword);
router.post("/send-otp", sendOtp);
router.post("/send-otp-reset", sendOtpResetPassword);
router.get("/detail", authMiddleware, getUserDetail);

export default router;
