import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import ProgressBar from "../../components/ui/ProgressBar";

export default function LessonCard({ lesson }) {
  return (
    <Card className="lesson-card">
      <Badge variant="info">{lesson.subject}</Badge>
      <h3 className="lesson-card-title">{lesson.title}</h3>
      <p className="lesson-card-desc">{lesson.description}</p>
      <ProgressBar value={lesson.progress ?? 0} max={100} label="Progress" />
      <Link to={`/lessons/${lesson._id}`} className="lesson-card-link">Continue →</Link>
    </Card>
  );
}
