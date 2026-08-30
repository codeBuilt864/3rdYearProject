import { ChevronDownIcon, XIcon } from "lucide-react";

const WORK_MODES = ["Remote", "Hybrid", "On-site"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-3 pr-8 py-2 rounded-xl border text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7B5CFF]/30 ${
          value
            ? "bg-[#7B5CFF]/20 border-[#7B5CFF]/60 text-white"
            : "bg-[#0b1220] border-[#7B5CFF]/20 text-white/50 hover:border-[#7B5CFF]/40"
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#1B1443] text-white">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  );
}

function JobFilters({ filters, companies, onChange, onClear }) {
  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        label="Work Mode"
        value={filters.workMode}
        options={WORK_MODES}
        onChange={(v) => onChange("workMode", v)}
      />
      <FilterSelect
        label="Job Type"
        value={filters.jobType}
        options={JOB_TYPES}
        onChange={(v) => onChange("jobType", v)}
      />
      <FilterSelect
        label="Company"
        value={filters.company}
        options={companies.slice(0, 50)}
        onChange={(v) => onChange("company", v)}
      />

      {hasActive && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-all"
        >
          <XIcon className="size-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

export default JobFilters;
