import { ArrowUpRightIcon, BriefcaseIcon, ChevronDownIcon, FileTextIcon, HandshakeIcon, MessagesSquareIcon, TrophyIcon } from "lucide-react";

const icons = { Applications: BriefcaseIcon, "Resume & Portfolio": FileTextIcon, Networking: HandshakeIcon, Interviews: MessagesSquareIcon, Offers: TrophyIcon };

export default function StrategyCard({ guide, expanded, onToggle }) {
  const Icon = icons[guide.category] || BriefcaseIcon;
  const contentId = `guide-${guide.id}-content`;
  return (
    <article className={`rounded-2xl border bg-[#0F0C29]/50 transition-colors ${expanded ? "border-[#A66CFF]/50" : "border-white/10 hover:border-[#7B5CFF]/40"}`}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="flex items-center gap-2 text-xs font-medium text-[#C6AEFF]"><Icon aria-hidden="true" className="size-4" />{guide.category}</span>
          <span className="text-xs text-white/40">{guide.steps.length} steps</span>
        </div>
        <h2 className="text-lg font-semibold text-white leading-snug">{guide.title}</h2>
        <p className="text-sm text-white/60 leading-relaxed mt-2 mb-5">{guide.intro}</p>
        <button aria-expanded={expanded} aria-controls={contentId} onClick={onToggle}
          className="flex items-center justify-between gap-3 w-full text-sm font-semibold text-[#C6AEFF] hover:text-white rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A66CFF]">
          {expanded ? "Close guide" : "Read guide"}<ChevronDownIcon aria-hidden="true" className={`size-4 shrink-0 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div id={contentId} hidden={!expanded} className="px-5 pb-6 sm:px-6 border-t border-white/10">
        <h3 className="text-sm font-semibold text-white mt-5 mb-4">Put it into practice</h3>
        <ol className="space-y-4">
          {guide.steps.map((step, index) => <li key={index} className="flex gap-3 text-sm text-white/75 leading-relaxed">
            <span aria-hidden="true" className="shrink-0 size-6 rounded-full bg-[#7B5CFF]/15 text-[#C6AEFF] inline-flex items-center justify-center text-xs font-semibold">{index + 1}</span>
            <span>{step}</span>
          </li>)}
        </ol>
        {guide.resources?.length > 0 && <div className="mt-6 pt-5 border-t border-white/10">
          <h3 className="text-sm font-semibold text-white mb-3">Further reading</h3>
          <ul className="space-y-3">{guide.resources.map((resource) => <li key={resource.href}>
            <a href={resource.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-sm text-[#C6AEFF] hover:text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]">
              <span>{resource.label}<span className="sr-only"> (opens in a new tab)</span></span><ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0 mt-0.5" />
            </a>
          </li>)}</ul>
        </div>}
      </div>
    </article>
  );
}
