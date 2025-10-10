import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// 🔥 Load env
dotenv.config();

// 🔥 Connect DB
connectDB();

const app = express();

// 🌐 CORS (frontend connection)
app.use(
  cors({
    origin: "http://localhost:5173",
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

// 🚀 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});