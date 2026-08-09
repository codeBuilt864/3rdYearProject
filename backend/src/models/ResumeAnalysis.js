import mongoose from "mongoose";

const feedbackItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["strength", "minor-improvement", "major-improvement"] },
    name: String,
    message: String,
  },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    score: Number,
    summary: String,
    feedback: [feedbackItemSchema],
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    jobInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobInfo",
      required: true,
    },
    fileName: { type: String, default: null },
    overallScore: { type: Number, default: null },
    ats: { type: categorySchema, default: null },
    jobMatch: { type: categorySchema, default: null },
    writingAndFormatting: { type: categorySchema, default: null },
    keywordCoverage: { type: categorySchema, default: null },
    other: { type: categorySchema, default: null },
  },
  { timestamps: true }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
