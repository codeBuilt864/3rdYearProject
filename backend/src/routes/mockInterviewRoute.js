import express from "express";
import {
  generateQuestions,
  getAnswerFeedback,
  getInterviewSummary,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

// Generate role-specific interview questions
router.post("/generate-questions", generateQuestions);

// Get feedback on an answer
router.post("/get-feedback", getAnswerFeedback);

// Get interview summary and tips
router.post("/get-summary", getInterviewSummary);

export default router;
