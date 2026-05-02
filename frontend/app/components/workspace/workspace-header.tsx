import type { User, Workspace } from "@/types";
import { WorkspaceAvatar } from "./workspace-avatar";
import { Button } from "../ui/button";
import { Plus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface WorkspaceHeaderProps {
    workspace: Workspace;
    members: {
        _id: string;
        user: User;
        role: "admin" | "member" | "owner" | "viewer";
        joinedAt: Date;
    }[];
    onCreateProject: () => void;
    onInviteMember: () => void;
    canCreateProject: boolean;
    canInviteMember: boolean;
}

export const WorkspaceHeader = ({
    workspace,
    members,
    onCreateProject,
    onInviteMember,
    canCreateProject,
    canInviteMember,
}: WorkspaceHeaderProps) => {

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex md:items-center gap-3">
                        {workspace.color && (
                            <WorkspaceAvatar color={workspace.color} name={workspace.name} />
                        )}

                        <h2 className="text-xl md:text-2xl font-semibold">
                            {workspace.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 justify-between md:justify-start mb-4 md:mb-0">
                        {canInviteMember && (
                            <Button variant={"outline"} onClick={onInviteMember}>
                                <UserPlus className="size-4 mr-2" />
                                Invite
                            </Button>
                        )}
                        {canCreateProject && (
                            <Button onClick={onCreateProject}>
                                <Plus className="size-4 mr-2" />
                                Create Project
                            </Button>
                        )}

                    </div>
                </div>
                {workspace.description && (
                    <p className="text-sm md:text-base text-muted-foreground">
                        {workspace.description}
                    </p>
                )}
            </div>
            {members.length > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Members</span>

                    <div className="flex flex-wrap gap-3">
                        {members.map((member) => (
                            <div
                                key={member._id}
                                className="flex items-center gap-2"
                                title={`${member.user.name} - ${member.role}`}
                            >
                                <Avatar
                                    className="relative h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                                >
                                    <AvatarImage
                                        src={member.user.profilePicture}
                                        alt={member.user.name}
                                    />
                                    <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="rounded-full border px-2 py-0.5 text-xs capitalize text-muted-foreground">
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
