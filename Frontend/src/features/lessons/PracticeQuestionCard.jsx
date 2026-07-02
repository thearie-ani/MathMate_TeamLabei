import { useState } from "react";
import Button from "../../components/ui/Button";

export default function PracticeQuestionCard({ question }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="practice-card">
      <p className="practice-question">{question.text}</p>
      <div className="practice-options">
        {question.options.map((opt, i) => (
          <button
            key={i}
            className={`practice-option ${selected === i ? "practice-option--selected" : ""} ${revealed && i === question.answer ? "practice-option--correct" : ""}`}
            onClick={() => setSelected(i)}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button variant="secondary" onClick={() => setRevealed(true)}>Check Answer</Button>
    </div>
  );
}
