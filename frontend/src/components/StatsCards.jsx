import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-6 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-lg">
            <UsersIcon className="w-6 h-6 text-[#7B5CFF]" />
          </div>
          <span className="px-3 py-1 bg-[#7B5CFF]/30 text-white/70 text-xs font-semibold rounded-full border border-[#7B5CFF]/50">Live</span>
        </div>
        <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text mb-1">{activeSessionsCount}</div>
        <div className="text-sm text-white/70">Active Sessions</div>
      </div>

      {/* Recent Count */}
      <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#A66CFF]/20 rounded-2xl p-6 hover:border-[#A66CFF]/50 hover:shadow-lg hover:shadow-[#A66CFF]/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-[#A66CFF]/30 to-[#7B5CFF]/30 rounded-lg">
            <TrophyIcon className="w-6 h-6 text-[#A66CFF]" />
          </div>
        </div>
        <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#A66CFF] to-[#7B5CFF] bg-clip-text mb-1">{recentSessionsCount}</div>
        <div className="text-sm text-white/70">Total Sessions</div>
      </div>
    </div>
  );
}

export default StatsCards;
