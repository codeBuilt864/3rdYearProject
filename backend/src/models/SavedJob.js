import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true },
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyLogo: { type: String, default: null },
    location: { type: String, default: null },
    employmentType: { type: String, default: null },
    workMode: { type: String, default: null },
    salary: { type: String, default: null },
    skills: { type: [String], default: [] },
    description: { type: String, default: "" },
    postedDate: { type: String, default: null },
    applyUrl: { type: String, required: true },
    source: { type: String, required: true },
  },
  { timestamps: true }
);

savedJobSchema.index({ clerkUserId: 1, jobId: 1 }, { unique: true });

const SavedJob = mongoose.model("SavedJob", savedJobSchema);

export default SavedJob;
