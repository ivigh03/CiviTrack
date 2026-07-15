import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, children, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn(
        "relative inline-flex items-center gap-1 rounded-xl bg-elevated p-1",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({ className, value, children, ...props }) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        "relative rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export const TabsContent = TabsPrimitive.Content;
