import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
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

    // 👤 User who posted
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👨‍🔧 Assigned Staff (NEW 🔥)
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 👍 Voting system
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },

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

    // 📌 Status tracking
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
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