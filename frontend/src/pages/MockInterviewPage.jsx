import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import {
  Briefcase,
  BookOpen,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function MockInterviewPage() {
  const navigate = useNavigate();

  const [stage, setStage] = useState("setup"); // setup, interview, summary
  const [formData, setFormData] = useState({
    role: "",
    level: "mid-level",
    skills: "",
  });
  const POPULAR_ROLES = [
    "Frontend Engineer",
    "Backend Engineer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "QA Engineer",
    "Mobile Developer",
    "UI/UX Designer",
    "Systems Engineer",
  ];
  const [roleOption, setRoleOption] = useState(() =>
    POPULAR_ROLES.includes(formData.role) && formData.role ? formData.role : "custom"
  );

  // Dropdown / pills role picker — shows popular roles as pills in a dropdown panel
  function DropdownRolePicker({ value, onChange, options = [] }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
      function onDocClick(e) {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", onDocClick);
      return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const filtered = query
      ? options.filter((r) => r.toLowerCase().includes(query.toLowerCase()))
      : options;

    return (
      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          className="w-full text-left px-4 py-3 bg-[#071025] rounded-xl border border-slate-700 text-white flex items-center justify-between"
        >
          <span className="truncate">{value || 'Select a role or type to search'}</span>
          <svg className={`w-4 h-4 ml-3 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" /></svg>
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full max-h-72 overflow-auto bg-[#071025] border border-slate-700 rounded-lg p-4 shadow-xl">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles..."
              className="w-full mb-3 px-3 py-2 bg-[#0b1220] rounded-md border border-slate-700 text-white focus:outline-none"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filtered.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { onChange(r); setOpen(false); setQuery(''); }}
                  className={`px-3 py-2 text-sm rounded-full text-white bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 hover:from-[#7B5CFF]/30 hover:to-[#A66CFF]/30 transition-all`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-xs text-white/60">Or enter a custom role</label>
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g., Senior ML Engineer"
                className="w-full mt-2 px-3 py-2 bg-[#0b1220] rounded-md border border-slate-700 text-white focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Handle setup form submission
  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!formData.role.trim()) {
      alert("Please enter a role");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-interview/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          level: formData.level,
          skills: formData.skills,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || "Failed to generate questions";
        console.error("API Error:", errorMsg);
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setQuestions(data.questions);
      setStage("interview");
      setCurrentFeedback(null);
    } catch (error) {
      console.error("Interview start error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit answer and get feedback
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert("Please provide an answer");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-interview/get-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: currentAnswer,
          role: formData.role,
          level: formData.level,
        }),
      });

      if (!res.ok) throw new Error("Failed to get feedback");

      const feedback = await res.json();
      setCurrentFeedback(feedback);
      setAnswers([...answers, currentAnswer]);
      setScores([...scores, feedback.score]);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer("");
      setCurrentFeedback(null);
    } else {
      // Interview complete, get summary
      handleFinishInterview();
    }
  };

  // Get interview summary
  const handleFinishInterview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-interview/get-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          answers,
          scores,
        }),
      });

      if (!res.ok) throw new Error("Failed to get summary");

      const summaryData = await res.json();
      setSummary(summaryData);
      setStage("summary");
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Restart interview
  const handleRestart = () => {
    setStage("setup");
    setFormData({ role: "", level: "mid-level", skills: "" });
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScores([]);
    setCurrentAnswer("");
    setCurrentFeedback(null);
    setSummary(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />

      {/* ========== SETUP STAGE ========== */}
      {stage === "setup" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 backdrop-blur-md border border-[#7B5CFF]/50 text-white rounded-3xl p-10 mb-8 shadow-2xl shadow-[#7B5CFF]/20 hover:shadow-2xl hover:shadow-[#7B5CFF]/30 transition-all duration-300">
              <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent">AI Mock Interview</h1>
              <p className="text-lg text-white/80">
                Practice for real interviews with AI-powered questions tailored to your role
              </p>
            </div>

            <div className="bg-[#071025] border border-slate-700 rounded-2xl shadow-md p-8">
              <form onSubmit={handleStartInterview} className="space-y-6">
                {/* Job Role */}
                <div>
                  <label className="block mb-3">
                    <span className="text-lg font-bold flex items-center gap-2 text-white mb-2">
                      <Briefcase size={20} className="text-[#7B5CFF]" />
                      Job Role / Position
                    </span>
                  </label>
                  <div>
                    <roleOption
                      value={formData.role}
                      onChange={(v) => setFormData({ ...formData, role: v })}
                      options={POPULAR_ROLES}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-2">
                    Choose a common role from the list for faster setup, or type your own.
                  </p>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block mb-3">
                    <span className="text-lg font-bold flex items-center gap-2 text-white mb-2">
                      <BookOpen size={20} className="text-[#7B5CFF]" />
                      Experience Level
                    </span>
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all"
                  >
                    <option value="junior" className="bg-[#16213e]">Junior (0-2 years)</option>
                    <option value="mid-level" className="bg-[#16213e]">Mid-level (2-5 years)</option>
                    <option value="senior" className="bg-[#16213e]">Senior (5+ years)</option>
                  </select>
                </div>

                {/* Skills / Focus Areas */}
                <div>
                  <label className="block mb-3">
                    <span className="text-lg font-bold flex items-center gap-2 text-white mb-2">
                      <MessageSquare size={20} className="text-[#7B5CFF]" />
                      Key Skills / Focus Areas (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., React, Node.js, System Design, Problem-solving"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all placeholder:text-white/50"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:cursor-not-allowed duration-300"
                >
                  {isLoading ? "Generating Questions..." : "Start Interview"}
                </button>
              </form>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-white/70 text-sm">
                <div className="flex gap-2 p-3 bg-[#7B5CFF]/10 rounded-lg">
                  <CheckCircle className="text-[#7B5CFF] flex-shrink-0" size={20} />
                  <span>5 role-specific questions</span>
                </div>
                <div className="flex gap-2 p-3 bg-[#7B5CFF]/10 rounded-lg">
                  <CheckCircle className="text-[#7B5CFF] flex-shrink-0" size={20} />
                  <span>Real-time AI feedback</span>
                </div>
                <div className="flex gap-2 p-3 bg-[#7B5CFF]/10 rounded-lg">
                  <CheckCircle className="text-[#7B5CFF] flex-shrink-0" size={20} />
                  <span>Improvement tips</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== INTERVIEW STAGE ========== */}
      {stage === "interview" && questions.length > 0 && (
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Left: Question and Instructions */}
              <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 flex flex-col hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-white">
                      Question {currentQuestionIndex + 1}/{questions.length}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-[#7B5CFF]/20 rounded-full overflow-hidden border border-[#7B5CFF]/30">
                        <div
                          className="h-full bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] transition-all duration-500"
                          style={{
                            width: `${
                              ((currentQuestionIndex + 1) / questions.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/10 rounded-2xl p-6 border border-[#7B5CFF]/40 mb-6">
                  <p className="text-lg leading-relaxed font-semibold text-white">
                    {questions[currentQuestionIndex]}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-white/70">
                  <p className="font-semibold text-white">💡 Tips:</p>
                  <ul className="space-y-2 pl-4">
                    <li className="flex gap-2"><span>•</span><span>Use the STAR method (Situation, Task, Action, Result)</span></li>
                    <li className="flex gap-2"><span>•</span><span>Provide specific examples from your experience</span></li>
                    <li className="flex gap-2"><span>•</span><span>Keep your answer concise but detailed</span></li>
                    <li className="flex gap-2"><span>•</span><span>Show enthusiasm and problem-solving skills</span></li>
                  </ul>
                </div>

                <div className="flex-1" />
              </div>

              {/* Right: Answer Input and Feedback */}
              <div className="flex flex-col gap-6">
                {/* Answer Input */}
                <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-6 flex-1 flex flex-col hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-4">Your Answer</h3>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Be detailed and specific."
                    className="flex-1 p-4 bg-gradient-to-br from-[#7B5CFF]/5 to-[#A66CFF]/5 text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all resize-none placeholder:text-white/50"
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isLoading || !currentAnswer.trim()}
                    className="mt-4 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:cursor-not-allowed duration-300"
                  >
                    {isLoading ? "Analyzing..." : "Submit Answer"}
                  </button>
                </div>

                {/* Feedback Box */}
                {currentFeedback && (
                  <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-6 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                    <div className="flex items-start gap-3 mb-6">
                      <BarChart3 className="text-[#7B5CFF] flex-shrink-0 mt-1" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-white">Feedback</h3>
                        <p className="text-4xl font-black bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent">
                          {currentFeedback.score}/10
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentFeedback.strengths && (
                        <div>
                          <p className="font-semibold text-green-400 mb-2">
                            ✓ Strengths:
                          </p>
                          <ul className="space-y-1 text-sm text-white/80">
                            {currentFeedback.strengths.map((s, i) => (
                              <li key={i} className="flex gap-2"><span>•</span><span>{s}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentFeedback.improvements && (
                        <div>
                          <p className="font-semibold text-amber-400 mb-2">
                            ⚠ Areas to Improve:
                          </p>
                          <ul className="space-y-1 text-sm text-white/80">
                            {currentFeedback.improvements.map((i, idx) => (
                              <li key={idx} className="flex gap-2"><span>•</span><span>{i}</span></li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {currentFeedback.tips && (
                        <div>
                          <p className="font-semibold text-blue-400 mb-2">
                            💡 Tip:
                          </p>
                          <p className="text-sm text-white/80">
                            {currentFeedback.tips}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl duration-300"
                    >
                      {currentQuestionIndex + 1 === questions.length
                        ? "Finish & Get Summary"
                        : "Next Question"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== SUMMARY STAGE ========== */}
      {stage === "summary" && summary && (
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Overall Score */}
            <div className="bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 backdrop-blur-md border border-[#7B5CFF]/50 text-white rounded-3xl p-10 mb-8 shadow-2xl shadow-[#7B5CFF]/20 hover:shadow-2xl hover:shadow-[#7B5CFF]/30 transition-all duration-300">
              <h1 className="text-5xl font-black mb-3">Interview Complete! 🎉</h1>
              <p className="text-lg text-white/80 mb-6">
                Here's your performance summary and personalized improvement plan.
              </p>
              <div className="text-center">
                <p className="text-7xl font-black bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent mb-2">{summary.overallScore}/10</p>
                <p className="text-xl capitalize font-bold text-white">{summary.readiness}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Top Strengths */}
              {summary.topStrengths && (
                <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={28} />
                    Your Strengths
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {summary.topStrengths.map((strength, i) => (
                      <li key={i} className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 p-4 rounded-xl border border-green-500/30 text-green-100">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas to Improve */}
              {summary.keyAreasToImprove && (
                <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="text-amber-400" size={28} />
                    Areas to Improve
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {summary.keyAreasToImprove.map((area, i) => (
                      <li key={i} className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 p-4 rounded-xl border border-amber-500/30 text-amber-100">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Plan */}
              {summary.actionPlan && (
                <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6">📋 Your Action Plan</h2>
                  <ol className="space-y-3">
                    {summary.actionPlan.map((action, i) => (
                      <li key={i} className="flex gap-4 text-white/80">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] font-bold flex-shrink-0 text-sm">{i + 1}</span>
                        <span className="pt-1">{action}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Resources */}
              {summary.resources && (
                <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                  <h2 className="text-2xl font-bold text-white mb-6">📚 Recommended Resources</h2>
                  <ul className="space-y-2">
                    {summary.resources.map((resource, i) => (
                      <li key={i} className="text-white/80 flex gap-2">
                        <span>📖</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Score Breakdown */}
              <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg p-8 hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-6">📊 Question Scores</h2>
                <div className="space-y-4">
                  {scores.map((score, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="font-semibold w-12 text-white">Q{i + 1}:</span>
                      <div className="flex-1 bg-[#7B5CFF]/20 rounded-full h-3 overflow-hidden border border-[#7B5CFF]/30">
                        <div
                          className={`h-full transition-all ${
                            score >= 8
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : score >= 6
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-red-500 to-[#A66CFF]"
                          }`}
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg w-12 text-white">{score}/10</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] duration-300"
                >
                  Try Another Role
                </button>
                <button
                  onClick={() => navigate("/problems")}
                  className="flex-1 py-4 bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 hover:border-[#7B5CFF]/60 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl duration-300"
                >
                  Practice Coding Problems
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterviewPage;
// Force reload
