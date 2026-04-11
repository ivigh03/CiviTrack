import { useEffect, useState } from "react";
import axios from "../../api/axios";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axios.get("/admin/notifications").then((res) => {
      setNotifications(res.data || []);
    });
  };

  // 🔥 REAL-TIME SOCKET (FIXED)
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("🔥 PAGE RECEIVED:", data);

      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          createdAt: new Date(),
          read: false,
          complaint: data.complaint, // 👈 this is string id
        },
        ...prev,
      ]);
    };

    socket.on("newNotification", handleNotification);

    return () => {
      socket.off("newNotification", handleNotification);
    };
  }, []);

  // ✅ Mark as read
  const markAsRead = async (id) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="text-white">

      <h1 className="text-2xl mb-4">🔔 Notifications</h1>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => {
              markAsRead(n._id);

              // ✅ FIXED NAVIGATION
              if (n.complaint) {
                navigate(`/admin/complaints/${n.complaint}`);
              }
            }}
            className={`p-4 rounded-lg shadow cursor-pointer flex justify-between items-center transition ${
              n.read
                ? "bg-[#1e293b]"
                : "bg-[#334155] border-l-4 border-blue-500"
            }`}
          >
            <div>
              <p className="text-sm">{n.message}</p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            {/* STATUS BADGE */}
            {!n.read && (
              <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                NEW
              </span>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Notifications;