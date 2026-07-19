import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, ArrowLeft, Users } from "lucide-react";
import { courseApi } from "../../api/courseApi.js";
import { Card } from "../../components/common/card.jsx";
import { StatusPill } from "../../components/common/badge.jsx";
import Button from "../../components/common/button.jsx";

export default function CoursePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ["coursePreview", id],
    queryFn: async () => (await courseApi.getCourseById(id)).data.data.course,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["courseLessons", id],
    queryFn: async () => (await courseApi.getLessonsByCourse(id)).data.data.lessons,
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl space-y-4" aria-busy="true">
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
        <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-4 p-3 bg-[#f3effe] border border-violet-200 rounded-xl flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#7c3aed] text-sm font-medium">
          <Eye size={15} />
          Admin Preview 
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/courses/${id}/edit`)}>
            <Pencil size={13} /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/courses")}>
            <ArrowLeft size={13} /> Back
          </Button>
        </div>
      </div>

      <Card className="p-8 mb-4">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#f3effe] border border-[#e8e4f8] flex items-center justify-center text-3xl flex-shrink-0">
            {course?.icon || "📚"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <StatusPill published={course?.isPublished} />
              <span className="text-xs text-gray-400 border border-[#e8e4f8] rounded-full px-2 py-0.5">{course?.grade}</span>
              <span className="text-xs text-gray-400 border border-[#e8e4f8] rounded-full px-2 py-0.5">{course?.difficulty}</span>
              <span className="text-xs text-violet-600 border border-violet-200 bg-violet-50 rounded-full px-2 py-0.5 flex items-center gap-1">
                <Users size={11} /> {course?.enrollmentCount || 0} enrolled
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a1535] mb-2">{course?.title}</h1>
            <p className="text-gray-500 leading-relaxed">{course?.description}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-5 border-b border-[#e8e4f8]">
          <h2 className="font-bold text-[#1a1535]">Lessons ({lessons?.length || 0})</h2>
        </div>
        <div className="divide-y divide-[#f0eeff]">
          {lessonsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
              </div>
            ))
          ) : lessons?.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No lessons yet.{" "}
              <button onClick={() => navigate(`/admin/lessons/new?courseId=${id}`)} className="ml-1 text-[#8b5cf6] hover:underline">
                Add a lesson
              </button>
            </div>
          ) : (
            lessons?.map((lesson, idx) => (
              <div key={lesson._id} className="flex items-center justify-between p-4 hover:bg-[#faf9ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ec4899] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1535]">{lesson.title}</p>
                    <p className="text-xs text-gray-400">{lesson.estimatedMinutes || 15} min read</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/admin/lessons/${lesson._id}/preview`)}
                  className="text-xs text-[#8b5cf6] hover:text-[#7c3aed] flex items-center gap-1 font-medium"
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}