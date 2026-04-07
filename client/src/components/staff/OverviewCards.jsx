export default function OverviewCards({ complaints }) {
  const assigned = complaints.filter(c => c.status === "assigned").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const completed = complaints.filter(c => c.status === "completed").length;

  const data = [
    { label: "Assigned", value: assigned },
    { label: "In Progress", value: inProgress },
    { label: "Pending", value: pending },
    { label: "Completed", value: completed },
  ];

  return (
    <div className="overview-grid">
      {data.map((item, i) => (
        <div key={i} className="overview-card">
          <h2>{item.value}</h2>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}