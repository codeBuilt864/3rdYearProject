import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Navbar from "../components/Navbar";
import MarkdownRenderer from "../components/MarkdownRenderer";

const DIFFICULTIES = ["easy", "medium", "hard"];

// status: "init" | "awaiting-answer" | "awaiting-next"
function QuestionsPracticePage() {
  const { jobInfoId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("init");
  const [answer, setAnswer] = useState("");

  const {
    complete: generateQuestion,
    completion: question,
    setCompletion: setQuestion,
    isLoading: isGeneratingQuestion,
    data: questionData,
  } = useCompletion({
    api: "/api/questions/generate-question",
    onFinish: () => setStatus("awaiting-answer"),
    onError: (err) => console.error("Question error:", err),
  });

  const {
    complete: generateFeedback,
    completion: feedback,
    setCompletion: setFeedback,
    isLoading: isGeneratingFeedback,
  } = useCompletion({
    api: "/api/questions/generate-feedback",
    onFinish: () => setStatus("awaiting-next"),
    onError: (err) => console.error("Feedback error:", err),
  });

  const questionId = useMemo(() => {
    const last = questionData?.at(-1);
    if (!last || typeof last !== "object") return null;
    return last.questionId ?? null;
  }, [questionData]);

  const isLoading = isGeneratingQuestion || isGeneratingFeedback;

  function handleGenerateQuestion(difficulty) {
    setQuestion("");
    setFeedback("");
    setAnswer("");
    setStatus("init");
    generateQuestion(difficulty, { body: { jobInfoId, difficulty } });
  }

  function handleAnswer() {
    if (!answer.trim() || !questionId) return;
    generateFeedback(answer.trim(), { body: { questionId, answer: answer.trim() } });
  }

  function handleSkip() {
    setQuestion("");
    setFeedback("");
    setAnswer("");
    setStatus("init");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
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
                disabled={isLoading || !answer.trim() || !questionId}
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
