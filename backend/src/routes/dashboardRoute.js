import express from "express";
import { requireAuth } from "@clerk/express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/", requireAuth(), getDashboard);
export default router;
