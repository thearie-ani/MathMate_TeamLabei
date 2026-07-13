export default function ProgressBar({ value = 0, max = 100, label = "", showPercent = true, className = "" }) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`progress-bar-wrapper ${className}`}>
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      {showPercent && <span className="progress-percent">{percent}%</span>}
    </div>
  );
}
