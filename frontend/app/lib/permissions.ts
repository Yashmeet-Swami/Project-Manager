import type { Project, Workspace } from "@/types";

export const WORKSPACE_PERMISSIONS = {
  INVITE_MEMBER: "invite_member",
  CREATE_PROJECT: "create_project",
  EDIT_WORKSPACE: "edit_workspace",
  REMOVE_MEMBER: "remove_member",
} as const;

export const PROJECT_PERMISSIONS = {
  CREATE_TASK: "create_task",
  UPDATE_ANY_TASK: "update_any_task",
  UPDATE_ASSIGNED_TASK: "update_assigned_task",
  ASSIGN_TASK_MEMBERS: "assign_task_members",
  ARCHIVE_TASK: "archive_task",
  EDIT_PROJECT: "edit_project",
} as const;

const workspaceRolePermissions: Record<string, readonly string[]> = {
  owner: [
    WORKSPACE_PERMISSIONS.INVITE_MEMBER,
    WORKSPACE_PERMISSIONS.CREATE_PROJECT,
    WORKSPACE_PERMISSIONS.EDIT_WORKSPACE,
    WORKSPACE_PERMISSIONS.REMOVE_MEMBER,
  ],
  admin: [
    WORKSPACE_PERMISSIONS.INVITE_MEMBER,
    WORKSPACE_PERMISSIONS.CREATE_PROJECT,
    WORKSPACE_PERMISSIONS.EDIT_WORKSPACE,
    WORKSPACE_PERMISSIONS.REMOVE_MEMBER,
  ],
  member: [],
  viewer: [],
};

const projectRolePermissions: Record<string, readonly string[]> = {
  manager: [
    PROJECT_PERMISSIONS.CREATE_TASK,
    PROJECT_PERMISSIONS.UPDATE_ANY_TASK,
    PROJECT_PERMISSIONS.UPDATE_ASSIGNED_TASK,
    PROJECT_PERMISSIONS.ASSIGN_TASK_MEMBERS,
    PROJECT_PERMISSIONS.ARCHIVE_TASK,
    PROJECT_PERMISSIONS.EDIT_PROJECT,
  ],
  contributor: [
    PROJECT_PERMISSIONS.CREATE_TASK,
    PROJECT_PERMISSIONS.UPDATE_ASSIGNED_TASK,
  ],
  viewer: [],
};

type WorkspacePermission = (typeof WORKSPACE_PERMISSIONS)[keyof typeof WORKSPACE_PERMISSIONS];
type ProjectPermission = (typeof PROJECT_PERMISSIONS)[keyof typeof PROJECT_PERMISSIONS];

const getMemberUserId = (member: { user?: { _id?: string } | string }) => {
  return typeof member.user === "string" ? member.user : member.user?._id;
};

export const getWorkspaceRole = (workspace?: Workspace, userId?: string) => {
  if (!workspace || !userId) return undefined;

  return workspace.members?.find((member) => getMemberUserId(member) === userId)
    ?.role;
};

export const getProjectRole = (project?: Project, userId?: string) => {
  if (!project || !userId) return undefined;

  return project.members?.find((member) => getMemberUserId(member) === userId)
    ?.role;
};

export const hasWorkspacePermission = (
  role: string | undefined,
  permission: WorkspacePermission
) => {
  if (!role) return false;

  return (
    workspaceRolePermissions[role]?.includes(permission) ?? false
  );
};

export const hasProjectPermission = (
  role: string | undefined,
  permission: ProjectPermission
) => {
  if (!role) return false;

  return (
    projectRolePermissions[role]?.includes(permission) ?? false
  );
};
