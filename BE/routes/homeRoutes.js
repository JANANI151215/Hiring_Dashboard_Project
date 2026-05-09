import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUpcomingInterviews,
  getRecentHires,
  getTopCandidates
} from "../controllers/homeController.js";

const router = express.Router();

// Upcoming interviews
router.get("/interviews/upcoming", verifyToken, getUpcomingInterviews);

// Recent hires
router.get("/candidates/hired", verifyToken, getRecentHires);

// Top candidates (paginated)
router.get("/candidates/top", verifyToken, getTopCandidates);

export default router;
