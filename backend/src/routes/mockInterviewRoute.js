import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getHumeToken,
  getJobInfos,
  createJobInfo,
  updateJobInfo,
  getJobInfoById,
  createInterview,
  updateInterview,
  getInterviewsByJobInfo,
  getInterviewById,
  getInterviewMessages,
  generateFeedback,
} from "../controllers/mockInterviewController.js";

const router = express.Router();

router.use(requireAuth());

router.get("/token", getHumeToken);

router.get("/job-infos", getJobInfos);
router.post("/job-infos", createJobInfo);
router.get("/job-infos/:id", getJobInfoById);
router.put("/job-infos/:id", updateJobInfo);

router.post("/interviews", createInterview);
router.patch("/interviews/:id", updateInterview);
router.get("/interviews/by-job/:jobInfoId", getInterviewsByJobInfo);
router.get("/interviews/:id/messages", getInterviewMessages);
router.get("/interviews/:id", getInterviewById);
router.post("/interviews/:id/feedback", generateFeedback);

export default router;
