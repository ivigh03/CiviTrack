import { useNavigate } from "react-router-dom";

export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

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
      <p className="area">{complaint.area}</p>

      <small>{complaint.createdAt}</small>
    </div>
  );
}