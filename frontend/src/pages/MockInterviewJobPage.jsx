import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  Loader2Icon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MockInterviewJobPage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const [jobInfo, setJobInfo] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [jobRes, interviewsRes] = await Promise.all([
          axiosInstance.get(`/api/mock-interview/job-infos/${jobInfoId}`),
          axiosInstance.get(`/api/mock-interview/interviews/by-job/${jobInfoId}`),
        ]);
        setJobInfo(jobRes.data.jobInfo);
        setInterviews(interviewsRes.data.interviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
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
      <div className="max-w-5xl mx-auto w-full p-6 space-y-6">
        <button
          onClick={() => navigate("/mockinterview")}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          Dashboard
        </button>

        {/* Job info header */}
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
          <p className="text-white/60 text-sm line-clamp-3">{jobInfo?.description}</p>
        </div>

        {/* Interviews section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Interviews</h2>
            <button
              onClick={() => navigate(`/mockinterview/${jobInfoId}/interviews/new`)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white rounded-xl font-semibold hover:scale-[1.02] transition-all text-sm"
            >
              <PlusIcon className="size-4" />
              New Interview
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New interview card */}
            <button
              onClick={() => navigate(`/mockinterview/${jobInfoId}/interviews/new`)}
              className="border-2 border-dashed border-[#7B5CFF]/30 rounded-2xl p-6 flex items-center justify-center gap-2 text-white/50 hover:border-[#7B5CFF]/60 hover:text-white/80 transition-all min-h-[100px]"
            >
              <PlusIcon className="size-5" />
              New Interview
            </button>

            {/* Past interviews */}
            {interviews.map((interview) => (
              <button
                key={interview._id}
                onClick={() =>
                  navigate(`/mockinterview/${jobInfoId}/interviews/${interview._id}`)
                }
                className="text-left bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl p-6 hover:scale-[1.02] hover:border-[#7B5CFF]/60 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-white">{formatDateTime(interview.createdAt)}</p>
                  <p className="text-white/50 text-sm mt-1">{interview.duration}</p>
                </div>
                <ArrowRightIcon className="size-5 text-white/40 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockInterviewJobPage;
