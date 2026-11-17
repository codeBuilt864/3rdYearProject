import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-[#7B5CFF]/20 to-[#A66CFF]/20 backdrop-blur-md border border-[#7B5CFF]/30 rounded-2xl p-8 flex items-center justify-between hover:border-[#7B5CFF]/50 transition-all duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center shadow-lg shadow-[#7B5CFF]/30">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] bg-clip-text text-transparent">
                Welcome back, {user?.firstName || "there"}!
              </h1>
            </div>
            <p className="text-lg text-white/70 ml-16">
              Prepare for your dream job with AI-driven interviews and coding challenges.
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group px-8 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#7B5CFF]/50 hover:scale-105 flex items-center gap-3 text-white font-bold text-lg whitespace-nowrap"
          >
            <ZapIcon className="w-5 h-5" />
            <span>Create Session</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
