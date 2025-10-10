import Complaint from "../models/Complaint.js";
import User from "../models/User.js";



export const getDashboard = async (req, res) => {
  try {
    // ✅ Stats
    const total = await Complaint.countDocuments();

    const resolved = await Complaint.countDocuments({ status: "resolved" });

    const pending = await Complaint.countDocuments({
      status: { $in: ["pending", "in-progress"] },
    });

    const escalated = await Complaint.countDocuments({
      escalated: true,
    });

    // ✅ CATEGORY CHART (real)
    const categoryData = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const category = categoryData.map((c) => ({
      name: c._id || "Other",
      count: c.count,
    }));

    // ✅ TIMELINE CHART (last 7 days)
    const timelineData = await Complaint.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%a", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const timeline = timelineData.map((t) => ({
      date: t._id,
      count: t.count,
    }));

    res.json({
      stats: { total, resolved, pending, escalated },
      charts: { category, timeline },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};