import express from "express";
import {
  getAllJobs,
  createJob,
  applyJob,
  getMyApplications,
} from "../controllers/jobController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public: get all jobs
router.get("/", getAllJobs);

// ✅ Admin only: create a new job
router.post("/", protect, authorize("admin"), createJob);

// ✅ Candidate: apply to a job
router.post("/:id/apply", protect, authorize("candidate"), applyJob);

// ✅ Candidate: view all jobs they applied to
router.get("/my-applications", protect, authorize("candidate"), getMyApplications);

export default router;
