import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, Loader2Icon, XIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import CondensedMessages from "../components/MockInterview/CondensedMessages";
import MarkdownRenderer from "../components/MarkdownRenderer";
import axiosInstance from "../lib/axios";
import { condenseChatMessages } from "../lib/condenseChatMessages";
import toast from "react-hot-toast";
import { HumeClient } from "hume";

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MockInterviewDetailPage() {
  const { jobInfoId, interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [condensedMessages, setCondensedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axiosInstance.get(
          `/api/mock-interview/interviews/${interviewId}`
        );
        setInterview(data.interview);

        // Fetch chat messages from backend (which calls Hume)
        if (data.interview.humeChatId) {
          const msgsRes = await axiosInstance.get(
            `/api/mock-interview/interviews/${interviewId}/messages`
          );
          setCondensedMessages(condenseChatMessages(msgsRes.data.messages));
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load interview");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [interviewId]);

  async function handleGenerateFeedback() {
    setGeneratingFeedback(true);
    try {
      const { data } = await axiosInstance.post(
        `/api/mock-interview/interviews/${interviewId}/feedback`,
        { userName: interview?.jobInfoId?.name ?? "Candidate" }
      );
      setInterview((prev) => ({ ...prev, feedback: data.feedback }));
      setShowFeedback(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate feedback");
    } finally {
      setGeneratingFeedback(false);
    }
  }

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
          onClick={() => navigate(`/mockinterview/${jobInfoId}`)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          All Interviews
        </button>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Interview: {interview && formatDateTime(interview.createdAt)}
            </h1>
            <p className="text-white/50 text-sm">{interview?.duration}</p>
          </div>

          {interview?.feedback ? (
            <button
              onClick={() => setShowFeedback(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white rounded-xl font-semibold hover:scale-[1.02] transition-all text-sm flex-shrink-0"
            >
              View Feedback
            </button>
          ) : (
            <button
              onClick={handleGenerateFeedback}
              disabled={generatingFeedback}
              className="px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-semibold transition-all text-sm flex-shrink-0 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {generatingFeedback && <Loader2Icon className="size-4 animate-spin" />}
              {generatingFeedback ? "Generating..." : "Generate Feedback"}
            </button>
          )}
        </div>

        {/* Transcript */}
        <CondensedMessages
          messages={condensedMessages}
          className="max-w-3xl"
        />
      </div>

      {/* Feedback overlay dialog */}
      {showFeedback && interview?.feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b1220] border border-[#7B5CFF]/30 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-[#7B5CFF]/20">
            <div className="flex items-center justify-between p-6 border-b border-[#7B5CFF]/20">
              <h2 className="text-xl font-bold text-white">Feedback</h2>
              <button
                onClick={() => setShowFeedback(false)}
                className="p-1 rounded-lg hover:bg-[#7B5CFF]/20 transition-colors"
              >
                <XIcon className="size-5 text-white/60" />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <MarkdownRenderer>{interview.feedback}</MarkdownRenderer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockInterviewDetailPage;
