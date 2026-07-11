import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";

function MockInterviewNewJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    title: "",
    experienceLevel: "junior",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axiosInstance.post("/api/mock-interview/job-infos", {
        ...form,
        title: form.title || null,
      });
      navigate(`/mockinterview/${data.jobInfo._id}`);
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
          onClick={() => navigate("/mockinterview")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <h1 className="text-3xl md:text-4xl font-black text-white">Create New Job Description</h1>

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
                placeholder="Paste the job description here. Be as specific as possible — the more detail you provide, the more realistic the interview will be."
                className="w-full px-4 py-3 bg-[#0b1220] text-white rounded-xl border border-[#7B5CFF]/30 focus:border-[#7B5CFF]/60 focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all resize-none placeholder:text-white/40"
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
        </div>
      </div>
    </div>
  );
}

export default MockInterviewNewJobPage;
