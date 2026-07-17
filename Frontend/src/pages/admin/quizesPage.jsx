
import { useState,useMemo } from "react";
import { useNavigate} from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Users, Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";

import toast from "react-hot-toast";
import { quizApi } from "../../api/quizApi.js";


import {ScoreBadge, StatusPill} from "../../components/common/badge.jsx";
import {GradientBtn} from "../../components/common/button.jsx";
import {Card, PageHeader, SearchBar} from "../../components/common/card.jsx";
import DeleteModal from "../../components/common/comfirmDeleteModal.jsx";
import DataTable from "../../components/table/dataTable.jsx";



export default function QuizzesPage () {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminQuizzes"],
    queryFn: async () => {
      const res = await quizApi.getAllQuizzes();
      console.log("Quiz: ", res.data);
      return res.data.data.quizzes;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => quizApi.deleteQuiz(id),
    onSuccess: () => {
      toast.success("Quiz deleted");
      queryClient.invalidateQueries(["adminQuizzes"]);
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete quiz"),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }) =>
      quizApi.updateQuiz(id, {isPublished: !isPublished}),
    onSuccess: () => {
      toast.success("Quiz updated");
      queryClient.invalidateQueries(["adminQuizzes"]);
    },
  });

  const columns = useMemo(() => [
    {
      header: "Quiz",
      accessorKey: "title",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-[#1a1535]">{row.original.title}</p>
          {row.original.description && (
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
              {row.original.description}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Course",
      id: "course",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {row.original.course?.title || "—"}
        </span>
      ),
    },
    {
      header: "Questions",
      id: "questions",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.questions?.length || 0}
        </span>
      ),
    },
    {
      header: "Attempts",
      accessorKey: "attemptCount",
      cell: ({ getValue }) => <span className="font-medium">{getValue() || 0}</span>,
    },
    {
      header: "Avg Score",
      accessorKey: "averageScore",
      cell: ({ getValue }) =>
        getValue() ? <ScoreBadge score={Math.round(getValue())} /> : <span className="text-gray-400">—</span>,
    },
    {
      header: "Status",
      accessorKey: "isPublished",
      cell: ({ row }) => (
        <button
          onClick={() => togglePublish.mutate({ id: row.original._id, isPublished: row.original.isPublished })}
          className="flex items-center gap-1.5"
        >
          {row.original.isPublished
            ? <ToggleRight size={22} className="text-violet-500" />
            : <ToggleLeft size={22} className="text-gray-300" />
          }
          <StatusPill published={row.original.isPublished} />
        </button>
      ),
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/admin/quizzes/${row.original._id}/submissions`)}
            title="Submissions"
            className="w-8 h-8 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-500 
            flex items-center justify-center transition-colors"
          >
            <Users size={14} />
          </button>
          <button
            onClick={() => navigate(`/admin/quizzes/${row.original._id}/preview`)}
            className="w-8 h-8 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-500 
            flex items-center justify-center transition-colors"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => navigate(`/admin/quizzes/${row.original._id}/edit`)}
            className="w-8 h-8 rounded-lg hover:bg-pink-50 text-gray-400 hover:text-pink-500 
            flex items-center justify-center transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 
            flex items-center justify-center transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [navigate, togglePublish]);

  const filtered = useMemo(() =>
    (data || []).filter((q) =>
      q.title?.toLowerCase().includes(search.toLowerCase())
    ), [data, search]);

  return (
    <div className="p-6 max-w-7xl">
      <PageHeader
        title="Quizzes"
        subtitle={`${data?.length || 0} quizzes total`}
        action={
          <GradientBtn onClick={() => navigate("/admin/quizzes/new")}>
            <Plus size={16} /> New Quiz
          </GradientBtn>
        }
      />

      <Card>
        <div className="p-4 border-b border-[#e8e4f8] flex items-center justify-between gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Search quizzes..." />
          <p className="text-xs text-gray-400">{filtered.length} results</p>
        </div>
        <DataTable
          data={filtered}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No quizzes yet. Create your first quiz."
        />
      </Card>

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        itemName={deleteTarget?.title}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
