import Candidate from "../models/candidate.js";
import User from "../models/user.js"; // ✅ Added for validation

// Helper to convert string to sentence case
function toSentenceCase(str) {
  if (!str) return "Applied"; // default status
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ✅ Create a new candidate
export const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, role, appliedJob, status, score } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if candidate already exists in Candidates collection
    const exists = await Candidate.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Candidate already exists" });
    }

    // ✅ Updated validation — check by email OR name (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { fullName: { $regex: `^${name.trim()}$`, $options: "i" } },
      ],
      role: "candidate",
    });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist in Users collection or is not a candidate",
      });
    }

    // Normalize status
    const normalizedStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : "Applied";

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      role,
      appliedJob,
      status: normalizedStatus,
      score,
    });

    res.status(201).json(candidate);
  } catch (err) {
    console.error("❌ Error creating candidate:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all candidates
export const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().populate("appliedJob", "title");
    res.status(200).json(candidates);
  } catch (err) {
    console.error("❌ Error fetching candidates:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get candidate by ID
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate("appliedJob", "title");
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (err) {
    console.error("❌ Error fetching candidate by ID:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update candidate
export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const { name, email, phone, role, appliedJob, status, score } = req.body;

    // Case-insensitive check in Users collection when updating name
    if (name) {
      const user = await User.findOne({
        fullName: { $regex: `^${name.trim()}$`, $options: "i" },
        role: "candidate",
      });
      if (!user) {
        return res.status(400).json({ message: "User does not exist or is not a candidate" });
      }
    }

    candidate.name = name || candidate.name;
    candidate.email = email || candidate.email;
    candidate.phone = phone || candidate.phone;
    candidate.role = role || candidate.role;
    candidate.appliedJob = appliedJob || candidate.appliedJob;
    candidate.status = status ? toSentenceCase(status) : candidate.status;
    candidate.score = score !== undefined ? score : candidate.score;

    const updatedCandidate = await candidate.save();
    res.status(200).json(updatedCandidate);
  } catch (err) {
    console.error("❌ Error updating candidate:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete candidate
export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting candidate:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
