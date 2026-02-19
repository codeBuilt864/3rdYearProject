import { ENV } from "../lib/env.js";

const OPENAI_API_KEY = ENV.OPENAI_API_KEY;

// Generate role-specific interview questions
export const generateQuestions = async (req, res) => {
  const { role, level, skills } = req.body;

  if (!role) {
    return res.status(400).json({ error: "Role is required" });
  }

  try {
    // Validate API key
    if (!OPENAI_API_KEY) {
      console.error("❌ ERROR: OPENAI_API_KEY is not set in environment variables");
      return res.status(500).json({ 
        error: "OpenAI API key is not configured. Check your .env file.",
        details: "OPENAI_API_KEY environment variable is missing"
      });
    }

    if (!OPENAI_API_KEY.startsWith('sk-')) {
      console.error("❌ ERROR: Invalid OpenAI API key format");
      return res.status(500).json({ 
        error: "Invalid OpenAI API key format. Must start with 'sk-'",
        keyPrefix: OPENAI_API_KEY.substring(0, 5)
      });
    }

    const prompt = `Generate 5 realistic interview questions for a ${level || "mid-level"} ${role} position. 
    Skills/focus areas: ${skills || "general programming"}.
    Format: Return ONLY a JSON array of strings with exactly 5 questions, no other text.
    Example format: ["Question 1?", "Question 2?", ...]`;

    console.log(`📝 Generating questions for role: ${role}, level: ${level}`);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert technical interviewer. Generate realistic, challenging interview questions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ OpenAI API Error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    console.log("✅ OpenAI API response received");

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON from response - handle cases where OpenAI adds extra text
    let questions;
    try {
      questions = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON array from the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse questions from OpenAI response");
      }
    }

    return res.json({ questions, role, level });
  } catch (error) {
    console.error("❌ Error generating questions:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({ 
      error: "Failed to generate questions",
      details: error.message
    });
  }
};

// Evaluate answer and provide feedback
export const getAnswerFeedback = async (req, res) => {
  const { question, answer, role, level } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer are required" });
  }

  try {
    console.log(`📝 Getting feedback for answer to: ${question.substring(0, 50)}...`);

    const prompt = `You are an expert technical interviewer evaluating a ${level || "mid-level"} ${role} candidate.

Question: ${question}
Candidate's Answer: ${answer}

Provide feedback in JSON format with EXACTLY these fields:
{
  "score": (1-10 numeric score),
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "tips": "Brief tip to improve this answer",
  "followUp": "A brief follow-up question to ask"
}

Return ONLY valid JSON, no other text.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert technical interviewer providing constructive feedback. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ OpenAI API Error: ${response.status}`, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    console.log("✅ OpenAI feedback response received");

    const data = await response.json();
    const feedbackText = data.choices[0].message.content;

    // Parse JSON from response - handle cases where OpenAI adds extra text
    let feedback;
    try {
      feedback = JSON.parse(feedbackText);
    } catch (parseError) {
      // Try to extract JSON object from the content
      const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedback = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse feedback from OpenAI response");
      }
    }

    console.log("✅ Successfully parsed feedback:", feedback);
    return res.json(feedback);
  } catch (error) {
    console.error("❌ Error getting feedback:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({ 
      error: "Failed to get feedback",
      details: error.message
    });
  }
};

// Generate interview summary and improvement tips
export const getInterviewSummary = async (req, res) => {
  const { role, answers, scores } = req.body;

  if (!role || !answers || !scores) {
    return res.status(400).json({ error: "Role, answers, and scores required" });
  }

  try {
    const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    console.log(`📝 Generating summary for ${role} with average score: ${avgScore}`);

    const prompt = `You are an expert career coach and technical interviewer.
A ${role} candidate just completed a mock interview with the following scores: ${scores.join(", ")} (average: ${avgScore}/10).

Number of questions answered: ${answers.length}

Provide a comprehensive summary in JSON format:
{
  "overallScore": ${avgScore},
  "readiness": "your assessment (Ready for real interview / Needs more prep / Strong candidate)",
  "topStrengths": ["strength1", "strength2", "strength3"],
  "keyAreasToImprove": ["area1", "area2", "area3"],
  "actionPlan": [
    "action1: specific tip",
    "action2: specific tip",
    "action3: specific tip"
  ],
  "resources": [
    "Resource 1 for improvement",
    "Resource 2 for practice"
  ]
}

Return ONLY valid JSON, no other text.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert career coach. Provide constructive, actionable feedback. Always return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`❌ OpenAI API Error: ${response.status}`, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    console.log("✅ OpenAI summary response received");

    const data = await response.json();
    const summaryText = data.choices[0].message.content;

    // Parse JSON from response - handle cases where OpenAI adds extra text
    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch (parseError) {
      // Try to extract JSON object from the content
      const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse summary from OpenAI response");
      }
    }

    console.log("✅ Successfully generated interview summary");
    return res.json(summary);
  } catch (error) {
    console.error("❌ Error generating summary:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(500).json({ 
      error: "Failed to generate summary",
      details: error.message
    });
  }
};
