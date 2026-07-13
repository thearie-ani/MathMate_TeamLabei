// Placeholder — wire up a chart library (e.g., Recharts) later
export default function PerformanceChart({ data = [] }) {
  return (
    <div className="perf-chart">
      <h3 className="perf-chart-title">Performance Over Time</h3>
      {data.length === 0 ? (
        <p className="perf-chart-empty">No data yet.</p>
      ) : (
        <pre className="perf-chart-placeholder">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
