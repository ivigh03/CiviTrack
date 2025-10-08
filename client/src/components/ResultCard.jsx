import { useState, useEffect } from "react";

export default function ResultCard({ result, onSubmit }) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (result) {
      setDescription(result.description);
    }
  }, [result]);

  if (!result) return null;

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h2>AI Analysis</h2>

      <p><strong>Category:</strong> {result.category}</p>
      <p><strong>Priority:</strong> {result.priority}</p>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          borderRadius: "10px",
          padding: "10px",
          marginTop: "10px"
        }}
      />

      <button
        style={{ marginTop: 10 }}
        onClick={() => onSubmit(description, result.file)}
      >
        Submit Complaint
      </button>
    </div>
  );
}