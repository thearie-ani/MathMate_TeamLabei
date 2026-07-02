export default function FormulaBlock({ formula, label }) {
  return (
    <div className="formula-block">
      {label && <p className="formula-label">{label}</p>}
      <code className="formula-code">{formula}</code>
    </div>
  );
}
