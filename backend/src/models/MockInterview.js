import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    jobInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobInfo",
      required: true,
    },
    duration: { type: String, default: "00:00:00" },
    vapiCallId: { type: String, default: null },
    candidateName: { type: String, default: "Candidate" },
    transcript: {
      type: [{
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, min: 0, required: true },
        _id: false,
      }],
      default: [],
    },
    // Retained so existing interview records and feedback remain accessible.
    humeChatId: { type: String, default: null },
    feedback: { type: String, default: null },
  },
  { timestamps: true, optimisticConcurrency: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;
