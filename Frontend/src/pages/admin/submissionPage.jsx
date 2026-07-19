
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery} from "@tanstack/react-query";

import { FileText, ArrowLeft, TrendingUp, Award,} from "lucide-react";

import {quizApi} from "../../api/quizApi.js";

import {ScoreBadge} from "../../components/common/badge.jsx";
import {Card, StatCard} from "../../components/common/card.jsx";
import DataTable from "../../components/table/dataTable.jsx";
import {formatDate} from "../../utils/formatDate.js";

export default function SubmissionsPage () {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quiz } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await quizApi.getQuizById(id);
      return res.data.data;
    },
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["submissions", id],
    queryFn: async () => {
      const res = await quizApi.getAllSubmissionsByQuiz(id);
      return res.data.data.submissions;
    },
  });

  const avgScore = useMemo(() => {
    if (!submissions?.length) return 0;
    return Math.round(submissions.reduce((a, s) => a + s.percentage, 0) / submissions.length);
  }, [submissions]);

  const columns = useMemo(() => [
    {
      header: "Student",
      id: "student",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-violet-100
          border border-[#e8e4f8] flex items-center justify-center text-xs font-bold text-violet-600">
            {row.original.student?.username?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium text-[#1a1535] text-sm">{row.original.student?.username}</p>
            <p className="text-xs text-gray-400">{row.original.student?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Score",
      accessorKey: "percentage",
      cell: ({ getValue }) => <ScoreBadge score={getValue()} />,
    },
    {
      header: "Correct",
      id: "correct",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.score} / {row.original.totalQuestions}
        </span>
      ),
    },
    {
      header: "Attempts",
      accessorKey: "attempts",
      cell: ({ getValue }) => <span>{getValue() || 1}</span>,
    },
    {
      header: "Status",
      accessorKey: "percentage",
      id: "status",
      cell: ({ getValue }) => (
        getValue() >= (quiz?.passingScore || 60)
          ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Passed</span>
          : <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">Failed</span>
      ),
    },
    {
      header: "Submitted",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => <span className="text-gray-500">{formatDate(getValue())}</span>,
    },
  ], [quiz]);

  return (
    <div className="p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/quizzes")}
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center text-gray-500 hover:bg-[#f8f7ff]">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">
            Submissions — {quiz?.title || "Quiz"}
          </h1>
          <p className="text-xs text-gray-500">{submissions?.length || 0} total submissions</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Submissions"
          value={submissions?.length || 0}
          icon={FileText}
          gradient="bg-gradient-to-br from-violet-400 to-violet-600"
        />
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={Award}
          gradient="bg-gradient-to-br from-pink-400 to-pink-600"
        />
        <StatCard
          label="Pass Rate"
          value={submissions?.length
            ? `${Math.round(submissions.filter(s => s.score >= (quiz?.passingScore || 60)).length / submissions.length * 100)}%`
            : "—"
          }
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-pink-500 to-violet-500"
        />
      </div>

      <Card>
        <div className="p-4 border-b border-[#e8e4f8]">
          <h2 className="text-sm font-bold text-[#1a1535]">All Submissions</h2>
        </div>
        <DataTable
          data={submissions}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No submissions yet for this quiz"
        />
      </Card>
    </div>
  );
};