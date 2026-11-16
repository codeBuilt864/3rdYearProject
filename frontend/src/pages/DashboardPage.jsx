import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import TemplatesPreview from "../components/TemplatesPreview";
import DashboardOverview from "../components/DashboardOverview";
import useDashboard from "../hooks/useDashboard";

function DashboardPage() {
  const navigate = useNavigate();
  const dashboardQuery = useDashboard();
  const { user } = useUser();
  const firstName = user?.firstName || user?.fullName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF]">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Centralized tools — resume, company research, and interview prep.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#7B5CFF]/8 to-[#A66CFF]/8 rounded-2xl p-6 border border-[#7B5CFF]/20">
              <h2 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div
                  className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate("/resumeanalyze")}
                >
                  <h4 className="font-semibold text-white mb-2">
                    Resume Analyzer
                  </h4>
                  <p className="text-sm text-white/70">
                    Get an ATS-friendly score and clear, prioritized fixes.
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate("/mockinterview")}
                >
                  <h4 className="font-semibold text-white mb-2">
                    Mock Interview
                  </h4>
                  <p className="text-sm text-white/70">
                    Practice rounds with AI feedback to boost interview
                    readiness.
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate("/questions")}
                >
                  <h4 className="font-semibold text-white mb-2">
                    Technical Questions
                  </h4>
                  <p className="text-sm text-white/70">
                    AI-generated questions with instant feedback on your answers.
                  </p>
                </div>

                <div
                  className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => navigate("/strategies")}
                >
                  <h4 className="font-semibold text-white mb-2">
                    Job Strategies
                  </h4>
                  <p className="text-sm text-white/70">
                    Personalized application & networking priorities.
                  </p>
                </div>
              </div>
          </div>

          <DashboardOverview query={dashboardQuery} />

          <div className="bg-gradient-to-br from-[#7B5CFF]/8 to-[#A66CFF]/8 rounded-2xl p-6 border border-[#7B5CFF]/20">
            <h2 className="text-2xl font-extrabold text-white mb-4">
              Ready-to-use Templates
            </h2>
            <div className="w-full max-w-3xl">
              <TemplatesPreview />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
