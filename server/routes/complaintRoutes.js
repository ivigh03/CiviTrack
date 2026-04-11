import express from "express";
import multer from "multer";
import { analyzeComplaintImage } from "../controllers/complaintController.js";
import Complaint from "../models/complaint.js";

const router = express.Router();

// 📂 Multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext); // ✅ keeps extension
  },
});

const upload = multer({ storage });
/* 🧠 AI ANALYZE ROUTE */
router.post("/analyze", upload.single("image"), analyzeComplaintImage);

/* 📤 CREATE COMPLAINT */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // 🔥 SAFE LOCATION PARSE (FIXED)
    let location = null;

    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch (err) {
        console.error("Invalid location JSON");
        return res.status(400).json({
          success: false,
          message: "Invalid location format",
        });
      }
    }

    // 🔥 VALIDATION (IMPORTANT)
    if (!req.body.title || !req.body.address) {
      return res.status(400).json({
        success: false,
        message: "Title and address are required",
      });
    }

    // 📦 CREATE COMPLAINT
    const complaint = new Complaint({
      image: req.file ? `/uploads/${req.file.filename}` : null, // ✅ FIXED PATH
      location,
      address: req.body.address,
      title: req.body.title,
      userDescription: req.body.userDescription || "",
      category: req.body.category || "general",
      severity: req.body.severity || "medium",
    });

    await complaint.save();

    res.status(201).json({
      success: true,
      message: "Complaint saved successfully",
      data: complaint, // ✅ return created complaint
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error saving complaint",
    });
  }
});

/* 📥 GET ALL COMPLAINTS */
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("assignedTo") // ✅ ADD THIS

      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: complaints,
    });

  } catch (err) {
    console.error("FETCH ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Error fetching complaints",
    });
  }
});

// 👍👎 VOTE
router.put("/:id/vote", async (req, res) => {
  try {
    const { type } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (type === "upvote") complaint.upvotes += 1;
    if (type === "downvote") complaint.downvotes += 1;

    await complaint.save();

    res.json({
      success: true,
      data: complaint,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 🔥 ASSIGN COMPLAINT
router.put("/:id/assign", async (req, res) => {
  try {
    const { staffId } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    complaint.assignedTo = staffId;
    complaint.status = "assigned";

    await complaint.save();

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;