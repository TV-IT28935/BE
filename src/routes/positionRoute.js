import express from "express";
import {
  createPosition,
  deletePosition,
  getAllPosition,
  getPosition,
  updatePosition,
} from "../controller/positionController.js";
import { authMiddleware } from "../middleware/authMiddlewares.js";
import positionSchemaJoi from "../validation/position.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/", authMiddleware, validate(positionSchemaJoi), createPosition);
router.get("/", authMiddleware, getAllPosition);
router.get("/:id", authMiddleware, getPosition);
router.delete("/:id", authMiddleware, deletePosition);
router.put("/", authMiddleware, validate(positionSchemaJoi), updatePosition);

export default router;
