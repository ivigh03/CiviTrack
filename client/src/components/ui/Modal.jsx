import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import { modalOverlay, modalContent } from "../../lib/motion";

export default function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  showClose = true,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-overlay/70 backdrop-blur-sm"
                variants={modalOverlay}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                variants={modalContent}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-elevated focus:outline-none",
                  className
                )}
              >
                {(title || showClose) && (
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      {title && (
                        <Dialog.Title className="text-lg font-semibold text-foreground">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-muted">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>

                    {showClose && (
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          aria-label="Close"
                          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-elevated hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Dialog.Close>
                    )}
                  </div>
                )}

                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
