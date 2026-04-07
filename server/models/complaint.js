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

    // 🧾 Title (for search/filter)
    title: String,

    // 👤 User who posted
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes you’ll have a User model
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

    // (optional but better) track who voted
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
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);