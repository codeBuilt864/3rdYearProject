import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useVapiInterview from "../hooks/useVapiInterview";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import CondensedMessages from "../components/MockInterview/CondensedMessages";
import FftVisualizer from "../components/MockInterview/FftVisualizer";
import axiosInstance from "../lib/axios";
import { condenseChatMessages } from "../lib/condenseChatMessages";
import toast from "react-hot-toast";

function StartCall({ jobInfo }) {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { status, messages, duration, isMuted, volume, micVolume, start, stop, toggleMute, retrySave } = useVapiInterview({
    jobInfoId, jobInfo, candidateName: user?.fullName || "Candidate", navigate,
  });
  const condensedMessages = useMemo(() => condenseChatMessages(messages), [messages]);
  // Vapi supplies audio levels rather than Hume's FFT bins; retain the existing bar display.
  const micFft = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 1, 0.6].map((scale) => isMuted ? 0 : micVolume * 4 * scale);
  // Connect and save using the existing spinner.
  if (status === "connecting" || status === "saving") {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2Icon className="size-16 animate-spin text-[#7B5CFF]" />
      </div>
    );
  }

  // Live call UI.
  if (status === "open") {
    return (
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div className="max-w-5xl mx-auto w-full px-6 py-6 flex flex-col items-center justify-end gap-4">
          <CondensedMessages
            messages={condensedMessages}
            maxFft={volume * 4}
            className="max-w-3xl w-full"
          />

          {/* Controls bar */}
          <div className="flex gap-5 rounded-2xl border border-[#7B5CFF]/30 bg-[#071025] px-6 py-3 w-fit sticky bottom-6 items-center shadow-xl">
            <button
              className="p-2 rounded-lg hover:bg-[#7B5CFF]/20 transition-colors"
              onClick={toggleMute}
            >
              {isMuted ? (
                <MicOffIcon className="size-5 text-red-400" />
              ) : (
                <MicIcon className="size-5 text-white" />
              )}
            </button>

            <div className="h-8 self-stretch">
              <FftVisualizer fft={micFft} />
            </div>

            <span className="text-sm text-white/50 tabular-nums min-w-[50px] text-center">
              {duration}
            </span>

            <button
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
              onClick={stop}
            >
              <PhoneOffIcon className="size-5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Start the interview, or retry a failed final save.
  return (
    <div className="flex-1 flex items-center justify-center">
      <button
        onClick={status === "save-error" ? retrySave : start}
        className="px-10 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:scale-[1.02] duration-300"
      >
        {status === "save-error" ? "Retry saving interview" : "Start Interview"}
      </button>
    </div>
  );
}

// Load the existing job context before starting a Vapi call.
function MockInterviewCallPage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const jobRes = await axiosInstance.get(`/api/job-descriptions/${jobInfoId}`);
        setJobInfo(jobRes.data.jobInfo);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load interview");
        navigate(`/mockinterview/${jobInfoId}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobInfoId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="size-16 animate-spin text-[#7B5CFF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <StartCall jobInfo={jobInfo} />
    </div>
  );
}

export default MockInterviewCallPage;
