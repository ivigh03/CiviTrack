export default function OverviewCards({ complaints = [] }) {
  const assigned = complaints.filter(c => c.status === "pending").length;
  const inProgress = complaints.filter(c => c.status === "in-progress").length;
  const completed = complaints.filter(c => c.status === "resolved").length;

  return (
    <div className="overview-grid">
      <div className="overview-card">
        <h2>{assigned}</h2>
        <p>Assigned</p>
      </div>

      <div className="overview-card">
        <h2>{inProgress}</h2>
        <p>In Progress</p>
      </div>

      <div className="overview-card">
        <h2>{assigned}</h2>
        <p>Pending</p>
      </div>

      <div className="overview-card">
        <h2>{completed}</h2>
        <p>Completed</p>
      </div>
    </div>
  );
}