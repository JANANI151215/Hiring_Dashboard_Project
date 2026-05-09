import express from "express";
import {
  getDashboardStats,
  getJobNames,
  getCandidateNames,
  getHiredCandidates,
  getTopCandidates,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/jobs", getJobNames);
router.get("/candidates", getCandidateNames);
router.get("/hired", getHiredCandidates);
router.get("/top", getTopCandidates); // ✅ Added

export default router;
