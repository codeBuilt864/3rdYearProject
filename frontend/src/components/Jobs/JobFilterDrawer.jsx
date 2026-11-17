import { XIcon, SlidersHorizontalIcon } from "lucide-react";
import { useState } from "react";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(value === opt ? "" : opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              value === opt
                ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white border-transparent"
                : "border-[#7B5CFF]/30 text-white/60 hover:border-[#7B5CFF]/60 hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function JobFilterDrawer({ filters, companies, onChange, onClear }) {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
          activeCount > 0
            ? "bg-[#7B5CFF]/20 border-[#7B5CFF]/60 text-white"
            : "border-[#7B5CFF]/30 text-white/60 hover:border-[#7B5CFF]/50 hover:text-white"
        }`}
      >
        <SlidersHorizontalIcon className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="bg-[#7B5CFF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-gradient-to-br from-[#1B1443] to-[#0F0C29] border-t border-[#7B5CFF]/30 rounded-t-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <XIcon className="size-5 text-white/60" />
              </button>
            </div>

            <ChipGroup
              label="Work Mode"
              options={WORK_MODES}
              value={filters.workMode}
              onChange={(v) => onChange("workMode", v)}
            />

            <ChipGroup
              label="Job Type"
              options={JOB_TYPES}
              value={filters.jobType}
              onChange={(v) => onChange("jobType", v)}
            />

            {companies.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Company</p>
                <select
                  value={filters.company}
                  onChange={(e) => onChange("company", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0b1220] border border-[#7B5CFF]/30 rounded-xl text-white text-sm focus:outline-none focus:border-[#7B5CFF]/60"
                >
                  <option value="">All Companies</option>
                  {companies.slice(0, 50).map((c) => (
                    <option key={c} value={c} className="bg-[#1B1443]">{c}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { onClear(); setOpen(false); }}
                className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all"
              >
                Clear All
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white text-sm font-bold transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobFilterDrawer;
