import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUser,
  getUserById,
  updateUserById,
} from "../controller/userController.js";
import validate from "../middleware/validate.js";
import userSchemaJoi from "../validation/user.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.post("/register", validate(userSchemaJoi), createUser);

router.get("/", authMiddleware, getAllUser);

router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", authMiddleware, deleteUserById);
router.put("/", authMiddleware, validate(userSchemaJoi), updateUserById);

export default router;
