import express from "express";
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";

const router = express.Router();

// ✅ CRUD routes for candidates
// Create a new candidate
router.post("/", createCandidate);

// Get all candidates
router.get("/", getCandidates);

// Get candidate by ID
router.get("/:id", getCandidateById);

// Update candidate by ID
router.put("/:id", updateCandidate);

// Delete candidate by ID
router.delete("/:id", deleteCandidate);

export default router;
