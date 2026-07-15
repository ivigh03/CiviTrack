import { useState } from "react";

import ComplaintCard from "./ComplaintCard";
import ProofUploadModal from "./ProofUploadModal";

import {
  completeComplaint,
} from "../../api/complaintApi";

export default function ComplaintList({
  complaints,
  setComplaints,
}) {
  const [selected, setSelected] = useState(null);

  // 🔥 HANDLE BUTTON ACTION
  const handleAction = (complaint) => {
    // assigned → start work
    if (complaint.status === "assigned") {
      updateLocalStatus(
        complaint._id,
        "in-progress"
      );
    }

    // in-progress → open proof modal
    else if (
      complaint.status === "in-progress"
    ) {
      setSelected(complaint);
    }
  };

  // 🔥 LOCAL UI UPDATE
  const updateLocalStatus = (
    id,
    newStatus
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, status: newStatus }
          : c
      )
    );
  };

  // 🔥 FINAL SUBMIT
  const handleSubmitProof = async (
    id,
    proof
  ) => {
    try {
      const formData = new FormData();

      // ✅ proof image
      if (proof.image) {
        formData.append(
          "proofImage",
          proof.image
        );
      }

      // ✅ remark
      formData.append(
        "remark",
        proof.note || ""
      );

      // ✅ backend update
      await completeComplaint(
        id,
        formData
      );

      // ✅ frontend update
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
                ...c,
                status: "resolved",
                proof,
              }
            : c
        )
      );

      // ✅ close modal
      setSelected(null);

    } catch (err) {
      console.error(
        "COMPLETE ERROR:",
        err
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {complaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            handleAction={handleAction}
          />
        ))}
      </div>

      {/* 🔥 PROOF MODAL */}
      {selected && (
        <ProofUploadModal
          complaint={selected}
          onClose={() =>
            setSelected(null)
          }
          onSubmit={handleSubmitProof}
        />
      )}
    </>
  );
}
