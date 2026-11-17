import { XIcon, MapPinIcon, BriefcaseIcon, MonitorIcon, CalendarIcon, ExternalLinkIcon, BanknoteIcon } from "lucide-react";

function formatPostedDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return dateStr;
  }
}

const SOURCE_COLORS = {
  Findwork: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "ITPro.lk": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function JobDetails({ job, onClose }) {
  if (!job) return null;

  const sourceStyle = SOURCE_COLORS[job.source] || "bg-white/10 text-white/60 border-white/20";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-[#1B1443] to-[#0F0C29] border border-[#7B5CFF]/40 rounded-2xl shadow-2xl shadow-[#7B5CFF]/20 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#7B5CFF]/20 flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#0b1220] border border-[#7B5CFF]/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
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
            <span className={`text-[#7B5CFF] font-black text-xl ${job.companyLogo ? "hidden" : "flex"}`}>
              {job.company.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-black text-white leading-tight">{job.title}</h2>
            <p className="text-white/60 mt-0.5">{job.company}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full border ${sourceStyle}`}>
                {job.source}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          >
            <XIcon className="size-5 text-white/60" />
          </button>
        </div>

        {/* Meta */}
        <div className="px-6 py-4 border-b border-[#7B5CFF]/20 flex flex-wrap gap-4 text-sm text-white/60">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="size-4 text-[#7B5CFF]" />
              {job.location}
            </span>
          )}
          {job.workMode && (
            <span className="flex items-center gap-1.5">
              <MonitorIcon className="size-4 text-[#7B5CFF]" />
              {job.workMode}
            </span>
          )}
          {job.employmentType && (
            <span className="flex items-center gap-1.5">
              <BriefcaseIcon className="size-4 text-[#7B5CFF]" />
              {job.employmentType}
            </span>
          )}
          {job.salary && (
            <span className="flex items-center gap-1.5">
              <BanknoteIcon className="size-4 text-[#7B5CFF]" />
              {job.salary}
            </span>
          )}
          {job.postedDate && (
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="size-4 text-[#7B5CFF]" />
              {formatPostedDate(job.postedDate)}
            </span>
          )}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Skills */}
          {job.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm px-3 py-1 rounded-full border border-[#7B5CFF]/30 text-[#A66CFF] bg-[#7B5CFF]/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div>
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Description</h3>
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#7B5CFF]/20">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]"
          >
            Apply Now
            <ExternalLinkIcon className="size-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
