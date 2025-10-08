import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import { protect } from "./middlewares/authMiddleware.js";



// 🔐 Load env variables
dotenv.config();

// 🔥 Connect Database
connectDB();

const app = express();

// 🌐 CORS (frontend connection)
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL (Vite)
    credentials: true,
  })
);

// 📦 Middleware
app.use(express.json());

// 📌 Routes
app.use("/api/auth", authRoutes);

// 🧪 Health Check Route
app.get("/", (req, res) => {
  res.send("✅ CiviTrack API Running...");
});

// ❌ Global Error Handler (VERY IMPORTANT)
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