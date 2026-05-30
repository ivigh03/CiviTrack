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
  },
  {
    timestamps: true,
  }
  
);

export default mongoose.model(
  "Complaint",
  complaintSchema
);