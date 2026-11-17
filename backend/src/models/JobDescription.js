import mongoose from "mongoose";

const jobInfoSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, default: null },
    experienceLevel: {
      type: String,
      enum: ["junior", "mid-level", "senior"],
      required: true,
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const JobInfo = mongoose.model("JobInfo", jobInfoSchema);

export default JobInfo;
