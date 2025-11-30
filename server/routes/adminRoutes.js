import express from "express";
import {
  getDashboard,
  getComplaints,
  updateStatus,
  assignStaff,
  getUsers,
  deleteUser,
  updateUserRole,
  getComplaintById,
  getNotifications,
  markAllNotificationsRead,
  clearNotifications,
  markNotificationRead,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", getUsers);

router.get("/dashboard", getDashboard);

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

router.get("/complaints", getComplaints);

router.put("/complaints/:id", updateStatus);

router.put("/assign/:id", assignStaff);

router.put("/users/:id/role", updateUserRole);

router.delete("/users/:id", deleteUser);

router.get("/complaints/:id", getComplaintById);

export default router;