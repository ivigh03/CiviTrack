import User from "../models/User.js";
import { createNotification } from "./createNotification.js";
import { getIO } from "../socket.js";
import { broadcastDashboardUpdate } from "./dashboardSnapshot.js";

const ACTIVE_STATUSES = ["pending", "assigned", "in-progress"];

export const applyEscalation = async (complaints) => {
  const now = new Date();

  const toEscalate = complaints.filter(
    (c) =>
      !c.escalated &&
      ACTIVE_STATUSES.includes(c.status) &&
      c.slaDeadline &&
      now > new Date(c.slaDeadline)
  );

  if (toEscalate.length === 0) return;

  const admins = await User.find({ role: "admin" });

  for (const complaint of toEscalate) {
    complaint.escalated = true;
    await complaint.save();

    for (const admin of admins) {
      const notification = {
        message: `Complaint "${complaint.title}" escalated (SLA breached)`,
        type: "escalation",
        complaint: complaint._id,
        user: admin._id,
      };

      await createNotification(notification);

      getIO()
        .to(admin._id.toString())
        .emit("newNotification", notification);
    }

    getIO().to("admins").emit("complaint:updated", complaint);
  }

  await broadcastDashboardUpdate();
};
