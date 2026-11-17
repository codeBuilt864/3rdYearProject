import JobInfo from "../models/JobDescription.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";
import MockInterview from "../models/MockInterview.js";
import Question from "../models/Question.js";
import SavedJob from "../models/SavedJob.js";

const CATEGORIES = {
  ats: "ATS Compatibility",
  jobMatch: "Job Match",
  writingAndFormatting: "Writing & Formatting",
  keywordCoverage: "Keyword Coverage",
  other: "Additional Insights",
};

// GET /api/dashboard — ownership comes exclusively from the authenticated session.
export async function getDashboard(req, res) {
  const clerkUserId = req.auth()?.userId;
  if (!clerkUserId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const jobs = await JobInfo.find({ clerkUserId })
      .select("name title experienceLevel createdAt updatedAt").sort({ updatedAt: -1 }).lean();
    const ownedJobs = { jobInfoId: { $in: jobs.map((job) => job._id) } };
    // An abandoned call is not interview practice. Older Hume-only records cannot
    // establish whether a candidate answered and are excluded from this count.
    const practiced = { ...ownedJobs, transcript: { $elemMatch: { role: "user", content: { $regex: "\\S" } } } };
    const completedAnalysis = { ...ownedJobs, overallScore: { $gte: 0, $lte: 10 } };
    const [interviewCount, questionCount, savedJobCount, analyses, interviews, questions, savedJobs, pendingFeedback] = await Promise.all([
      MockInterview.countDocuments(practiced),
      Question.countDocuments(ownedJobs),
      SavedJob.countDocuments({ clerkUserId }),
      ResumeAnalysis.find(completedAnalysis).sort({ createdAt: -1 }).limit(5)
        .select("jobInfoId fileName overallScore ats jobMatch writingAndFormatting keywordCoverage other createdAt").lean(),
      MockInterview.find(practiced).sort({ createdAt: -1 }).limit(5).select("jobInfoId duration createdAt updatedAt").lean(),
      Question.find(ownedJobs).sort({ createdAt: -1 }).limit(5).select("jobInfoId difficulty createdAt").lean(),
      SavedJob.find({ clerkUserId }).sort({ createdAt: -1 }).limit(5).select("title company createdAt").lean(),
      MockInterview.findOne({ ...practiced, feedback: { $in: [null, ""] } })
        .sort({ createdAt: -1 }).select("jobInfoId createdAt").lean(),
    ]);

    const jobMap = new Map(jobs.map((job) => [String(job._id), job]));
    const nameFor = (id) => jobMap.get(String(id))?.name || "Job preparation";
    const latest = analyses[0];
    const latestAnalysis = latest ? {
      id: String(latest._id), jobInfoId: String(latest.jobInfoId),
      jobName: nameFor(latest.jobInfoId), fileName: latest.fileName,
      overallScore: latest.overallScore, createdAt: latest.createdAt,
      href: `/resumeanalyze/${latest.jobInfoId}/analyses/${latest._id}`,
    } : null;
    const improvements = latest ? Object.entries(CATEGORIES).flatMap(([key, category]) =>
      (latest[key]?.feedback || [])
        .filter((item) => ["major-improvement", "minor-improvement"].includes(item.type))
        .map((item) => ({ category, type: item.type, name: item.name, message: item.message }))
    ).sort((a, b) => Number(b.type === "major-improvement") - Number(a.type === "major-improvement")) : [];

    const activity = [
      ...analyses.map((item) => ({ id: `resume-${item._id}`, type: "resume", label: "Resume analyzed", detail: nameFor(item.jobInfoId), date: item.createdAt, jobInfoId: String(item.jobInfoId), href: `/resumeanalyze/${item.jobInfoId}/analyses/${item._id}` })),
      ...interviews.map((item) => ({ id: `interview-${item._id}`, type: "interview", label: "Interview practiced", detail: nameFor(item.jobInfoId), date: item.createdAt, jobInfoId: String(item.jobInfoId), href: `/mockinterview/${item.jobInfoId}/interviews/${item._id}` })),
      ...questions.map((item) => ({ id: `question-${item._id}`, type: "question", label: "Question generated", detail: `${nameFor(item.jobInfoId)} · ${item.difficulty}`, date: item.createdAt, jobInfoId: String(item.jobInfoId), href: `/questions/${item.jobInfoId}` })),
      ...savedJobs.map((item) => ({ id: `saved-${item._id}`, type: "saved", label: "Job saved", detail: `${item.title} · ${item.company}`, date: item.createdAt, href: "/jobs?view=saved" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const lastUsed = new Map(jobs.map((job) => [String(job._id), new Date(job.updatedAt).getTime()]));
    for (const item of activity) {
      if (item.jobInfoId) lastUsed.set(item.jobInfoId, Math.max(lastUsed.get(item.jobInfoId) || 0, new Date(item.date).getTime()));
    }
    const recentJobs = jobs.map((job) => ({ id: String(job._id), name: job.name, title: job.title, experienceLevel: job.experienceLevel, lastUsed: lastUsed.get(String(job._id)) }))
      .sort((a, b) => b.lastUsed - a.lastUsed).slice(0, 3);

    const nextSteps = [];
    const targetId = latestAnalysis?.jobInfoId || recentJobs[0]?.id;
    if (!jobs.length) {
      nextSteps.push({ title: "Choose a target role", description: "Create a job description to tailor your preparation.", href: "/resumeanalyze/new", action: "Create job description" });
    } else {
      if (!latestAnalysis) nextSteps.push({ title: "Analyze your resume", description: "Get feedback tailored to your target job.", href: `/resumeanalyze/${targetId}/new`, action: "Upload resume" });
      if (improvements.some((item) => item.type === "major-improvement")) nextSteps.push({ title: "Review your resume priorities", description: `Address the major improvements identified for ${latestAnalysis.jobName}.`, href: latestAnalysis.href, action: "Review analysis" });
      if (pendingFeedback) nextSteps.push({ title: "Get interview feedback", description: `Review your practice for ${nameFor(pendingFeedback.jobInfoId)}.`, href: `/mockinterview/${pendingFeedback.jobInfoId}/interviews/${pendingFeedback._id}`, action: "Open interview" });
      if (!interviewCount) nextSteps.push({ title: "Practice your first interview", description: "Build confidence with a voice interview for your target role.", href: `/mockinterview/${targetId}/interviews/new`, action: "Start interview" });
      if (!questionCount) nextSteps.push({ title: "Try a technical question", description: "Choose a difficulty and practice explaining your answer.", href: `/questions/${targetId}/practice`, action: "Practice questions" });
      if (!nextSteps.length) nextSteps.push({ title: "Keep your preparation moving", description: "Practice another technical question for your target role.", href: `/questions/${targetId}/practice`, action: "Continue practice" });
    }

    res.set("Cache-Control", "private, no-store");
    return res.json({ stats: { interviewCount, questionCount, savedJobCount }, latestAnalysis, improvements: improvements.slice(0, 4), recentJobs, recentActivity: activity.slice(0, 5), nextSteps: nextSteps.slice(0, 3) });
  } catch (error) {
    console.error("Error loading dashboard:", error.message);
    return res.status(500).json({ message: "Failed to load your dashboard" });
  }
}
