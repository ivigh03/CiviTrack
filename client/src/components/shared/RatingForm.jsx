import { useState } from "react";
import { Star } from "lucide-react";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

export default function RatingForm({ onSubmit }) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!stars) return;

    setSubmitting(true);
    try {
      await onSubmit(stars, comment);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">Rate this resolution</p>

      <div className="mb-4 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStars(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5"
          >
            <Star
              className={
                (hovered || stars) >= value
                  ? "h-6 w-6 fill-warning text-warning"
                  : "h-6 w-6 text-muted"
              }
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <Textarea
          placeholder="Add an optional comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </div>

      <Button onClick={handleSubmit} loading={submitting} disabled={!stars} className="w-full">
        Submit Rating
      </Button>
    </div>
  );
}
