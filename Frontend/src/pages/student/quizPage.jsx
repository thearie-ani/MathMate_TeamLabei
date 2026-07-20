import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { quizApi } from "../../api/quizApi.js";
import QuizResult from "../../components/common/quizResult.jsx";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState({});
  const [resultSubmission, setResultSubmission] = useState(null);

  const { data: quiz, isLoading: isQuizLoading, isError: quizErrored } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => (await quizApi.getQuizById(id)).data.data,
  });

  // getMySubmission 404s when the student has never attempted this quiz —
  // that's an expected outcome here, not a real error, so it's normalized
  // to `null` rather than surfacing as a fetch failure.
  const { data: existingSubmission, isLoading: isSubmissionLoading } = useQuery({
    queryKey: ["mySubmission", id],
    queryFn: async () => {
      try {
        return (await quizApi.getMySubmission(id)).data.data.submission;
      } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
  });

  const isRetake = Boolean(existingSubmission);

  // Pre-fill previous picks on a retake as a starting point — none of the
  // isCorrect/correct-answer info is shown at this stage, only which
  // option they'd selected, so this doesn't leak anything they haven't
  // already seen on their first attempt.
  useEffect(() => {
    if (existingSubmission?.answers?.length) {
      const prefilled = {};
      for (const a of existingSubmission.answers) {
        prefilled[a.questionId] = a.selectedIndex;
      }
      setAnswers(prefilled);
    }
  }, [existingSubmission]);

 

  const answeredCount = quiz?.questions ? quiz.questions.filter((q) => answers[q._id] !== undefined).length : 0;
  const totalQuestions = quiz?.questions?.length || 0;
  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = quiz.questions.map((q) => ({ questionId: q._id, selectedIndex: answers[q._id] }));
      return isRetake ? quizApi.retakeQuiz(id, payload) : quizApi.submitQuiz(id, payload);
    },
    onSuccess: (res) => {
      const submission = res.data.data.submission;
      setResultSubmission(submission);
      queryClient.invalidateQueries({ queryKey: ["quizHistory"] });
      queryClient.invalidateQueries({ queryKey: ["mySubmission", id] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to submit quiz. Please try again.");
    },
  });

  const handleSelect = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleRetakeAgain = () => {
    setResultSubmission(null);
    setAnswers({});
  };

  if (isQuizLoading || isSubmissionLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={32} />
      </div>
    );
  }

  if (quizErrored || !quiz) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <p className="text-sm text-gray-500">This quiz couldn't be loaded — it may no longer be available.</p>
        <button onClick={() => navigate("/quizzes")} className="mt-3 text-sm font-semibold text-[#8b5cf6] hover:text-[#7c3aed]">
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (resultSubmission) {
    return <QuizResult quiz={quiz} submission={resultSubmission} onRetake={handleRetakeAgain} onBackToQuizzes={() => navigate("/quizzes")} />;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate("/quizzes")}
        className="flex items-center gap-2 text-sm text-[#8b5cf6] hover:text-[#7c3aed] mb-5"
      >
        <ArrowLeft size={16} />
        Back to Quizzes
      </button>

      <div className="bg-white border border-[#eee7ff] rounded-2xl overflow-hidden mb-4">
        <div className="p-6 bg-[#faf7ff] border-b border-[#eee7ff]">
          <h1 className="text-xl font-bold text-[#1a1535] mb-1">{quiz.title}</h1>
          {quiz.description && <p className="text-sm text-gray-500">{quiz.description}</p>}

          {isRetake && (
            <div className="flex items-center gap-2 mt-3 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 w-fit">
              <CheckCircle2 size={13} />
              Previous score: {existingSubmission.score}% — retaking will replace this result
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, qi) => (
          <div key={q._id} className="bg-white border border-[#eee7ff] rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {qi + 1}
              </span>
              <p className="text-sm font-semibold text-[#1a1535]">{q.text}</p>
            </div>
            <div className="ml-9 space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer border text-sm transition-all ${
                    answers[q._id] === oi
                      ? "border-violet-300 bg-violet-50 text-violet-800"
                      : "border-[#eee7ff] hover:border-violet-200 hover:bg-[#faf7ff]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q._id}`}
                    checked={answers[q._id] === oi}
                    onChange={() => handleSelect(q._id, oi)}
                    className="accent-[#8b5cf6]"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white border border-[#eee7ff] rounded-2xl p-4 flex items-center justify-between sticky bottom-4">
        <span className="text-sm text-gray-500">
          {answeredCount} of {totalQuestions} answered
        </span>
        <button
          onClick={() => submitMutation.mutate()}
          disabled={!allAnswered || submitMutation.isPending}
          className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold text-sm
          px-6 py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitMutation.isPending && <Loader2 size={14} className="animate-spin" />}
          {submitMutation.isPending ? "Submitting..." : isRetake ? "Submit Retake" : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}