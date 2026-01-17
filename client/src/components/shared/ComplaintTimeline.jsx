import {
  History,
  FilePlus,
  Sparkles,
  UserCog,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Star,
} from "lucide-react";
import Badge from "../ui/Badge";
import { StaggerList, StaggerItem } from "../ui/AnimatedContainer";

const matchEntry = (action) => {
  if (action === "Complaint Created") return { variant: "neutral", Icon: FilePlus };
  if (action === "AI Categorized") return { variant: "info", Icon: Sparkles };
  if (action.startsWith("Assigned") || action.startsWith("Reassigned"))
    return { variant: "primary", Icon: UserCog };
  if (action.startsWith("Status changed to")) return { variant: "info", Icon: RefreshCcw };
  if (action === "Escalated") return { variant: "danger", Icon: AlertTriangle };
  if (action === "Resolved") return { variant: "success", Icon: CheckCircle2 };
  if (action.startsWith("Citizen Rated")) return { variant: "primary", Icon: Star };
  return { variant: "neutral", Icon: History };
};

const actorLabel = (entry) => {
  if (entry.performedBy?.name) return entry.performedBy.name;
  if (entry.action === "AI Categorized") return "AI Assistant";
  return "System";
};

export default function ComplaintTimeline({ activityLog = [] }) {
  return (
    <>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <History className="h-4 w-4 text-primary" />
        Activity Timeline
      </h3>

      {!activityLog || activityLog.length === 0 ? (
        <p className="text-muted">No activity yet</p>
      ) : (
        <StaggerList className="space-y-4">
          {activityLog.map((entry, index) => {
            const { variant, Icon } = matchEntry(entry.action);

            return (
              <StaggerItem key={entry._id || index} className="border-l-2 border-primary pl-4">
                <p className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {entry.action}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={variant}>{actorLabel(entry)}</Badge>
                  <span className="text-sm text-muted">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerList>
      )}
    </>
  );
}
