import assert from "node:assert/strict";
import { afterEach, mock, test } from "node:test";
import { getDashboard } from "../src/controllers/dashboardController.js";
import JobInfo from "../src/models/JobDescription.js";
import ResumeAnalysis from "../src/models/ResumeAnalysis.js";
import MockInterview from "../src/models/MockInterview.js";
import Question from "../src/models/Question.js";
import SavedJob from "../src/models/SavedJob.js";

afterEach(() => mock.restoreAll());

function response() {
  return { statusCode: 200, headers: {}, set(key, value) { this.headers[key] = value; return this; }, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
}
const request = (userId = "owner") => ({ auth: () => ({ userId }), query: { clerkUserId: "another-user" } });
const job = { _id: "job-1", name: "Backend application", title: "Engineer", experienceLevel: "junior", updatedAt: "2026-11-01T00:00:00Z" };

function fixtures(values = {}) {
  const calls = [];
  function query(model, method, result) {
    mock.method(model, method, (filter) => {
      const call = { model: model.modelName, method, filter };
      calls.push(call);
      return {
        select(fields) { call.fields = fields; return this; },
        sort(order) { call.sort = order; return this; },
        limit(limit) { call.limit = limit; return this; },
        async lean() { return result; },
      };
    });
  }
  function count(model, value) {
    mock.method(model, "countDocuments", async (filter) => {
      calls.push({ model: model.modelName, method: "countDocuments", filter });
      return value;
    });
  }
  query(JobInfo, "find", values.jobs || []);
  query(ResumeAnalysis, "find", values.analyses || []);
  query(MockInterview, "find", values.interviews || []);
  query(MockInterview, "findOne", values.pendingFeedback || null);
  query(Question, "find", values.questions || []);
  query(SavedJob, "find", values.savedJobs || []);
  count(MockInterview, values.interviewCount || 0);
  count(Question, values.questionCount || 0);
  count(SavedJob, values.savedJobCount || 0);
  return calls;
}

test("unauthenticated requests never query user data", async () => {
  const calls = fixtures();
  const res = response();
  await getDashboard(request(null), res);
  assert.equal(res.statusCode, 401);
  assert.equal(calls.length, 0);
});

test("new users see honest zero counts, no score, and a starting action", async () => {
  fixtures();
  const res = response();
  await getDashboard(request(), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body.stats, { interviewCount: 0, questionCount: 0, savedJobCount: 0 });
  assert.equal(res.body.latestAnalysis, null);
  assert.deepEqual(res.body.recentActivity, []);
  assert.deepEqual(res.body.improvements, []);
  assert.equal(res.body.nextSteps[0].href, "/resumeanalyze/new");
  assert.equal(res.headers["Cache-Control"], "private, no-store");
});

test("every query is scoped to the session owner, not a supplied user ID", async () => {
  const calls = fixtures({ jobs: [job] });
  await getDashboard(request(), response());
  for (const call of calls) {
    if (["JobInfo", "SavedJob"].includes(call.model)) assert.equal(call.filter.clerkUserId, "owner");
    else assert.deepEqual(call.filter.jobInfoId, { $in: ["job-1"] });
  }
  // Do not retrieve entire transcripts, job listings, or question answers for a dashboard.
  assert.ok(!calls.find((call) => call.model === "MockInterview" && call.method === "find").fields.includes("transcript"));
});

test("users without owned jobs cannot receive orphaned preparation records", async () => {
  const calls = fixtures();
  await getDashboard(request(), response());
  for (const call of calls.filter((call) => !["JobInfo", "SavedJob"].includes(call.model))) {
    assert.deepEqual(call.filter.jobInfoId, { $in: [] });
  }
});

test("interview counts and activity require recorded nonblank candidate speech", async () => {
  const calls = fixtures({ jobs: [job], interviewCount: 2, questionCount: 4, savedJobCount: 3 });
  const res = response();
  await getDashboard(request(), res);
  for (const call of calls.filter((call) => call.model === "MockInterview")) {
    assert.deepEqual(call.filter.transcript, { $elemMatch: { role: "user", content: { $regex: "\\S" } } });
  }
  assert.deepEqual(res.body.stats, { interviewCount: 2, questionCount: 4, savedJobCount: 3 });
});

test("uses completed resume scores, prioritizes major improvements, and sorts activity", async () => {
  const calls = fixtures({
    jobs: [job], interviewCount: 1, questionCount: 1,
    analyses: [{ _id: "analysis-1", jobInfoId: "job-1", overallScore: 0, fileName: "resume.pdf", createdAt: "2026-11-10T09:00:00Z", ats: { feedback: [
      { type: "strength", name: "Contact details", message: "Present" },
      { type: "minor-improvement", name: "Formatting", message: "Simplify headings" },
      { type: "major-improvement", name: "Keywords", message: "Include relevant technologies" },
    ] } }],
    questions: [{ _id: "question-1", jobInfoId: "job-1", difficulty: "easy", createdAt: "2026-11-11T09:00:00Z" }],
    savedJobs: [{ _id: "saved-1", title: "Developer", company: "Example", createdAt: "2026-11-12T09:00:00Z" }],
  });
  const res = response();
  await getDashboard(request(), res);
  assert.deepEqual(calls.find((call) => call.model === "ResumeAnalysis").filter.overallScore, { $gte: 0, $lte: 10 });
  assert.equal(res.body.latestAnalysis.overallScore, 0);
  assert.equal(res.body.latestAnalysis.jobName, job.name);
  assert.deepEqual(res.body.improvements.map((item) => item.type), ["major-improvement", "minor-improvement"]);
  assert.deepEqual(res.body.recentActivity.map((item) => item.type), ["saved", "question", "resume"]);
  assert.equal(res.body.nextSteps[0].href, "/resumeanalyze/job-1/analyses/analysis-1");
});

test("pending interview feedback links to the existing interview detail page", async () => {
  fixtures({ jobs: [job], interviewCount: 1, pendingFeedback: { _id: "interview-1", jobInfoId: "job-1" } });
  const res = response();
  await getDashboard(request(), res);
  assert.ok(res.body.nextSteps.some((step) => step.href === "/mockinterview/job-1/interviews/interview-1"));
  assert.ok(!res.body.nextSteps.some((step) => step.title === "Practice your first interview"));
});

test("activity is bounded and failures never expose database details", async () => {
  const calls = fixtures({ jobs: [job] });
  await getDashboard(request(), response());
  for (const call of calls.filter((call) => call.method === "find" && call.model !== "JobInfo")) assert.equal(call.limit, 5);
  mock.restoreAll();
  mock.method(JobInfo, "find", () => { throw new Error("Sensitive database detail"); });
  mock.method(console, "error", () => {});
  const res = response();
  await getDashboard(request(), res);
  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { message: "Failed to load your dashboard" });
});
