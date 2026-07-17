
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Plus, X, Loader2, ArrowLeft, Save, } from "lucide-react";

import toast from "react-hot-toast";

import {quizApi} from "../../api/quizApi.js";
import {courseApi} from "../../api/courseApi.js";


import {GradientBtn, GhostBtn} from "../../components/common/button.jsx";
import {Card, Field, inputCls, selectCls} from "../../components/common/card.jsx";


const quizSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  course: z.string().min(1, "Course is required"),
  topic: z.string().optional(),
  passingScore: z.number().min(1).max(100),
  isPublished: z.boolean().optional(),
  questions: z.array(z.object({
    questionText: z.string().min(5, "Question is required"),
    options: z.array(z.string().min(1, "Option is required")).min(2),
    correctOptionIndex: z.number().min(0),
    explanation: z.string().optional(),
  })).min(1, "At least one question required"),
});

export default function QuizFormPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      passingScore: 60,
      isPublished: false,
      questions: [{ text: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await courseApi.getAllCourses();
      return res.data.data.courses;
    },
  });

  const selectedCourse = watch("course");

  const { data: topics } = useQuery({
    queryKey: ["topics", selectedCourse],
    queryFn: async () => {
      const res = await courseApi.getTopicsByCourse(selectedCourse);
      return res.data.data.topics;
    },
    enabled: !!selectedCourse,
  });

  const { isLoading: isFetching } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await quizApi.getQuizById(id);
      return res.data.data;
    },
    enabled: isEditMode,
    onSuccess: (quiz) => reset({
      ...quiz,
      course: quiz.course?._id || quiz.course,
      topic: quiz.topic?._id || quiz.topic || "",
    }),
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEditMode
        ? quizApi.updateQuiz(data)
        : quizApi.createQuiz(data),
    onSuccess: () => {
      toast.success(isEditMode ? "Quiz updated" : "Quiz created");
      queryClient.invalidateQueries(["adminQuizzes"]);
      navigate("/admin/quizzes");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Something went wrong"),
  });

  if (isFetching) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-violet-500" size={32} />
    </div>
  );

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/admin/quizzes")}
          className="w-9 h-9 rounded-xl border border-[#e8e4f8] flex items-center justify-center text-gray-500 hover:bg-[#f8f7ff]">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1a1535]">{isEditMode ? "Edit Quiz" : "New Quiz"}</h1>
          <p className="text-xs text-gray-500">{fields.length} question{fields.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        {/* Quiz Info */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-[#1a1535] mb-4">Quiz Details</h3>
          <div className="space-y-4">
            <Field label="Title" required error={errors.title?.message}>
              <input {...register("title")} placeholder="e.g. Limits Basics" className={inputCls} />
            </Field>
            <Field label="Description">
              <input {...register("description")} placeholder="Optional short description" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Course" required error={errors.course?.message}>
                <select {...register("course")} className={selectCls}>
                  <option value="">Select course</option>
                  {courses?.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
              </Field>
              <Field label="Topic (optional)">
                <select {...register("topic")} className={selectCls} disabled={!selectedCourse}>
                  <option value="">No specific topic</option>
                  {topics?.map((t) => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <Field label="Passing Score (%)" error={errors.passingScore?.message}>
                <input
                  {...register("passingScore", { valueAsNumber: true })}
                  type="number" min="1" max="100"
                  className={inputCls}
                />
              </Field>
              <div className="flex items-center justify-between p-4 bg-[#f8f7ff] rounded-xl border border-[#e8e4f8]">
                <span className="text-sm font-medium text-[#1a1535]">Published</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register("isPublished")} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer
                  peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-violet-500
                  after:content-[''] after:absolute after:top-0.5 after:left-0.5
                  after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all
                  peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Questions */}
        <div className="space-y-3">
          {fields.map((field, qi) => (
            <Card key={field.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-violet-500
                  flex items-center justify-center text-white text-xs font-bold">
                    {qi + 1}
                  </div>
                  <span className="text-sm font-bold text-[#1a1535]">Question {qi + 1}</span>
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(qi)}
                    className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500
                    flex items-center justify-center transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>

              <Field label="Question" required error={errors.questions?.[qi]?.questionText?.message}>
                <input
                  {...register(`questions.${qi}.questionText`)}
                  placeholder="Enter your question..."
                  className={inputCls}
                />
              </Field>

              <div className="mt-3 space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Options (select the correct one)
                </label>
                {[0, 1, 2, 3].map((oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register(`questions.${qi}.correctOptionIndex`, { valueAsNumber: true })}
                      value={oi}
                      className="accent-violet-500"
                    />
                    <input
                      {...register(`questions.${qi}.options.${oi}`)}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className={`${inputCls} flex-1`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <Field label="Explanation (optional)">
                  <input
                    {...register(`questions.${qi}.explanation`)}
                    placeholder="Why is this the correct answer?"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Card>
          ))}
        </div>

        {errors.questions?.root && (
          <p className="text-xs text-red-500">{errors.questions.root.message}</p>
        )}

        {/* Add Question */}
        <button
          type="button"
          onClick={() => append({ questionText: "", options: ["", "", "", ""], correctOptionIndex: 0, explanation: "" })}
          className="w-full py-3 border-2 border-dashed border-[#e8e4f8] rounded-xl text-sm 
          text-violet-500 hover:border-violet-300 hover:bg-violet-50 transition-all font-medium
          flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Question
        </button>

        <div className="flex gap-3 justify-end">
          <GhostBtn onClick={() => navigate("/admin/quizzes")}>Cancel</GhostBtn>
          <GradientBtn type="submit" disabled={mutation.isPending}>
            <Save size={15} />
            {isEditMode ? "Save Changes" : "Create Quiz"}
          </GradientBtn>
        </div>
      </form>
    </div>
  );
};