import { useState } from "react";
import ComplaintCard from "./ComplaintCard";
import ProofUploadModal from "./ProofUploadModal";

export default function ComplaintList({ complaints, setComplaints }) {
  const [selected, setSelected] = useState(null);

  const handleAction = (complaint) => {
    if (complaint.status === "assigned") {
      updateStatus(complaint._id, "in-progress");
    } else if (complaint.status === "in-progress") {
      setSelected(complaint); // 🔥 open modal
    }
  };

  const updateStatus = (id, newStatus, proof = {}) => {
    const updated = complaints.map((c) =>
      c._id === id
        ? { ...c, status: newStatus, proof }
        : c
    );

    setComplaints(updated);
  };

  return (
    <>
      <div className="staff-list">
        {complaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            handleAction={handleAction}
          />
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selected && (
        <ProofUploadModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onSubmit={(id, proof) =>
            updateStatus(id, "completed", proof)
          }
        />
      )}
    </>
  );
}