import React from "react";

function StrategyCard({ icon, title, image, intro, steps, resources }) {
  return (
    <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-[#7B5CFF]/20 transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row gap-6 p-8">
        {/* Left Content */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 flex items-center justify-center text-4xl border border-[#7B5CFF]/40 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all duration-300">
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-2">{title}</h3>
              <p className="text-purple-200/80 text-base leading-relaxed">{intro}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-4">Steps</h4>
              <ol className="space-y-3">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] text-white text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span className="pt-0.5">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {resources && resources.length > 0 && (
              <div className="pt-4 border-t border-[#7B5CFF]/20">
                <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wider mb-3">Resources</h4>
                <ul className="space-y-2">
                  {resources.map((r, idx) => (
                    <li key={idx}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-[#7B5CFF] text-sm transition-colors duration-300 flex items-center gap-2 group/link"
                      >
                        <span className="text-lg group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                        <span className="hover:underline">{r.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Image */}
        {image && (
          <div className="flex-shrink-0 w-full md:w-64">
            <img
              src={image}
              alt={title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/vite.svg';
              }}
              className="w-full h-64 object-cover rounded-2xl border border-[#7B5CFF]/20 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-[#7B5CFF]/60"
              style={{ maxHeight: 256 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StrategyCard;
