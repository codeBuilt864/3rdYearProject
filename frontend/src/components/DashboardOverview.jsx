import { Link } from "react-router";
import DashboardQuickActions from "./DashboardQuickActions";
import { ArrowRightIcon, BookmarkIcon, BriefcaseIcon, FileTextIcon, HistoryIcon, LightbulbIcon, MessageSquareIcon, RefreshCwIcon, TargetIcon } from "lucide-react";

const panel = "bg-gradient-to-br from-[#7B5CFF]/8 to-[#A66CFF]/8 rounded-2xl p-6 border border-[#7B5CFF]/20";
const linkStyle = "text-sm font-semibold text-[#B899FF] hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF] rounded";
const activityIcons = { resume: FileTextIcon, interview: MessageSquareIcon, question: LightbulbIcon, saved: BookmarkIcon };

function Section(props) {
  const { title, icon: Icon, children } = props;
  return (
    <section className={panel}>
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Icon className="size-5 text-[#A66CFF]" />{title}</h2>
      {children}
    </section>
  );
}

function ActivityDate({ date }) {
  return <time dateTime={date} className="text-xs text-white/50 shrink-0">{new Date(date).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time>;
}

export default function DashboardOverview({ query }) {
  const { data, isPending, isError, isFetching, refetch, dataUpdatedAt } = query;
  if (isPending) return (
    <div role="status" aria-label="Loading your dashboard" className="space-y-4">
      <p className="text-sm text-white/60">Loading your preparation overview...</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((key) => <div key={key} className="h-32 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />)}
      </div>
      <DashboardQuickActions />
    </div>
  );
  if (!data) return (
    <div className="space-y-6">
      <div role="alert" className={panel}>
        <p className="text-white mb-3">We couldn&apos;t load your dashboard. Your preparation data is still saved.</p>
        <button onClick={() => refetch()} className={linkStyle}>Try again</button>
      </div>
      <DashboardQuickActions />
    </div>
  );

  const { stats, latestAnalysis, improvements, recentJobs, recentActivity, nextSteps } = data;
  const statistics = [
    { label: "Latest resume score", value: latestAnalysis ? `${latestAnalysis.overallScore}/10` : "No analysis yet", detail: latestAnalysis?.jobName || "Analyze a resume to get started", href: latestAnalysis?.href || "/resumeanalyze", icon: FileTextIcon },
    { label: "Interviews practiced", value: stats.interviewCount, detail: "Sessions with recorded answers", href: "/mockinterview", icon: MessageSquareIcon },
    { label: "Questions generated", value: stats.questionCount, detail: "Technical questions created for you", href: "/questions", icon: LightbulbIcon },
    { label: "Saved jobs", value: stats.savedJobCount, detail: "Opportunities you bookmarked", href: "/jobs?view=saved", icon: BookmarkIcon },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/50" aria-live="polite">
          {isError ? "Could not refresh. Showing your last loaded overview." : isFetching ? "Updating your overview..." : `Updated ${new Date(dataUpdatedAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`}
        </p>
        <button onClick={() => refetch()} disabled={isFetching} className={`${linkStyle} flex items-center gap-2 disabled:opacity-50`}>
          <RefreshCwIcon className={`size-4 ${isFetching ? "animate-spin" : ""}`} />Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((statistic) => {
          const { label, value, detail, href, icon: Icon } = statistic;
          return (
          <Link key={label} to={href} className="rounded-2xl p-5 bg-gradient-to-br from-white/3 to-white/2 border border-white/10 hover:border-[#A66CFF]/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]">
            <div className="flex items-center justify-between gap-2"><h2 className="text-sm text-white/80">{label}</h2><Icon className="size-4 text-[#A66CFF] shrink-0" /></div>
            <p className={`${typeof value === "string" && value.length > 12 ? "text-xl" : "text-3xl"} font-bold text-white mt-3`}>{value}</p>
            <p className="text-xs text-white/60 mt-2 break-words">{detail}</p>
          </Link>
          );
        })}
      </div>

      <DashboardQuickActions />

      <Section title="Next steps" icon={TargetIcon}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nextSteps.map((step) => (
            <div key={step.title} className="rounded-xl p-4 border border-[#7B5CFF]/20 bg-[#0f0c1a]/40 flex flex-col items-start">
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-white/60 mt-2 mb-4 flex-1">{step.description}</p>
              <Link to={step.href} className={`${linkStyle} inline-flex items-center gap-2`}>{step.action}<ArrowRightIcon className="size-4" /></Link>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Continue preparing" icon={BriefcaseIcon}>
        {recentJobs.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="rounded-xl p-4 border border-[#7B5CFF]/20 bg-[#0f0c1a]/40">
                <h3 className="font-semibold text-white break-words">{job.name}</h3>
                <p className="text-sm text-white/60 mt-1">{[job.title, job.experienceLevel].filter(Boolean).join(" · ")}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                  <Link className={linkStyle} to={`/resumeanalyze/${job.id}`}>Resume</Link>
                  <Link className={linkStyle} to={`/mockinterview/${job.id}`}>Interviews</Link>
                  <Link className={linkStyle} to={`/questions/${job.id}`}>Questions</Link>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-white/60">Your job descriptions will appear here once you <Link className={linkStyle} to="/resumeanalyze/new">create your first target role</Link>.</p>}
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Section title="Recent activity" icon={HistoryIcon}>
          {recentActivity.length ? <ul className="divide-y divide-white/10">
            {recentActivity.map((item) => {
              const Icon = activityIcons[item.type] || BriefcaseIcon;
              return <li key={item.id}>
                <Link to={item.href} className="flex gap-3 py-4 rounded-lg hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]">
                  <Icon className="size-5 text-[#A66CFF] shrink-0 mt-1" />
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-white">{item.label}</p><p className="text-sm text-white/60 break-words mt-1">{item.detail}</p><ActivityDate date={item.date} /></div>
                  <ArrowRightIcon className="size-4 text-white/40 shrink-0 mt-1" />
                </Link>
              </li>;
            })}
          </ul> : <p className="text-sm text-white/60">Your recent analyses, interview practice, generated questions, and saved jobs will appear here.</p>}
        </Section>

        <Section title="Resume improvements" icon={FileTextIcon}>
          {!latestAnalysis ? <p className="text-sm text-white/60">Upload a resume for a target role to see personalized improvement priorities. <Link className={linkStyle} to="/resumeanalyze">Analyze a resume</Link></p> : <>
            <p className="text-sm text-white/60 mb-4">Latest analysis for <span className="text-white">{latestAnalysis.jobName}</span>{latestAnalysis.fileName ? ` · ${latestAnalysis.fileName}` : ""}</p>
            {improvements.length ? <ul className="space-y-3">
              {improvements.map((item, index) => <li key={`${item.category}-${index}`} className={`rounded-xl p-4 border ${item.type === "major-improvement" ? "border-amber-500/30 bg-amber-500/5" : "border-[#7B5CFF]/20 bg-[#0f0c1a]/40"}`}>
                <p className="text-xs text-[#C6AEFF] mb-1">{item.category} · {item.type === "major-improvement" ? "High priority" : "Improvement"}</p>
                <h3 className="text-sm font-semibold text-white">{item.name}</h3><p className="text-sm text-white/60 mt-1">{item.message}</p>
              </li>)}
            </ul> : <p className="text-sm text-white/60">No improvement items were flagged in this analysis. Review the full report for its scores and strengths.</p>}
            <Link to={latestAnalysis.href} className={`${linkStyle} inline-flex items-center gap-2 mt-4`}>View full analysis<ArrowRightIcon className="size-4" /></Link>
          </>}
        </Section>
      </div>
    </div>
  );
}
