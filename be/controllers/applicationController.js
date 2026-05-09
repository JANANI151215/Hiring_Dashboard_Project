import Application from "../models/application.js";
import Job from "../models/job.js";

/**
 * Candidate applies for a job
 */
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existing = await Application.findOne({ user: userId, job: jobId });
    if (existing) return res.status(400).json({ message: "Already applied" });

    const application = await Application.create({
      user: userId,
      job: jobId,
      status: "applied",
    });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({ message: "Server error while applying" });
  }
};

/**
 * Get candidate's own applications
 */
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const myApplications = await Application.find({ user: userId })
      .populate("job", "title companyName location")
      .sort({ createdAt: -1 });

    // ALWAYS return array
    res.status(200).json(Array.isArray(myApplications) ? myApplications : []);
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({ message: "Server error fetching your applications" });
  }
};

/**
 * Admin/Recruiter gets all applications
 */
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "fullName email")
      .populate("job", "title companyName location");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Server error fetching applications" });
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const validStatuses = ["applied", "reviewed", "selected", "rejected"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updated = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Status updated", updatedApplication: updated });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error updating status" });
  }
};

/**
 * Delete an application
 */
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const deleted = await Application.findByIdAndDelete(applicationId);
    if (!deleted) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    res.status(500).json({ message: "Server error deleting application" });
  }
};

/**
 * Candidate edits own application
 */
export const editApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { resume, coverLetter } = req.body;
    const userId = req.user._id;

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Cannot edit this application" });

    if (resume) application.resume = resume;
    if (coverLetter) application.coverLetter = coverLetter;

    await application.save();
    res.status(200).json({ message: "Application updated successfully", application });
  } catch (error) {
    console.error("Edit application error:", error);
    res.status(500).json({ message: "Server error updating application" });
  }
};
