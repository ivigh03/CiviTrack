import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

export default function Drawer({
  open,
  onOpenChange,
  side = "left",
  title,
  children,
  className,
  widthClassName = "w-72",
}) {
  const isLeft = side === "left";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-overlay/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ x: isLeft ? "-100%" : "100%" }}
                animate={{ x: 0 }}
                exit={{ x: isLeft ? "-100%" : "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className={cn(
                  "fixed inset-y-0 z-50 flex flex-col bg-surface border-border shadow-elevated focus:outline-none",
                  isLeft ? "left-0 border-r" : "right-0 border-l",
                  widthClassName,
                  "max-w-[85vw]",
                  className
                )}
              >
                {title && (
                  <div className="flex items-center justify-between border-b border-border px-4 py-4">
                    <Dialog.Title className="text-base font-semibold text-foreground">
                      {title}
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-elevated hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
