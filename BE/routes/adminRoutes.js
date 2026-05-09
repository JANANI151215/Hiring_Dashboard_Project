import express from "express";
import { getStats, getRecentUsers, getCandidates } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Admin-only routes
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/recent-users", protect, authorize("admin"), getRecentUsers);

// ✅ Get all candidates
router.get("/candidates", protect, authorize("admin"), getCandidates);

export default router;
