import { RecentProjects } from "@/components/dashboard/recent-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useNavigate, useSearchParams } from "react-router"; // ✅ Fixed import

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  // 🟥 When no workspace selected
  if (!workspaceId) {
    return (
<div className="min-h-[80vh] pt-12 pb-12 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-start justify-center">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-full opacity-30"></div>

            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Your Dashboard</h2>
            <p className="text-gray-600 mb-2">No workspace selected</p>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Choose a workspace to view your projects, tasks, and analytics. Get started by selecting an existing workspace or creating a new one.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/workspaces')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Select Workspace
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/workspaces')}
                className="w-full border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all duration-200"
              >
                Create New Workspace
              </Button>
            </div>
          </div>

          {/* Mini tips or actions */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
              <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600">Track Progress</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-100">
              <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600">View Analytics</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🟡 Loading
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-gray-600">Loading workspace data...</p>
        </div>
      </div>
    );
  }

  // 🟢 Workspace data loaded
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
