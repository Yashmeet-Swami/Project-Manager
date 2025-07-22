import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import type { TaskStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const TaskStatusSelector = ({
    status,
    taskId,
}: {
    status: TaskStatus;
    taskId: string;
}) => {
    const { mutate , isPending } = useUpdateTaskStatusMutation();

    const handleStatusChange = (value: string) =>{
        mutate(
            {taskId , status: value as TaskStatus },
            {
                onSuccess: () => {
                    toast.success("Status uploaded successfully");
                },
                onError: (error: any) => {
                    const errormsg = error.response.data.message;
                    toast.error(errormsg);
                    console.log(error);
                }
            }
        )
    }
    return (
    <Select value={status || ""} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]" disabled={isPending}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
    )
}