import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

import Navbar from "../components/Navbar";
import TemplatesPreview from "../components/TemplatesPreview";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const firstName = user?.firstName || user?.fullName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF]">Welcome back, {firstName} 👋</h1>
            <p className="text-sm text-white/70 mt-1">Centralized tools — resume, company research, and interview prep.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate('/resumeanalyze')} className="px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg font-semibold text-white">Analyze Resume</button>
            <button onClick={() => navigate('/companies')} className="px-4 py-2 bg-white/6 hover:bg-white/10 rounded-lg text-white">Explore Companies</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#7B5CFF]/8 to-[#A66CFF]/8 rounded-2xl p-6 border border-[#7B5CFF]/20">
              <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/resumeanalyze')}>
                  <h4 className="font-semibold text-white mb-2">Resume Analyzer</h4>
                  <p className="text-sm text-white/70">Get an ATS-friendly score and clear, prioritized fixes.</p>
                </div>

                <div className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/mockinterview')}>
                  <h4 className="font-semibold text-white mb-2">Mock Interview</h4>
                  <p className="text-sm text-white/70">Practice rounds with AI feedback to boost interview readiness.</p>
                </div>

                <div className="p-4 rounded-lg bg-[#0f0c1a]/50 border border-[#7B5CFF]/10 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/strategies')}>
                  <h4 className="font-semibold text-white mb-2">Job Strategies</h4>
                  <p className="text-sm text-white/70">Personalized application & networking priorities.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl p-5 bg-gradient-to-br from-white/3 to-white/2 border border-white/6">
                <h4 className="text-sm text-white/80">Resume Score</h4>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">72</p>
                    <p className="text-xs text-white/60">ATS & format</p>
                  </div>
                  <button onClick={() => navigate('/resumeanalyze')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Improve</button>
                </div>
              </div>

              <div className="rounded-2xl p-5 bg-gradient-to-br from-white/3 to-white/2 border border-white/6">
                <h4 className="text-sm text-white/80">Interview Readiness</h4>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">Moderate</p>
                    <p className="text-xs text-white/60">Behavioral & technical</p>
                  </div>
                  <button onClick={() => navigate('/mockinterview')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Practice</button>
                </div>
              </div>

              <div className="rounded-2xl p-5 bg-gradient-to-br from-white/3 to-white/2 border border-white/6">
                <h4 className="text-sm text-white/80">Skill Gaps</h4>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">3</p>
                    <p className="text-xs text-white/60">Suggested learning topics</p>
                  </div>
                  <button onClick={() => navigate('/strategies')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Learn</button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#7B5CFF]/8 to-[#A66CFF]/8 rounded-2xl p-6 border border-[#7B5CFF]/20">
              <h2 className="text-2xl font-extrabold text-white mb-4">Ready-to-use Templates</h2>
              <div className="w-full max-w-3xl">
                <TemplatesPreview />
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-gradient-to-br from-[#7B5CFF]/6 to-[#A66CFF]/6 rounded-2xl p-4 border border-[#7B5CFF]/20">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Recommended Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Fix top resume issues</p>
                    <p className="text-xs text-white/60">Address the 3 highest-impact ATS fixes first.</p>
                  </div>
                  <button onClick={() => navigate('/resumeanalyze')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Go</button>
                </li>

                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Schedule mock interview</p>
                    <p className="text-xs text-white/60">Run a 30-minute technical mock with feedback.</p>
                  </div>
                  <button onClick={() => navigate('/mockinterview')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Start</button>
                </li>

                <li className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Study targeted skills</p>
                    <p className="text-xs text-white/60">Follow curated learning path for top skill gaps.</p>
                  </div>
                  <button onClick={() => navigate('/strategies')} className="px-3 py-1 bg-white/6 rounded text-white text-sm">Open</button>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#7B5CFF]/6 to-[#A66CFF]/6 rounded-2xl p-4 border border-[#7B5CFF]/20">
              <h3 className="text-sm font-semibold text-white/80 mb-2">Upcoming Sessions</h3>
              <p className="text-sm text-white/70">No sessions scheduled — try a mock interview to get started.</p>
              <div className="mt-3">
                <button onClick={() => navigate('/mockinterview')} className="px-4 py-2 bg-white/6 hover:bg-white/10 rounded-lg text-white">Book a Mock Interview</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
