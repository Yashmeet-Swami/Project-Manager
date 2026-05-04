import { fetchData } from "@/lib/fetch-util";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import type { ActivityLog } from "@/types";
import { getActivityIcon } from "./task-icon";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => fetchData(`/tasks/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };

  if (isPending) return <div className="py-8 flex justify-center"><Loader /></div>;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-6 uppercase tracking-wider">Activity</h3>

      {data && data.length > 0 ? (
        <div className="space-y-0">
          {data.map((activity, index) => (
            <div key={activity._id} className="relative flex gap-4 pb-6 last:pb-0 group">
              {index !== data.length - 1 && (
                  <div className="absolute top-8 bottom-0 left-4 w-[2px] bg-slate-100 group-hover:bg-slate-200 transition-colors" />
              )}
              <div className="relative z-10 flex-none bg-white">
                  <Avatar className="size-8 border border-slate-200 shadow-sm transition-transform hover:scale-105">
                      <AvatarImage src={activity.user?.profilePicture} />
                      <AvatarFallback className="text-[10px]">{activity.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
              </div>
              
              <div className="flex-1 pt-1.5 min-w-0">
                <p className="text-sm text-slate-700 leading-snug text-pretty">
                  <span className="font-semibold text-slate-900 mr-1">{activity.user?.name}</span>
                  {activity.details?.description}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block font-medium uppercase tracking-wider">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex-none pt-1">
                  <div className="size-6 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
                      {getActivityIcon(activity.action)}
                  </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
          <div className="text-sm text-slate-500 italic py-6 text-center bg-slate-50 rounded-md border border-dashed border-slate-200">No activity yet</div>
      )}
    </div>
  );
};