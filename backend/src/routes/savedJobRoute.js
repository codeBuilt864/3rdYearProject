import express from "express";
import { requireAuth } from "@clerk/express";
import { getSavedJobs, saveJob, unsaveJob } from "../controllers/savedJobController.js";

const router = express.Router();

router.use(requireAuth());
router.get("/", getSavedJobs);
router.post("/", saveJob);
router.delete("/:jobId", unsaveJob);

export default router;
