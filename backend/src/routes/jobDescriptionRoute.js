import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getJobDescriptions,
  createJobDescription,
  getJobDescriptionById,
  updateJobDescription,
  deleteJobDescription,
} from "../controllers/jobDescriptionController.js";

const router = express.Router();

router.use(requireAuth());

router.get("/", getJobDescriptions);
router.post("/", createJobDescription);
router.get("/:id", getJobDescriptionById);
router.put("/:id", updateJobDescription);
router.delete("/:id", deleteJobDescription);

export default router;
