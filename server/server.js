import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import {setIO} from "./socket.js"
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// 🔥 Load env
dotenv.config();

// 🔥 Connect DB
connectDB();

const app = express();

// ✅ CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(app);

// ✅ SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});
setIO(io);
// 🔥 EXPORT io (VERY IMPORTANT)
export { io };

// 📦 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import path from "path";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("✅ CiviTrack API Running...");
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// 🚀 Start Server (IMPORTANT: use server, not app)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});