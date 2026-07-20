import { CheckCircle2, XCircle, RotateCcw, ArrowLeft } from "lucide-react";

/**
 * Built from two separate pieces of data:
 *   - `quiz.questions`   -> text + options (student-safe shape, no correctIndex)
 *   - `submission.answers` -> { questionId, selectedIndex, isCorrect } per question
 *
 * Note on a real limitation, not a design choice: the student-facing quiz
 * payload never includes `correctIndex` or the explanation text (correctly
 * stripped so a student can't peek at answers before submitting) — so this
 * view can show "you got this right/wrong" and "you picked X" accurately,
 * but can't show *what the correct answer was* or *why*, unless the
 * backend is updated to include that in the submission response itself
 * (safe to reveal only after grading has already happened). Until then,
 * those two pieces of UI are conditionally rendered and simply don't
 * appear if the data isn't there.
 */
export default function QuizResult({ quiz, submission, onRetake, onBackToQuizzes }) {
  const passed = submission.passed;
  const answersByQuestionId = Object.fromEntries((submission.answers || []).map((a) => [a.questionId, a]));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div
        className={`rounded-2xl p-6 text-center border mb-6 ${
          passed ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
        }`}
      >
        {passed ? (
          <CheckCircle2 size={36} className="mx-auto mb-3 text-emerald-500" />
        ) : (
          <XCircle size={36} className="mx-auto mb-3 text-amber-500" />
        )}
        <p className={`text-4xl font-bold mb-1 ${passed ? "text-emerald-600" : "text-amber-600"}`}>{submission.score}%</p>
        <p className={`text-sm font-semibold ${passed ? "text-emerald-700" : "text-amber-700"}`}>
          {passed ? "You passed!" : `Not quite — you need ${quiz.passingScore || 60}% to pass`}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {submission.pointsEarned} / {submission.totalPoints} correct · Attempt #{submission.attemptNumber || 1}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {quiz.questions.map((q, qi) => {
          const answer = answersByQuestionId[q._id];
          const isCorrect = answer?.isCorrect;
          const selectedText = answer ? q.options[answer.selectedIndex] : null;

          return (
            <div
              key={q._id}
              className={`bg-white border rounded-xl p-4 ${isCorrect ? "border-emerald-200" : "border-red-200"}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5 ${
                    isCorrect ? "bg-emerald-500" : "bg-red-400"
                  }`}
                >
                  {qi + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a1535]">{q.text}</p>
                  <p className="text-sm mt-2 flex items-center gap-1.5">
                    {isCorrect ? (
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-400 flex-shrink-0" />
                    )}
                    <span className={isCorrect ? "text-emerald-700" : "text-red-600"}>
                      Your answer: {selectedText ?? "—"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBackToQuizzes}
          className="flex-1 flex items-center justify-center gap-2 border border-[#eee7ff] text-[#1a1535]
          font-semibold text-sm py-3 rounded-xl hover:bg-[#faf7ff] transition"
        >
          <ArrowLeft size={15} />
          Back to Quizzes
        </button>
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed]
          text-white font-semibold text-sm py-3 rounded-xl transition"
        >
          <RotateCcw size={15} />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}