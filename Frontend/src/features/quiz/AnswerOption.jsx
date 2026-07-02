const letters = ["A", "B", "C", "D"];

export default function AnswerOption({ label, index, selected, onSelect }) {
  return (
    <button
      className={`answer-option ${selected ? "answer-option--selected" : ""}`}
      onClick={onSelect}
    >
      <span className="answer-letter">{letters[index]}</span>
      <span className="answer-text">{label}</span>
    </button>
  );
}
