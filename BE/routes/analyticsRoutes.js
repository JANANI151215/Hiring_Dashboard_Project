import express from "express";
import Candidate from "../models/candidate.js";
import Job from "../models/job.js";
import Interview from "../models/interview.js";

const router = express.Router();

// 📊 Get complete hiring analytics overview
router.get("/", async (req, res) => {
  try {
    // Use Promise.all to parallelize all DB calls
    const [
      totalCandidates,
      totalJobs,
      totalInterviews,
      hiredCandidates,
      avgScoreAgg,
      topRolesAgg,
      statusAgg,
    ] = await Promise.all([
      Candidate.countDocuments(),
      Job.countDocuments(),
      Interview.countDocuments(),
      Candidate.countDocuments({ status: "hired" }),
      Candidate.aggregate([
        { $group: { _id: null, avgScore: { $avg: "$score" } } },
      ]),
      Candidate.aggregate([
        { $group: { _id: { $ifNull: ["$role", "Unassigned"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Candidate.aggregate([
        { $group: { _id: { $ifNull: ["$status", "Unknown"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Compute safe fallback values
    const averageScore = avgScoreAgg[0]?.avgScore
      ? Number(avgScoreAgg[0].avgScore.toFixed(1))
      : 0;

    const topRoles =
      topRolesAgg.length > 0
        ? topRolesAgg.map((r) => ({
            name: r._id || "Unassigned",
            count: r.count,
          }))
        : [{ name: "Unassigned", count: 0 }];

    const statusStats =
      statusAgg.length > 0
        ? statusAgg.map((s) => ({
            name: s._id || "Unknown",
            count: s.count,
          }))
        : [
            { name: "Applied", count: 0 },
            { name: "Interviewed", count: 0 },
            { name: "Hired", count: 0 },
          ];

    // 🧠 Optional: Add derived insights
    const hiringRate =
      totalCandidates > 0
        ? ((hiredCandidates / totalCandidates) * 100).toFixed(1)
        : 0;

    const avgInterviewsPerJob =
      totalJobs > 0 ? (totalInterviews / totalJobs).toFixed(1) : 0;

    // ✅ Respond with structured analytics data
    res.json({
      totals: {
        totalCandidates,
        totalJobs,
        totalInterviews,
        hiredCandidates,
        averageScore,
        hiringRate,
        avgInterviewsPerJob,
      },
      topRoles,
      statusStats,
    });
  } catch (err) {
    console.error("🔥 Error fetching analytics:", err);
    res.status(500).json({
      message: err.message || "Error fetching analytics data.",
    });
  }
});

export default router;
