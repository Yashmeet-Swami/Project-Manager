import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { useUpdateTaskTitleMutation } from "@/hooks/use-task";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const TaskTitle = ({
    title,
    taskId,
}: {
    title: string;
    taskId: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [optimisticTitle, setOptimisticTitle] = useState(title);
    
    useEffect(() => {
        setOptimisticTitle(title);
        setNewTitle(title);
    }, [title]);

    const { mutate, isPending } = useUpdateTaskTitleMutation();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);
    
    const updateTitle = () => {
        if (newTitle.trim() === "" || newTitle === optimisticTitle) {
            setIsEditing(false);
            setNewTitle(optimisticTitle);
            return;
        }

        const previousTitle = optimisticTitle;
        setOptimisticTitle(newTitle);
        setIsEditing(false);

        mutate(
            { taskId, title: newTitle.trim() },
            {
                onError: (error: any) => {
                    setOptimisticTitle(previousTitle);
                    setNewTitle(previousTitle);
                    const errorMessage = error.response?.data?.message || "Failed to update title";
                    toast.error(errorMessage);
                }
            }
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            updateTitle();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setNewTitle(optimisticTitle);
        }
    }

    return (
        <div className="group relative flex flex-col w-full min-w-0 transition-all">
            {isEditing ? (
                <div className="flex items-center w-full relative">
                    <Input 
                        ref={inputRef}
                        className="text-2xl md:text-3xl font-bold h-auto py-1 px-2 -ml-2 w-full border-blue-300 ring-2 ring-blue-100 shadow-sm transition-all bg-white"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={updateTitle}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                        aria-label="Task title input"
                    />
                </div>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <h1 
                            className="text-2xl md:text-3xl font-bold text-slate-900 break-words min-w-0 cursor-text py-1 px-2 -ml-2 rounded-md hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                            onClick={() => setIsEditing(true)}
                            tabIndex={0}
                            role="button"
                            aria-label={`Edit title: ${optimisticTitle}`}
                            onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
                        >
                            {optimisticTitle}
                        </h1>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">Click to edit</TooltipContent>
                </Tooltip>
            )}
            
            {isPending && (
                <span className="text-[10px] font-medium text-slate-400 absolute -bottom-4 left-0 animate-pulse">
                    Saving...
                </span>
            )}
        </div>
    )
}