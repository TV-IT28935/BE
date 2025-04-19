import express from "express";
import {
  createRole,
  deleteRole,
  getAllRole,
  getRoleById,
  updateRole,
} from "../controller/roleController.js";

const router = express.Router();

router.get("/", getAllRole);
router.get("/:id", getRoleById);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
