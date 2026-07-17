import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";
import { getIO } from "../socket.js";
import { broadcastDashboardUpdate } from "../utils/dashboardSnapshot.js";
import { logActivity } from "../utils/logActivity.js";
import { haversineDistanceKm } from "../utils/similarity.js";

/* 🤖 SMART AUTO-ASSIGNMENT CONFIG */
const WEIGHTS = { category: 0.4, workload: 0.35, distance: 0.25 };
const MAX_DISTANCE_KM = 20;
const ACTIVE_STATUSES = ["assigned", "in-progress", "escalated"];

// Bridges the AI's free-text complaint category to the staff specialization
// enum — for scoring only, never mutates stored complaint/user data.
export function normalizeCategory(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("pothole") || c.includes("road")) return "road";
  if (c.includes("garbage") || c.includes("trash") || c.includes("waste")) return "garbage";
  if (c.includes("water")) return "water";
  if (c.includes("electric") || c.includes("light")) return "electricity";
  return "general";
}

// Scores every eligible staff member and returns the best staffId, or null
// if no eligible staff exist. Never throws for "no candidates" — only for
// genuine DB errors, which the caller treats as fail-open.
export async function chooseAutoAssignStaff({ complaint }) {
  const staff = await User.find({
    role: "staff",
    isBlocked: false,
    isAvailable: true,
  }).select("_id specialization location");

  if (staff.length === 0) return null;

  const staffIds = staff.map((s) => s._id);

  const workloadAgg = await Complaint.aggregate([
    { $match: { assignedTo: { $in: staffIds }, status: { $in: ACTIVE_STATUSES } } },
    { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
  ]);
  const workloadMap = new Map(workloadAgg.map((w) => [String(w._id), w.count]));

  const workloadCounts = staff.map((s) => workloadMap.get(String(s._id)) || 0);
  const maxWorkload = Math.max(0, ...workloadCounts);

  const normalizedCategory = normalizeCategory(complaint.category);

  let best = null;

  for (const s of staff) {
    const workloadCount = workloadMap.get(String(s._id)) || 0;
    const categoryScore = s.specialization === normalizedCategory ? 1 : 0;
    const workloadScore = maxWorkload === 0 ? 1 : 1 - workloadCount / maxWorkload;

    let distanceScore = 0;
    if (
      complaint.location?.lat != null &&
      complaint.location?.lng != null &&
      s.location?.lat != null &&
      s.location?.lng != null
    ) {
      const distanceKm = haversineDistanceKm(
        complaint.location.lat,
        complaint.location.lng,
        s.location.lat,
        s.location.lng
      );
      distanceScore = Math.max(0, 1 - distanceKm / MAX_DISTANCE_KM);
    }

    const total =
      WEIGHTS.category * categoryScore +
      WEIGHTS.workload * workloadScore +
      WEIGHTS.distance * distanceScore;

    if (!best || total > best.total || (total === best.total && workloadCount < best.workloadCount)) {
      best = { staffId: s._id, total, workloadCount };
    }
  }

  return best?.staffId ?? null;
}

// Shared assign/reassign logic used by both manual admin assignment and
// auto-assignment on complaint creation, so admin override behaves
// identically to auto-assign (just a different assignedBy).
export async function applyAssignment({ complaintId, staffId, assignedBy }) {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    throw new Error("COMPLAINT_NOT_FOUND");
  }

  const action = complaint.assignedTo ? "reassigned" : "assigned";
  const previousStatus = complaint.status;

  const staffUser = await User.findById(staffId).select("name");
  const staffName = staffUser?.name || "staff";

  complaint.assignedTo = staffId;
  complaint.status = "in-progress";

  complaint.assignmentHistory.push({
    assignedTo: staffId,
    assignedBy: assignedBy || null,
    action,
    assignedAt: new Date(),
  });

  logActivity(complaint, {
    action: action === "assigned" ? `Assigned to ${staffName}` : `Reassigned to ${staffName}`,
    performedBy: assignedBy || null,
  });

  if (previousStatus !== "in-progress") {
    logActivity(complaint, {
      action: "Status changed to In Progress",
      performedBy: assignedBy || null,
    });
  }

  await complaint.save();

  await User.findByIdAndUpdate(staffId, {
    $addToSet: { assignedComplaints: complaint._id },
  });

  const populated = await Complaint.findById(complaint._id)
    .populate("assignedTo")
    .populate("assignmentHistory.assignedTo")
    .populate("assignmentHistory.assignedBy")
    .populate("activityLog.performedBy");

  const notification = {
    message: action === "assigned" ? "Complaint assigned to you" : "Complaint reassigned to you",
    type: "assignment",
    complaint: complaint._id,
    user: staffId,
  };

  await createNotification(notification);

  getIO().to(staffId.toString()).emit("newNotification", notification);

  getIO().to("admins").emit("complaint:updated", populated);
  // Keeps a staff member's dashboard live for both auto-assign and
  // manual (re)assignment — mirrors the "admins" broadcast above.
  getIO().to(staffId.toString()).emit("complaint:updated", populated);

  await broadcastDashboardUpdate();

  return populated;
}
