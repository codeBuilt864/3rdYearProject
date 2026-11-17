import express from "express";
import { requireAuth } from "@clerk/express";
import { generateQuestion, generateFeedback } from "../controllers/questionController.js";

const router = express.Router();

router.use(requireAuth());

router.post("/generate-question", generateQuestion);
router.post("/generate-feedback", generateFeedback);

export default router;
