import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    image: String,

    location: {
      lat: Number,
      lng: Number,
    },
    address: String,

    aiDescription: String,
    userDescription: String,
    category: String,
    severity: String,

    // 📌 Priority (NEW 🔥)
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // 🧾 Title (for search/filter)
    title: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👨‍🔧 Assigned Staff (NEW 🔥)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ ADD THIS (CRITICAL)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ PROOF IMAGE (for later)
    proofImage: String,

    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },

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

    status: {
      type: String,
      enum: ["pending", "assigned", "in-progress", "resolved", "rejected"],
      enum: ["pending", "in-progress", "resolved", "rejected","escalated"],
      default: "pending",
    },

    // 🔥 SLA & ESCALATION SYSTEM

    // ⏱ SLA deadline (NEW)
    slaDeadline: Date,

    // ⚠ Escalation flag (NEW)
    escalated: {
      type: Boolean,
      default: false,
    },

    // 📝 Admin remarks (NEW)
    adminRemarks: String,

    // 🕒 Tracking timestamps (NEW)
    startedAt: Date,
    resolvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);