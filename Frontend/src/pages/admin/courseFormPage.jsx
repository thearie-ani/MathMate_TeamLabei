import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useEntityForm } from '../../hooks/useEntityForm';
import { courseApi } from '../../api/courseApi';
import { courseSchema, courseDefaultValues } from '../../components/forms/courseSchema';
import { Card, Field, inputCls, selectCls } from '../../components/common/Card';
import Button from '../../components/common/button';

const GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'All'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function CourseFormPage() {
  const navigate = useNavigate();

  const { form, isEditMode, isLoadingEntity, loadError, isSubmitting, onSubmit } = useEntityForm({
    schema: courseSchema,
    defaultValues: courseDefaultValues,
    fetchOne: async (id) => (await courseApi.getCourseById(id)).data.data.course,
    createEntity: (payload) => courseApi.createCourse(payload),
    updateEntity: (id, payload) => courseApi.updateCourse(id, payload),
    listRoute: '/admin/courses',
    entityLabel: 'Course',
  });

  const { register, formState: { errors } } = form;

  if (isLoadingEntity) {
    return (
      <div className="p-6 max-w-2xl space-y-4" aria-busy="true">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6 max-w-2xl">
        <p className="text-sm text-red-500 mb-3">{loadError}</p>
        <Button variant="ghost" onClick={() => navigate('/admin/courses')}>
          Back to courses
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/courses')}
          aria-label="Back to courses"
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center
          text-gray-500 hover:bg-[#f8f7ff] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">{isEditMode ? 'Edit Course' : 'New Course'}</h1>
          <p className="text-xs text-gray-500">{isEditMode ? 'Update course details' : 'Create a new course'}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="flex gap-3">
            <Field label="Icon">
              <input {...register('icon')} placeholder="∫" className={`${inputCls} text-center text-2xl`} style={{ width: 64 }} />
            </Field>
            <div className="flex-1">
              <Field label="Title" required error={errors.title?.message}>
                <input {...register('title')} placeholder="e.g. Calculus" className={inputCls} />
              </Field>
            </div>
          </div>

          <Field label="Description" required error={errors.description?.message}>
            <textarea
              {...register('description')}
              placeholder="What will students learn in this course?"
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Grade" required>
              <select {...register('grade')} className={selectCls}>
                {GRADES.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Difficulty" required>
              <select {...register('difficulty')} className={selectCls}>
                {DIFFICULTIES.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#f8f7ff] rounded-xl border border-[#e8e4f8]">
            <div>
              <p className="text-sm font-semibold text-[#1a1535]">Publish Course</p>
              <p className="text-xs text-gray-500">Make visible to enrolled students</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="sr-only peer" />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer
                peer-checked:bg-[#8b5cf6]
                after:content-[''] after:absolute after:top-0.5 after:left-0.5
                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                peer-checked:after:translate-x-5"
              />
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button variant="ghost" type="button" onClick={() => navigate('/admin/courses')}>
              Cancel
            </Button>
            <Button variant="pink" type="submit" isLoading={isSubmitting}>
              <Save size={15} />
              {isEditMode ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
