import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    jobInfoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobInfo",
      required: true,
    },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
