import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#1a1a3e]/95 to-[#16213e]/95 backdrop-blur-md border border-purple-500/30 rounded-2xl max-w-2xl w-full mx-4 shadow-2xl shadow-purple-500/20">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">Create New Session</h3>
            <button onClick={onClose} className="p-1 hover:bg-purple-500/20 rounded-lg transition-all">
              <XIcon className="size-6 text-purple-300" />
            </button>
          </div>

          <div className="space-y-8">
            {/* PROBLEM SELECTION */}
            <div className="space-y-3">
              <label className="block">
                <span className="text-white font-semibold mb-2 block">Select Problem
                  <span className="text-pink-500"> *</span>
                </span>
              </label>

              <select
                className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all"
                value={roomConfig.problem}
                onChange={(e) => {
                  const selectedProblem = problems.find((p) => p.title === e.target.value);
                  setRoomConfig({
                    difficulty: selectedProblem.difficulty,
                    problem: e.target.value,
                  });
                }}
              >
                <option value="" disabled className="bg-[#16213e]">
                  Choose a coding problem...
                </option>

                {problems.map((problem) => (
                  <option key={problem.id} value={problem.title} className="bg-[#16213e]">
                    {problem.title} ({problem.difficulty})
                  </option>
                ))}
              </select>
            </div>

            {/* ROOM SUMMARY */}
            {roomConfig.problem && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Code2Icon className="size-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white mb-2">Room Summary:</p>
                    <p className="text-green-200/80">
                      Problem: <span className="font-medium text-green-300">{roomConfig.problem}</span>
                    </p>
                    <p className="text-green-200/80">
                      Max Participants: <span className="font-medium text-green-300">2 (1-on-1 session)</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8 justify-end">
            <button 
              className="px-6 py-3 bg-purple-500/20 text-purple-300 rounded-lg font-semibold hover:bg-purple-500/30 transition-all border border-purple-500/30 hover:border-purple-500/50"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/40 transition-all flex items-center gap-2 disabled:opacity-50"
              onClick={onCreateRoom}
              disabled={isCreating || !roomConfig.problem}
            >
              {isCreating ? (
                <LoaderIcon className="size-5 animate-spin" />
              ) : (
                <PlusIcon className="size-5" />
              )}

              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CreateSessionModal;

