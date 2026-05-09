import Job from "../models/job.js";
import Candidate from "../models/candidate.js";
import Interview from "../models/interview.js";

// ✅ Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const jobsCount = await Job.countDocuments();
    const candidatesCount = await Candidate.countDocuments();
    const interviewsCount = await Interview.countDocuments();

    // ✅ Case-insensitive match for "Hired" or "hired"
    const hiredCount = await Candidate.countDocuments({
      status: { $regex: /^hired$/i },
    });

    const weeklyTrend = [
      { day: "Mon", applicants: 5 },
      { day: "Tue", applicants: 7 },
      { day: "Wed", applicants: 10 },
      { day: "Thu", applicants: 8 },
      { day: "Fri", applicants: 12 },
      { day: "Sat", applicants: 9 },
      { day: "Sun", applicants: 15 },
    ];

    res.status(200).json({
      jobs: jobsCount,
      candidates: candidatesCount,
      interviews: interviewsCount,
      hired: hiredCount,
      weeklyTrend,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Names for popups
export const getJobNames = async (req, res) => {
  try {
    const jobs = await Job.find().select("title");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching job names:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCandidateNames = async (req, res) => {
  try {
    const candidates = await Candidate.find().select("fullName");
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidate names:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getHiredCandidates = async (req, res) => {
  try {
    // ✅ Case-insensitive filter for "Hired"
    const hiredCandidates = await Candidate.find({
      status: { $regex: /^hired$/i },
    }).select("fullName");

    res.status(200).json(hiredCandidates);
  } catch (error) {
    console.error("Error fetching hired candidates:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Top Candidates (by score)
export const getTopCandidates = async (req, res) => {
  try {
    const topCandidates = await Candidate.find()
      .sort({ score: -1 }) // Sort by highest score
      .limit(5)
      .select("fullName score");
    res.status(200).json(topCandidates);
  } catch (error) {
    console.error("Error fetching top candidates:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
