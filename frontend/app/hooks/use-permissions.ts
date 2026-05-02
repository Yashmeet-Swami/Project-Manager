import { useAuth } from "@/provider/auth-context";
import type { Project, Workspace } from "@/types";
import {
  getProjectRole,
  getWorkspaceRole,
  hasProjectPermission,
  hasWorkspacePermission,
  PROJECT_PERMISSIONS,
  WORKSPACE_PERMISSIONS,
} from "@/lib/permissions";

export const useWorkspacePermissions = (workspace?: Workspace) => {
  const { user } = useAuth();
  const role = getWorkspaceRole(workspace, user?._id);

  return {
    role,
    canInviteMember: hasWorkspacePermission(
      role,
      WORKSPACE_PERMISSIONS.INVITE_MEMBER
    ),
    canCreateProject: hasWorkspacePermission(
      role,
      WORKSPACE_PERMISSIONS.CREATE_PROJECT
    ),
    canEditWorkspace: hasWorkspacePermission(
      role,
      WORKSPACE_PERMISSIONS.EDIT_WORKSPACE
    ),
    canRemoveMember: hasWorkspacePermission(
      role,
      WORKSPACE_PERMISSIONS.REMOVE_MEMBER
    ),
  };
};

export const useProjectPermissions = (project?: Project) => {
  const { user } = useAuth();
  const role = getProjectRole(project, user?._id);

  return {
    role,
    canCreateTask: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.CREATE_TASK
    ),
    canUpdateAnyTask: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.UPDATE_ANY_TASK
    ),
    canUpdateAssignedTask: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.UPDATE_ASSIGNED_TASK
    ),
    canAssignMembers: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.ASSIGN_TASK_MEMBERS
    ),
    canArchiveTask: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.ARCHIVE_TASK
    ),
    canEditProject: hasProjectPermission(
      role,
      PROJECT_PERMISSIONS.EDIT_PROJECT
    ),
  };
};
