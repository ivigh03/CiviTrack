import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";

const Notifications = () => {
  const { notifications, markAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  const handleClear = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    clearAll();
  };

  return (
    <div className="text-white">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          🔔 Notifications
        </h1>

        <div className="flex gap-3">

          <button
            onClick={handleClear}
            disabled={notifications.length === 0}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              notifications.length === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            🗑 Clear All
          </button>

        </div>
      </div>

      <div className="space-y-3">

        {notifications.length === 0 ? (
          <div className="bg-[#1e293b] rounded-xl p-10 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-400 text-lg">
              No notifications available
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                layout
                initial={{ opacity: 0, x: -20, backgroundColor: "rgba(59,130,246,0.35)" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                onClick={() => {
                  markAsRead(n._id);

                  if (n.complaint) {
                    const complaintId =
                      typeof n.complaint === "object"
                        ? n.complaint._id
                        : n.complaint;

                    navigate(
                      `/admin/complaints/${complaintId}`
                    );
                  }
                }}
                className={`p-4 rounded-lg shadow cursor-pointer flex justify-between items-center transition ${
                  n.read
                    ? "bg-[#1e293b]"
                    : "bg-[#334155] border-l-4 border-blue-500"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    {n.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(
                      n.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                {!n.read && (
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                    NEW
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

      </div>
    </div>
  );
};

export default Notifications;
