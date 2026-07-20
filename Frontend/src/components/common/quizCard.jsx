import { Link } from "react-router-dom";
import { ClipboardList, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

/**
 * `submission` is the student's own latest attempt on this quiz (or null
 * if they've never taken it) — comes from a single getQuizHistory() call
 * on the list page, not a per-card fetch, same pattern as CourseCard.
 */
export default function QuizCard({ quiz, submission }) {
  const hasAttempted = Boolean(submission);
  const passed = submission?.passed;

  return (
    <div className="bg-white border border-[#eee7ff] rounded-2xl p-5 flex flex-col hover:shadow-md hover:shadow-violet-100 transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#f3edff] border border-[#eee7ff] flex items-center justify-center flex-shrink-0">
          <ClipboardList size={20} className="text-[#8b5cf6]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-[#1a1535] leading-tight truncate">{quiz.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {quiz.questions?.length || 0} question{quiz.questions?.length === 1 ? "" : "s"} · Pass at {quiz.passingScore || 60}%
          </p>
        </div>
      </div>

      {quiz.description && <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{quiz.description}</p>}

      {hasAttempted && (
        <div
          className={`flex items-center justify-between mt-3 px-3 py-2 rounded-xl text-sm font-medium ${
            passed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            {passed ? "Passed" : "Not passed"} · {submission.score}%
          </span>
          <span className="text-xs opacity-70">Attempt #{submission.attemptNumber || 1}</span>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {!hasAttempted ? (
          <Link
            to={`/quizzes/${quiz._id}`}
            className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]
            text-white font-semibold text-sm py-2.5 rounded-xl transition"
          >
            Take Quiz
          </Link>
        ) : (
          <>
            <Link
              to={`/quizzes/${quiz._id}/result`}
              className="flex-1 flex items-center justify-center gap-2 border border-[#eee7ff]
              text-[#1a1535] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#faf7ff] transition"
            >
              View Result
            </Link>
            <Link
              to={`/quizzes/${quiz._id}?retake=true`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]
              text-white font-semibold text-sm py-2.5 rounded-xl transition"
            >
              <RotateCcw size={14} />
              Retake
            </Link>
          </>
        )}
      </div>
    </div>
  );
}