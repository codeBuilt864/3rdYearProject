import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VoiceProvider, useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import CondensedMessages from "../components/MockInterview/CondensedMessages";
import FftVisualizer from "../components/MockInterview/FftVisualizer";
import axiosInstance from "../lib/axios";
import { condenseChatMessages } from "../lib/condenseChatMessages";
import toast from "react-hot-toast";

// ── Inner component — must be inside VoiceProvider ──────────────────────────
function StartCall({ jobInfo, accessToken }) {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { connect, readyState, chatMetadata, callDurationTimestamp, messages, fft, disconnect, isMuted, mute, unmute, micFft } = useVoice();

  const [interviewId, setInterviewId] = useState(null);
  const durationRef = useRef(callDurationTimestamp);
  durationRef.current = callDurationTimestamp;

  // Sync humeChatId to DB when available
  useEffect(() => {
    if (chatMetadata?.chatId == null || interviewId == null) return;
    axiosInstance
      .patch(`/api/mock-interview/interviews/${interviewId}`, { humeChatId: chatMetadata.chatId })
      .catch(console.error);
  }, [chatMetadata?.chatId, interviewId]);

  // Sync duration every 10s
  useEffect(() => {
    if (interviewId == null) return;
    const id = setInterval(() => {
      if (durationRef.current == null) return;
      axiosInstance
        .patch(`/api/mock-interview/interviews/${interviewId}`, { duration: durationRef.current })
        .catch(console.error);
    }, 10000);
    return () => clearInterval(id);
  }, [interviewId]);

  // On disconnect — save final duration and navigate to detail page
  useEffect(() => {
    if (readyState !== VoiceReadyState.CLOSED) return;
    if (interviewId == null) {
      return navigate(`/mockinterview/${jobInfoId}`);
    }
    if (durationRef.current != null) {
      axiosInstance
        .patch(`/api/mock-interview/interviews/${interviewId}`, { duration: durationRef.current })
        .catch(console.error);
    }
    navigate(`/mockinterview/${jobInfoId}/interviews/${interviewId}`);
  }, [readyState, interviewId, jobInfoId, navigate]);

  const condensedMessages = useMemo(() => condenseChatMessages(messages), [messages]);

  // IDLE — show Start Interview button
  if (readyState === VoiceReadyState.IDLE) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={async () => {
            try {
              const { data } = await axiosInstance.post("/api/mock-interview/interviews", {
                jobInfoId,
              });
              setInterviewId(data.interview._id);
              connect({
                auth: { type: "accessToken", value: accessToken },
                configId: import.meta.env.VITE_HUME_CONFIG_ID,
                sessionSettings: {
                  type: "session_settings",
                  variables: {
                    userName: user?.fullName ?? "Candidate",
                    title: jobInfo.title ?? "Not Specified",
                    description: jobInfo.description,
                    experienceLevel: jobInfo.experienceLevel,
                  },
                },
              });
            } catch (err) {
              console.error(err);
              toast.error("Failed to start interview");
            }
          }}
          className="px-10 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:scale-[1.02] duration-300"
        >
          Start Interview
        </button>
      </div>
    );
  }

  // CONNECTING or CLOSED — show spinner
  if (readyState === VoiceReadyState.CONNECTING || readyState === VoiceReadyState.CLOSED) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2Icon className="size-16 animate-spin text-[#7B5CFF]" />
      </div>
    );
  }

  // OPEN — live call UI
  return (
    <div className="flex-1 overflow-y-auto flex flex-col-reverse">
      <div className="max-w-5xl mx-auto w-full px-6 py-6 flex flex-col items-center justify-end gap-4">
        <CondensedMessages
          messages={condensedMessages}
          maxFft={Math.max(...fft)}
          className="max-w-3xl w-full"
        />

        {/* Controls bar */}
        <div className="flex gap-5 rounded-2xl border border-[#7B5CFF]/30 bg-[#071025] px-6 py-3 w-fit sticky bottom-6 items-center shadow-xl">
          <button
            className="p-2 rounded-lg hover:bg-[#7B5CFF]/20 transition-colors"
            onClick={() => (isMuted ? unmute() : mute())}
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
            {callDurationTimestamp}
          </span>

          <button
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
            onClick={disconnect}
          >
            <PhoneOffIcon className="size-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Outer page — fetches token + job info, wraps with VoiceProvider ──────────
function MockInterviewCallPage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [tokenRes, jobRes] = await Promise.all([
          axiosInstance.get("/api/mock-interview/token"),
          axiosInstance.get(`/api/mock-interview/job-infos/${jobInfoId}`),
        ]);
        setAccessToken(tokenRes.data.accessToken);
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
      <VoiceProvider>
        <StartCall jobInfo={jobInfo} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}

export default MockInterviewCallPage;
