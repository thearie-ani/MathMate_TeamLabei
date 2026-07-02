export default function AchievementGrid({ achievements = [] }) {
  return (
    <div className="achievement-grid">
      {achievements.map((ach, i) => (
        <div
          key={i}
          className={`achievement-item ${ach.unlocked ? "achievement-item--unlocked" : "achievement-item--locked"}`}
          title={ach.description}
        >
          <span className="achievement-icon">{ach.icon}</span>
          <p className="achievement-name">{ach.name}</p>
        </div>
      ))}
    </div>
  );
}
