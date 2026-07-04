import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";
import Complaint from "../models/Complaint.js";

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

    // ✅ Return the AI suggestion only — the real Complaint document is
    // created later by the actual submit (POST /api/complaints), not here.
    res.json({

      success: true,

      data: parsed,
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

// 🗺️ Lightweight lat/lng feed for heatmaps
export const getComplaintLocations = async (req, res) => {
  try {
    const complaints = await Complaint.find({}, "location severity status");

    const data = complaints
      .filter(
        (c) =>
          c.location &&
          typeof c.location.lat === "number" &&
          typeof c.location.lng === "number"
      )
      .map((c) => ({
        lat: c.location.lat,
        lng: c.location.lng,
        severity: c.severity,
      }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};