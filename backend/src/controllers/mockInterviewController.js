import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ENV } from "../lib/env.js";
import JobInfo from "../models/JobDescription.js";
import MockInterview from "../models/MockInterview.js";

const google = createGoogleGenerativeAI({ apiKey: ENV.GEMINI_API_KEY });

// POST /api/mock-interview/interviews
export async function createInterview(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId, candidateName } = req.body;

    if (candidateName !== undefined && (typeof candidateName !== "string" || candidateName.length > 200)) {
      return res.status(400).json({ message: "Invalid candidate name" });
    }

    const jobInfo = await JobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    const interview = await MockInterview.create({ jobInfoId, candidateName: candidateName?.trim() || "Candidate" });
    res.status(201).json({ interview });
  } catch (error) {
    console.error("Error creating interview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// PATCH /api/mock-interview/interviews/:id
export async function updateInterview(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;
    const { vapiCallId, duration, transcript } = req.body;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId?.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (vapiCallId !== undefined && (typeof vapiCallId !== "string" || !vapiCallId.trim() || vapiCallId.length > 100)) {
      return res.status(400).json({ message: "Invalid call ID" });
    }
    if (interview.vapiCallId && vapiCallId !== undefined && interview.vapiCallId !== vapiCallId) {
      return res.status(409).json({ message: "Interview is already linked to a different call" });
    }
    if (duration !== undefined && (typeof duration !== "string" || !/^\d{2,}:\d{2}:\d{2}$/.test(duration))) {
      return res.status(400).json({ message: "Invalid duration" });
    }
    if (transcript !== undefined) {
      if (!Array.isArray(transcript) || transcript.length > 2000 || transcript.some((message) =>
        !message || !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" || !message.content.trim() || message.content.length > 20000 ||
        !Number.isFinite(message.timestamp) || message.timestamp < 0
      )) {
        return res.status(400).json({ message: "Invalid transcript" });
      }
      // Snapshots are append-only; a delayed save must never erase newer turns.
      const existing = interview.transcript || [];
      if (transcript.length < existing.length || existing.some((message, index) =>
        message.role !== transcript[index]?.role || message.content !== transcript[index]?.content ||
        message.timestamp !== transcript[index]?.timestamp
      )) {
        return res.status(409).json({ message: "Transcript cannot overwrite saved turns" });
      }
      interview.transcript = transcript.map(({ role, content, timestamp }) => ({ role, content, timestamp }));
    }
    if (vapiCallId !== undefined) interview.vapiCallId = vapiCallId;
    if (duration !== undefined) interview.duration = duration;
    await interview.save();

    res.json({ interview });
  } catch (error) {
    console.error("Error updating interview:", error.message);
    if (error.name === "VersionError") {
      return res.status(409).json({ message: "Interview changed while saving; retry the latest transcript" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/mock-interview/interviews/by-job/:jobInfoId
export async function getInterviewsByJobInfo(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId } = req.params;

    const jobInfo = await JobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    const interviews = await MockInterview.find({
      jobInfoId,
      $or: [{ vapiCallId: { $ne: null } }, { humeChatId: { $ne: null } }, { "transcript.0": { $exists: true } }],
    }).sort({ updatedAt: -1 });

    res.json({ interviews });
  } catch (error) {
    console.error("Error fetching interviews:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/mock-interview/interviews/:id
export async function getInterviewById(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId?.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ interview });
  } catch (error) {
    console.error("Error fetching interview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/mock-interview/interviews/:id/messages
export async function getInterviewMessages(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId?.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.json({ messages: interview.transcript || [] });
  } catch (error) {
    console.error("Error fetching interview messages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/mock-interview/interviews/:id/feedback
export async function generateFeedback(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId?.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (interview.feedback) return res.json({ feedback: interview.feedback });
    if (!interview.transcript?.some((message) => message.role === "user")) {
      return res.status(400).json({ message: "No candidate transcript is available for feedback" });
    }

    const formattedMessages = interview.transcript.map((message) => ({
      speaker: message.role === "user" ? "interviewee" : "interviewer",
      text: message.content,
      timestamp: message.timestamp,
    }));

    const jobInfo = interview.jobInfoId;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: JSON.stringify(formattedMessages),
      maxSteps: 10,
      experimental_continueSteps: true,
      system: `You are an expert interview coach and evaluator. Your role is to analyze a mock job interview transcript and provide clear, detailed, and structured feedback on the interviewee's performance based on the job requirements. Your output should be in markdown format.
  
---

Additional Context:

Interviewee's name: ${interview.candidateName || "Candidate"}
Job title: ${jobInfo.title || "Not Specified"}
Job description: ${jobInfo.description}
Job Experience level: ${jobInfo.experienceLevel}

---

Transcript JSON Format:

speaker: "interviewee" or "interviewer"
text: "The actual spoken text of the message"
timestamp: "Approximate seconds elapsed when a final transcript segment was received; this is not precise speech timing. No audio or emotion measurements are provided."

---

Your Task:

Review the full transcript and evaluate the interviewee's performance in relation to the role. Provide detailed, structured feedback organized into the following primary categories (do not repeat the subcategories in your response and instead just use them as reference for what to look for and include in your response):

---

Feedback Categories:

1. **Communication Clarity**
   - Was the interviewee articulate and easy to understand?
   - Did they use structured and appropriate language for this job and experience level?

2. **Confidence and Emotional State**
   - Assess confidence only from the wording and structure of the answers.
   - Do not infer vocal tone, nervousness, or emotions from text alone; state this limitation.

3. **Response Quality**
   - Did the interviewee respond with relevant, well-reasoned answers aligned with the job requirements?
   - Were answers appropriately scoped for their experience level (e.g., detail depth, use of examples)?

4. **Pacing and Timing**
   - Discuss answer length and conversational flow using the transcript.
   - Timestamps reflect transcript delivery, not speech boundaries. Do not claim precise pauses or response latency.

5. **Engagement and Interaction**
   - Did the interviewee show curiosity or ask thoughtful questions?
   - Did they engage with the conversation in a way that reflects interest in the role and company?

6. **Role Fit & Alignment**
   - Based on the job description and the candidate's answers, how well does the interviewee match the expectations for this role and level?
   - Identify any gaps in technical or soft skills.

7. **Overall Strengths & Areas for Improvement**
   - Summarize top strengths.
   - Identify the most important areas for improvement.
   - Provide a brief overall performance assessment.

---

Additional Notes:

- Reference specific moments from the transcript, including quotes and approximate timestamps where useful. Do not invent audio or emotional observations.
- Tailor your analysis and feedback to the specific job description and experience level provided.
- Be clear, constructive, and actionable. The goal is to help the interviewee grow.
- Do not include an h1 title or information about the job description in your response, just include the feedback.
- Refer to the interviewee as "you" in your feedback. This feedback should be written as if you were speaking directly to the interviewee.
- Include a number rating (out of 10) in the heading for each category (e.g., "Communication Clarity: 8/10") as well as an overall rating at the very start of the response.
- Stop generating output as soon you have provided the full feedback.`,
    });

    interview.feedback = text;
    await interview.save();

    res.json({ feedback: text });
  } catch (error) {
    console.error("Error generating feedback:", error.message);
    res.status(500).json({ message: "Failed to generate feedback" });
  }
}
