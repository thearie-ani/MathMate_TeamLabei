import { useNavigate } from "react-router-dom";
import { useFieldArray } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Plus, X, Loader2, ArrowLeft, Save } from "lucide-react";

import { useEntityForm } from "../../hooks/useEntityForm.js";
import { quizApi } from "../../api/quizApi.js";
import { courseApi } from "../../api/courseApi.js";

import { quizSchema, emptyQuestion } from "../../components/forms/quizSchema.js";
import { GradientBtn, GhostBtn } from "../../components/common/button.jsx";
import { Card, Field, inputCls, selectCls } from "../../components/common/card.jsx";

export default function QuizFormPage() {
  const navigate = useNavigate();

  const {
    form,
    isEditMode,
    isLoadingEntity,
    loadError,
    isSubmitting,
    onSubmit,
  } = useEntityForm({
    schema: quizSchema,
    defaultValues: {
      title: "",
      description: "",
      course: "",
      topic: "",
      passingScore: 60,
      isPublished: false,
      questions: [emptyQuestion()],
    },

    fetchOne: async (id) =>
      (await quizApi.getQuizById(id)).data.data,

    createEntity: (data) =>
      quizApi.createQuiz(data),

    updateEntity: (id, data) =>
      quizApi.updateQuiz(id, data),

    mapRecordToForm: (quiz) => ({
      title: quiz.title || "",
      description: quiz.description || "",
      course: quiz.course?._id || quiz.course || "",
      topic: quiz.topic?._id || quiz.topic || "",
      passingScore: quiz.passingScore ?? 60,
      isPublished: quiz.isPublished ?? false,
      questions: quiz.questions?.length
        ? quiz.questions.map((q) => ({
            text: q.text || "",
            options: q.options?.length ? q.options : ["", "", "", ""],
            correctIndex: q.correctIndex ?? 0,
            explaination: q.explaination || "",
            points: q.points ?? 1,
          }))
        : [emptyQuestion()],
    }),

    transformSubmit: (data) => ({
      ...data,
      questions: data.questions.map((q) => ({
        ...q,
        options: q.options.filter((o) => o.trim() !== ""),
      })),
    }),

    listRoute: "/admin/quizzes",
    listQueryKey: ["adminQuizzes"],
    entityLabel: "Quiz",
  });

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () =>
      (await courseApi.getAllCourses()).data.data.courses,
  });

  const selectedCourse = watch("course");

  const { data: topics } = useQuery({
    queryKey: ["topics", selectedCourse],
    queryFn: async () =>
      (await courseApi.getTopicsByCourse(selectedCourse)).data.data.topics,
    enabled: !!selectedCourse,
  });

  if (isLoadingEntity) {
    return (
      <div className="p-6 flex justify-center">
        <Loader2 className="animate-spin text-violet-500" size={32} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-3">{loadError}</p>
        <GhostBtn onClick={() => navigate("/admin/quizzes")}>
          Back
        </GhostBtn>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/quizzes")}
          className="w-9 h-9 rounded-xl border flex items-center justify-center text-gray-500"
        >
          <ArrowLeft size={16} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">
            {isEditMode ? "Edit Quiz" : "New Quiz"}
          </h1>
          <p className="text-xs text-gray-500">
            {fields.length} question{fields.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">

        <Card className="p-6">
          <h3 className="font-bold mb-4">Quiz Details</h3>

          <div className="space-y-4">
            <Field label="Title" error={errors.title?.message}>
              <input {...register("title")} className={inputCls} />
            </Field>

            <Field label="Description">
              <input {...register("description")} className={inputCls} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Course" error={errors.course?.message}>
                <select {...register("course")} className={selectCls}>
                  <option value="">Select course</option>
                  {courses?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Topic">
                <select
                  {...register("topic")}
                  className={selectCls}
                  disabled={!selectedCourse}
                >
                  <option value="">No topic</option>
                  {topics?.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Passing Score">
              <input
                type="number"
                {...register("passingScore", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("isPublished")}
              />
              Published
            </label>
          </div>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id} className="p-5">
            <div className="flex justify-between mb-4">
              <b>Question {index + 1}</b>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <Field
              label="Question"
              error={errors.questions?.[index]?.text?.message}
            >
              <input
                {...register(`questions.${index}.text`)}
                className={inputCls}
              />
            </Field>

            <div className="mt-3 space-y-2">
              {[0,1,2,3].map((i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="radio"
                    value={i}
                    {...register(
                      `questions.${index}.correctIndex`,
                      { valueAsNumber: true }
                    )}
                  />

                  <input
                    {...register(`questions.${index}.options.${i}`)}
                    className={inputCls}
                    placeholder={`Option ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <Field label="Explanation">
              <input
                {...register(`questions.${index}.explaination`)}
                className={inputCls}
              />
            </Field>

            <Field label="Points">
              <input
                type="number"
                {...register(`questions.${index}.points`, {
                  valueAsNumber: true,
                })}
                className={inputCls}
              />
            </Field>
          </Card>
        ))}

        <button
          type="button"
          onClick={() => append(emptyQuestion())}
          className="w-full py-3 border-2 border-dashed rounded-xl text-violet-500 flex justify-center gap-2"
        >
          <Plus size={16} />
          Add Question
        </button>

        <div className="flex justify-end gap-3">
          <GhostBtn
            type="button"
            onClick={() => navigate("/admin/quizzes")}
          >
            Cancel
          </GhostBtn>

          <GradientBtn
            type="submit"
            disabled={isSubmitting}
          >
            <Save size={15} />
            {isEditMode ? "Save Changes" : "Create Quiz"}
          </GradientBtn>
        </div>

      </form>
    </div>
  );
}