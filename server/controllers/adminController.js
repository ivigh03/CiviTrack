import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

// 📊 Dashboard
export const getDashboard = async (req, res) => {
  const total = await Complaint.countDocuments();
  const resolved = await Complaint.countDocuments({ status: "RESOLVED" });
  const pending = await Complaint.countDocuments({ status: "OPEN" });
  const escalated = await Complaint.countDocuments({ escalated: true });

  res.json({
    stats: { total, resolved, pending, escalated },
  });
};

// 📋 All complaints
export const getComplaints = async (req, res) => {
  const complaints = await Complaint.find().populate("assignedTo");
  res.json(complaints);
};

// 🔄 Update status
export const updateStatus = async (req, res) => {
  const { status } = req.body;

  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
};

// 👤 Assign staff
export const assignStaff = async (req, res) => {
  const { staffId } = req.body;

  const updated = await Complaint.findByIdAndUpdate(
    req.params.id,
    { assignedTo: staffId },
    { new: true }
  );

  res.json(updated);
};