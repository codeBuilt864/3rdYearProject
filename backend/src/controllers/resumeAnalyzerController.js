import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { ENV } from "../lib/env.js";
import JobInfo from "../models/JobDescription.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

const google = createGoogleGenerativeAI({ apiKey: ENV.GEMINI_API_KEY });

const categorySchema = z.object({
  score: z.number().min(0).max(10),
  summary: z.string(),
  feedback: z.array(
    z.object({
      type: z.enum(["strength", "minor-improvement", "major-improvement"]),
      name: z.string(),
      message: z.string(),
    })
  ),
});

const aiAnalyzeSchema = z.object({
  overallScore: z.number().min(0).max(10),
  ats: categorySchema,
  jobMatch: categorySchema,
  writingAndFormatting: categorySchema,
  keywordCoverage: categorySchema,
  other: categorySchema,
});

// GET /api/resume-analyzer/analyses/by-job/:jobInfoId
export async function getAnalysesByJobInfo(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const jobInfo = await JobInfo.findOne({ _id: req.params.jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job description not found" });

    const analyses = await ResumeAnalysis.find({ jobInfoId: req.params.jobInfoId }).sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/resume-analyzer/analyses/:id
export async function getAnalysisById(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const analysis = await ResumeAnalysis.findById(req.params.id).populate("jobInfoId");
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    if (analysis.jobInfoId.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/resume-analyzer/analyses — upload resume file + analyze
export async function createAnalysis(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId } = req.body;

    if (!req.file) return res.status(400).json({ message: "Resume file is required" });
    if (!jobInfoId) return res.status(400).json({ message: "jobInfoId is required" });

    const jobInfo = await JobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job description not found" });

    const analysis = await ResumeAnalysis.create({ jobInfoId, fileName: req.file.originalname });

    const mimeType = req.file.mimetype;
    const fileBuffer = req.file.buffer;

    const systemPrompt = `You are an expert resume reviewer and hiring advisor.

You will receive a candidate's resume as a file. This resume is being used to apply for a job with the following information:

Job Description:
\`\`\`
${jobInfo.description}
\`\`\`
Experience Level: ${jobInfo.experienceLevel}
${jobInfo.title ? `\nJob Title: ${jobInfo.title}` : ""}

Evaluate the resume against the job requirements and provide structured feedback in these categories:

1. ats - ATS compatibility (layout, standard headings, no graphics, consistent formatting)
2. jobMatch - Alignment with job description and experience level
3. writingAndFormatting - Writing quality, tone, grammar, clarity, structure
4. keywordCoverage - Keyword and terminology coverage from the job description
5. other - Any other relevant feedback (missing contact info, red flags, career gaps)

For each category return: score (1-10), summary (short), feedback array with items having type ("strength"|"minor-improvement"|"major-improvement"), name, and message.
Also return an overallScore (1-10).

Refer to the candidate as "you". Be constructive and actionable.`;

    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );

    const { object } = await generateObject({
      model: google(ENV.GEMINI_MODEL),
      schema: aiAnalyzeSchema,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              data: arrayBuffer,
              mimeType,
            },
          ],
        },
      ],
    });

    analysis.overallScore = object.overallScore;
    analysis.ats = object.ats;
    analysis.jobMatch = object.jobMatch;
    analysis.writingAndFormatting = object.writingAndFormatting;
    analysis.keywordCoverage = object.keywordCoverage;
    analysis.other = object.other;
    await analysis.save();

    res.status(201).json({ analysis });
  } catch (err) {
    console.error("Error creating analysis:", err);
    res.status(500).json({ message: "Failed to analyze resume" });
  }
}
