import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Loader2, Users } from "lucide-react";

/**
 * One card renders in exactly one of three states, driven by `progress`:
 *   - progress is null/undefined       -> not enrolled -> Enroll button
 *   - progress exists, not completed    -> Continue Learning + progress bar
 *   - progress.completedAt is set       -> Completed badge + Review button
 *
 * Keeping these as three visually distinct branches (not one button whose
 * label changes) makes the completed state actually feel like an
 * accomplishment instead of "still just a course link."
 */
export default function CourseCard({ course, progress, isEnrolling, onEnroll }) {
  const isEnrolled = Boolean(progress);
  const isCompleted = Boolean(progress?.completedAt) || progress?.progressPercentage === 100;
  const percentage = progress?.progressPercentage || 0;

  return (
    <div className="bg-white border border-[#eee7ff] rounded-2xl p-5 flex flex-col hover:shadow-md hover:shadow-violet-100 transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#f3edff] border border-[#eee7ff] flex items-center justify-center text-xl flex-shrink-0">
          {course.icon || "📚"}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-[#1a1535] leading-tight truncate">{course.title}</h3>
        </div>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{course.description}</p>

      {course.enrollmentCount > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
          <Users size={13} />
          {course.enrollmentCount} enrolled
        </div>
      )}

      <div className="mt-4">
        {!isEnrolled ? (
          <button
            onClick={() => onEnroll(course)}
            disabled={isEnrolling}
            className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]
            text-white font-semibold text-sm py-2.5 rounded-xl transition disabled:opacity-60"
          >
            {isEnrolling ? <Loader2 size={15} className="animate-spin" /> : <BookOpen size={15} />}
            {isEnrolling ? "Enrolling..." : "Enroll"}
          </button>
        ) : isCompleted ? (
          <>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-2">
              <CheckCircle2 size={14} />
              Completed
            </div>
            <Link
              to={`/courses/${course.slug}`}
              className="w-full flex items-center justify-center gap-2 border border-emerald-200 bg-emerald-50
              text-emerald-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-emerald-100 transition"
            >
              Review Course
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
              <span>Progress</span>
              <span className="font-semibold text-[#8b5cf6]">{percentage}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#f3edff] mb-3 overflow-hidden">
              <div className="h-full rounded-full bg-[#8b5cf6] transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
            <Link
              to={`/courses/${course.slug}`}
              className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]
              text-white font-semibold text-sm py-2.5 rounded-xl transition"
            >
              Continue Learning
            </Link>
          </>
        )}
      </div>
    </div>
  );
}