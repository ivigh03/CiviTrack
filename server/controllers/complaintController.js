import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO } from "../socket.js";
import Notification from "../models/Notification.js";

export const analyzeComplaintImage = async (req, res) => {

  try {

    // ✅ FILE CHECK
    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Image file missing",
      });
    }

    // ✅ USER CHECK
    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const filePath = req.file.path;

    console.log("FILE PATH:", filePath);

    // ✅ AI ANALYSIS
    const aiResult =
      await analyzeImage(filePath);

    // ✅ DELETE TEMP FILE
    fs.unlinkSync(filePath);

    let parsed;

    try {

      const clean = aiResult
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsed = JSON.parse(clean);

      parsed = {
        title:
          parsed.title ||
          parsed.category ||
          "General Issue",

        category:
          parsed.category ||
          "general",

        description:
          parsed.description || "",

        severity:
          parsed.severity ||
          "medium",
      };

    } catch (err) {

      parsed = {
        title: "General Issue",

        category: "general",

        description: aiResult,

        severity: "medium",
      };
    }

    // ✅ CREATE COMPLAINT
    const complaint =
      await Complaint.create({

        title:
          parsed.title,

        category:
          parsed.category,

        userDescription:
          parsed.description,

        severity:
          parsed.severity,

        image:
          `/uploads/${req.file.filename}`,

        address:
          req.body.address || "Unknown Address",

        user:
          req.user._id,

        status:
          "pending",
      });

    // ✅ NOTIFY ADMINS
    const admins =
      await User.find({
        role: "admin",
      });

    for (const admin of admins) {

      const notification = {

        message:
          `New complaint at ${complaint.address}`,

        type:
          "complaint",

        complaint:
          complaint._id,

        user:
          admin._id,
      };

      await createNotification(
        notification
      );

      // ✅ REALTIME SOCKET
      getIO()
        .to(admin._id.toString())
        .emit(
          "newNotification",
          notification
        );
    }

    res.json({

      success: true,

      data: parsed,

      complaint,
    });

  } catch (error) {

    console.error(
      "AI ERROR:",
      error.message
    );

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Image analysis failed",
    });
  }
};