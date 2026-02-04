import express from 'express';
import { analyzeResumeHandler } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/analyze', analyzeResumeHandler);

export default router;
