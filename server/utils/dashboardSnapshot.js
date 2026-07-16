import Complaint from "../models/Complaint.js";
import User from "../models/User.js";
import { getIO } from "../socket.js";

// ✅ Stats + chart aggregation, shared by the REST endpoint and every
// live broadcast so both can never drift out of sync with the DB.
export const getDashboardSnapshot = async () => {
  const total = await Complaint.countDocuments();

  const resolved = await Complaint.countDocuments({ status: "resolved" });

  const pending = await Complaint.countDocuments({
    status: { $in: ["pending", "in-progress"] },
  });

  const escalated = await Complaint.countDocuments({
    escalated: true,
  });

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

  // Note: $dateToString defaults to UTC day boundaries, so all date math
  // here uses UTC methods to stay consistent with the aggregation below —
  // mixing in local-time Date methods causes an off-by-one on non-UTC servers.
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const sevenDaysAgo = new Date(todayUTC);
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);

  const timelineData = await Complaint.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const countsByDate = Object.fromEntries(
    timelineData.map((t) => [t._id, t.count])
  );

  const timeline = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(sevenDaysAgo);
    day.setUTCDate(day.getUTCDate() + i);
    const key = day.toISOString().slice(0, 10);
    timeline.push({ date: key, count: countsByDate[key] || 0 });
  }

  const ratingAgg = await Complaint.aggregate([
    { $match: { "citizenRating.stars": { $exists: true } } },
    { $group: { _id: null, avgRating: { $avg: "$citizenRating.stars" }, count: { $sum: 1 } } },
  ]);

  const avgRating = ratingAgg[0] ? Math.round(ratingAgg[0].avgRating * 10) / 10 : null;
  const ratedCount = ratingAgg[0]?.count ?? 0;

  const staffRatingAgg = await Complaint.aggregate([
    { $match: { "citizenRating.stars": { $exists: true }, assignedTo: { $ne: null } } },
    { $group: { _id: "$assignedTo", avgStars: { $avg: "$citizenRating.stars" }, count: { $sum: 1 } } },
    { $sort: { avgStars: -1 } },
  ]);

  let topRatedStaff = null;
  let worstRatedStaff = null;

  if (staffRatingAgg.length > 0) {
    const top = staffRatingAgg[0];
    const worst = staffRatingAgg[staffRatingAgg.length - 1];

    const [topUser, worstUser] = await Promise.all([
      User.findById(top._id).select("name"),
      User.findById(worst._id).select("name"),
    ]);

    topRatedStaff = {
      staffId: top._id,
      name: topUser?.name || "Unknown",
      avgRating: Math.round(top.avgStars * 10) / 10,
      ratingCount: top.count,
    };

    worstRatedStaff = staffRatingAgg.length > 1
      ? {
          staffId: worst._id,
          name: worstUser?.name || "Unknown",
          avgRating: Math.round(worst.avgStars * 10) / 10,
          ratingCount: worst.count,
        }
      : null;
  }

  return {
    stats: { total, resolved, pending, escalated, avgRating, avgResolutionQuality: avgRating, ratedCount },
    charts: { category, timeline },
    topRatedStaff,
    worstRatedStaff,
  };
};

// ✅ Push a fresh snapshot to every connected admin. Never throws —
// a broadcast failure must not break the mutation that triggered it.
export const broadcastDashboardUpdate = async () => {
  try {
    const snapshot = await getDashboardSnapshot();
    getIO().to("admins").emit("dashboard:update", snapshot);
  } catch (err) {
    console.error("DASHBOARD BROADCAST ERROR:", err.message);
  }
};
