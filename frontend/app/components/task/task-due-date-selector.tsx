import { useUpdateTaskDueDateMutation } from "@/hooks/use-task";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const TaskDueDateSelector = ({
  dueDate,
  taskId,
}: {
  dueDate: string | Date | null;
  taskId: string;
}) => {
  const [date, setDate] = useState<Date | undefined>(
    dueDate ? new Date(dueDate) : undefined
  );
  
  useEffect(() => {
      setDate(dueDate ? new Date(dueDate) : undefined);
  }, [dueDate]);

  const { mutate, isPending } = useUpdateTaskDueDateMutation();

  const handleSelect = (newDate: Date | undefined) => {
    const prevDate = date;
    setDate(newDate);

    mutate(
      { taskId, dueDate: newDate || null },
      {
        onSuccess: () => {
          toast.success("Due date updated");
        },
        onError: (error: any) => {
          setDate(prevDate);
          toast.error(error.response?.data?.message || "Failed to update due date");
        },
      }
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-normal h-8 px-3 rounded-full shadow-sm transition-all text-xs",
            !date && "text-muted-foreground",
            date && date < new Date() && "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
            date && date >= new Date() && "text-slate-700 bg-slate-50 hover:bg-slate-100"
          )}
          disabled={isPending}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {date ? format(date, "MMM d, yyyy") : <span>No due date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
