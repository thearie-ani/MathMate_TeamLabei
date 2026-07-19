import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, Users, ToggleLeft, ToggleRight, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { courseApi } from "../../api/courseApi.js";
import { Card, PageHeader, SearchBar } from "../../components/common/card.jsx";
import { StatusPill } from "../../components/common/badge.jsx";
import Button from "../../components/common/button.jsx";
import ConfirmDeleteModal from "../../components/common/comfirmDeleteModal.jsx";
import DataTable from "../../components/table/dataTable.jsx";

export default function CoursesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: async () => (await courseApi.getAllCourses()).data.data.courses,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => courseApi.deleteCourse(id),
    onSuccess: () => {
      toast.success("Course deleted");
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete course"),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, status }) =>
      courseApi.updateCourse(id, {
        status: status === "published" ? "draft" : "published",
      }),
    onSuccess: () => {
      toast.success("Course updated");
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update course"),
  });

  const columns = useMemo(
    () => [
      {
        header: "Course",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-semibold text-[#1a1535]">{row.original.title}</p>
              <p className="text-xs text-gray-400">{row.original.grade}</p>
            </div>
          </div>
        ),
      },
      {
        header: "Lessons",
        accessorKey: "lessonCount",
        cell: ({ getValue }) => <span className="font-medium">{getValue() || 0}</span>,
      },
      {
        header: "Enrolled",
        accessorKey: "enrollmentCount",
        cell: ({ getValue }) => (
          <span className="flex items-center gap-1.5 font-medium text-[#1a1535]">
            <Users size={13} className="text-violet-400" />
            {getValue() || 0}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const published = row.original.status === "published";

          return (
            <button
              onClick={() =>
                togglePublish.mutate({
                  id: row.original._id,
                  status: row.original.status,
                })
              }
              className="flex items-center gap-1.5"
            >
              {published ? (
                <ToggleRight size={22} className="text-[#8b5cf6]" />
              ) : (
                <ToggleLeft size={22} className="text-gray-300" />
              )}

              <StatusPill published={published} />
            </button>
          );
        },
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/admin/courses/${row.original._id}/lessons`)}
              title="Lessons"
              className="w-8 h-8 rounded-lg hover:bg-[#f3effe] text-gray-400 hover:text-[#8b5cf6] flex items-center justify-center transition-colors"
            >
              <BookOpen size={15} />
            </button>
            <button
              onClick={() => navigate(`/admin/courses/${row.original._id}/preview`)}
              title="Preview"
              className="w-8 h-8 rounded-lg hover:bg-[#f3effe] text-gray-400 hover:text-[#8b5cf6] flex items-center justify-center transition-colors"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => navigate(`/admin/courses/${row.original._id}/edit`)}
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
    [navigate, togglePublish]
  );

  const filtered = useMemo(
    () => (data || []).filter((c) => c.title?.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );

  return (
    <div className="p-6 max-w-7xl">
      <PageHeader
        title="Courses"
        subtitle={`${data?.length || 0} courses total`}
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/admin/import")}>
              Import from OpenStax
            </Button>
            <Button variant="pink" onClick={() => navigate("/admin/courses/new")}>
              <Plus size={16} /> New Course
            </Button>
          </div>
        }
      />

      <Card>
        <div className="p-4 border-b border-[#e8e4f8] flex items-center justify-between gap-3 flex-wrap">
          <SearchBar value={search} onChange={setSearch} placeholder="Search courses..." />
          <p className="text-xs text-gray-400">{filtered.length} results</p>
        </div>
        <DataTable data={filtered} columns={columns} isLoading={isLoading} emptyMessage="No courses yet. Create your first course." />
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