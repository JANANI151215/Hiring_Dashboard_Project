import express from "express";
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getAnalytics,
} from "../controllers/interviewController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📊 Analytics route — admin & recruiter
router.get("/analytics", protect, authorize("admin", "recruiter"), getAnalytics);

// 👇 Order matters: define analytics before :id routes
router.get("/", protect, authorize("admin", "interviewer", "recruiter"), getInterviews);
router.get("/:id", protect, authorize("admin", "interviewer", "recruiter"), getInterviewById);

// 🆕 Create — Admin & Recruiter
router.post("/", protect, authorize("admin", "recruiter"), createInterview);

// ✏️ Update — Admin only
router.patch("/:id", protect, authorize("admin"), updateInterview);

// ❌ Delete — Admin only
router.delete("/:id", protect, authorize("admin"), deleteInterview);

export default router;
