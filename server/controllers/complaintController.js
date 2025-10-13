import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";
import Complaint from "../models/complaint.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import { io } from "../server.js";
import Notification from "../models/Notification.js";

export const analyzeComplaintImage = async (req, res) => {
  try {
    const filePath = req.file.path;

    const aiResult = await analyzeImage(filePath);

    fs.unlinkSync(filePath);

    let parsed;

    try {
      const clean = aiResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(clean);

      parsed = {
        title: parsed.title || parsed.category || "General Issue",
        category: parsed.category || "general",
        description: parsed.description || "",
        severity: parsed.severity || "medium",
      };
    } catch (err) {
      parsed = {
        title: "General Issue",
        category: "general",
        description: aiResult,
        severity: "medium",
      };
    }

    // 🚀 CREATE COMPLAINT (IMPORTANT)
    const complaint = await Complaint.create({
      title: parsed.title,
      category: parsed.category,
      userDescription: parsed.description,
      severity: parsed.severity,
      image: req.file?.path || "", // optional
      address: req.body.address,
      user: req.user?._id || null,
      status: "pending",
    });

    // 🔥 NOTIFY ADMINS
    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      const notification = {
        message: `New complaint at ${complaint.address}`,
        type: "complaint",
        complaint: complaint._id,
        user: admin._id,
      };

      await createNotification(notification);

      // 🔥 REAL-TIME SOCKET
      io.emit("newNotification", notification);
    }

    res.json({
      success: true,
      data: parsed,
      complaint,
    });

  } catch (error) {
    console.error("AI ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Image analysis failed",
    });
  }
};