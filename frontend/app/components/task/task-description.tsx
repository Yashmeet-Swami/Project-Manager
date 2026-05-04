import { useUpdateTaskDescriptionMutation } from "@/hooks/use-task";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";

export const TaskDescription = ({
    description,
    taskId,
}: {
    description: string;
    taskId: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [optimisticDescription, setOptimisticDescription] = useState(description);
    const [newDescription, setNewDescription] = useState(description);
    const { mutate, isPending } = useUpdateTaskDescriptionMutation();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setOptimisticDescription(description);
        setNewDescription(description);
    }, [description]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            // Move cursor to end
            textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
        }
    }, [isEditing]);

    const updateDescription = () => {
        if (newDescription === optimisticDescription) {
            setIsEditing(false);
            return;
        }

        const previousDesc = optimisticDescription;
        setOptimisticDescription(newDescription);
        setIsEditing(false);

        mutate(
            { taskId, description: newDescription },
            {
                onError: (error: any) => {
                    setOptimisticDescription(previousDesc);
                    setNewDescription(previousDesc);
                    const errorMessage = error.response?.data?.message || "Failed to update description";
                    toast.error(errorMessage);
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Escape") {
            setIsEditing(false);
            setNewDescription(optimisticDescription);
        }
    };

    return (
        <div className="group relative w-full transition-all mt-2">
            {isEditing ? (
                <div className="relative w-full">
                    <Textarea
                        ref={textareaRef}
                        className="w-full min-h-[120px] resize-y p-3 border-blue-300 ring-2 ring-blue-100 shadow-sm transition-all bg-white text-base leading-relaxed"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        onBlur={updateDescription}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                        placeholder="Add a more detailed description..."
                    />
                </div>
            ) : (
                <div 
                    className="w-full min-h-[80px] p-3 -ml-3 rounded-lg hover:bg-slate-50 transition-colors cursor-text border border-transparent hover:border-slate-200"
                    onClick={() => setIsEditing(true)}
                    tabIndex={0}
                    role="textbox"
                    aria-label="Edit description"
                    onKeyDown={(e) => e.key === "Enter" && setIsEditing(true)}
                >
                    {optimisticDescription ? (
                        <p className="text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {optimisticDescription}
                        </p>
                    ) : (
                        <p className="text-base text-slate-400 italic">
                            Add a more detailed description...
                        </p>
                    )}
                </div>
            )}

            {isPending && (
                <span className="text-[10px] font-medium text-slate-400 absolute -bottom-5 left-0 animate-pulse">
                    Saving...
                </span>
            )}
        </div>
    );
};