import AppError from "../libs/app-error.js";
import asyncHandler from "../libs/async-handler.js";
import { hasProjectPermission } from "../libs/permissions.js";
import mongoose from "mongoose";
import Project from "../models/project.js";

const getMemberUserId = (member) => {
  return member.user?._id?.toString() || member.user?.toString();
};

export const requireProjectPermission = (permission) =>
  asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.projectId;

    if (!projectId) {
      throw new AppError("Project ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new AppError("Invalid project ID format", 400);
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const member = project.members.find(
      (projectMember) => getMemberUserId(projectMember) === req.user._id.toString()
    );

    if (!member) {
      throw new AppError("You are not a member of this project", 403);
    }

    if (!hasProjectPermission(member.role, permission)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }

    req.project = project;
    req.projectRole = member.role;
    next();
  });
