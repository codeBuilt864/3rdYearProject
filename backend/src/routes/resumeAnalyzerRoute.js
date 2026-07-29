import express from "express";
import multer from "multer";
import { requireAuth } from "@clerk/express";
import {
  getJobInfos,
  createJobInfo,
  getJobInfoById,
  updateJobInfo,
  getAnalysesByJobInfo,
  getAnalysisById,
  createAnalysis,
} from "../controllers/resumeAnalyzerController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Please upload a PDF, Word document, or text file"));
  },
});

router.use(requireAuth());

router.get("/job-infos", getJobInfos);
router.post("/job-infos", createJobInfo);
router.get("/job-infos/:id", getJobInfoById);
router.put("/job-infos/:id", updateJobInfo);

router.get("/analyses/by-job/:jobInfoId", getAnalysesByJobInfo);
router.get("/analyses/:id", getAnalysisById);
router.post("/analyses", upload.single("resumeFile"), createAnalysis);

export default router;
