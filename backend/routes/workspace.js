import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
} from "../controllers/workspace.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/", authMiddleware,
  validateRequest({ body: workspaceSchema }),  // 🧠 Apply zod schema to req.body
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);

router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
export default router;
