// models/candidateModel.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    role: { type: String }, // added role field
    appliedJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job" }, // link to Job collection
    status: {
      type: String,
      enum: ["Applied", "Interviewed", "Hired","ShortListed"],
      default: "applied",
    },
    score: { type: Number, default: 0 }, // optional score field
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

export default mongoose.model("Candidate", candidateSchema);
