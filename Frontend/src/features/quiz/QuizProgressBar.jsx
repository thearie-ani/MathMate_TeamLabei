export default function QuizProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="quiz-progress">
      <div className="quiz-progress-track">
        <div className="quiz-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="quiz-progress-label">{current} / {total}</span>
    </div>
  );
}
