import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home({ complaints }) {
  const navigate = useNavigate();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const pending = complaints.filter(c => c.status === "pending").length;

  const data = [
    { label: "Total", value: total },
    { label: "Resolved", value: resolved },
    { label: "Pending", value: pending },
  ];

  return (
    <div className="home">

      <div className="new-complaint">
        <h2>Report an Issue</h2>
        <button onClick={() => navigate("/complaintForm")}>
          + New Complaint
        </button>
      </div>

      <div className="analytics">
        {data.map((item, i) => (
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}