import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import socket from "../socket";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // 🔹 initial fetch
  useEffect(() => {
    axios.get("/admin/notifications").then((res) => {
      setNotifications(res.data || []);
    });
  }, []);

  // 🔥 socket listener
  useEffect(() => {
    const handler = (data) => {
      console.log("🔥 GLOBAL RECEIVED:", data);

      setNotifications((prev) => [
        {
          _id: Date.now(),
          message: data.message,
          createdAt: new Date(),
          read: false,
        },
        ...prev,
      ]);
    };

    socket.on("newNotification", handler);

    return () => socket.off("newNotification", handler);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);