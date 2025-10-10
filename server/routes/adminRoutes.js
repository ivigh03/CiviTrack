import express from "express";
import {
  getDashboard,
  getComplaints,
  updateStatus,
  assignStaff,
  getUsers,
} from "../controllers/adminController.js";

const router = express.Router();
router.get("/users", getUsers);
router.get("/dashboard", getDashboard);
router.get("/complaints", getComplaints);
router.put("/complaints/:id", updateStatus);
router.put("/assign/:id", assignStaff);

export default router;