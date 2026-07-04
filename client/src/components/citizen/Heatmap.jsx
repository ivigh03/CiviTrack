import { Flame } from "lucide-react";
import HeatmapView from "../HeatmapView";
import Card from "../ui/Card";

export default function Heatmap() {
  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-foreground">
        <Flame className="h-5 w-5 text-primary" />
        Complaint Heatmap
      </h2>

      <Card variant="glass" padding="sm" className="overflow-hidden">
        <HeatmapView />
      </Card>
    </div>
  );
}
