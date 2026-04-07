import { useState } from "react";

export default function ProofUploadModal({ complaint, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    onSubmit(complaint._id, { note, image });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Upload Proof</h2>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <textarea
          placeholder="Add note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}