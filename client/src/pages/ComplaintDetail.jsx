import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CommentSection from "../components/dashboard/CommentSection";
import "../styles/complaintDetail.css";

export default function ComplaintDetail() {
  const { id } = useParams();
  const { complaints } = useSelector((state) => state.complaints);

  const complaint = complaints.find((c) => c._id === id);

  if (!complaint) return <h2>Complaint not found</h2>;

  return (
    <div className="detail-container">
      <div className="detail-card">

        {/* 🔥 HEADER */}
        <div className="detail-header">
          <h1>{complaint.title}</h1>
          <span className={`badge ${complaint.status}`}>
            {complaint.status}
          </span>
        </div>

        {/* 📄 INFO */}
        <p className="desc">{complaint.description}</p>

        <div className="meta">
          <span>📍 {complaint.area}</span>
          <span>📂 {complaint.category}</span>
          <span>📅 {complaint.createdAt}</span>
        </div>

        {/* 🖼 IMAGES */}
        <div className="image-grid">
          {complaint.images.map((img, i) => (
            <img key={i} src={img} alt="complaint" />
          ))}
        </div>

        {/* 👍 VOTING */}
        <div className="votes">
          <button className="upvote">👍 {complaint.votes}</button>
          <button className="downvote">👎 {complaint.downvotes}</button>
        </div>

        {/* 💬 COMMENTS */}
        <CommentSection comments={complaint.comments} />

      </div>
    </div>
  );
}