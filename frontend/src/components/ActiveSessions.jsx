import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a3e]/80 to-[#16213e]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
      <div className="p-6">
        {/* HEADERS SECTION */}
        <div className="flex items-center justify-between mb-6">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg">
              <ZapIcon className="size-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-black text-white">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoaderIcon className="size-10 animate-spin text-purple-400" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl hover:border-purple-500/50 hover:bg-purple-500/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4 p-4">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative size-14 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
                      <Code2Icon className="size-6 text-white" />
                      <div className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-[#1a1a3e] animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg text-white truncate">{session.problem}</h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            session.difficulty === "easy"
                              ? "bg-green-500/30 text-green-300 border border-green-500/50"
                              : session.difficulty === "medium"
                              ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                              : "bg-red-500/30 text-red-300 border border-red-500/50"
                          }`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-purple-200/70">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="size-4 text-purple-400" />
                          <span className="font-medium">{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-4 text-purple-400" />
                          <span className="text-xs">{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="px-2 py-1 bg-red-500/30 text-red-300 text-xs font-semibold rounded-full border border-red-500/50">FULL</span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/30 text-green-300 text-xs font-semibold rounded-full border border-green-500/50">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {session.participant && !isUserInSession(session) ? (
                    <button className="px-4 py-2 bg-gray-600/40 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed opacity-50">Full</button>
                  ) : (
                    <Link to={`/session/${session._id}`} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center gap-2">
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-purple-400/50" />
              </div>
              <p className="text-lg font-semibold text-purple-200/70 mb-1">No active sessions</p>
              <p className="text-sm text-purple-200/50">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;
