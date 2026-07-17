import { useState } from "react";
import { toast } from "sonner";
import { ThumbsUp } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { voteComplaint } from "../../api/complaintApi";

export default function DuplicateConfirmModal({
  open,
  onOpenChange,
  bestMatch,
  onSupportExisting,
  onSubmitAnyway,
}) {
  const [supporting, setSupporting] = useState(false);

  if (!bestMatch) return null;

  const handleSupport = async () => {
    setSupporting(true);
    try {
      await voteComplaint(bestMatch._id, "upvote");
      toast.success("Thanks — you're now supporting this complaint.");
      onSupportExisting();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not support this complaint");
    } finally {
      setSupporting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="This looks similar to an existing complaint"
      description={`"${bestMatch.title}" at ${bestMatch.address} — already has ${bestMatch.upvotes} supporter(s).`}
    >
      <p className="mb-4 text-sm text-muted">{bestMatch.userDescription}</p>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onSubmitAnyway}>
          Submit as new anyway
        </Button>
        <Button className="flex-1" loading={supporting} onClick={handleSupport}>
          <ThumbsUp className="h-4 w-4" />
          Support this instead
        </Button>
      </div>
    </Modal>
  );
}
