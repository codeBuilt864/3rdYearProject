import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, Loader2Icon, PlayIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";

function QuestionsJobPage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/api/job-descriptions/${jobInfoId}`)
      .then(({ data }) => setJobInfo(data.jobInfo))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobInfoId]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
        <button
          onClick={() => navigate("/questions")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black text-white">{jobInfo?.name}</h1>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
              {jobInfo?.experienceLevel}
            </span>
            {jobInfo?.title && (
              <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
                {jobInfo.title}
              </span>
            )}
          </div>
          <p className="text-white/60 text-sm line-clamp-4">{jobInfo?.description}</p>
        </div>

        <div className="bg-[#071025] border border-[#7B5CFF]/20 rounded-2xl p-8 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Answer Technical Questions</h2>
            <p className="text-white/60 text-sm mt-1">
              Challenge yourself with AI-generated questions tailored to this job. Choose a difficulty, answer the question, and get instant feedback.
            </p>
          </div>
          <button
            onClick={() => navigate(`/questions/${jobInfoId}/practice`)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white rounded-xl font-bold hover:scale-[1.02] transition-all"
          >
            <PlayIcon className="size-4" />
            Start Practice
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionsJobPage;
