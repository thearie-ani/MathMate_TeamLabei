import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Eye, Pencil, ArrowLeft, Clock, BookMarked } from "lucide-react";
import { courseApi } from "../../api/courseApi.js";
import { Card } from "../../components/common/card.jsx";
import Button from "../../components/common/button.jsx";
import KatexRenderer from "../../components/renderer/KatexRenderer.jsx";

export default function LessonPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lessonPreview", id],
    queryFn: async () => (await courseApi.getLessonById(id)).data.data.lesson,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl space-y-4" aria-busy="true">
        <div className="h-10 bg-gray-100 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-4 p-3 bg-[#f3effe] border border-violet-200 rounded-xl flex-wrap gap-2">
        <div className="flex items-center gap-2 text-[#7c3aed] text-sm font-medium">
          <Eye size={15} />
          Admin Preview 
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/lessons/${id}/edit`)}>
            <Pencil size={13} /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/courses/${lesson?.course?._id || lesson?.course}/lessons`)}
          >
            <ArrowLeft size={13} /> Back
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 bg-[#f8f7ff] border-b border-[#e8e4f8]">
          <div className="flex items-center gap-2 mb-3">
            <BookMarked size={16} className="text-[#a78bfa]" />
            <span className="text-xs font-medium text-[#8b5cf6] uppercase tracking-wide">
              Chapter {lesson?.chapter}.{lesson?.order}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1535] mb-2">{lesson?.title}</h1>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {lesson?.sourceUrl && (
              <a href={lesson.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                View original source ↗
              </a>
            )}
          </div>
        </div>

        {/* Same KatexRenderer used on the real student-facing lesson page --
            LaTeX formulas authored in Tiptap render identically here. */}
        <div className="p-6">
          <KatexRenderer html={lesson?.content} className="prose prose-sm max-w-none text-[#1a1535] leading-relaxed" />
        </div>

        <div className="p-6 border-t border-[#e8e4f8] bg-[#faf9ff]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">This is how students see this lesson</span>
            <div className="px-5 py-2.5 bg-[#8b5cf6] text-white text-sm font-semibold rounded-xl opacity-70 cursor-not-allowed">
              ✓ Mark as Complete
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}