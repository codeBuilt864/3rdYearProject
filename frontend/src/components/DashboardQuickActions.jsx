import { Link } from "react-router";
import { BriefcaseIcon, FileTextIcon, LightbulbIcon, MicIcon } from "lucide-react";

const actions = [
  { label: "Analyze resume", href: "/resumeanalyze", icon: FileTextIcon },
  { label: "Practice interview", href: "/mockinterview", icon: MicIcon },
  { label: "Practice questions", href: "/questions", icon: LightbulbIcon },
  { label: "Find jobs", href: "/jobs", icon: BriefcaseIcon },
];

export default function DashboardQuickActions() {
  return (
    <nav aria-label="Quick actions">
      <h2 className="text-sm font-semibold text-white/70 mb-3">Quick actions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              to={action.href}
              className="flex items-center justify-center gap-2.5 min-h-12 px-3 py-3 rounded-xl border border-[#7B5CFF]/30 bg-[#7B5CFF]/10 text-sm font-semibold text-white/90 hover:bg-[#7B5CFF]/25 hover:border-[#A66CFF]/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66CFF]"
            >
              <Icon aria-hidden="true" className="size-4 shrink-0 text-[#B899FF]" />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
