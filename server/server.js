import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";


// 🔥 Load env
dotenv.config();

// 🔥 Connect DB
connectDB();

const app = express();

// 🌐 CORS (frontend connection)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

// 📦 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes);

// 🧪 Health Check Route
// 🔥 Middlewares


// 🔥 Test route
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

// 🚀 Start Server (ONLY ONCE)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});