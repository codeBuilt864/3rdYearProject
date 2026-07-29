import { fetchAccessToken, HumeClient } from "hume";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ENV } from "../lib/env.js";
import MockJobInfo from "../models/MockJobInfo.js";
import MockInterview from "../models/MockInterview.js";

const google = createGoogleGenerativeAI({ apiKey: ENV.GEMINI_API_KEY });

// GET /api/mock-interview/token
export async function getHumeToken(req, res) {
  try {
    const accessToken = await fetchAccessToken({
      apiKey: ENV.HUME_API_KEY,
      secretKey: ENV.HUME_SECRET_KEY,
    });
    res.json({ accessToken });
  } catch (error) {
    console.error("Error fetching Hume token:", error.message);
    res.status(500).json({ message: "Failed to get access token" });
  }
}

// GET /api/mock-interview/job-infos
export async function getJobInfos(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const jobInfos = await MockJobInfo.find({ clerkUserId }).sort({ updatedAt: -1 });
    res.json({ jobInfos });
  } catch (error) {
    console.error("Error fetching job infos:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/mock-interview/job-infos
export async function createJobInfo(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { name, title, experienceLevel, description } = req.body;

    if (!name || !experienceLevel || !description) {
      return res.status(400).json({ message: "name, experienceLevel, and description are required" });
    }

    const jobInfo = await MockJobInfo.create({
      clerkUserId,
      name,
      title: title || null,
      experienceLevel,
      description,
    });

    res.status(201).json({ jobInfo });
  } catch (error) {
    console.error("Error creating job info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// PUT /api/mock-interview/job-infos/:id
export async function updateJobInfo(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;
    const { name, title, experienceLevel, description } = req.body;

    const jobInfo = await MockJobInfo.findOneAndUpdate(
      { _id: id, clerkUserId },
      { name, title: title || null, experienceLevel, description },
      { new: true }
    );

    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    res.json({ jobInfo });
  } catch (error) {
    console.error("Error updating job info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/mock-interview/job-infos/:id
export async function getJobInfoById(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { id } = req.params;

    const jobInfo = await MockJobInfo.findOne({ _id: id, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    res.json({ jobInfo });
  } catch (error) {
    console.error("Error fetching job info:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// POST /api/mock-interview/interviews
export async function createInterview(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId } = req.body;

    const jobInfo = await MockJobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    const interview = await MockInterview.create({ jobInfoId });
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
    const { humeChatId, duration } = req.body;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (humeChatId !== undefined) interview.humeChatId = humeChatId;
    if (duration !== undefined) interview.duration = duration;
    await interview.save();

    res.json({ interview });
  } catch (error) {
    console.error("Error updating interview:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET /api/mock-interview/interviews/by-job/:jobInfoId
export async function getInterviewsByJobInfo(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId } = req.params;

    const jobInfo = await MockJobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    const interviews = await MockInterview.find({
      jobInfoId,
      humeChatId: { $ne: null },
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
    if (interview.jobInfoId.clerkUserId !== clerkUserId) {
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
    if (interview.jobInfoId.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!interview.humeChatId) {
      return res.json({ messages: [] });
    }

    const client = new HumeClient({ apiKey: ENV.HUME_API_KEY });
    const allChatEvents = [];
    const chatEventsIterator = await client.empathicVoice.chats.listChatEvents(
      interview.humeChatId,
      { pageNumber: 0, pageSize: 100 }
    );
    for await (const chatEvent of chatEventsIterator) {
      allChatEvents.push(chatEvent);
    }

    res.json({ messages: allChatEvents });
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
    const { userName } = req.body;

    const interview = await MockInterview.findById(id).populate("jobInfoId");
    if (!interview) return res.status(404).json({ message: "Interview not found" });
    if (interview.jobInfoId.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!interview.humeChatId) {
      return res.status(400).json({ message: "Interview has not been completed yet" });
    }

    // Fetch chat messages from Hume
    const client = new HumeClient({ apiKey: ENV.HUME_API_KEY });
    const allChatEvents = [];
    const chatEventsIterator = await client.empathicVoice.chats.listChatEvents(
      interview.humeChatId,
      { pageNumber: 0, pageSize: 100 }
    );
    for await (const chatEvent of chatEventsIterator) {
      allChatEvents.push(chatEvent);
    }

    // Format messages for Gemini (same as old project)
    const formattedMessages = allChatEvents
      .map((message) => {
        if (message.type !== "USER_MESSAGE" && message.type !== "AGENT_MESSAGE") return null;
        if (message.messageText == null) return null;
        return {
          speaker: message.type === "USER_MESSAGE" ? "interviewee" : "interviewer",
          text: message.messageText,
          emotionFeatures: message.role === "USER" ? message.emotionFeatures : undefined,
        };
      })
      .filter(Boolean);

    const jobInfo = interview.jobInfoId;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: JSON.stringify(formattedMessages),
      maxSteps: 10,
      experimental_continueSteps: true,
      system: `You are an expert interview coach and evaluator. Your role is to analyze a mock job interview transcript and provide clear, detailed, and structured feedback on the interviewee's performance based on the job requirements. Your output should be in markdown format.
  
---

Additional Context:

Interviewee's name: ${userName}
Job title: ${jobInfo.title || "Not Specified"}
Job description: ${jobInfo.description}
Job Experience level: ${jobInfo.experienceLevel}

---

Transcript JSON Format:

speaker: "interviewee" or "interviewer"
text: "The actual spoken text of the message"
emotionFeatures: "An object of emotional features where the key is the emotion and the value is the intensity (0-1). This is only provided for interviewee messages."

---

Your Task:

Review the full transcript and evaluate the interviewee's performance in relation to the role. Provide detailed, structured feedback organized into the following primary categories (do not repeat the subcategories in your response and instead just use them as reference for what to look for and include in your response):

---

Feedback Categories:

1. **Communication Clarity**
   - Was the interviewee articulate and easy to understand?
   - Did they use structured and appropriate language for this job and experience level?

2. **Confidence and Emotional State**
   - Based on the provided emotional cues and speech content, how confident did the interviewee appear?
   - Highlight any nervous or hesitant moments that may have affected the impression they gave.

3. **Response Quality**
   - Did the interviewee respond with relevant, well-reasoned answers aligned with the job requirements?
   - Were answers appropriately scoped for their experience level (e.g., detail depth, use of examples)?

4. **Pacing and Timing**
   - Analyze delays between interviewer questions and interviewee responses.
   - Point out long or unnatural pauses that may indicate uncertainty or unpreparedness.

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

- Reference specific moments from the transcript, including quotes and timestamps where useful. Do not return specific emotional features in your response.
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
