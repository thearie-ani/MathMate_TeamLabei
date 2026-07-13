import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, Award, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardApi } from '../../api/dashboardApi';
import { Card, PageHeader, StatCard } from '../../components/common/Card';
import { ScoreBadge } from '../../components/common/Badge';
import DataTable from '../../components/table/DataTable';
import { formatDate } from '../../utils/formatDate';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
  queryKey: ["adminDashboard"],
  queryFn: async () => {
    const response = await dashboardApi.getAdminDashboard();
    console.log("ADMIN DASHBOARD RESPONSE:", response);
    console.log("ADMIN DASHBOARD DATA:", response.data);
    return response.data?.data ?? {};
  },
  staleTime: 2 * 60 * 1000,
});

  const stats = data?.stats || {};
  const topTopics = data?.topPerformingTopics || [];
  const recentUsers = data?.recentRegistrations || [];
  const trend = data?.trend || [];

  const statCards = [
    {
      label: 'Total Users',
      value: isLoading ? '—' : (stats.totalUsers || 0).toLocaleString(),
      sub: '↑ 12% this month',
      subColor: 'text-emerald-600',
      icon: Users,
      accent: 'pink',
    },
    {
      label: 'Active Today',
      value: isLoading ? '—' : (stats.activeToday || 0).toLocaleString(),
      sub: `${stats.activeTodayPercentage || 0}% of users`,
      subColor: 'text-[#7c3aed]',
      icon: TrendingUp,
      accent: 'violet',
    },
    {
      label: 'Quiz Attempts',
      value: isLoading ? '—' : (stats.totalAttempts || 0).toLocaleString(),
      sub: `↑ ${stats.weeklyAttempts || 0} this week`,
      subColor: 'text-[#db2777]',
      icon: Award,
      accent: 'pink',
    },
    {
      label: 'Avg. Score',
      value: isLoading ? '—' : `${stats.avgScore || 0}%`,
      sub: '↑ 3% from last week',
      subColor: 'text-emerald-600',
      icon: BarChart2,
      accent: 'violet',
    },
  ];

  const recentColumns = useMemo(
    () => [
      { header: 'Name', accessorKey: 'name', cell: ({ getValue }) => <span className="font-medium text-[#1a1535]">{getValue()}</span> },
      { header: 'Grade', accessorKey: 'grade' },
      { header: 'Quizzes', accessorKey: 'quizzesTaken' },
      { header: 'Avg Score', accessorKey: 'avgScore', cell: ({ getValue }) => <ScoreBadge score={getValue()} /> },
      { header: 'Joined', accessorKey: 'joinedAt', cell: ({ getValue }) => <span className="text-gray-500">{formatDate(getValue())}</span> },
    ],
    []
  );

  return (
    <div className="p-6 max-w-7xl space-y-6">
      <PageHeader title="Overview" subtitle="Platform analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-[#1a1535] mb-4">Enrollment &amp; Completion Trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eeff" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e8e4f8', borderRadius: 12, fontSize: 12 }} />
            <Line type="monotone" dataKey="enrollments" stroke="#ec4899" strokeWidth={2.5} dot={{ r: 3, fill: '#ec4899' }} name="Enrollments" />
            <Line type="monotone" dataKey="completions" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3, fill: '#8b5cf6' }} name="Completions" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h2 className="text-sm font-bold text-[#1a1535] mb-5">Top Performing Topics</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : topTopics.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No quiz data yet</p>
          ) : (
            <div className="space-y-4">
              {topTopics.map((t) => (
                <div key={t._id}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-[#1a1535] font-medium">{t.topicTitle}</span>
                    <span className="text-sm font-bold text-[#8b5cf6]">{t.avgScore}%</span>
                  </div>
                  <div className="h-2 bg-[#f0eeff] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8b5cf6] rounded-full transition-all duration-500" style={{ width: `${t.avgScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-bold text-[#1a1535] mb-5">Platform Overview</h2>
          <div className="space-y-3">
            {[
              { label: 'Courses published', value: stats.publishedCourses ?? '—' },
              { label: 'Total topics', value: stats.totalTopics ?? '—' },
              { label: 'Total quizzes', value: stats.totalQuizzes ?? '—' },
              { label: 'Questions in DB', value: stats.totalQuestions ?? '—' },
              { label: 'AI tutor sessions', value: (stats.aiTutorSessions || 0).toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#f0eeff] last:border-0">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-bold text-[#1a1535]">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-5 border-b border-[#e8e4f8]">
          <h2 className="text-sm font-bold text-[#1a1535]">Recent Registrations</h2>
        </div>
        <DataTable data={recentUsers} columns={recentColumns} isLoading={isLoading} emptyMessage="No recent registrations" />
      </Card>
    </div>
  );
}
