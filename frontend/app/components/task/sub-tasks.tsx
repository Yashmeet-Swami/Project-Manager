import type { Subtask } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useAddSubTaskMutation,
  useUpdateSubTaskMutation,
} from "@/hooks/use-task";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export const SubTasksDetails = ({
  subTasks,
  taskId,
}: {
  subTasks: Subtask[];
  taskId: string;
}) => {
  const [newSubTask, setNewSubTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { mutate: addSubTask, isPending } = useAddSubTaskMutation();
  const { mutate: updateSubTask } = useUpdateSubTaskMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [optimisticSubTasks, setOptimisticSubTasks] = useState<Subtask[]>(subTasks);

  useEffect(() => {
      setOptimisticSubTasks(subTasks);
  }, [subTasks]);

  useEffect(() => {
      if (isAdding && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isAdding]);

  const handleToggleTask = (subTaskId: string, checked: boolean) => {
    const previous = [...optimisticSubTasks];
    setOptimisticSubTasks(prev => prev.map(st => st._id === subTaskId ? { ...st, completed: checked } : st));

    updateSubTask(
      { taskId, subTaskId, completed: checked },
      {
        onError: (error: any) => {
          setOptimisticSubTasks(previous);
          const errMessage = error.response?.data?.message || "Failed to update subtask";
          toast.error(errMessage);
        },
      }
    );
  };

  const handleUpdateTitle = (subTaskId: string, title: string) => {
      if (!title.trim()) return;
      const subTask = optimisticSubTasks.find(st => st._id === subTaskId);
      if (subTask?.title === title) return;

      const previous = [...optimisticSubTasks];
      setOptimisticSubTasks(prev => prev.map(st => st._id === subTaskId ? { ...st, title } : st));

      updateSubTask(
          { taskId, subTaskId, title },
          {
              onError: (error: any) => {
                  setOptimisticSubTasks(previous);
                  toast.error(error.response?.data?.message || "Failed to update title");
              }
          }
      )
  };

  const handleAddSubTask = () => {
    if (!newSubTask.trim()) {
        setIsAdding(false);
        return;
    }
    
    addSubTask(
      { taskId, title: newSubTask.trim() },
      {
        onSuccess: () => {
          setNewSubTask("");
          setIsAdding(false);
        },
        onError: (error: any) => {
          const errMessage = error.response?.data?.message || "Failed to add subtask";
          toast.error(errMessage);
        },
      }
    );
  };

  return (
    <div className="mb-6 mt-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
        Checklist
        <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {optimisticSubTasks.filter(s => s.completed).length} / {optimisticSubTasks.length}
        </span>
      </h3>

      <div className="space-y-1 mb-2">
        {optimisticSubTasks.length > 0 ? (
          optimisticSubTasks.map((subTask) => (
            <div key={subTask._id} className="flex items-start space-x-3 group rounded-md p-1.5 -mx-1.5 hover:bg-slate-50 transition-colors">
              <Checkbox
                id={subTask._id}
                className="mt-1 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-colors"
                checked={subTask.completed}
                onCheckedChange={(checked) =>
                  handleToggleTask(subTask._id, !!checked)
                }
              />

              <Input
                className={cn(
                  "h-auto py-0.5 px-1.5 text-sm border-transparent bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-blue-200 focus-visible:border-blue-300 hover:border-slate-200 transition-all",
                  subTask.completed ? "line-through text-slate-400" : "text-slate-700"
                )}
                defaultValue={subTask.title}
                onBlur={(e) => handleUpdateTitle(subTask._id, e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.currentTarget.blur();
                    }
                }}
              />
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-400 italic py-2">No subtasks yet</div>
        )}
      </div>

      <div className="mt-2">
        {isAdding ? (
            <div className="flex items-center gap-2 mt-2">
                <Input
                    ref={inputRef}
                    placeholder="What needs to be done?"
                    value={newSubTask}
                    onChange={(e) => setNewSubTask(e.target.value)}
                    className="h-8 text-sm border-blue-200 ring-1 ring-blue-100 focus-visible:ring-2"
                    disabled={isPending}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSubTask();
                        if (e.key === "Escape") {
                            setIsAdding(false);
                            setNewSubTask("");
                        }
                    }}
                />
                <Button
                    size="sm"
                    className="h-8"
                    onClick={handleAddSubTask}
                    disabled={isPending || !newSubTask.trim()}
                >
                    Add
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-slate-500"
                    onClick={() => {
                        setIsAdding(false);
                        setNewSubTask("");
                    }}
                >
                    Cancel
                </Button>
            </div>
        ) : (
            <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 h-8 -ml-2 transition-colors"
                onClick={() => setIsAdding(true)}
            >
                <Plus className="size-4 mr-1.5" />
                Add Subtask
            </Button>
        )}
      </div>
    </div>
  );
};