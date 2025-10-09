import express from "express";
import multer from "multer";
import { analyzeComplaintImage } from "../controllers/complaintController.js";
import Complaint from "../models/Complaint.js"; // 👈 import model

const router = express.Router();

// store images temporarily
const upload = multer({ dest: "uploads/" });

/* 🧠 AI ANALYZE ROUTE */
router.post("/analyze", upload.single("image"), analyzeComplaintImage);

/* 📤 SAVE COMPLAINT ROUTE (THIS WAS MISSING) */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const location = JSON.parse(req.body.location);

    const complaint = new Complaint({
      image: req.file?.path,
      location,
      address: req.body.address,
      title: req.body.title,
      userDescription: req.body.userDescription,
    });

    await complaint.save();

    res.json({
      success: true,
      message: "Complaint saved successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error saving complaint",
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
    });
  }
});

export default router;