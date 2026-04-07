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
    </div>
  );
}