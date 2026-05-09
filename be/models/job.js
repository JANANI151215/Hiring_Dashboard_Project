import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    location: { type: String },
    salaryRange: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // candidates who applied
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", jobSchema);
