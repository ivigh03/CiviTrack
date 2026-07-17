import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";
import { applyEscalation } from "../utils/checkEscalation.js";
import { getDashboardSnapshot, broadcastDashboardUpdate } from "../utils/dashboardSnapshot.js";
import { logActivity } from "../utils/logActivity.js";
import { applyAssignment } from "../services/assignmentService.js";

const formatStatusLabel = (status) =>
  status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
    // ⚠ Escalate any overdue complaints before computing stats
    const candidates = await Complaint.find({
      escalated: false,
      status: { $in: ["pending", "assigned", "in-progress"] },
    });
    await applyEscalation(candidates);

    const snapshot = await getDashboardSnapshot();

    res.json(snapshot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 All complaints
export const getComplaints = async (req, res) => {
  const candidates = await Complaint.find({
    escalated: false,
    status: { $in: ["pending", "assigned", "in-progress"] },
  });
  await applyEscalation(candidates);

  const complaints = await Complaint.find().populate("assignedTo");
  res.json(complaints);
};

// 🔄 Update status
export const updateStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }
    logActivity(complaint, {
      action: `Status changed to ${formatStatusLabel(status)}`,
      performedBy: req.user._id,
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate("assignedTo")
      .populate("activityLog.performedBy");

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
          getIO()
  .to(admin._id.toString())
  .emit("newNotification", notification);
        }
      }
    }

    getIO().to("admins").emit("complaint:updated", updated);
    await broadcastDashboardUpdate();

    res.json(updated);

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        read: false,
      },
      {
        read: true,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
export const markNotificationRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          read: true,
        },
        {
          new: true,
        }
      );

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// 👤 Assign staff
export const assignStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        message: "Staff ID required",
      });
    }

    const populated = await applyAssignment({
      complaintId: req.params.id,
      staffId,
      assignedBy: req.user?._id || null,
    });

    res.json(populated);

  } catch (err) {
    if (err.message === "COMPLAINT_NOT_FOUND") {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    console.error("========== ASSIGN STAFF ERROR ==========");
    console.error(err);
    console.error(err.stack);
    console.error("=======================================");

    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
};

// 🧑‍🔧 Update a staff member's auto-assignment profile (specialization,
// location, availability) — used by the admin UserModal
export const updateStaffProfile = async (req, res) => {
  try {
    const { specialization, location, isAvailable } = req.body;

    const update = {};
    if (specialization !== undefined) update.specialization = specialization;
    if (location !== undefined) update.location = location;
    if (isAvailable !== undefined) update.isAvailable = isAvailable;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
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
// 📊 Per-staff performance metrics + org-wide monthly resolved trend
export const getStaffPerformance = async (req, res) => {
  try {
    const staffList = await User.find({ role: "staff" }).select("name specialization");

    const resolutionAgg = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null }, status: "resolved", resolvedAt: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          avgResolutionMs: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } },
          totalResolved: { $sum: 1 },
        },
      },
    ]);

    const pendingAgg = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null }, status: "in-progress" } },
      { $group: { _id: "$assignedTo", pending: { $sum: 1 } } },
    ]);

    const escalatedAgg = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null }, escalated: true } },
      { $group: { _id: "$assignedTo", escalated: { $sum: 1 } } },
    ]);

    const ratingAgg = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null }, "citizenRating.stars": { $exists: true } } },
      { $group: { _id: "$assignedTo", avgRating: { $avg: "$citizenRating.stars" } } },
    ]);

    const totalAssignedAgg = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", totalAssigned: { $sum: 1 } } },
    ]);

    const toMap = (agg) => new Map(agg.map((row) => [row._id.toString(), row]));
    const resolutionMap = toMap(resolutionAgg);
    const pendingMap = toMap(pendingAgg);
    const escalatedMap = toMap(escalatedAgg);
    const ratingMap = toMap(ratingAgg);
    const totalAssignedMap = toMap(totalAssignedAgg);

    const staff = staffList.map((user) => {
      const id = user._id.toString();
      const resolution = resolutionMap.get(id);
      const totalResolved = resolution?.totalResolved || 0;
      const totalAssigned = totalAssignedMap.get(id)?.totalAssigned || 0;

      return {
        staffId: user._id,
        name: user.name,
        specialization: user.specialization,
        avgResolutionTimeHours: resolution
          ? Math.round((resolution.avgResolutionMs / (1000 * 60 * 60)) * 10) / 10
          : null,
        totalResolved,
        pending: pendingMap.get(id)?.pending || 0,
        escalated: escalatedMap.get(id)?.escalated || 0,
        avgRating: ratingMap.has(id) ? Math.round(ratingMap.get(id).avgRating * 10) / 10 : null,
        completionPercent: totalAssigned > 0 ? Math.round((totalResolved / totalAssigned) * 100) : null,
      };
    });

    const now = new Date();
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

    const monthlyAgg = await Complaint.aggregate([
      { $match: { status: "resolved", resolvedAt: { $gte: sixMonthsAgo, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$resolvedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const countsByMonth = Object.fromEntries(monthlyAgg.map((m) => [m._id, m.count]));

    const monthlyTrend = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(Date.UTC(sixMonthsAgo.getUTCFullYear(), sixMonthsAgo.getUTCMonth() + i, 1));
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      monthlyTrend.push({ month: key, count: countsByMonth[key] || 0 });
    }

    res.json({ staff, monthlyTrend });
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
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const exportComplaintsCSV = async (req, res) => {
  try {
    const { Parser } = await import("json2csv");
    const complaints = await Complaint.find().lean();

    const parser = new Parser();
    const csv = parser.parse(complaints);

    res.header("Content-Type", "text/csv");
    res.attachment("complaints.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user")
      .populate("assignedTo")
      .populate("assignmentHistory.assignedTo")
      .populate("assignmentHistory.assignedBy")
      .populate("activityLog.performedBy");

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};