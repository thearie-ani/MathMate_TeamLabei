import ProgressBar from "../../components/ui/ProgressBar";

export default function XPProgressBar({ xp = 0, nextLevel = 1000, level = 1 }) {
  return (
    <div className="xp-bar">
      <div className="xp-bar-header">
        <span className="xp-level">Level {level}</span>
        <span className="xp-value">{xp} / {nextLevel} XP</span>
      </div>
      <ProgressBar value={xp} max={nextLevel} showPercent={false} />
    </div>
  );
}
