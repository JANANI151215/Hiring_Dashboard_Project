import Job from "../models/job.js";

// ✅ Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// ✅ Admin: create job
export const createJob = async (req, res) => {
  try {
    const { title, description, department } = req.body;

    const job = new Job({
      title,
      description,
      department,
      postedBy: req.user._id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to create job", error: err.message });
  }
};

// ✅ Candidate: apply to a job
export const applyJob = async (req, res) => {
  try {
    console.log("Apply request user:", req.user); // DEBUG

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if candidate already applied
    if (job.applications.includes(req.user._id)) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    job.applications.push(req.user._id);
    await job.save();

    console.log("Applied successfully:", req.user._id, "->", job._id); // DEBUG
    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("ApplyJob error:", err);
    res.status(500).json({ message: "Failed to apply", error: err.message });
  }
};

// ✅ Candidate: get all jobs applied by user
export const getMyApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ applications: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("GetMyApplications error:", err);
    res.status(500).json({ message: "Failed to fetch your applications", error: err.message });
  }
};
