import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import StatusBadge from "./ui/StatusBadge";

export default function ResultCard({ result, onSubmit }) {
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (result) {
      setDescription(result.description);
    }
  }, [result]);

  if (!result) return null;

  return (
    <Card variant="glass" padding="sm" className="mt-2">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Analysis
      </p>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
        <span>Category:</span>
        <Badge variant="primary">{result.category}</Badge>
        {result.priority && (
          <>
            <span>Priority:</span>
            <StatusBadge type="priority" value={result.priority} />
          </>
        )}
      </div>
    </Card>
  );
}
