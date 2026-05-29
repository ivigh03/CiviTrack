import { useNavigate } from "react-router-dom";

export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

  if (!complaint) return null;

  return (
    <div
      className="complaint-card"
      onClick={() => navigate(`/complaint/${complaint._id}`)}
    >
      <div className="card-header">
        <h3>{complaint.title}</h3>

        <span className={`badge ${complaint.status}`}>
          {complaint.status}
        </span>
      </div>

      <p className="category">{complaint.category}</p>

      {/* ✅ FIXED */}
      <p className="area">📍 {complaint.address}</p>

      <small>
        {new Date(complaint.createdAt).toLocaleString()}
      </small>
    </div>
  );
}