import AnswerOption from "./AnswerOption";

export default function QuizQuestionCard({ question, onAnswer, selectedAnswer }) {
  return (
    <div className="quiz-question-card">
      <p className="quiz-question-text">{question.text}</p>
      <div className="quiz-answers">
        {question.options.map((opt, i) => (
          <AnswerOption
            key={i}
            label={opt}
            index={i}
            selected={selectedAnswer === i}
            onSelect={() => onAnswer(i)}
          />
        ))}
      </div>
    </div>
  );
}
