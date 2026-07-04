import { io } from "socket.io-client";
import { UPLOADS_BASE_URL } from "./api/axios";

const socket = io(UPLOADS_BASE_URL || "http://localhost:5000", {
  autoConnect: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ SOCKET DISCONNECTED");
});

export const joinNotificationRoom = (token) => {
  if (!token) return;
  socket.emit("join", { token });
};

export default socket;