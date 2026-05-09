import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true },
    interviewerName: { type: String, required: true },
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true },

    // ✅ Store as Date for accurate sorting
    interviewDate: { type: Date, required: true },

    interviewType: { type: String, required: true },

    status: {
      type: String,
      required: true,
      enum: ["upcoming", "completed", "cancelled"],
      lowercase: true,
      default: "upcoming",
    },

    feedback: { type: String, default: "N/A" },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
