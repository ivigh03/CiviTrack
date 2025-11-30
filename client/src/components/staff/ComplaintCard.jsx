import Timeline from "./Timeline";

export default function ComplaintCard({ complaint, handleAction }) {
  // 🔥 SAFETY (prevents crash)
  if (!complaint) return null;

  return (
    <div className="staff-card">

      {/* 🔝 TOP */}
      <div className="card-top">
        <h3>{complaint.title || "No Title"}</h3>

        {/* optional badge */}
        <span className={`priority ${complaint.severity || "medium"}`}>
          {complaint.severity || "medium"}
        </span>
      </div>

      {/* 📍 ADDRESS */}
      <p className="area">
        📍 {complaint.address || "No address"}
      </p>

      {/* 📊 STATUS */}
      <p>Status: {complaint.status}</p>

      {/* 🔥 IMAGE */}
      {complaint.image && (
        <img
          src={`http://localhost:5000${complaint.image}`}
          alt="complaint"
          className="complaint-img"
        />
      )}

      {/* 🔥 TIMELINE */}
      <Timeline status={complaint.status} />

      {/* 🔥 ACTION BUTTONS */}
      {complaint.status === "pending" && (
        <button
          className="action-btn"
          onClick={() => handleAction(complaint)}
        >
          ▶ Start Work
        </button>
      )}

      {complaint.status === "in-progress" && (
        <button
          className="action-btn"
          onClick={() => handleAction(complaint)}
        >
          ✅ Mark Completed
        </button>
      )}

      {complaint.status === "resolved" && (
        <p style={{ color: "#00c853" }}>
          ✔ Completed
        </p>
      )}
    </div>
  );
}