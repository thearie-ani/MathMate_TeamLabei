import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { courseApi } from '../../api/courseApi';
import { Card, PageHeader, SearchBar } from '../../components/common/card';
import { StatusPill } from '../../components/common/badge';
import Button from '../../components/common/button';
import ConfirmDeleteModal from '../../components/common/comfirmDeleteModal';
import DataTable from '../../components/table/dataTable';

export default function CourseListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: async () => {
      const res = await courseApi.getAllCourses();
      return res.data.data.courses;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => courseApi.deleteCourse(id),
    onSuccess: () => {
      toast.success('Course deleted');
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete course'),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, isPublished }) => courseApi.updateCourse(id, { isPublished: !isPublished }),
    onSuccess: () => {
      toast.success('Course updated');
      queryClient.invalidateQueries({ queryKey: ['adminCourses'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to update course'),
  });

  const columns = useMemo(
    () => [
      {
        header: 'Course',
        accessorKey: 'title',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f3effe] flex items-center justify-center text-lg border border-[#e8e4f8]">
              {row.original.icon || '📚'}
            </div>
            <div>
              <p className="font-semibold text-[#1a1535]">{row.original.title}</p>
              <p className="text-xs text-gray-400">{row.original.grade}</p>
            </div>
          </div>
        ),
      },
      { header: 'Difficulty', accessorKey: 'difficulty' },
      { header: 'Topics', accessorKey: 'topicCount', cell: ({ getValue }) => <span className="font-medium">{getValue() || 0}</span> },
      { header: 'Enrolled', accessorKey: 'enrollmentCount', cell: ({ getValue }) => <span className="font-medium">{getValue() || 0}</span> },
      {
        header: 'Status',
        accessorKey: 'isPublished',
        cell: ({ row }) => (
          <button
            onClick={() => togglePublish.mutate({ id: row.original._id, isPublished: row.original.isPublished })}
            className="flex items-center gap-1.5"
            aria-label="Toggle published status"
          >
            {row.original.isPublished ? (
              <ToggleRight size={22} className="text-[#8b5cf6]" />
            ) : (
              <ToggleLeft size={22} className="text-gray-300" />
            )}
            <StatusPill published={row.original.isPublished} />
          </button>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
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
          <Button variant="pink" onClick={() => navigate('/admin/courses/new')}>
            <Plus size={16} /> New Course
          </Button>
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
