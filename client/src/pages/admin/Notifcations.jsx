import { useEffect, useState } from "react";
import axios from "../../api/axios";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await axios.get("/admin/notifications");

      const data = res.data || [];

      setNotifications(data);

      // Mark all read AFTER fetching
      if (data.length > 0) {
        await axios.put("/admin/notifications/read-all");

        setNotifications(
          data.map((n) => ({
            ...n,
            read: true,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Real-time socket notifications
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("🔥 PAGE RECEIVED:", data);

      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          createdAt: new Date(),
          read: false,
          complaint: data.complaint,
        },
        ...prev,
      ]);
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, []);

  // Mark single notification read
  const markAsRead = async (id) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id
            ? { ...n, read: true }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications read
  const markAllRead = async () => {
    try {
      await axios.put("/admin/notifications/read-all");

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all notifications?"
    );

    if (!confirmed) return;

    try {
      await axios.delete("/admin/notifications");

      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-white">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          🔔 Notifications
        </h1>

        <div className="flex gap-3">

         

          <button
            onClick={clearAll}
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
          notifications.map((n) => (
            <div
              key={n._id}
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
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Notifications;