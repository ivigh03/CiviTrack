import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import jwt from "jsonwebtoken";

import { setIO } from "./socket.js";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

// 🔥 Load ENV
dotenv.config();

// 🔥 Connect MongoDB
connectDB();

const app = express();

/* ✅ CREATE HTTP SERVER */
const server = http.createServer(app);

/* ✅ ALLOWED CLIENT ORIGINS */
const ALLOWED_ORIGINS = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:5173", "http://localhost:5174"];

/* ✅ SOCKET.IO SETUP */
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

setIO(io);
console.log("✅ Socket.IO initialized");

// ✅ SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log(
    "🔌 User connected:",
    socket.id
  );

  socket.on("join", ({ token } = {}) => {

    if (!token) return;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.join(decoded.id);

      console.log(
        `✅ User joined room ${decoded.id}`
      );
    } catch (err) {
      console.error("SOCKET JOIN ERROR:", err.message);
    }

  });

  socket.on("disconnect", () => {

    console.log(
      "❌ User disconnected"
    );

  });

});

/* 📦 MIDDLEWARE */
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* 📂 STATIC UPLOADS */
app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

/* 📌 ROUTES */
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/complaints",
  complaintRoutes
);

/* 🧪 TEST ROUTE */
app.get("/", (req, res) => {

  res.send(
    "✅ CiviTrack API Running..."
  );

});

/* ❌ GLOBAL ERROR HANDLER */
app.use(
  (err, req, res, next) => {

    console.error(
      "ERROR:",
      err.message
    );

    res.status(
      err.status || 500
    ).json({
      success: false,
      message:
        err.message ||
        "Server Error",
    });

  }
);

/* 🚀 START SERVER */
const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `🚀 Server running on port ${PORT}`
  );

});