import express from "express";
import { validateRequest } from "zod-express-middleware";
import { inviteMemberSchema, tokenSchema, workspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { requireWorkspacePermission } from "../middleware/workspace-permission.js";
import { WORKSPACE_PERMISSIONS } from "../libs/permissions.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceInviteInfo,
  getWorkspaceProjects,
  getWorkspaceStats,
  acceptInviteByToken,
  inviteUserToWorkspace,
  acceptGenerateInvite,
} from "../controllers/workspace.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.INVITE_MEMBER),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get(
  "/:workspaceId/invite-info",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  getWorkspaceInviteInfo
);

router.get(
  "/:workspaceId",
  authMiddleware,
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.VIEW_WORKSPACE),
  getWorkspaceDetails
);
router.get(
  "/:workspaceId/projects",
  authMiddleware,
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.VIEW_WORKSPACE),
  getWorkspaceProjects
);
router.get(
  "/:workspaceId/stats",
  authMiddleware,
  requireWorkspacePermission(WORKSPACE_PERMISSIONS.VIEW_WORKSPACE),
  getWorkspaceStats
);

export default router;
