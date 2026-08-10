import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, pipeDataStreamToResponse, createDataStream } from "ai";
import { ENV } from "../lib/env.js";
import JobInfo from "../models/JobDescription.js";
import Question from "../models/Question.js";

const google = createGoogleGenerativeAI({ apiKey: ENV.GEMINI_API_KEY });

// POST /api/questions/generate-question
// body: { jobInfoId, difficulty }
export async function generateQuestion(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { jobInfoId, difficulty } = req.body;

    if (!jobInfoId || !difficulty) {
      return res.status(400).json({ message: "jobInfoId and difficulty are required" });
    }
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty" });
    }

    const jobInfo = await JobInfo.findOne({ _id: jobInfoId, clerkUserId });
    if (!jobInfo) return res.status(404).json({ message: "Job info not found" });

    const previousQuestions = await Question.find({ jobInfoId })
      .sort({ createdAt: 1 })
      .select("text difficulty");

    const previousMessages = previousQuestions.flatMap((q) => [
      { role: "user", content: q.difficulty },
      { role: "assistant", content: q.text },
    ]);

    pipeDataStreamToResponse(res, {
      execute: async (dataStream) => {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          messages: [
            ...previousMessages,
            { role: "user", content: difficulty },
          ],
          system: `You are an AI assistant that creates technical interview questions tailored to a specific job role. Your task is to generate one realistic and relevant technical question that matches the skill requirements of the job and aligns with the difficulty level provided by the user.

Job Information:
- Job Description: \`${jobInfo.description}\`
- Experience Level: \`${jobInfo.experienceLevel}\`
${jobInfo.title ? `- Job Title: \`${jobInfo.title}\`` : ""}

Guidelines:
- The question must reflect the skills and technologies mentioned in the job description.
- Make sure the question is appropriately scoped for the specified experience level.
- A difficulty level of "easy", "medium", or "hard" is provided by the user and should be used to tailor the question.
- Prefer practical, real-world challenges over trivia.
- Return only the question, clearly formatted (e.g., with code snippets or bullet points if needed). Do not include the answer.
- Return only one question at a time.
- The question should be formatted as markdown.
- Stop generating output as soon as you have provided the full question.`,
          onFinish: async ({ text }) => {
            const question = await Question.create({ jobInfoId, text, difficulty });
            dataStream.writeData({ questionId: question._id.toString() });
          },
        });

        result.mergeIntoDataStream(dataStream, { sendUsage: false });
      },
    });
  } catch (error) {
    console.error("Error generating question:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate question" });
    }
  }
}

// POST /api/questions/generate-feedback
// body: { questionId, answer }
export async function generateFeedback(req, res) {
  try {
    const clerkUserId = req.auth().userId;
    const { questionId, answer } = req.body;

    if (!questionId || !answer?.trim()) {
      return res.status(400).json({ message: "questionId and answer are required" });
    }

    const question = await Question.findById(questionId).populate("jobInfoId");
    if (!question) return res.status(404).json({ message: "Question not found" });
    if (question.jobInfoId.clerkUserId !== clerkUserId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    pipeDataStreamToResponse(res, {
      execute: (dataStream) => {
        const result = streamText({
          model: google("gemini-2.5-flash"),
          prompt: answer.trim(),
          system: `You are an expert technical interviewer. Your job is to evaluate the candidate's answer to a technical interview question.

The original question was:
\`\`\`
${question.text}
\`\`\`

Instructions:
- Review the candidate's answer (provided in the user prompt).
- Assign a rating from 1 to 10.
- Provide concise, constructive feedback on what was done well and what could be improved.
- Be honest but professional.
- Include a full correct answer in the output.
- Refer to the candidate as "you" in your feedback.
- Stop generating output as soon as you have provided the rating, feedback, and full correct answer.

Output Format (strictly follow this structure):
## Feedback (Rating: <Your rating from 1 to 10>/10)
<Your written feedback as markdown>
---
## Correct Answer
<The full correct answer as markdown>`,
        });

        result.mergeIntoDataStream(dataStream, { sendUsage: false });
      },
    });
  } catch (error) {
    console.error("Error generating feedback:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate feedback" });
    }
  }
}
