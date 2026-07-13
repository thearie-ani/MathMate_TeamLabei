import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, Filter, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { courseApi } from '../../api/courseApi';
import { Card, PageHeader, selectCls } from '../../components/common/Card';
import Button from '../../components/common/Button';
import ConfirmDeleteModal from '../../components/common/comfirmDeleteModal';
import DataTable from '../../components/table/DataTable';

export default function TopicListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await courseApi.getAllCourses()).data.data.courses,
  });

  const { data: topics, isLoading } = useQuery({
    queryKey: ['adminTopics', selectedCourse],
    queryFn: async () => (await courseApi.getTopicsByCourse(selectedCourse)).data.data.topics,
    enabled: !!selectedCourse,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => courseApi.deleteTopic(id),
    onSuccess: () => {
      toast.success('Topic deleted');
      queryClient.invalidateQueries({ queryKey: ['adminTopics'] });
      setDeleteTarget(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete topic'),
  });

  const columns = useMemo(
    () => [
      {
        header: 'Order',
        accessorKey: 'order',
        cell: ({ getValue }) => (
          <span className="w-7 h-7 rounded-full bg-[#f3effe] border border-[#e8e4f8] flex items-center justify-center text-xs font-bold text-[#7c3aed]">
            {getValue() + 1}
          </span>
        ),
      },
      { header: 'Topic', accessorKey: 'title', cell: ({ getValue }) => <span className="font-semibold text-[#1a1535]">{getValue()}</span> },
      { header: 'Est. Time', accessorKey: 'estimatedMinutes', cell: ({ getValue }) => <span className="text-gray-500">{getValue() || 15} min</span> },
      { header: 'Completions', accessorKey: 'completionCount', cell: ({ getValue }) => <span className="font-medium">{getValue() || 0}</span> },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(`/admin/topics/${row.original._id}/preview`)}
              title="Preview"
              className="w-8 h-8 rounded-lg hover:bg-[#f3effe] text-gray-400 hover:text-[#8b5cf6] flex items-center justify-center transition-colors"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => navigate(`/admin/topics/${row.original._id}/edit`)}
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
      <PageHeader
        title="Topics"
        subtitle="Manage course topics and lessons"
        action={
          <Button variant="pink" onClick={() => navigate(`/admin/topics/new${selectedCourse ? `?courseId=${selectedCourse}` : ''}`)}>
            <Plus size={16} /> New Topic
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-[#e8e4f8] flex items-center gap-3">
          <Filter size={15} className="text-gray-400" />
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className={`${selectCls} w-56`}>
            <option value="">Select a course</option>
            {courses?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {!selectedCourse ? (
          <div className="py-16 text-center text-gray-400">
            <BookOpen size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Select a course to view its topics</p>
          </div>
        ) : (
          <DataTable data={topics} columns={columns} isLoading={isLoading} emptyMessage="No topics in this course yet" />
        )}
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
