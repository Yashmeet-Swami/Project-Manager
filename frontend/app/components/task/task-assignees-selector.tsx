import type { ProjectMemberRole, Task, User } from "@/types";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useUpdateTaskAssigneesMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Plus, UserPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

export const TaskAssigneesSelector = ({
  task,
  assignees,
  projectMembers,
}: {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    assignees.map((assignee) => assignee._id)
  );
  
  useEffect(() => {
      setSelectedIds(assignees.map((a) => a._id));
  }, [assignees]);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { mutate, isPending } = useUpdateTaskAssigneesMutation();

  const handleSelect = (id: string) => {
    let newSelected = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];

    setSelectedIds(newSelected);
  };

  const handleSave = () => {
    mutate(
      { taskId: task._id, assignees: selectedIds },
      {
        onSuccess: () => {
          setDropDownOpen(false);
          toast.success("Assignees updated");
        },
        onError: (error: any) => {
          const errMessage = error.response?.data?.message || "Failed to update assignees";
          toast.error(errMessage);
        },
      }
    );
  };

  const selectedUsers = projectMembers
    .filter((member) => selectedIds.includes(member.user._id))
    .map(m => m.user);

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {selectedUsers.length > 0 ? (
          selectedUsers.map((user) => (
            <Tooltip key={user._id}>
                <TooltipTrigger asChild>
                    <Avatar className="size-7 border-2 border-white bg-slate-100 hover:z-10 relative transition-transform hover:scale-110 cursor-pointer shadow-sm">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="text-[10px]">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">{user.name}</TooltipContent>
            </Tooltip>
          ))
        ) : (
          <div className="size-7 rounded-full border border-dashed border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400">
            <UserPlus className="size-3.5" />
          </div>
        )}
      </div>

      <Popover open={dropDownOpen} onOpenChange={setDropDownOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-7 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
             <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2" align="start">
          <div className="mb-2 px-2 pb-2 border-b text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Assign to...
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {projectMembers.map((m) => (
              <label
                className={cn(
                    "flex items-center px-2 py-1.5 cursor-pointer hover:bg-slate-50 rounded-md transition-colors",
                    selectedIds.includes(m.user._id) ? "bg-blue-50/50" : ""
                )}
                key={m.user._id}
              >
                <Checkbox
                  checked={selectedIds.includes(m.user._id)}
                  onCheckedChange={() => handleSelect(m.user._id)}
                  className="mr-3"
                />
                <Avatar className="size-6 mr-2">
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback className="text-[10px]">{m.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">{m.user.name}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 px-2 pt-2 mt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                  setDropDownOpen(false);
                  setSelectedIds(assignees.map((a) => a._id));
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {isPending && <span className="text-[10px] font-medium text-slate-400 animate-pulse ml-2">Saving...</span>}
    </div>
  );
};