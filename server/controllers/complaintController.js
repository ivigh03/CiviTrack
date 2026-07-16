import { analyzeImage } from "../services/geminiService.js";
import fs from "fs";
import Complaint from "../models/Complaint.js";
import { logActivity } from "../utils/logActivity.js";

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

// ⭐ Citizen rates a resolved complaint
export const rateComplaint = async (req, res) => {
  try {
    const { stars, comment } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only rate your own complaints",
      });
    }

    if (complaint.status !== "resolved") {
      return res.status(400).json({
        success: false,
        message: "Complaint must be resolved before rating",
      });
    }

    if (complaint.citizenRating?.stars) {
      return res.status(400).json({ success: false, message: "Complaint already rated" });
    }

    const numStars = Number(stars);

    if (!Number.isInteger(numStars) || numStars < 1 || numStars > 5) {
      return res.status(400).json({
        success: false,
        message: "Stars must be an integer between 1 and 5",
      });
    }

    complaint.citizenRating = {
      stars: numStars,
      comment: comment || "",
      ratedAt: new Date(),
    };

    logActivity(complaint, {
      action: `Citizen Rated Resolution (${numStars}★)`,
      performedBy: req.user._id,
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("user")
      .populate("assignedTo")
      .populate("activityLog.performedBy");

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Single complaint fetch (citizen/staff/admin — same visibility as the list endpoint)
export const getComplaintDetail = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user")
      .populate("assignedTo")
      .populate("assignmentHistory.assignedTo")
      .populate("assignmentHistory.assignedBy")
      .populate("activityLog.performedBy");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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