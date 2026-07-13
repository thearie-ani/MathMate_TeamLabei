export default function RecentActivityList({ activities = [] }) {
  return (
    <div className="activity-list">
      <h3 className="activity-list-title">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="activity-empty">No recent activity.</p>
      ) : (
        <ul className="activity-items">
          {activities.map((act, i) => (
            <li key={i} className="activity-item">
              <span className="activity-icon">{act.icon}</span>
              <div className="activity-info">
                <p className="activity-desc">{act.description}</p>
                <p className="activity-time">{act.time}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
