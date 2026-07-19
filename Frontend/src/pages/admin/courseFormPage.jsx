import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useEntityForm } from "../../hooks/useEntityForm.js";
import { courseApi } from "../../api/courseApi.js";

import {
  courseSchema,
  courseDefaultValues,
} from "../../components/forms/courseSchema.js";

import {
  Card,
  Field,
  inputCls,
} from "../../components/common/card.jsx";

import Button from "../../components/common/button.jsx";

export default function CourseFormPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = location.state?.prefill;

  const {
    id,
    form,
    isEditMode,
    isLoadingEntity,
    loadError,
    isSubmitting,
    onSubmit,
  } = useEntityForm({

    schema: courseSchema,

    defaultValues: () => ({
      ...courseDefaultValues,
      ...(prefill || {}),
    }),

    fetchOne: async (id) =>
      (await courseApi.getCourseById(id))
        .data.data.course,

    createEntity: (payload) =>
      courseApi.createCourse(payload),

    updateEntity: (id, payload) =>
      courseApi.updateCourse(id, payload),

    mapRecordToForm: (course) => ({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      thumbnail: course.thumbnail || "",
      icon: course.icon || "",
      status: course.status || "draft",
      isPublished: course.status === "published",
      sourceUrl: course.sourceUrl || "",
    }),

    listRoute: "/admin/courses",
    listQueryKey: ["adminCourses"],
    entityLabel: "Course",
  });


  const {
    register,
    watch,
    setValue,
    formState:{ errors },
  } = form;


  if (isLoadingEntity) {
    return (
      <div className="p-6 max-w-2xl">
        Loading...
      </div>
    );
  }


  if (loadError) {
    return (
      <div className="p-6 max-w-2xl">
        <p className="text-sm text-red-500 mb-3">
          {loadError}
        </p>

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
    <div className="p-6 max-w-2xl">

      <div className="flex items-center gap-3 mb-6">

        <button
          onClick={() => navigate("/admin/courses")}
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center text-gray-500 hover:bg-[#f8f7ff]"
        >
          <ArrowLeft size={16}/>
        </button>

        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">
            {isEditMode ? "Edit Course" : "New Course"}
          </h1>

          <p className="text-xs text-gray-500">
            {prefill
              ? "Imported course"
              : isEditMode
              ? "Update course details"
              : "Create a new course"}
          </p>
        </div>

      </div>


      <Card className="p-6">

        <form
          onSubmit={onSubmit}
          className="space-y-5"
          noValidate
        >

          <div className="flex gap-3">

            <Field label="Icon">

              <input
                {...register("icon")}
                placeholder="∫"
                className={`${inputCls} text-center text-2xl`}
                style={{width:64}}
              />

            </Field>


            <div className="flex-1">

              <Field
                label="Title"
                required
                error={errors.title?.message}
              >

                <input
                  {...register("title")}
                  placeholder="e.g. Calculus Volume 1"
                  className={inputCls}
                />

              </Field>
            </div>
          </div>
          <Field
            label="Slug"
            error={errors.slug?.message}
          >

            <input
              {...register("slug")}
              placeholder="calculus-volume-1"
              className={`${inputCls} font-mono`}
            />

          </Field>


          <Field
            label="Description"
            required
            error={errors.description?.message}
          >

            <textarea
              {...register("description")}
              placeholder="What will students learn in this course?"
              rows={3}
              className={`${inputCls} resize-none`}
            />

          </Field>


          <Field label="Thumbnail URL">

            <input
              {...register("thumbnail")}
              placeholder="https://..."
              className={inputCls}
            />

          </Field>




          <div className="flex gap-3 justify-end">

            <Button
              variant="ghost"
              type="button"
              onClick={() => navigate("/admin/courses")}
            >
              Cancel
            </Button>


            <Button
              variant="pink"
              type="submit"
              isLoading={isSubmitting}
            >

              <Save size={15}/>

              {isEditMode
                ? "Save Changes"
                : "Create Course"}

            </Button>

          </div>


        </form>

      </Card>

    </div>
  );
}