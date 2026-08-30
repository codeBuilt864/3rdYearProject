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

function QuestionsPage() {
  const navigate = useNavigate();
  const { isLoaded } = useAuth();
  const [jobInfos, setJobInfos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    axiosInstance
      .get("/api/job-descriptions")
      .then(({ data }) => setJobInfos(data.jobInfos ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
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

  if (jobInfos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
          <h1 className="text-3xl md:text-4xl font-black text-white">Technical Questions</h1>
          <p className="text-white/60">
            To get started, enter the job you're preparing for. The AI will generate technical questions tailored to the role and give you feedback on your answers.
          </p>
          <button
            onClick={() => navigate("/questions/new")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white rounded-xl font-bold hover:scale-[1.02] transition-all"
          >
            <PlusIcon className="size-4" />
            Add Job Description
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-black text-white">Select a Job Description</h1>
          <button
            onClick={() => navigate("/questions/new")}
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
              onClick={() => navigate(`/questions/${jobInfo._id}`)}
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
            onClick={() => navigate("/questions/new")}
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

export default QuestionsPage;
