import Badge from "./Badge";

const STATUS_MAP = {
  pending: "warning",
  assigned: "info",
  "in-progress": "info",
  resolved: "success",
  rejected: "danger",
  escalated: "danger",
};

const SEVERITY_MAP = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const MAPS = {
  status: STATUS_MAP,
  severity: SEVERITY_MAP,
  priority: SEVERITY_MAP,
};

// Semantic wrapper — maps complaint status/severity/priority strings to a
// consistent color across every dashboard, instead of each file hardcoding
// its own status-to-color logic.
export default function StatusBadge({ type = "status", value, className }) {
  if (!value) return null;

  const variant = MAPS[type]?.[value] || "neutral";
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
