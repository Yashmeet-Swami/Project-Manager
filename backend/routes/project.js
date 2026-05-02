import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireProjectPermission } from "../middleware/project-permission.js";
import { requireWorkspacePermission } from "../middleware/workspace-permission.js";
import { validateRequest } from "zod-express-middleware";
import {
  PROJECT_PERMISSIONS,
  WORKSPACE_PERMISSIONS,
} from "../libs/permissions.js";
import { projectSchema } from "../libs/validate-schema.js";
import { z } from "zod";
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
} from "../controllers/project.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.CREATE_PROJECT),
  createProject
);

router.get(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  requireProjectPermission(PROJECT_PERMISSIONS.VIEW_PROJECT),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  requireProjectPermission(PROJECT_PERMISSIONS.VIEW_PROJECT),
  getProjectTasks
);
export default router;
