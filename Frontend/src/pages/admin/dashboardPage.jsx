import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  TrendingUp,
  Award,
  BarChart2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { dashboardApi } from "../../api/dashboardApi";
import {
  Card,
  PageHeader,
  StatCard,
} from "../../components/common/Card";
import { ScoreBadge } from "../../components/common/Badge";
import DataTable from "../../components/table/DataTable";
import { formatDate } from "../../utils/formatDate";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 1000 * 60 * 2,
  });

  const stats = data?.stats ?? {};
  const topTopics = data?.topPerformingTopics ?? [];
  const recentUsers = data?.recentUsers ?? [];
  const trend = data?.trend ?? [];

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
          <span className="font-medium text-[#1a1535]">
            {getValue()}
          </span>
        ),
      },
      {
        header: "Quizzes",
        accessorKey: "quizzesTaken",
      },
      {
        header: "Avg Score",
        accessorKey: "avgScore",
        cell: ({ getValue }) => (
          <ScoreBadge score={getValue()} />
        ),
      },
      {
        header: "Joined",
        accessorKey: "joinedAt",
        cell: ({ getValue }) => (
          <span className="text-gray-500">
            {formatDate(getValue())}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-7xl p-6 space-y-6">
      <PageHeader
        title="Overview"
        subtitle="Platform analytics"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <Card className="p-5">
        <h2 className="mb-4 text-sm font-bold text-[#1a1535]">
          Enrollment & Completion Trend
        </h2>

        {trend.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center text-sm text-gray-400">
            No trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend}>
              <CartesianGrid
                stroke="#f0eeff"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#9ca3af",
                }}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#9ca3af",
                }}
              />

              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e8e4f8",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />

              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />

              <Line
                type="monotone"
                dataKey="completions"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-5 text-sm font-bold text-[#1a1535]">
            Top Performing Topics
          </h2>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : topTopics.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">
              No quiz data yet
            </p>
          ) : (
            <div className="space-y-4">
              {topTopics.map((topic) => (
                <div key={topic._id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#1a1535]">
                      {topic.topicTitle}
                    </span>

                    <span className="text-sm font-bold text-violet-600">
                      {topic.avgScore}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#f0eeff]">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{
                        width: `${topic.avgScore}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-5 text-sm font-bold text-[#1a1535]">
            Platform Overview
          </h2>

          <div className="space-y-3">
            {[
              {
                label: "Courses Published",
                value: stats.publishedCourses ?? 0,
              },
              {
                label: "Total Topics",
                value: stats.totalTopics ?? 0,
              },
              {
                label: "Total Quizzes",
                value: stats.totalQuizzes ?? 0,
              },
              {
                label: "Questions in Database",
                value: stats.totalQuestions ?? 0,
              },
              {
                label: "AI Tutor Sessions",
                value: (stats.aiTutorSessions ?? 0).toLocaleString(),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-[#f0eeff] py-2 last:border-0"
              >
                <span className="text-sm text-gray-500">
                  {item.label}
                </span>

                <span className="text-sm font-bold text-[#1a1535]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="border-b border-[#e8e4f8] p-5">
          <h2 className="text-sm font-bold text-[#1a1535]">
            Recent Registrations
          </h2>
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