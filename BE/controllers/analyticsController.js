import Candidate from "../models/candidate.js";
import Job from "../models/job.js";
import Interview from "../models/interview.js";

export const getAnalyticsOverview = async (req, res) => {
  try {
    const [candidateCount, jobCount, interviewCount, hiredCount, avgScore] =
      await Promise.all([
        Candidate.countDocuments(),
        Job.countDocuments(),
        Interview.countDocuments(),
        Candidate.countDocuments({ status: "hired" }),
        Candidate.aggregate([
          { $group: { _id: null, avgScore: { $avg: "$score" } } },
        ]),
      ]);

    const topRoles = await Candidate.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const statusStats = await Candidate.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totals: {
        candidates: candidateCount,
        jobs: jobCount,
        interviews: interviewCount,
        hired: hiredCount,
        averageScore: avgScore[0]?.avgScore?.toFixed(1) || 0,
      },
      topRoles: topRoles.map((r) => ({
        name: r._id || "Unassigned",
        count: r.count,
      })),
      statusStats: statusStats.map((s) => ({
        name: s._id || "Unknown",
        count: s.count,
      })),
    });
  } catch (error) {
    console.error("Error fetching analytics overview:", error);
    res.status(500).json({ message: "Error generating analytics overview" });
  }
};
