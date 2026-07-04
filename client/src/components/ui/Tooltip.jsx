import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/cn";

export function TooltipProvider({ children }) {
  return <TooltipPrimitive.Provider delayDuration={200}>{children}</TooltipPrimitive.Provider>;
}

export default function Tooltip({ content, children, side = "top", className }) {
  if (!content) return children;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            "z-[60] rounded-lg bg-elevated px-2.5 py-1.5 text-xs font-medium text-foreground shadow-elevated border border-border animate-fade-in",
            className
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-elevated" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
