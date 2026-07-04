import { cn } from "../../lib/cn";

export default function Card({
  className,
  variant = "solid",
  padding = "md",
  children,
  ...props
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border shadow-card",
        variant === "glass" ? "glass" : "bg-surface",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
