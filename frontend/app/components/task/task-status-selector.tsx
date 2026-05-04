import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import type { TaskStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-700 hover:bg-slate-200 ring-slate-200",
  "In Progress": "bg-amber-100 text-amber-700 hover:bg-amber-200 ring-amber-200",
  "Done": "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 ring-emerald-200",
};

export const TaskStatusSelector = ({
    status,
    taskId,
}: {
    status: TaskStatus;
    taskId: string;
}) => {
    const [optimisticStatus, setOptimisticStatus] = useState<TaskStatus>(status);
    
    useEffect(() => {
        setOptimisticStatus(status);
    }, [status]);

    const { mutate, isPending } = useUpdateTaskStatusMutation();

    const handleStatusChange = (value: string) => {
        const previousStatus = optimisticStatus;
        setOptimisticStatus(value as TaskStatus);

        mutate(
            {taskId , status: value as TaskStatus },
            {
                onError: (error: any) => {
                    setOptimisticStatus(previousStatus);
                    const errormsg = error.response?.data?.message || "Failed to update status";
                    toast.error(errormsg);
                }
            }
        )
    }

    return (
        <Select value={optimisticStatus || ""} onValueChange={handleStatusChange} disabled={isPending}>
            <SelectTrigger className={cn("w-fit h-8 px-3 border-0 ring-1 ring-inset focus:ring-2 shadow-sm rounded-full transition-all", statusStyles[optimisticStatus] || statusStyles["To Do"])}>
                <div className="flex items-center gap-2 text-xs font-medium">
                    <div className={cn("w-1.5 h-1.5 rounded-full", optimisticStatus === "Done" ? "bg-emerald-500" : optimisticStatus === "In Progress" ? "bg-amber-500" : "bg-slate-500")} />
                    <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
        </Select>
    )
}