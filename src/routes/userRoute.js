import express from "express";
import {
  createUser,
  getAllUser,
  getUserById,
} from "../controller/userController.js";
import validate from "../middleware/validate.js";
import userSchemaJoi from "../validation/user.js";

const router = express.Router();

router.post("/register", validate(userSchemaJoi), createUser);

router.get("/", getAllUser);

router.get("/:id", getUserById);

export default router;
