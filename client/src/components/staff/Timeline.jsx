import { cn } from "../../lib/cn";

export default function Timeline({ status }) {
  const steps = ["assigned", "in-progress", "completed"];

  return (
    <div className="my-2 flex gap-2">
      {steps.map((step, i) => (
        <span
          key={i}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium capitalize",
            steps.indexOf(status) >= i
              ? "bg-primary text-primary-foreground"
              : "bg-elevated text-muted"
          )}
        >
          {step}
        </span>
      ))}
    </div>
  );
}
