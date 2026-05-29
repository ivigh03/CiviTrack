import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ SOCKET DISCONNECTED");
});

export default socket;