import AppError from "../libs/app-error.js";
import asyncHandler from "../libs/async-handler.js";
import { hasWorkspacePermission } from "../libs/permissions.js";
import mongoose from "mongoose";
import Workspace from "../models/workspace.js";

const getMemberUserId = (member) => {
  return member.user?._id?.toString() || member.user?.toString();
};

export const requireWorkspacePermission = (permission) =>
  asyncHandler(async (req, res, next) => {
    const workspaceId = req.params.workspaceId || req.body.workspaceId;

    if (!workspaceId) {
      throw new AppError("Workspace ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      throw new AppError("Invalid workspace ID format", 400);
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new AppError("Workspace not found", 404);
    }

    const member = workspace.members.find(
      (workspaceMember) =>
        getMemberUserId(workspaceMember) === req.user._id.toString()
    );

    if (!member) {
      throw new AppError("You are not a member of this workspace", 403);
    }

    if (!hasWorkspacePermission(member.role, permission)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }

    req.workspace = workspace;
    req.workspaceRole = member.role;
    next();
  });
