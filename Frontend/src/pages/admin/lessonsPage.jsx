import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, CheckCircle2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { courseApi } from "../../api/courseApi.js";
import { Card, PageHeader } from "../../components/common/card.jsx";
import Button from "../../components/common/button.jsx";
import ConfirmDeleteModal from "../../components/common/comfirmDeleteModal.jsx";
import DataTable from "../../components/table/dataTable.jsx";

export default function LessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: course } = useQuery({
    queryKey: ["adminCourse", id],
    queryFn: async () => (await courseApi.getCourseById(id)).data.data.course,
    enabled: !!id,
  });

  const { data: lessons, isLoading } = useQuery({
  queryKey: ["adminLessons", id],
  queryFn: async () => {
    const response = await courseApi.getLessonsByCourse(id);
    console.log(response.data);

    return response.data.data.lessons;
  },
  enabled: !!id,
});

  const deleteMutation = useMutation({
    mutationFn: (id) => courseApi.deleteLesson(id),
    onSuccess: () => {
      toast.success("Lesson deleted");
      queryClient.invalidateQueries({ queryKey: ["adminLessons", id] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete lesson"),
  });

  const columns = useMemo(
    () => [
      {
        header: "Order",
        accessorKey: "order",
        cell: ({ getValue, row }) => (
          <span className="w-7 h-7 rounded-full bg-[#f3effe] border border-[#e8e4f8] flex items-center justify-center text-xs font-bold text-[#7c3aed]">
            {row.original.chapter}.{getValue() ?? 0}
          </span>
        ),
      },
      {
        header: "Lesson",
        accessorKey: "title",
        cell: ({ getValue, row }) => (
          <div>
            <p className="font-semibold text-[#1a1535]">{getValue()}</p>
            {row.original.sourceUrl && <p className="text-[11px] text-gray-400">Imported from OpenStax</p>}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              getValue() === "published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {getValue() === "published" ? "Published" : "Draft"}
          </span>
        ),
      },
      {
        header: "Completions",
        accessorKey: "completionCount",
        cell: ({ getValue }) => (
          <span className="flex items-center gap-1.5 font-medium text-[#1a1535]">
            <CheckCircle2 size={13} className="text-emerald-400" />
            {getValue() || 0}
          </span>
        ),
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/admin/lessons/${row.original._id}/preview`)}
              title="Preview"
              className="w-8 h-8 rounded-lg hover:bg-[#f3effe] text-gray-400 hover:text-[#8b5cf6] flex items-center justify-center transition-colors"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => navigate(`/admin/lessons/${row.original._id}/edit`)}
              title="Edit"
              className="w-8 h-8 rounded-lg hover:bg-pink-50 text-gray-400 hover:text-[#ec4899] flex items-center justify-center transition-colors"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setDeleteTarget(row.original)}
              title="Delete"
              className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="p-6 max-w-7xl">
      <Link to="/admin/courses" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-500 hover:underline mb-3">
        <ArrowLeft size={12} /> Back to courses
      </Link>
      <PageHeader
        title={`${course?.title || "Course"} — Lessons`}
        subtitle={`${lessons?.length || 0} lessons`}
        action={
          <Button variant="pink" onClick={() => navigate(`/admin/lessons/new?courseId=${id}`)}>
            <Plus size={16} /> New Lesson
          </Button>
        }
      />

      <Card>
        <DataTable data={lessons} columns={columns} isLoading={isLoading} emptyMessage="No lessons in this course yet." />
      </Card>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        itemName={deleteTarget?.title}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}