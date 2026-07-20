import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { quizApi } from "../../api/quizApi.js";
import QuizResult from "../../components/common/quizResult.jsx";

export default function QuizResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quiz", id],
    queryFn: async () => (await quizApi.getQuizById(id)).data.data,
  });
  const {
    data: submission,
    isLoading: isSubmissionLoading,
    isError: submissionErrored,
  } = useQuery({
    queryKey: ["mySubmission", id],
    queryFn: async () => (await quizApi.getMySubmission(id)).data.data.submission,
  });

  if (isQuizLoading || isSubmissionLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#8b5cf6]" size={32} />
      </div>
    );
  }

  // A 404 here means there's genuinely no submission to show — send them
  // to take the quiz instead of showing an empty/broken result view.
  if (submissionErrored || !submission || !quiz) {
    navigate(`/quizzes/${id}`, { replace: true });
    return null;
  }

  return (
    <QuizResult
      quiz={quiz}
      submission={submission}
      onRetake={() => navigate(`/quizzes/${id}?retake=true`)}
      onBackToQuizzes={() => navigate("/quizzes")}
    />
  );
}