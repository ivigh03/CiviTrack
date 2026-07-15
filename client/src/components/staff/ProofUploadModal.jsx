import { useState } from "react";
import { motion } from "framer-motion";

export default function ProofUploadModal({ complaint, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    onSubmit(complaint._id, { note, image });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="modal-overlay"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ duration: 0.2 }}
        className="modal"
      >
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
      </motion.div>
    </motion.div>
  );
}
