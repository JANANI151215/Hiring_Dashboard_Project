import express from "express";
import {
  applyForJob,
  getApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  editApplication,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Candidate routes
router.post("/applications/apply/:jobId", protect, applyForJob);
router.put("/applications/edit/:applicationId", protect, editApplication);
router.get("/applications/my", protect, getMyApplications);

// Admin/Recruiter routes
router.get("/applications", protect, getApplications);
router.put("/applications/status/:applicationId", protect, updateApplicationStatus);
router.delete("/applications/:applicationId", protect, deleteApplication);

export default router;
