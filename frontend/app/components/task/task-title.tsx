import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";

export const TaskTitle = ({
    title,
    taskId,
}: {
    title: string;
    taskId: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const { mutate, isPending } = useUpdateTaskTitleMutation();
    
    const updateTitle = () => {
        mutate(
            { taskId, title: newTitle },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success("Title updated successfully");
                },
                onError: (error: any) => {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                }
            }
        )
    }

    return (
        <div className="relative flex items-start gap-2 w-full">
            {isEditing ? (
                <div className="flex items-center gap-2 w-full">
                    <Input 
                        className="text-xl font-semibold flex-1 min-w-0"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        disabled={isPending}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={updateTitle}
                            disabled={isPending}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setIsEditing(false);
                                setNewTitle(title);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2 w-full">
                    <h2 className="text-xl flex-1 font-semibold break-words min-w-0">
                        {title}
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}