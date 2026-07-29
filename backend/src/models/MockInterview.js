import mongoose from "mongoose";

const mockInterviewSchema = new mongoose.Schema(
  {
    jobInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockJobInfo",
      required: true,
    },
    duration: { type: String, default: "00:00:00" },
    humeChatId: { type: String, default: null },
    feedback: { type: String, default: null },
  },
  { timestamps: true }
);

const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

export default MockInterview;
