import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "selected", "rejected"],
      default: "applied",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// ✅ Prevent OverwriteModelError if model is re-imported
const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default Application;
