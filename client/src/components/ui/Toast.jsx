import { Toaster } from "sonner";

// Mounted once at the app root. Use `import { toast } from "sonner"` anywhere
// to fire a toast — it will pick up this theming automatically.
export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{
        style: {
          background: "rgb(var(--color-surface))",
          color: "rgb(var(--color-foreground))",
          border: "1px solid rgb(var(--color-border) / var(--border-opacity))",
          borderRadius: "0.875rem",
        },
      }}
    />
  );
}
