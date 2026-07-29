import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRightIcon, PlusIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";

const EXPERIENCE_LABELS = {
  junior: "Junior",
  "mid-level": "Mid-level",
  senior: "Senior",
};

function JobInfoForm({ onSuccess, existing }) {
  const [form, setForm] = useState({
    name: existing?.name ?? "",
    title: existing?.title ?? "",
    experienceLevel: existing?.experienceLevel ?? "junior",
    description: existing?.description ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...form, title: form.title || null };
      if (existing) {
        await axiosInstance.put(`/api/mock-interview/job-infos/${existing._id}`, payload);
      } else {
        await axiosInstance.post("/api/mock-interview/job-infos", payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-1">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Google SWE Application"
          className="w-full px-4 py-3 bg-[#071025] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all placeholder:text-white/40"
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
            className="w-full px-4 py-3 bg-[#071025] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all placeholder:text-white/40"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-white mb-1">Experience Level</label>
          <select
            value={form.experienceLevel}
            onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
            className="w-full px-4 py-3 bg-[#071025] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all"
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
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Paste the job description here. Be as specific as possible — the more detail you provide, the more realistic the interview will be."
          className="w-full px-4 py-3 bg-[#071025] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all resize-none placeholder:text-white/40"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] disabled:cursor-not-allowed duration-300"
      >
        {isSubmitting ? "Saving..." : "Save Job Information"}
      </button>
    </form>
  );
}

function MockInterviewPage() {
  const navigate = useNavigate();
  const { isLoaded } = useAuth();
  const [jobInfos, setJobInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchJobInfos() {
    try {
      const { data } = await axiosInstance.get("/api/mock-interview/job-infos");
      setJobInfos(data.jobInfos ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isLoaded) fetchJobInfos();
  }, [isLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="size-12 animate-spin text-[#7B5CFF]" />
        </div>
      </div>
    );
  }

  // No job infos yet — show inline create form
  if (jobInfos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
          <h1 className="text-3xl md:text-4xl font-black text-white">AI Mock Interview</h1>
          <p className="text-white/60">
            To get started, enter information about the job you are preparing for. The more specific
            you are, the more realistic the interview will be.
          </p>
          <div className="bg-[#071025] border border-[#7B5CFF]/20 rounded-2xl p-8">
            <JobInfoForm onSuccess={fetchJobInfos} />
          </div>
        </div>
      </div>
    );
  }

  // Has job infos — show list
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-black text-white">Select a Job Description</h1>
          <button
            onClick={() => navigate("/mockinterview/new")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white rounded-xl font-semibold hover:scale-[1.02] transition-all"
          >
            <PlusIcon className="size-4" />
            New
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobInfos.map((jobInfo) => (
            <button
              key={jobInfo._id}
              onClick={() => navigate(`/mockinterview/${jobInfo._id}`)}
              className="text-left bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl p-6 hover:scale-[1.02] hover:border-[#7B5CFF]/60 transition-all flex items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <p className="font-bold text-white text-lg">{jobInfo.name}</p>
                <p className="text-white/60 text-sm line-clamp-3">{jobInfo.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
                    {EXPERIENCE_LABELS[jobInfo.experienceLevel]}
                  </span>
                  {jobInfo.title && (
                    <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
                      {jobInfo.title}
                    </span>
                  )}
                </div>
              </div>
              <ArrowRightIcon className="size-5 text-white/40 flex-shrink-0" />
            </button>
          ))}

          <button
            onClick={() => navigate("/mockinterview/new")}
            className="border-2 border-dashed border-[#7B5CFF]/30 rounded-2xl p-6 flex items-center justify-center gap-2 text-white/50 hover:border-[#7B5CFF]/60 hover:text-white/80 transition-all"
          >
            <PlusIcon className="size-5" />
            New Job Description
          </button>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewPage;
