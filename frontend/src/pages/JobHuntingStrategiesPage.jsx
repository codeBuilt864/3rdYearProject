import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function JobHuntingStrategiesPage() {
  const navigate = useNavigate();

  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // fetch job hunting strategies data
    // setStrategies(data);
  }, []);

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel - Strategies List */}
          <Panel defaultSize={35} minSize={25}>
            <div className="h-full p-4 border-r border-base-300 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Job Hunting Strategies</h2>
              <div className="space-y-2">
                {strategies.length > 0 ? (
                  strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      onClick={() => setSelectedStrategy(strategy)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedStrategy?.id === strategy.id
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      <p className="font-semibold">{strategy.title}</p>
                      <p className="text-sm opacity-75">{strategy.category}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/60">No strategies available</p>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* Right panel - Strategy Details */}
          <Panel defaultSize={65} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Strategy Overview */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full p-4 border-b border-base-300 overflow-y-auto">
                  {selectedStrategy ? (
                    <div>
                      <h2 className="text-3xl font-bold mb-4">
                        {selectedStrategy.title}
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-base-content/60 mb-2">
                            Category
                          </p>
                          <div className="badge badge-primary">
                            {selectedStrategy.category}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/60 mb-2">
                            Description
                          </p>
                          <p className="text-base leading-relaxed">
                            {selectedStrategy.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base-content/60">
                      Select a strategy to view details
                    </p>
                  )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Action Steps */}
              <Panel defaultSize={50} minSize={30}>
                <div className="h-full p-4 overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4">Action Steps</h2>
                  {selectedStrategy ? (
                    <div>
                      {selectedStrategy.steps ? (
                        <ol className="list-decimal list-inside space-y-2">
                          {selectedStrategy.steps.map((step, idx) => (
                            <li key={idx} className="text-base-content/80">
                              {step}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-base-content/60">
                          No action steps available
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-base-content/60">
                      Select a strategy to see action steps
                    </p>
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

export default JobHuntingStrategiesPage;
