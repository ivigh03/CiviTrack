import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import socket, { joinNotificationRoom } from "../socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  // 🔹 initial fetch (per logged-in user)
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    axios.get("/admin/notifications").then((res) => {
      setNotifications(res.data || []);
    });
  }, [user]);

  // 🔥 join/rejoin the socket room on login and on reconnect (e.g. after refresh)
  useEffect(() => {
    if (!user || !token) return;

    joinNotificationRoom(token);

    const handleConnect = () => joinNotificationRoom(token);
    socket.on("connect", handleConnect);

    return () => socket.off("connect", handleConnect);
  }, [user, token]);

  // 🔥 socket listener
  useEffect(() => {
    const handler = (data) => {
      console.log("🔥 GLOBAL RECEIVED:", data);

      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          type: data.type,
          complaint: data.complaint,
          createdAt: new Date(),
          read: false,
        },
        ...prev,
      ]);
    };

    socket.on("newNotification", handler);

    return () => socket.off("newNotification", handler);
  }, []);

  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await axios.put("/admin/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await axios.delete("/admin/notifications");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        markAsRead,
        markAllRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);