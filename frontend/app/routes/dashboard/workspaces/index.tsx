import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { Workspace } from "@/types";
import { PlusCircle, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";

const Workspaces = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-y-4">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

          <Button
            onClick={() => setIsCreatingWorkspace(true)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <PlusCircle className="size-4 mr-2" />
            New Workspace
          </Button>
        </div>

        {/* Workspace Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {workspaces.map((ws) => (
            <WorkspaceCard key={ws._id} workspace={ws} />
          ))}

          {/* Empty State */}
          {workspaces.length === 0 && (
            <div className="col-span-full">
              <NoDataFound
                title="No workspaces found"
                description="Create a new workspace to get started"
                buttonText="Create Workspace"
                buttonAction={() => setIsCreatingWorkspace(true)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1 hover:border-primary/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />

              <div>
                <CardTitle className="text-base">{workspace.name}</CardTitle>
                <span className="text-xs text-muted-foreground">
                  Created at {format(workspace.createdAt, "MMM d, yyyy h:mm a")}
                </span>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs">{workspace.members.length}</span>
            </div>
          </div>

          <CardDescription className="line-clamp-2 mt-2">
            {workspace.description || "No description"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="text-sm font-medium text-blue-600 hover:underline">
            View workspace details →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Workspaces;
