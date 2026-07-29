import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";

const EXPERIENCE_LABELS = {
  junior: "Junior",
  "mid-level": "Mid-level",
  senior: "Senior",
};

function ResumeAnalyzeNewJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    title: "",
    experienceLevel: "junior",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockJobInfos, setMockJobInfos] = useState([]);
  const [selectedMockId, setSelectedMockId] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/api/mock-interview/job-infos")
      .then(({ data }) => setMockJobInfos(data.jobInfos ?? []))
      .catch(console.error);
  }, []);

  function handlePickMockJob(jobInfo) {
    setSelectedMockId(jobInfo._id);
    setForm({
      name: jobInfo.name,
      title: jobInfo.title ?? "",
      experienceLevel: jobInfo.experienceLevel,
      description: jobInfo.description,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/api/resume-analyzer/job-infos", {
        ...form,
        title: form.title || null,
      });
      navigate(`/resumeanalyze/${data.jobInfo._id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
        <button
          onClick={() => navigate("/resumeanalyze")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <h1 className="text-3xl md:text-4xl font-black text-white">New Job Description</h1>
        <p className="text-white/60">
          Enter the job you're applying for. The AI will use this to analyze your resume.
        </p>

        {/* Import from mock interview */}
        {mockJobInfos.length > 0 && (
          <div className="bg-[#071025] border border-[#7B5CFF]/20 rounded-2xl p-6 space-y-3">
            <p className="text-sm font-semibold text-white/70">
              Import from Mock Interview
            </p>
            <div className="flex flex-wrap gap-2">
              {mockJobInfos.map((j) => (
                <button
                  key={j._id}
                  type="button"
                  onClick={() => handlePickMockJob(j)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    selectedMockId === j._id
                      ? "bg-[#7B5CFF] border-[#7B5CFF] text-white"
                      : "bg-[#7B5CFF]/10 border-[#7B5CFF]/30 text-white/70 hover:border-[#7B5CFF]/60 hover:text-white"
                  }`}
                >
                  <span>{j.name}</span>
                  <span className="ml-2 text-xs opacity-60">{EXPERIENCE_LABELS[j.experienceLevel]}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/40">Clicking a job pre-fills the form below. You can edit before saving.</p>
          </div>
        )}

        <div className="bg-[#071025] border border-[#7B5CFF]/20 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Google SWE Application"
                className="w-full px-4 py-3 bg-[#0b1220] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all placeholder:text-white/40"
              />
              <p className="text-xs text-white/50 mt-1">Displayed in the UI for easy identification.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Job Title (optional)</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-3 bg-[#0b1220] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all placeholder:text-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-1">Experience Level</label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0b1220] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all"
                >
                  <option value="junior">Junior</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-1">Job Description</label>
              <textarea
                required
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Paste the job description here. The more detail you provide, the more accurate the resume analysis will be."
                className="w-full px-4 py-3 bg-[#0b1220] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all resize-none placeholder:text-white/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2Icon className="size-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzeNewJobPage;
