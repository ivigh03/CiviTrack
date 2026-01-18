import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // 📷 Original complaint image
    image: String,

    // 📍 Location
    location: {
      lat: Number,
      lng: Number,
    },

    address: String,

    // 🧠 AI + User Data
    aiDescription: String,
    userDescription: String,

    // 🤖 AI Duplicate Detection — cached semantic embedding of userDescription,
    // computed once at creation time and lazily backfilled for older complaints
    // encountered as duplicate-check candidates
    descriptionEmbedding: {
      type: [Number],
      default: undefined,
    },

    // Text that was embedded — lets a future backfill detect staleness if
    // userDescription is ever edited
    embeddingSourceText: {
      type: String,
      default: undefined,
    },

    // Which embedding model produced descriptionEmbedding
    embeddingModel: {
      type: String,
      default: undefined,
    },

    // 📂 Category
    category: String,

    // 🚨 Severity
    severity: String,
    assignmentHistory: [
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      enum: ["assigned", "reassigned"],
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    // 🕘 Generic activity log — one entry per lifecycle event
    activityLog: [
      {
        action: {
          type: String,
          required: true,
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🎯 Priority
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // 🧾 Complaint title
    title: String,

    // 👤 Complaint creator
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👨‍🔧 Assigned staff
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ Staff uploaded proof image
    proofImage: String,

    // ✅ Staff remark after completion
    staffRemark: String,

    // 👍 Voting system
    upvotes: {
      type: Number,
      default: 0,
    },

    downvotes: {
      type: Number,
      default: 0,
    },

    // 👥 Track voted users
    votedUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        vote: {
          type: String,
          enum: ["upvote", "downvote"],
        },
      },
    ],

    // 📌 Complaint status
    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in-progress",
        "resolved",
        "rejected",
        "escalated",
      ],
      default: "pending",
    },

    // ⏱ SLA deadline
    slaDeadline: Date,

    // ⚠ Escalation flag
    escalated: {
      type: Boolean,
      default: false,
    },

    // 📝 Admin remarks
    adminRemarks: String,

    // 🕒 Tracking timestamps
    startedAt: Date,
    resolvedAt: Date,

    // ⭐ Citizen feedback after resolution
    citizenRating: {
      stars: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        default: "",
      },
      ratedAt: Date,
    },
  },
  {
    timestamps: true,
  }
  
);

// Speeds up the bounding-box + status + category prefilter used by
// AI duplicate detection
complaintSchema.index({
  "location.lat": 1,
  "location.lng": 1,
  status: 1,
  category: 1,
});

export default mongoose.model(
  "Complaint",
  complaintSchema
);