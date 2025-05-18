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
    countAccount,
    createAccount,
    createUser,
    deleteUserById,
    getAccountByRole,
    getAllUser,
    getTotalPage,
    getUserById,
    getUserDetail,
    updateUserById,
} from "../controller/user.controller.js";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";
import validate from "../middleware/validate.js";
import userSchemaJoi from "../validation/user.validation.js";
import userDetailSchemaJoi from "../validation/userDetail.validation.js";

const router = express.Router();

router.post("/create", createUser);
router.get("/admin/account/find-all", authIsAdminMiddleware, getAllUser);
router.post(
    "/admin/create",
    authIsAdminMiddleware,
    validate(userDetailSchemaJoi),
    createAccount
);
router.get("/admin/total-page", authIsAdminMiddleware, getTotalPage);
router.get("/admin/count", authIsAdminMiddleware, countAccount);

router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authIsAdminMiddleware, deleteUserById);
router.put(
    "/update-profile",
    authMiddleware,
    validate(userDetailSchemaJoi),
    updateUserById
);
router.get("/admin/account/by-role", authIsAdminMiddleware, getAccountByRole);

router.get("/detail", authMiddleware, getUserDetail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
router.post("/refresh-token", handleRefreshToken);
router.put("/change-password", changePassword);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/send-otp-reset", sendOtpResetPassword);

export default router;
