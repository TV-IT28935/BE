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
    verifyOtp,
} from "../controller/auth.controller.js";
import {
    createUser,
    deleteUserById,
    getAccountByRole,
    getAllUser,
    getUserById,
    getUserDetail,
    updateUserById,
} from "../controller/user.controller.js";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";
import validate from "../middleware/validate.js";
import userSchemaJoi from "../validation/user.js";

const router = express.Router();

router.post("/create", validate(userSchemaJoi), createUser);
router.get("/admin/account/find-all", authIsAdminMiddleware, getAllUser);

router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authIsAdminMiddleware, deleteUserById);
router.put(
    "/update-profile",
    authMiddleware,
    validate(userSchemaJoi),
    updateUserById
);
router.get("/admin/account/by-role", authIsAdminMiddleware, getAccountByRole);

router.post("/login", loginUser);
router.post("/logout", authMiddleware, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", handleRefreshToken);
router.put("/change-password", changePassword);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp-reset", sendOtpResetPassword);
router.get("/detail", authMiddleware, getUserDetail);

export default router;
