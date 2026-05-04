import type { TaskPriority } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUpdateTaskPriorityMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const priorityStyles = {
  "High": "bg-red-50 text-red-700 ring-red-200 hover:bg-red-100",
  "Medium": "bg-orange-50 text-orange-700 ring-orange-200 hover:bg-orange-100",
  "Low": "bg-slate-50 text-slate-700 ring-slate-200 hover:bg-slate-100",
};

export const TaskPrioritySelector = ({
  priority,
  taskId,
}: {
  priority: TaskPriority;
  taskId: string;
}) => {
  const [optimisticPriority, setOptimisticPriority] = useState<TaskPriority>(priority);

  useEffect(() => {
      setOptimisticPriority(priority);
  }, [priority]);

  const { mutate, isPending } = useUpdateTaskPriorityMutation();

  const handlePriorityChange = (value: string) => {
    const prevPriority = optimisticPriority;
    setOptimisticPriority(value as TaskPriority);

    mutate(
      { taskId, priority: value as TaskPriority },
      {
        onError: (error: any) => {
          setOptimisticPriority(prevPriority);
          const errorMessage = error.response?.data?.message || "Failed to update priority";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Select value={optimisticPriority || ""} onValueChange={handlePriorityChange} disabled={isPending}>
      <SelectTrigger className={cn("w-fit h-8 px-3 border-0 ring-1 ring-inset focus:ring-2 shadow-sm rounded-full transition-all", priorityStyles[optimisticPriority] || priorityStyles["Low"])}>
        <div className="flex items-center gap-2 text-xs font-medium">
            <SelectValue placeholder="Priority" />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="Low">Low</SelectItem>
        <SelectItem value="Medium">Medium</SelectItem>
        <SelectItem value="High">High</SelectItem>
      </SelectContent>
    </Select>
  );
};