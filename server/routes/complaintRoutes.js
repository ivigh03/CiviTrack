import express from "express";
import multer from "multer";

import { analyzeComplaintImage, getComplaintLocations } from "../controllers/complaintController.js";

import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO } from "../socket.js";
import { applyEscalation } from "../utils/checkEscalation.js";

const router = express.Router();

/* 📂 MULTER CONFIG */
const storage = multer.diskStorage({
  destination: "uploads/",

  filename: (req, file, cb) => {
    const ext =
      file.originalname
        .split(".")
        .pop();

    cb(
      null,
      Date.now() + "." + ext
    );
  },
});

const upload = multer({
  storage,
});

/* 🧠 AI ANALYZE */
router.post(
  "/analyze",
  protect,
  upload.single("image"),
  analyzeComplaintImage
);

/* 📤 CREATE COMPLAINT */
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {

    try {

      // ✅ DEBUGGING
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      let location = null;

      // ✅ Parse location safely
      if (req.body.location) {

        try {

          location = JSON.parse(
            req.body.location
          );

        } catch (err) {

          return res.status(400).json({
            success: false,
            message:
              "Invalid location format",
          });
        }
      }

      // ✅ Validation
      if (
        !req.body.title ||
        !req.body.address
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Title and address are required",
        });
      }

      // ✅ Create Complaint
      const complaint =
        new Complaint({

          image: req.file
            ? `/uploads/${req.file.filename}`
            : null,

          location,

          address:
            req.body.address,

          title:
            req.body.title,

          // ✅ SAVE USER (trusted from JWT, not client input)
          user:
            req.user._id,

          userDescription:
            req.body
              .userDescription || "",

          category:
            req.body.category ||
            "general",

          severity:
            req.body.severity ||
            "medium",

          slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        });

      await complaint.save();

      // ✅ NOTIFY ADMINS
      const admins = await User.find({ role: "admin" });

      for (const admin of admins) {
        const notification = {
          message: `New complaint at ${complaint.address}`,
          type: "complaint",
          complaint: complaint._id,
          user: admin._id,
        };

        await createNotification(notification);

        getIO()
          .to(admin._id.toString())
          .emit("newNotification", notification);
      }

      res.status(201).json({
        success: true,

        message:
          "Complaint saved successfully",

        data: complaint,
      });

    } catch (error) {

      console.error(
        "CREATE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Error saving complaint",
      });
    }
  }
);

/* 🗺️ COMPLAINT LOCATIONS (heatmap feed) */
router.get("/locations", protect, getComplaintLocations);

/* 📥 GET ALL COMPLAINTS */
router.get("/", protect, async (req, res) => {

  try {

    const escalationCandidates = await Complaint.find({
      escalated: false,
      status: { $in: ["pending", "assigned", "in-progress"] },
    });
    await applyEscalation(escalationCandidates);

    const complaints =
      await Complaint.find()

        // ✅ Populate user
        .populate("user")

        // ✅ Populate assigned staff
        .populate("assignedTo")

        .sort({
          createdAt: -1,
        });

    res.json({
      success: true,
      data: complaints,
    });

  } catch (err) {

    console.error(
      "FETCH ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Error fetching complaints",
    });
  }
});

/* 👍👎 VOTE */
router.put(
  "/:id/vote",
  protect,
  async (req, res) => {

    try {

      const { type } =
        req.body;

      if (type !== "upvote" && type !== "downvote") {
        return res.status(400).json({
          success: false,
          message: "Invalid vote type",
        });
      }

      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            "Complaint not found",
        });
      }

      // ✅ Enforce one vote per user
      const existingVote = complaint.votedUsers.find(
        (v) => v.user.toString() === req.user._id.toString()
      );

      if (!existingVote) {
        if (type === "upvote") complaint.upvotes += 1;
        if (type === "downvote") complaint.downvotes += 1;

        complaint.votedUsers.push({
          user: req.user._id,
          vote: type,
        });
      } else if (existingVote.vote === type) {
        return res.json({
          success: true,
          data: complaint,
          message: "You have already voted on this complaint",
        });
      } else {
        if (existingVote.vote === "upvote") complaint.upvotes -= 1;
        if (existingVote.vote === "downvote") complaint.downvotes -= 1;

        if (type === "upvote") complaint.upvotes += 1;
        if (type === "downvote") complaint.downvotes += 1;

        existingVote.vote = type;
      }

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
  }
);

/* ✅ COMPLETE COMPLAINT */
router.put(
  "/:id/complete",

  protect,
  authorizeRoles("staff"),

  upload.single(
    "proofImage"
  ),

  async (req, res) => {

    try {

      const complaint =
        await Complaint.findById(
          req.params.id
        );

      if (!complaint) {
        return res.status(404).json({
          success: false,
          message:
            "Complaint not found",
        });
      }

      // ✅ Save proof image
      if (req.file) {

        complaint.proofImage =
          `/uploads/${req.file.filename}`;
      }

      // ✅ Staff remark
      complaint.staffRemark =
        req.body.remark || "";

      // ✅ Update status
      complaint.status =
        "resolved";

      // ✅ Resolution timestamp
      complaint.resolvedAt =
        new Date();

      await complaint.save();

      // ✅ NOTIFY ADMINS
      const admins = await User.find({ role: "admin" });

      for (const admin of admins) {
        const notification = {
          message: `Complaint resolved by ${req.user.name}`,
          type: "resolution",
          complaint: complaint._id,
          user: admin._id,
        };

        await createNotification(notification);

        getIO()
          .to(admin._id.toString())
          .emit("newNotification", notification);
      }

      res.json({
        success: true,

        message:
          "Complaint marked resolved",

        data: complaint,
      });

    } catch (err) {

      console.error(
        "COMPLETE ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Error completing complaint",
      });
    }
  }
);

export default router;