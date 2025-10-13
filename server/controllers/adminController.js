import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";
export const getNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("complaint");

    res.json(notifications);

  } catch (err) {
    console.error("NOTIFICATION ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




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
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
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

  try {
    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("assignedTo");

    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // 🔥 WHEN RESOLVED
    if (status === "resolved") {
      const admins = await User.find({ role: "admin" });

      if (admins && admins.length > 0) {
        for (const admin of admins) {
          if (!admin) continue;

          const notification = {
            message: `Complaint resolved by ${
              updated.assignedTo?.name || "staff"
            }`,
            type: "resolution",
            complaint: updated._id,
            user: admin._id,
          };

          await createNotification(notification);
          getIO().emit("newNotification", notification);
        }
      }
    }

    res.json(updated);

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 👤 Assign staff
export const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    console.log("ASSIGN API HIT");
    console.log("Staff ID:", staffId);
    if (!staffId) {
      return res.status(400).json({ message: "Staff ID required" });
    }

   const updated = await Complaint.findByIdAndUpdate(
  req.params.id,
  { assignedTo: staffId, status: "in-progress" },
  { returnDocument: "after" }
);

const populated = await Complaint.findById(updated._id)
  .populate("assignedTo");


    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const notification = {
      message: `Complaint assigned to you`,
      type: "assignment",
      complaint: updated._id,
      user: staffId,
    };

    await createNotification(notification);
    console.log("🚀 EMITTING:", notification);
    getIO().emit("newNotification", notification);
    console.log("Notification created");
    res.json(populated);

  } catch (err) {
    console.error("ASSIGN STAFF ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        let complaintsCount = 0;

        if (user.role === "citizen") {
          complaintsCount = await Complaint.countDocuments({
            user: user._id,
          });
        }

        if (user.role === "staff") {
          complaintsCount = await Complaint.countDocuments({
            assignedTo: user._id,
            status: "resolved",
          });
        }

        return {
          ...user.toObject(),
          complaintsCount,
        };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user")
      .populate("assignedTo");

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};