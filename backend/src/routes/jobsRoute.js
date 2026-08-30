import express from "express";
import { requireAuth } from "@clerk/express";
import { getJobs } from "../controllers/jobsController.js";

const router = express.Router();

router.use(requireAuth());
router.get("/", getJobs);

export default router;
