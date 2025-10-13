import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// 🔐 Load env variables
dotenv.config();

// 🔥 Connect Database (ONLY ONCE)
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
import path from "path";

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// 🧪 Health Check Route
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