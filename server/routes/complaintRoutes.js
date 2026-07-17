import express from "express";
import multer from "multer";

import {
  analyzeComplaintImage,
  getComplaintLocations,
  rateComplaint,
  getComplaintDetail,
} from "../controllers/complaintController.js";

import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO } from "../socket.js";
import { applyEscalation } from "../utils/checkEscalation.js";
import { broadcastDashboardUpdate } from "../utils/dashboardSnapshot.js";
import { logActivity } from "../utils/logActivity.js";
import { embedText, EMBEDDING_MODEL_NAME } from "../services/geminiService.js";
import { boundingBox, haversineDistanceKm, cosineSimilarity } from "../utils/similarity.js";

const router = express.Router();

/* 🤖 AI DUPLICATE DETECTION CONFIG */
const DUPLICATE_SEARCH_RADIUS_KM = 0.5;
const DUPLICATE_SIMILARITY_THRESHOLD = 0.85;
const DUPLICATE_CANDIDATE_LIMIT = 25;
const EXCLUDED_STATUSES = ["resolved", "rejected"];

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

/* 🤖 CHECK FOR DUPLICATE COMPLAINTS NEARBY (pre-flight, before create) */
router.post("/check-duplicate", protect, async (req, res) => {
  try {
    const { location, description, category } = req.body;

    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid location is required",
      });
    }

    if (!description || !description.trim()) {
      return res.json({
        success: true,
        data: { isDuplicate: false, candidates: [] },
      });
    }

    const { minLat, maxLat, minLng, maxLng } = boundingBox(
      location.lat,
      location.lng,
      DUPLICATE_SEARCH_RADIUS_KM
    );

    const query = {
      "location.lat": { $gte: minLat, $lte: maxLat },
      "location.lng": { $gte: minLng, $lte: maxLng },
      status: { $nin: EXCLUDED_STATUSES },
    };

    if (category) {
      query.category = category;
    }

    const candidates = await Complaint.find(query).limit(
      DUPLICATE_CANDIDATE_LIMIT
    );

    if (candidates.length === 0) {
      return res.json({
        success: true,
        data: { isDuplicate: false, candidates: [] },
      });
    }

    let newEmbedding;
    try {
      newEmbedding = await embedText(description);
    } catch (err) {
      console.error("Duplicate-check embedding failed:", err.message);
      // Fail open — never block complaint submission on a Gemini outage
      return res.json({
        success: true,
        data: {
          isDuplicate: false,
          candidates: [],
          warning: "duplicate_check_unavailable",
        },
      });
    }

    const scored = [];

    for (const candidate of candidates) {
      let candidateEmbedding = candidate.descriptionEmbedding;
      const candidateText = candidate.userDescription || "";

      if (
        (!candidateEmbedding || candidateEmbedding.length === 0) &&
        candidateText.trim()
      ) {
        try {
          candidateEmbedding = await embedText(candidateText);
          candidate.descriptionEmbedding = candidateEmbedding;
          candidate.embeddingSourceText = candidateText;
          candidate.embeddingModel = EMBEDDING_MODEL_NAME;
          await candidate.save();
        } catch (err) {
          console.error(
            `Backfill embedding failed for complaint ${candidate._id}:`,
            err.message
          );
          continue;
        }
      }

      if (!candidateEmbedding || candidateEmbedding.length === 0) continue;

      const distanceKm = haversineDistanceKm(
        location.lat,
        location.lng,
        candidate.location.lat,
        candidate.location.lng
      );

      if (distanceKm > DUPLICATE_SEARCH_RADIUS_KM) continue;

      const similarity = cosineSimilarity(newEmbedding, candidateEmbedding);

      scored.push({
        _id: candidate._id,
        title: candidate.title,
        address: candidate.address,
        category: candidate.category,
        status: candidate.status,
        upvotes: candidate.upvotes,
        userDescription: candidate.userDescription,
        createdAt: candidate.createdAt,
        distanceKm: Math.round(distanceKm * 1000) / 1000,
        similarity: Math.round(similarity * 1000) / 1000,
      });
    }

    scored.sort((a, b) => b.similarity - a.similarity);

    const bestMatch = scored[0];
    const isDuplicate =
      !!bestMatch && bestMatch.similarity >= DUPLICATE_SIMILARITY_THRESHOLD;

    res.json({
      success: true,
      data: {
        isDuplicate,
        bestMatch: isDuplicate ? bestMatch : null,
        candidates: scored.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("DUPLICATE CHECK ERROR:", error);
    // Fail open at the route level too — never let this pre-flight check
    // hard-block complaint submission on a bug
    res.status(200).json({
      success: true,
      data: { isDuplicate: false, candidates: [], warning: "duplicate_check_error" },
    });
  }
});

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

      logActivity(complaint, {
        action: "Complaint Created",
        performedBy: req.user._id,
      });

      if (req.body.aiSuggested === "true") {
        logActivity(complaint, {
          action: "AI Categorized",
          performedBy: null,
        });
      }

      await complaint.save();

      // 🤖 Cache the embedding for future duplicate-detection candidate
      // scoring. Best-effort: never block/fail complaint creation if
      // Gemini is down.
      if (complaint.userDescription?.trim()) {
        try {
          const embedding = await embedText(complaint.userDescription);
          complaint.descriptionEmbedding = embedding;
          complaint.embeddingSourceText = complaint.userDescription;
          complaint.embeddingModel = EMBEDDING_MODEL_NAME;
          await complaint.save();
        } catch (err) {
          console.error(
            "Embedding computation failed for new complaint:",
            complaint._id,
            err.message
          );
        }
      }

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

      getIO().to("admins").emit("complaint:new", complaint);
      await broadcastDashboardUpdate();

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

/* 📄 GET SINGLE COMPLAINT */
router.get("/:id", protect, getComplaintDetail);

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

      getIO().to("admins").emit("complaint:updated", complaint);

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

/* ⭐ RATE RESOLUTION */
router.put("/:id/rate", protect, rateComplaint);

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

      logActivity(complaint, {
        action: "Resolved",
        performedBy: req.user._id,
      });

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

      getIO().to("admins").emit("complaint:updated", complaint);
      await broadcastDashboardUpdate();

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