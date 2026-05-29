import express from "express";
import multer from "multer";

import { analyzeComplaintImage } from "../controllers/complaintController.js";

import Complaint from "../models/Complaint.js";

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
  upload.single("image"),
  analyzeComplaintImage
);

/* 📤 CREATE COMPLAINT */
router.post(
  "/",
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

      // ✅ USER CHECK
      if (!req.body.user) {

        return res.status(400).json({
          success: false,
          message:
            "User ID missing",
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

          // ✅ SAVE USER
          user:
            req.body.user,

          userDescription:
            req.body
              .userDescription || "",

          category:
            req.body.category ||
            "general",

          severity:
            req.body.severity ||
            "medium",
        });

      await complaint.save();

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

/* 📥 GET ALL COMPLAINTS */
router.get("/", async (req, res) => {

  try {

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
  async (req, res) => {

    try {

      const { type } =
        req.body;

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

      // ✅ Vote update
      if (type === "upvote") {
        complaint.upvotes += 1;
      }

      if (type === "downvote") {
        complaint.downvotes += 1;
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

/* 🔥 ASSIGN COMPLAINT */
router.put(
  "/:id/assign",
  async (req, res) => {

    try {

      const { staffId } =
        req.body;

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

      // ✅ Assign
      complaint.assignedTo =
        staffId;

      complaint.status =
        "in-progress";

      await complaint.save();

      res.json({
        success: true,
        data: complaint,
      });

    } catch (err) {

      console.error(
        "ASSIGN ERROR:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Assignment failed",
      });
    }
  }
);

/* ✅ COMPLETE COMPLAINT */
router.put(
  "/:id/complete",

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