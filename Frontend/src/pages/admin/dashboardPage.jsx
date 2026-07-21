import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, Award, BarChart2 } from "lucide-react";

import { dashboardApi } from "../../api/dashboardApi";
import { Card, PageHeader, StatCard } from "../../components/common/Card";
import { ScoreBadge } from "../../components/common/Badge";
import DataTable from "../../components/table/DataTable";
import { formatDate } from "../../utils/formatDate";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: () => dashboardApi.getAdminDashboard(),
    staleTime: 1000 * 60 * 2,
  });

  const stats = data?.stats ?? {};
  const topQuizzes = data?.topPerformingTopics ?? [];
  const recentUsers = data?.recentUsers ?? [];

  const statCards = [
    {
      label: "Total Users",
      value: isLoading ? "—" : (stats.totalUsers ?? 0).toLocaleString(),
      sub: `${stats.activeTodayPercentage ?? 0}% active today`,
      subColor: "text-emerald-600",
      icon: Users,
      accent: "pink",
    },
    {
      label: "Active Today",
      value: isLoading ? "—" : (stats.activeToday ?? 0).toLocaleString(),
      sub: `${stats.activeTodayPercentage ?? 0}% of users`,
      subColor: "text-violet-600",
      icon: TrendingUp,
      accent: "violet",
    },
    {
      label: "Quiz Attempts",
      value: isLoading ? "—" : (stats.totalAttempts ?? 0).toLocaleString(),
      sub: `${stats.weeklyAttempts ?? 0} this week`,
      subColor: "text-pink-600",
      icon: Award,
      accent: "pink",
    },
    {
      label: "Average Score",
      value: isLoading ? "—" : `${stats.avgScore ?? 0}%`,
      sub: "Platform average",
      subColor: "text-emerald-600",
      icon: BarChart2,
      accent: "violet",
    },
  ];

  const recentColumns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "username",
        cell: ({ getValue }) => (
          <span className="font-medium text-[#1a1535]">{getValue()}</span>
        ),
      },
      { header: "Quizzes", accessorKey: "quizzesTaken" },
      {
        header: "Avg Score",
        accessorKey: "avgScore",
        cell: ({ getValue }) => <ScoreBadge score={getValue()} />,
      },
      {
        header: "Joined",
        accessorKey: "joinedAt",
        cell: ({ getValue }) => (
          <span className="text-gray-500">{formatDate(getValue())}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-7xl p-6 space-y-6">
      <PageHeader title="Overview" subtitle="Platform analytics" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-5 text-sm font-bold text-[#1a1535]">Top Performing Quizzes</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 animate-pulse rounded-lg bg-gray-100" />
              ))}
            </div>
          ) : topQuizzes.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No quiz data yet</p>
          ) : (
            <div className="space-y-4">
              {topQuizzes.map((quiz) => (
                <div key={quiz._id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1a1535]">{quiz.quizTitle}</span>
                    <span className="text-sm font-bold text-violet-600">{quiz.averageScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f0eeff]">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${quiz.averageScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-5 text-sm font-bold text-[#1a1535]">Platform Overview</h2>
          <div className="space-y-3">
            {[
              { label: "Courses Published", value: stats.publishedCourses ?? 0 },
              { label: "Total Lessons", value: stats.totalLessons ?? 0 },
              { label: "Total Quizzes", value: stats.totalQuizzes ?? 0 },
              { label: "Questions in Database", value: stats.totalQuestions ?? 0 },
              { label: "AI Tutor Sessions", value: (stats.aiTutorSessions ?? 0).toLocaleString() },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-[#f0eeff] py-2 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-bold text-[#1a1535]">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-[#e8e4f8] p-5">
          <h2 className="text-sm font-bold text-[#1a1535]">Recent Registrations</h2>
        </div>
        <DataTable
          data={recentUsers}
          columns={recentColumns}
          isLoading={isLoading}
          emptyMessage="No recent registrations"
        />
      </Card>
    </div>
  );
}