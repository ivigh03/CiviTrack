import express from "express";
import {
  getDashboard,
  getStaffPerformance,
  getComplaints,
  updateStatus,
  assignStaff,
  getUsers,
  deleteUser,
  toggleUserBlock,
  updateUserRole,
  getComplaintById,
  deleteComplaint,
  exportComplaintsCSV,
  getNotifications,
  markAllNotificationsRead,
  clearNotifications,
  markNotificationRead,
  updateStaffProfile,
} from "../controllers/adminController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getUsers);

router.get("/dashboard", protect, authorizeRoles("admin"), getDashboard);

router.get("/staff-performance", protect, authorizeRoles("admin"), getStaffPerformance);

router.get(
  "/notifications",
  protect,
  getNotifications
);

router.put(
  "/notifications/read-all",
  protect,
  markAllNotificationsRead
);

router.put(
  "/notifications/:id/read",
  protect,
  markNotificationRead
);

router.delete(
  "/notifications",
  protect,
  clearNotifications
);

router.get("/complaints", protect, authorizeRoles("admin"), getComplaints);

router.put("/complaints/:id", protect, authorizeRoles("admin"), updateStatus);

router.put(
  "/assign/:id",
  protect,
  authorizeRoles("admin"),
  assignStaff
);

router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.put("/users/:id/staff-profile", protect, authorizeRoles("admin"), updateStaffProfile);

router.put("/users/:id/block", protect, authorizeRoles("admin"), toggleUserBlock);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

router.get("/complaints/export", protect, authorizeRoles("admin"), exportComplaintsCSV);

router.delete("/complaints/:id", protect, authorizeRoles("admin"), deleteComplaint);

router.get("/complaints/:id", protect, authorizeRoles("admin"), getComplaintById);

export default router;