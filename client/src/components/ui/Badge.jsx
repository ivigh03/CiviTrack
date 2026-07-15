import { cn } from "../../lib/cn";

const VARIANTS = {
  neutral: "bg-elevated text-foreground",
  primary: "bg-primary/15 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info",
};

export default function Badge({ children, variant = "neutral", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
