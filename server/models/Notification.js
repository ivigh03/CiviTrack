import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: String,

    type: {
      type: String,
      enum: ["complaint", "assignment", "resolution", "escalation"],
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);