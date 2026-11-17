import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a3e]/80 to-[#16213e]/80 backdrop-blur-md border border-pink-500/20 rounded-2xl hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300 mt-8">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-lg">
            <Clock className="w-5 h-5 text-pink-400" />
          </div>
          <h2 className="text-2xl font-black text-white">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-purple-400" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`relative rounded-xl border transition-all duration-300 ${
                  session.status === "active"
                    ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/60 hover:shadow-lg hover:shadow-green-500/20"
                    : "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="px-2 py-1 bg-green-500/30 text-green-300 text-xs font-semibold rounded-full border border-green-500/50 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/40"
                          : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/40"
                      }`}
                    >
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white mb-1 truncate">{session.problem}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          session.difficulty === "easy"
                            ? "bg-green-500/30 text-green-300 border border-green-500/50"
                            : session.difficulty === "medium"
                            ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                            : "bg-red-500/30 text-red-300 border border-red-500/50"
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-purple-200/70 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                    <span className="text-xs font-semibold text-purple-300/80 uppercase">Completed</span>
                    <span className="text-xs text-purple-200/40">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-pink-400/50" />
              </div>
              <p className="text-lg font-semibold text-purple-200/70 mb-1">No sessions yet</p>
              <p className="text-sm text-purple-200/50">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
