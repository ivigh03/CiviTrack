import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/detail.css";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/complaints"
      );

      const found = res.data.data.find((c) => c._id === id);
      setComplaint(found);
    };

    fetchComplaint();
  }, [id]);

  if (!complaint) return <div className="loading">Loading...</div>;

  return (
    <div className="detail-page">

      <div className="detail-card">

        {/* 🔥 IMAGE */}
        {complaint.image && (
        <img
            src={`http://localhost:5000${complaint.image}`}
            alt="complaint"
            className="detail-img"
        />
        )}

        {/* 🔥 CONTENT */}
        <div className="detail-content">

          <h1>{complaint.title}</h1>

          <p className="badge">{complaint.category}</p>

          <p className="address">📍 {complaint.address}</p>

          <p className="desc">{complaint.userDescription}</p>

          {/* 🔥 VOTES */}
          <div className="vote-section">
            <button onClick={() => handleVote("upvote")}>
              👍 {complaint.upvotes}
            </button>

            <button onClick={() => handleVote("downvote")}>
              👎 {complaint.downvotes}
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  async function handleVote(type) {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/complaints/${id}/vote`,
        { type }
      );

      setComplaint(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }
}