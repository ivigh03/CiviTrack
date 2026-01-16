import { Flame } from "lucide-react";
import HeatmapView from "../HeatmapView";
import Card from "../ui/Card";

const Heatmap = () => {
  return (
    <div>
      <h1 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
        <Flame className="h-5 w-5 text-danger" />
        Complaint Heatmap
      </h1>
      <Card variant="glass" padding="sm" className="overflow-hidden">
        <HeatmapView />
      </Card>
    </div>
  );
};

export default Heatmap;
