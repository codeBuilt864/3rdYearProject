import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createInterview,
  updateInterview,
  getInterviewsByJobInfo,
  getInterviewById,
  getInterviewMessages,
  generateFeedback,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

router.use(requireAuth());

router.post("/interviews", createInterview);
router.patch("/interviews/:id", updateInterview);
router.get("/interviews/by-job/:jobInfoId", getInterviewsByJobInfo);
router.get("/interviews/:id/messages", getInterviewMessages);
router.get("/interviews/:id", getInterviewById);
router.post("/interviews/:id/feedback", generateFeedback);

export default router;
