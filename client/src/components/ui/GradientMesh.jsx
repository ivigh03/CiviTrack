import { cn } from "../../lib/cn";

// Lightweight animated gradient-mesh background — a handful of blurred,
// absolutely-positioned blobs animated via a CSS keyframe (see `animate-blob`
// in tailwind.config.js). No canvas/WebGL, just transforms + blur filters.
export default function GradientMesh({ className }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-[100px] animate-blob" />
      <div
        className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-info/25 blur-[110px] animate-blob"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-success/20 blur-[110px] animate-blob"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
