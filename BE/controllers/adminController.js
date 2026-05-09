import User from "../models/user.js";

// ✅ Get aggregated user stats
export const getStats = async (req, res) => {
  try {
    // Use MongoDB aggregation for more efficiency if needed
    const totalUsers = await User.countDocuments();
    const admin = await User.countDocuments({ role: "admin" });
    const recruiter = await User.countDocuments({ role: "recruiter" });
    const interviewer = await User.countDocuments({ role: "interviewer" });
    const candidate = await User.countDocuments({ role: "candidate" });

    res.status(200).json({ totalUsers, admin, recruiter, interviewer, candidate });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get recent users
export const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id fullName email role createdAt"); // include _id for linking to profile
    res.status(200).json(users);
  } catch (err) {
    console.error("Recent Users Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Optional: Get all candidates (for future features)
export const getCandidates = async (req, res) => {
  try {
    const candidates = await User.find({ role: "candidate" }).select("_id fullName email");
    res.status(200).json(candidates);
  } catch (err) {
    console.error("Get Candidates Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
