import Interview from "../models/interview.js";
import Candidate from "../models/candidate.js";

// ✅ Upcoming Interviews
export const getUpcomingInterviews = async (req, res) => {
  try {
    const today = new Date();
    const interviews = await Interview.find({
      interviewDate: { $gte: today.toISOString().split("T")[0] }
    })
      .sort({ interviewDate: 1 }); // earliest first

    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching upcoming interviews:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Recent Hires (replace Pending Feedbacks)
export const getRecentHires = async (req, res) => {
  try {
    const hiredCandidates = await Candidate.find({ status: "hired" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("fullName marks jobTitle");

    res.status(200).json(hiredCandidates);
  } catch (error) {
    console.error("Error fetching recent hires:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Top Candidates (Paginated)
export const getTopCandidates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const total = await Candidate.countDocuments();
    const candidates = await Candidate.find()
      .sort({ marks: -1 }) // highest marks first
      .skip(skip)
      .limit(limit)
      .select("fullName marks email");

    res.status(200).json({
      candidates,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching top candidates:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
