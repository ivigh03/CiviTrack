import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    image: String,
    location: Object,
    aiDescription: String,
    userDescription: String,
    category: String,
    severity: String, // ✅ NEW FIELD
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);