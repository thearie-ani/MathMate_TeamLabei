import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { ArrowLeft, Save } from "lucide-react";

import { useEntityForm } from "../../hooks/useEntityForm.js";
import { courseApi } from "../../api/courseApi.js";

import {
  lessonSchema,
  lessonDefaultValues,
} from "../../components/forms/lessonSchema.js";

import {
  Card,
  Field,
  inputCls,
  selectCls,
} from "../../components/common/card.jsx";

import Button from "../../components/common/button.jsx";
import TiptapEditor from "../../components/editor/tiptapEditor.jsx";

export default function LessonFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const presetCourseId = searchParams.get("courseId") || "";
  const prefill = location.state?.prefill;

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () =>
      (await courseApi.getAllCourses()).data.data.courses,
  });

  const {
    id,
    form,
    isEditMode,
    isLoadingEntity,
    loadError,
    isSubmitting,
    onSubmit,
  } = useEntityForm({
    schema: lessonSchema,

    defaultValues: () => ({
      ...lessonDefaultValues(presetCourseId),
      ...(prefill || {}),
    }),

    fetchOne: async (id) =>
      (await courseApi.getLessonById(id)).data.data.lesson,

    createEntity: (payload) =>
      courseApi.createLesson(payload.course, payload),

    updateEntity: (id, payload) =>
      courseApi.updateLesson(id, payload),

    mapRecordToForm: (lesson) => ({
      course: lesson.course?._id || lesson.course || "",   // ✅ matches register("course")
      title: lesson.title || "",
      slug: lesson.slug || "",
      content: lesson.content || "",
      chapter: lesson.chapter ?? 0,
      order: lesson.order ?? 0,
      status: lesson.status || "draft",
      sourceUrl: lesson.sourceUrl || "",
    }),

    listRoute: `/admin/courses/${presetCourseId}/lessons`,
    listQueryKey: ["adminLessons"],
    entityLabel: "Lesson",
  });

  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const currentCourse = watch("course");
  const backRoute =
    `/admin/courses/${currentCourse || presetCourseId}/lessons`;

  if (isLoadingEntity) {
    return <div className="p-6 max-w-4xl">Loading...</div>;
  }

  if (loadError) {
    return (
      <div className="p-6 max-w-4xl">
        <p className="text-sm text-red-500 mb-3">{loadError}</p>
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/courses")}
        >
          Back to courses
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(backRoute)}
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center text-gray-500 hover:bg-[#f8f7ff]"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">
            {isEditMode ? "Edit Lesson" : "New Lesson"}
          </h1>
          <p className="text-xs text-gray-500">
            {prefill
              ? "Imported from OpenStax"
              : isEditMode
              ? "Update lesson content"
              : "Create a new lesson"}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-[#1a1535] mb-4">
            Lesson Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <Field
                label="Course"
                required
                error={errors.course?.message}
              >
                <select
                  {...register("course")}
                  className={selectCls}
                >
                  <option value="">Select a course</option>

                  {courses?.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field
                label="Title"
                required
                error={errors.title?.message}
              >
                <input
                  {...register("title")}
                  className={inputCls}
                  placeholder="Lesson title"
                />
              </Field>
            </div>

            <Field label="Slug" error={errors.slug?.message}>
              <input
                {...register("slug")}
                className={inputCls}
                placeholder="lesson-slug"
              />
            </Field>

            <Field label="Chapter" error={errors.chapter?.message}>
              <input
                {...register("chapter")}
                type="number"
                className={inputCls}
              />
            </Field>

            <Field label="Order" error={errors.order?.message}>
              <input
                {...register("order")}
                type="number"
                className={inputCls}
              />
            </Field>

          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-[#1a1535] mb-4">
            Content
          </h3>
          <Controller name="content" control={control} render={({ field }) => (

          <TiptapEditor
            content={field.value}
            onChange={field.onChange}
           />
          )}
          />

          {errors.content && (
            <p className="text-sm text-red-500 mt-2">
              {errors.content.message}
            </p>
          )}
        </Card>

        <div className="flex items-center justify-between p-4 bg-[#f8f7ff] rounded-xl border border-[#e8e4f8]">
          <div>
            <p className="text-sm font-semibold text-[#1a1535]">
              Publish Lesson
            </p>
            <p className="text-xs text-gray-500">
              Make visible to students
            </p>
          </div>

          <input
            type="checkbox"
            checked={watch("status") === "published"}
            onChange={(e) =>
              setValue(
                "status",
                e.target.checked ? "published" : "draft"
              )
            }
            className="w-5 h-5"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(backRoute)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="pink"
            isLoading={isSubmitting}
          >
            <Save size={15} />
            {isEditMode ? "Save Changes" : "Publish"}
          </Button>
        </div>

      </form>
    </div>
  );
}