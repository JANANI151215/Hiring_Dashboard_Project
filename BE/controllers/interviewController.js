import Interview from "../models/interview.js";
import User from "../models/user.js";

// Helper to check if user exists
const userExists = async (fullName, role) => {
  const user = await User.findOne({ fullName, role });
  return !!user;
};

// CREATE
export const createInterview = async (req, res) => {
  try {
    const {
      candidateName,
      interviewerName,
      companyName,
      jobTitle,
      interviewDate,
      interviewType,
      status,
      feedback,
    } = req.body;

    if (
      !candidateName ||
      !interviewerName ||
      !companyName ||
      !jobTitle ||
      !interviewDate ||
      !interviewType ||
      !status
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    if (!(await userExists(candidateName, "candidate")))
      return res.status(400).json({ error: "Candidate does not exist" });
    if (!(await userExists(interviewerName, "interviewer")))
      return res.status(400).json({ error: "Interviewer does not exist" });

    const newInterview = new Interview({
      candidateName,
      interviewerName,
      companyName,
      jobTitle,
      interviewDate,
      interviewType,
      status,
      feedback: feedback || "N/A",
    });

    const saved = await newInterview.save();
    return res.status(200).json(saved);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// READ ALL
export const getInterviews = async (req, res) => {
  try {
    let interviews;

    if (req.user?.role === "admin" || req.user?.role === "recruiter") {
      interviews = await Interview.find().sort({ interviewDate: 1 });
    } else if (req.user?.role === "candidate") {
      interviews = await Interview.find({ candidateName: req.user.fullName }).sort({ interviewDate: 1 });
    } else if (req.user?.role === "interviewer") {
      interviews = await Interview.find({ interviewerName: req.user.fullName }).sort({ interviewDate: 1 });
    } else {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const now = new Date();

    // ✅ Ensure each interview reflects real-time status
    const updatedInterviews = await Promise.all(
      interviews.map(async (intv) => {
        if (intv.status?.toLowerCase() !== "cancelled") {
          const interviewDate = new Date(intv.interviewDate);
          const newStatus = interviewDate < now ? "completed" : "upcoming";

          // Update only if status changed
          if (newStatus !== intv.status) {
            intv.status = newStatus;
            await intv.save();
          }
        }
        return intv;
      })
    );

    return res.status(200).json(updatedInterviews);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// READ BY ID
export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview)
      return res.status(404).json({ error: "Interview not found" });
    return res.status(200).json(interview);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// UPDATE
export const updateInterview = async (req, res) => {
  try {
    if (req.body.dateTime) req.body.interviewDate = req.body.dateTime;

    if (
      req.body.candidateName &&
      !(await userExists(req.body.candidateName, "candidate"))
    ) {
      return res.status(400).json({ error: "Candidate does not exist" });
    }
    if (
      req.body.interviewerName &&
      !(await userExists(req.body.interviewerName, "interviewer"))
    ) {
      return res.status(400).json({ error: "Interviewer does not exist" });
    }

    const updated = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Interview not found" });

    // ✅ Always recompute status immediately after update
    if (!req.body.status || req.body.status.toLowerCase() !== "cancelled") {
      const now = new Date();
      const interviewDate = new Date(updated.interviewDate);
      updated.status = interviewDate < now ? "completed" : "upcoming";
      await updated.save();
    }

    // ✅ Return the latest interview document straight from DB
    const fresh = await Interview.findById(updated._id);
    return res.status(200).json(fresh);
  } catch (err) {
    console.error("Error updating interview:", err);
    return res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteInterview = async (req, res) => {
  try {
    const deleted = await Interview.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Interview not found" });
    return res
      .status(200)
      .json({ message: "Interview deleted successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ANALYTICS
export const getAnalytics = async (req, res) => {
  try {
    const total = await Interview.countDocuments();
    const completed = await Interview.countDocuments({ status: "completed" });
    const upcoming = await Interview.countDocuments({ status: "upcoming" });
    const cancelled = await Interview.countDocuments({ status: "cancelled" });

    return res.status(200).json({
      totalInterviews: total,
      completed,
      upcoming,
      cancelled,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
