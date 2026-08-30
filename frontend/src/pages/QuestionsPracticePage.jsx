import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useAuth } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import MarkdownRenderer from "../components/MarkdownRenderer";

const DIFFICULTIES = ["easy", "medium", "hard"];
const API_URL = import.meta.env.VITE_API_URL;

// status: "init" | "awaiting-answer" | "awaiting-next"
function QuestionsPracticePage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [status, setStatus] = useState("init");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const questionIdRef = useRef(null);

  async function streamResponse(url, body, onChunk, onDone) {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Stream error:", text);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("0:")) {
            // text chunk
            const text = JSON.parse(line.slice(2));
            onChunk(text);
          } else if (line.startsWith("2:")) {
            // data chunk — array of objects
            const data = JSON.parse(line.slice(2));
            if (Array.isArray(data)) {
              for (const item of data) {
                if (item.questionId) questionIdRef.current = item.questionId;
              }
            }
          }
        }
      }
      onDone();
    } catch (err) {
      console.error("Streaming failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGenerateQuestion(difficulty) {
    setQuestion("");
    setFeedback("");
    setAnswer("");
    setStatus("init");
    questionIdRef.current = null;
    streamResponse(
      `${API_URL}/api/questions/generate-question`,
      { jobInfoId, difficulty },
      (chunk) => setQuestion((prev) => prev + chunk),
      () => setStatus("awaiting-answer")
    );
  }

  function handleAnswer() {
    if (!answer.trim() || !questionIdRef.current) return;
    streamResponse(
      `${API_URL}/api/questions/generate-feedback`,
      { questionId: questionIdRef.current, answer: answer.trim() },
      (chunk) => setFeedback((prev) => prev + chunk),
      () => setStatus("awaiting-next")
    );
  }

  function handleSkip() {
    setQuestion("");
    setFeedback("");
    setAnswer("");
    setStatus("init");
    questionIdRef.current = null;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col overflow-hidden">
      <Navbar />

      {/* Header bar */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(`/questions/${jobInfoId}`)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm flex-shrink-0"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        {/* Controls */}
        <div className="flex gap-2 flex-wrap justify-center">
          {status === "awaiting-answer" ? (
            <>
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-[#7B5CFF]/40 text-white/70 hover:text-white hover:border-[#7B5CFF]/70 disabled:opacity-40 transition-all text-sm font-semibold"
              >
                {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Skip"}
              </button>
              <button
                onClick={handleAnswer}
                disabled={isLoading || !answer.trim() || !questionIdRef.current}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all text-sm font-semibold hover:scale-[1.02]"
              >
                {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Answer"}
              </button>
            </>
          ) : (
            DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => handleGenerateQuestion(d)}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all text-sm font-semibold hover:scale-[1.02] capitalize"
              >
                {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : d}
              </button>
            ))
          )}
        </div>

        <div className="flex-shrink-0 w-16 hidden md:block" />
      </div>

      {/* Split panels */}
      <div className="flex-1 border-t border-[#7B5CFF]/20 overflow-hidden">
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left: question + feedback */}
          <Panel defaultSize={50} minSize={20}>
            <PanelGroup direction="vertical" className="h-full">
              {/* Question panel */}
              <Panel defaultSize={question && feedback ? 30 : 100} minSize={10}>
                <div className="h-full overflow-y-auto p-6">
                  {!question ? (
                    <p className="text-white/40 flex items-center justify-center h-full text-center">
                      Select a difficulty above to get your first question.
                    </p>
                  ) : (
                    <MarkdownRenderer>{question}</MarkdownRenderer>
                  )}
                </div>
              </Panel>

              {/* Feedback panel — only shown when feedback exists */}
              {feedback && (
                <>
                  <PanelResizeHandle className="h-1 bg-[#7B5CFF]/20 hover:bg-[#7B5CFF]/50 transition-colors cursor-row-resize" />
                  <Panel defaultSize={70} minSize={10}>
                    <div className="h-full overflow-y-auto p-6 border-t border-[#7B5CFF]/20">
                      <MarkdownRenderer>{feedback}</MarkdownRenderer>
                    </div>
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-[#7B5CFF]/20 hover:bg-[#7B5CFF]/50 transition-colors cursor-col-resize" />

          {/* Right: answer textarea */}
          <Panel defaultSize={50} minSize={20}>
            <div className="h-full flex flex-col">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={status !== "awaiting-answer"}
                placeholder={
                  status === "init"
                    ? "Your answer will go here..."
                    : status === "awaiting-answer"
                    ? "Type your answer here..."
                    : "Select a difficulty to start a new question."
                }
                className="flex-1 w-full p-6 bg-transparent text-white/90 resize-none focus:outline-none placeholder:text-white/30 text-base disabled:cursor-default"
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default QuestionsPracticePage;
