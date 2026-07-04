import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";

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
    <div className="notifications">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>🔔 Notifications</h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={markAllRead} disabled={notifications.length === 0}>
            Mark all read
          </button>
          <button onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <AnimatePresence initial={false}>
          {notifications.map((n, i) => (
            <motion.div
              key={n._id}
              layout
              className="notification"
              initial={{ opacity: 0, x: -20, backgroundColor: "rgba(99,102,241,0.25)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(99,102,241,0)" }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              onClick={() => handleClick(n)}
              style={{
                cursor: "pointer",
                fontWeight: n.read ? "normal" : "bold",
              }}
            >
              {n.message}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
