import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function Notifications() {
  const { notifications, markAsRead, markAllRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (n) => {
    markAsRead(n._id);

    if (n.complaint) {
      const complaintId =
        typeof n.complaint === "object" ? n.complaint._id : n.complaint;
      navigate(`/complaint/${complaintId}`);
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={markAllRead} disabled={notifications.length === 0}>
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={BellOff} title="No new notifications" description="You're all caught up." />
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => handleClick(n)}
              >
                <Card
                  padding="sm"
                  className={`flex cursor-pointer items-center gap-3 transition-colors hover:border-primary/40 ${
                    !n.read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <Bell className={`h-4 w-4 shrink-0 ${n.read ? "text-muted" : "text-primary"}`} />
                  <p className={`text-sm ${n.read ? "text-muted" : "font-medium text-foreground"}`}>
                    {n.message}
                  </p>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
