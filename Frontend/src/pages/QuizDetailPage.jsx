import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, submitQuiz } from "../api/quizApi";
import QuizQuestionCard from "../features/quiz/QuizQuestionCard";
import QuizProgressBar from "../features/quiz/QuizProgressBar";
import Button from "../components/ui/Button";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizById(id)
      .then((res) => setQuiz(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnswer = (answerIndex) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = answerIndex;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const res = await submitQuiz(id, answers);
    setResult(res.data);
  };

  if (loading) return <p className="loading-text">Loading quiz…</p>;
  if (!quiz) return <p className="empty-text">Quiz not found.</p>;

  if (result) {
    return (
      <div className="page quiz-result-page">
        <h1 className="page-title">Quiz Complete!</h1>
        <p className="quiz-score">Score: {result.score} / {quiz.questions.length}</p>
      </div>
    );
  }

  const question = quiz.questions[current];

  return (
    <div className="page quiz-detail-page">
      <h1 className="page-title">{quiz.title}</h1>
      <QuizProgressBar current={current + 1} total={quiz.questions.length} />
      <QuizQuestionCard
        question={question}
        selectedAnswer={answers[current]}
        onAnswer={handleAnswer}
      />
      <div className="quiz-nav">
        {current > 0 && (
          <Button variant="ghost" onClick={() => setCurrent((c) => c - 1)}>← Back</Button>
        )}
        {current < quiz.questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => c + 1)} disabled={answers[current] === undefined}>
            Next →
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={answers[current] === undefined}>
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
