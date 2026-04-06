import Timeline from "./Timeline";

export default function ComplaintCard({ complaint, handleAction }) {
  return (
    <div className="staff-card">
      <div className="card-top">
        <h3>{complaint.title}</h3>
        <span className={`priority ${complaint.priority}`}>
          {complaint.priority}
        </span>
      </div>

      <p className="area">📍 {complaint.area}</p>
      <p>Status: {complaint.status}</p>

      {/* 🔥 TIMELINE */}
      <Timeline status={complaint.status} />

      {complaint.status !== "completed" && (
        <button
          className="action-btn"
          onClick={() => handleAction(complaint)}
        >
          {complaint.status === "assigned" && "▶ Start Work"}
          {complaint.status === "in-progress" && "✅ Mark Completed"}
        </button>
      )}

      {complaint.status === "completed" && (
        <p style={{ color: "#00c853" }}>
          ✔ Completed (Proof Submitted)
        </p>
      )}
    </div>
  );
}