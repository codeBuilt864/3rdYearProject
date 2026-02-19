import { getDifficultyBadgeClass } from "../lib/utils";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      {/* HEADER SECTION */}
      <div className="p-6 bg-gradient-to-br from-purple-600/40 to-pink-600/40 backdrop-blur-md border-b border-purple-500/30">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-white">{problem.title}</h1>
          <span className={`px-3 py-1 rounded-lg font-bold text-white ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-white/60">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="w-full px-4 py-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0f1729] text-white">
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl shadow-sm p-5 border border-purple-500/30">
          <h2 className="text-xl font-bold text-white">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-white/90">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-white/90">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl shadow-sm p-5 border border-purple-500/30">
          <h2 className="text-xl font-bold mb-4 text-white">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">{idx + 1}</span>
                  <p className="font-semibold text-white">Example {idx + 1}</p>
                </div>
                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm space-y-1.5 border border-purple-500/20">
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold min-w-[70px]">Input:</span>
                    <span className="text-white">{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-pink-400 font-bold min-w-[70px]">Output:</span>
                    <span className="text-white">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-purple-500/20 mt-2">
                      <span className="text-white/60 font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-xl shadow-sm p-5 border border-purple-500/30">
          <h2 className="text-xl font-bold mb-4 text-white">Constraints</h2>
          <ul className="space-y-2 text-white/90">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-purple-400">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
