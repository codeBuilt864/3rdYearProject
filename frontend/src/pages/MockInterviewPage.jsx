import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function MockInterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interviewData, setInterviewData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      // fetch interview data based on id
      // setInterviewData(data);
    }
  }, [id]);

  const handleSubmitAnswer = async () => {
    setIsLoading(true);
    // Implement interview answer submission and feedback logic here
    setIsLoading(false);
  };

  const handleNextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
    setUserAnswer("");
    setFeedback(null);
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel - Interview Question */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full p-4 border-r border-base-300 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Mock Interview</h2>
              {currentQuestion && (
                <div>
                  <p className="text-sm text-base-content/60 mb-2">
                    Question {questionIndex + 1}
                  </p>
                  <p className="text-lg font-semibold mb-4">{currentQuestion}</p>
                </div>
              )}
              {!currentQuestion && (
                <p>Start the interview to see questions</p>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* Right panel - Answer and Feedback */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - User Answer Input */}
              <Panel defaultSize={60} minSize={30}>
                <div className="h-full p-4 border-b border-base-300 overflow-y-auto flex flex-col">
                  <h2 className="text-lg font-bold mb-4">Your Answer</h2>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="textarea textarea-bordered flex-1 mb-4"
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isLoading || !userAnswer}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? "Analyzing..." : "Submit Answer"}
                  </button>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Feedback and Navigation */}
              <Panel defaultSize={40} minSize={30}>
                <div className="h-full p-4 overflow-y-auto flex flex-col">
                  <h2 className="text-lg font-bold mb-4">Feedback</h2>
                  {feedback && (
                    <div className="mb-4">
                      <p className="text-base-content/80 mb-4">{feedback}</p>
                    </div>
                  )}
                  {!feedback && (
                    <p className="text-base-content/60">
                      Submit your answer to receive feedback
                    </p>
                  )}
                  {feedback && (
                    <button
                      onClick={handleNextQuestion}
                      className="btn btn-primary mt-auto"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default MockInterviewPage;
