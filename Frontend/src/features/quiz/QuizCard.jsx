import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function QuizCard({ quiz }) {
  return (
    <Card className="quiz-card">
      <Badge variant={quiz.completed ? "success" : "default"}>
        {quiz.completed ? "Completed" : "Not started"}
      </Badge>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-meta">{quiz.questionCount} questions · {quiz.timeLimit} min</p>
      <Link to={`/quizzes/${quiz._id}`} className="quiz-card-link">
        {quiz.completed ? "Review" : "Start Quiz"} →
      </Link>
    </Card>
  );
}
