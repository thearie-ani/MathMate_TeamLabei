import { useNavigate, useSearchParams } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { useEntityForm } from '../../hooks/useEntityForm';
import { courseApi } from '../../api/courseApi';
import { topicSchema, topicDefaultValues } from '../../components/forms/topicSchema';
import { Card, Field, inputCls, selectCls } from '../../components/common/Card';
import Button from '../../components/common/Button';
import RichTextEditor from '../../components/editor/RichTextEditor';

export default function TopicFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetCourseId = searchParams.get('courseId') || '';

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => (await courseApi.getAllCourses()).data.data.courses,
  });

  const { id, form, isEditMode, isLoadingEntity, loadError, isSubmitting, onSubmit } = useEntityForm({
    schema: topicSchema,
    defaultValues: () => topicDefaultValues(presetCourseId),
    fetchOne: async (id) => (await courseApi.getTopicById(id)).data.data.topic,
    createEntity: (payload) => courseApi.createTopic(payload.course, payload),
    updateEntity: (id, payload) => courseApi.updateTopic(id, payload),
    mapRecordToForm: (topic) => ({
      course: topic.course?._id || topic.course || '',
      title: topic.title || '',
      content: topic.content || '',
      order: topic.order ?? 0,
      estimatedMinutes: topic.estimatedMinutes ?? 15,
    }),
    listRoute: '/admin/topics',
    entityLabel: 'Topic',
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  if (isLoadingEntity) {
    return (
      <div className="p-6 max-w-4xl space-y-4" aria-busy="true">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 max-w-4xl">
        <p className="text-sm text-red-500 mb-3">{loadError}</p>
        <Button variant="ghost" onClick={() => navigate('/admin/topics')}>
          Back to topics
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/topics')}
          aria-label="Back to topics"
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center
          text-gray-500 hover:bg-[#f8f7ff] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">{isEditMode ? 'Edit Topic' : 'New Topic'}</h1>
          <p className="text-xs text-gray-500">{isEditMode ? 'Update topic content' : 'Add a new lesson topic'}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Card className="p-6">
          <h3 className="text-sm font-bold text-[#1a1535] mb-4">Topic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Field label="Course" required error={errors.course?.message}>
                <select {...register('course')} className={selectCls}>
                  <option value="">Select a course</option>
                  {courses?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Title" required error={errors.title?.message}>
                <input {...register('title')} placeholder="e.g. Introduction to Limits" className={inputCls} />
              </Field>
            </div>

            <Field label="Order" error={errors.order?.message}>
              <input {...register('order')} type="number" min="0" placeholder="0" className={inputCls} />
            </Field>
            <Field label="Estimated Minutes" error={errors.estimatedMinutes?.message}>
              <input {...register('estimatedMinutes')} type="number" min="1" placeholder="15" className={inputCls} />
            </Field>
          </div>
        </Card>

        {/* The Quill + LaTeX "formula" bridge described in the architecture notes.
            Controller hands RichTextEditor a plain {value, onChange} pair, so it
            slots into React Hook Form exactly like any native input. */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#1a1535]">Content</h3>
            <span className="text-xs text-gray-400">Use the Σ formula button in the toolbar for math</span>
          </div>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                id="topic-content"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your lesson content here..."
                error={errors.content?.message}
              />
            )}
          />
        </Card>

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" type="button" onClick={() => navigate('/admin/topics')}>
            Cancel
          </Button>
          {isEditMode && (
            <Button variant="ghost" type="button" onClick={() => navigate(`/admin/topics/${id}/preview`)}>
              <Eye size={14} /> Preview
            </Button>
          )}
          <Button variant="pink" type="submit" isLoading={isSubmitting}>
            <Save size={15} />
            {isEditMode ? 'Save Changes' : 'Create Topic'}
          </Button>
        </div>
      </form>
    </div>
  );
}
