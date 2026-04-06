import express from "express";
import multer from "multer";
import { analyzeComplaintImage } from "../controllers/complaintController.js";

const router = express.Router();

// store images temporarily
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("image"), analyzeComplaintImage);

export default router;