import { useState } from "react";
import { ImagePlus } from "lucide-react";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

export default function ProofUploadModal({ complaint, onClose, onSubmit }) {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    onSubmit(complaint._id, { note, image });
    onClose();
  };

  return (
    <Modal open onOpenChange={(open) => !open && onClose()} title="Upload Proof">
      <div className="space-y-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border bg-elevated/50 px-3.5 py-3 text-sm text-muted hover:text-foreground">
          <ImagePlus className="h-4 w-4" />
          {image ? image.name : "Choose proof image (optional)"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        <Textarea
          placeholder="Add note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3">
          <Button className="flex-1" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
