import { MapPinIcon, BriefcaseIcon, MonitorIcon, CalendarIcon, ExternalLinkIcon, BookmarkIcon } from "lucide-react";

function formatPostedDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  } catch {
    return dateStr;
  }
}

const SOURCE_COLORS = {
  Findwork: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "ITPro.lk": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function JobCard({ job, onClick, isSaved = false, onToggleSave }) {
  const postedLabel = formatPostedDate(job.postedDate);
  const sourceStyle = SOURCE_COLORS[job.source] || "bg-white/10 text-white/60 border-white/20";

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl p-5 hover:border-[#7B5CFF]/60 hover:scale-[1.01] transition-all cursor-pointer flex flex-col gap-4"
    >
      {/* Header: logo + title + company */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#0b1220] border border-[#7B5CFF]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <span
            className={`text-[#7B5CFF] font-black text-lg ${job.companyLogo ? "hidden" : "flex"}`}
          >
            {job.company.charAt(0).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2">{job.title}</h3>
          <p className="text-white/60 text-sm mt-0.5 truncate">{job.company}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${sourceStyle}`}>
            {job.source}
          </span>
          {onToggleSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(job); }}
              className="p-1.5 rounded-lg hover:bg-[#7B5CFF]/20 transition-colors"
              title={isSaved ? "Remove from saved" : "Save job"}
            >
              <BookmarkIcon
                className={`size-4 transition-colors ${isSaved ? "fill-[#7B5CFF] text-[#7B5CFF]" : "text-white/40 hover:text-white/70"}`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Meta: location, work mode, employment type */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3" />
            {job.location}
          </span>
        )}
        {job.workMode && (
          <span className="flex items-center gap-1">
            <MonitorIcon className="size-3" />
            {job.workMode}
          </span>
        )}
        {job.employmentType && (
          <span className="flex items-center gap-1">
            <BriefcaseIcon className="size-3" />
            {job.employmentType}
          </span>
        )}
        {postedLabel && (
          <span className="flex items-center gap-1">
            <CalendarIcon className="size-3" />
            {postedLabel}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 rounded-full border border-[#7B5CFF]/30 text-[#A66CFF] bg-[#7B5CFF]/10"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/40">
              +{job.skills.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Footer: salary + apply */}
      <div className="flex items-center justify-between mt-auto pt-1">
        {job.salary ? (
          <span className="text-sm font-semibold text-[#A66CFF]">{job.salary}</span>
        ) : (
          <span />
        )}
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white text-xs font-bold rounded-lg hover:scale-105 transition-all"
        >
          Apply
          <ExternalLinkIcon className="size-3" />
        </a>
      </div>
    </div>
  );
}

export default JobCard;
