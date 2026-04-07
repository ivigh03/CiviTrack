export default function StatsCards({ complaints }) {
  const total = complaints.length;
  const open = complaints.filter(c => c.status === "open").length;
  const progress = complaints.filter(c => c.status === "in-progress").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  const data = [
    { label: "Total", value: total },
    { label: "Open", value: open },
    { label: "In Progress", value: progress },
    { label: "Resolved", value: resolved },
  ];

  return (
    <div className="stats-grid">
      {data.map((item, i) => (
        <div key={i} className="stat-card">
          <h3>{item.value}</h3>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}