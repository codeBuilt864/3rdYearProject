import { useRef, useState } from "react";
import { BookOpenIcon, FileTextIcon, SearchIcon, XIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import StrategyCard from "../components/StrategyCard";
import Templates from "../components/Templates";
import { filterStrategies, JOB_STRATEGIES, STRATEGY_CATEGORIES } from "../data/jobStrategies";

const tabs = [{ id: "guides", label: "Guides", icon: BookOpenIcon }, { id: "templates", label: "Templates", icon: FileTextIcon }];

function JobHuntingStrategiesPage() {
  const [activeTab, setActiveTab] = useState("guides");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const tabRefs = useRef([]);
  const guides = filterStrategies(JOB_STRATEGIES, category, search);

  function resetFilters() {
    setCategory("All");
    setSearch("");
    setExpandedId(null);
  }

  function handleTabKeyDown(event) {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveTab(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Tips &amp; Tricks</h1>
          <p className="text-sm sm:text-base text-white/60 mt-3 max-w-2xl leading-relaxed">Practical guides and reusable templates for your next career move. Choose a topic and start with one useful step.</p>
        </header>

        <div role="tablist" aria-label="Career resources" onKeyDown={handleTabKeyDown} className="flex gap-6 border-b border-white/10 mb-7">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button key={tab.id} ref={(element) => { tabRefs.current[index] = element; }}
                id={`${tab.id}-tab`} role="tab" aria-selected={selected} aria-controls={`${tab.id}-panel`} tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF] ${selected ? "border-[#A66CFF] text-white" : "border-transparent text-white/50 hover:text-white/80"}`}>
                <Icon aria-hidden="true" className="size-4" />{tab.label}
              </button>
            );
          })}
        </div>

        <section id="guides-panel" role="tabpanel" aria-labelledby="guides-tab" hidden={activeTab !== "guides"}>
          <div className="relative max-w-xl mb-5">
            <SearchIcon aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <label htmlFor="guide-search" className="sr-only">Search guides</label>
            <input id="guide-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setExpandedId(null); }}
              placeholder="Search topics, skills, or advice..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0F0C29]/60 border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#A66CFF] focus:ring-1 focus:ring-[#A66CFF]" />
          </div>

          <div role="group" aria-label="Filter guides by category" className="flex flex-wrap gap-2 mb-5">
            {["All", ...STRATEGY_CATEGORIES].map((item) => (
              <button key={item} aria-pressed={category === item} onClick={() => { setCategory(item); setExpandedId(null); }}
                className={`px-3.5 py-2 text-sm rounded-lg border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF] ${category === item ? "bg-[#7B5CFF]/20 border-[#A66CFF]/50 text-[#D4C4FF]" : "bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30"}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 mb-5 min-h-8">
            <p role="status" className="text-sm text-white/50">{guides.length} {guides.length === 1 ? "guide" : "guides"}{category !== "All" ? ` in ${category}` : " available"}</p>
            {(category !== "All" || search) && <button onClick={resetFilters} className="flex items-center gap-1.5 text-sm text-[#C6AEFF] hover:text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]"><XIcon aria-hidden="true" className="size-3.5" />Clear filters</button>}
          </div>

          {guides.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
            {guides.map((guide) => <StrategyCard key={guide.id} guide={guide} expanded={expandedId === guide.id} onToggle={() => setExpandedId(expandedId === guide.id ? null : guide.id)} />)}
          </div> : <div className="rounded-2xl border border-white/10 bg-[#0F0C29]/40 px-6 py-14 text-center">
            <SearchIcon aria-hidden="true" className="size-7 text-[#A66CFF] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white">No matching guides</h2>
            <p className="text-sm text-white/60 mt-2 mb-5">Try a different search or explore another category.</p>
            <button onClick={resetFilters} className="text-sm font-semibold text-[#C6AEFF] hover:text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]">Show all guides</button>
          </div>}
        </section>

        <section id="templates-panel" role="tabpanel" aria-labelledby="templates-tab" hidden={activeTab !== "templates"}>
          <p className="text-sm text-white/60 mb-6">Copy a starting point, then replace the example details with your own before sending.</p>
          <Templates />
        </section>
      </main>
    </div>
  );
}

export default JobHuntingStrategiesPage;
