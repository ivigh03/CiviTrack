import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

const Notifications = () => {
  const { notifications, markAsRead, markAllRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  const handleClear = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    clearAll();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h1>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={markAllRead} disabled={notifications.length === 0}>
            Mark all read
          </Button>
          <Button variant="danger" size="sm" onClick={handleClear} disabled={notifications.length === 0}>
            Clear All
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="No notifications available" description="You're all caught up." />
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => {
                  markAsRead(n._id);

                  if (n.complaint) {
                    const complaintId =
                      typeof n.complaint === "object" ? n.complaint._id : n.complaint;

                    navigate(`/admin/complaints/${complaintId}`);
                  }
                }}
              >
                <Card
                  padding="sm"
                  className={`flex cursor-pointer items-center justify-between gap-3 transition-colors hover:border-primary/40 ${
                    !n.read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <div>
                    <p className={`text-sm ${n.read ? "text-muted" : "font-medium text-foreground"}`}>
                      {n.message}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!n.read && (
                    <span className="shrink-0 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                      NEW
                    </span>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
