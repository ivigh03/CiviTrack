import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"; 
dotenv.config();

import complaintRoutes from "./routes/complaintRoutes.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/complaints", complaintRoutes);

// Server
const PORT = process.env.PORT || 5000; // ✅ slight improvement
app.listen(PORT, () => console.log(`Server running on ${PORT}`));