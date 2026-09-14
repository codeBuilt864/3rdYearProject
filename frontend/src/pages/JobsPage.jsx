import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, RefreshCwIcon, ChevronDownIcon, BookmarkIcon, BriefcaseIcon } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import JobCard from "../components/Jobs/JobCard";
import JobCardSkeleton from "../components/Jobs/JobCardSkeleton";
import JobDetails from "../components/Jobs/JobDetails";
import JobFilters from "../components/Jobs/JobFilters";
import JobFilterDrawer from "../components/Jobs/JobFilterDrawer";
import axiosInstance from "../lib/axios";

const PAGE_SIZE = 20;

async function fetchJobs(params) {
  const { data } = await axiosInstance.get("/api/jobs", { params });
  return data;
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function normalizeSaved(saved) {
  return {
    id: saved.jobId, title: saved.title, company: saved.company,
    companyLogo: saved.companyLogo, location: saved.location,
    employmentType: saved.employmentType, workMode: saved.workMode,
    salary: saved.salary, skills: saved.skills || [],
    description: saved.description, postedDate: saved.postedDate,
    applyUrl: saved.applyUrl, source: saved.source,
  };
}

function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState([]);
  const [view, setView] = useState("all"); // "all" | "saved"

  useEffect(() => {
    axiosInstance.get("/api/saved-jobs")
      .then(({ data }) => {
        setSavedJobIds(new Set(data.savedJobs.map((j) => j.jobId)));
        setSavedJobs(data.savedJobs);
      })
      .catch(() => {});
  }, []);

  async function handleToggleSave(job) {
    const isSaved = savedJobIds.has(job.id);
    if (isSaved) {
      await axiosInstance.delete(`/api/saved-jobs/${encodeURIComponent(job.id)}`);
      setSavedJobIds((prev) => { const next = new Set(prev); next.delete(job.id); return next; });
      setSavedJobs((prev) => prev.filter((j) => j.jobId !== job.id));
      toast.success("Job removed from saved");
    } else {
      await axiosInstance.post("/api/saved-jobs", {
        jobId: job.id, title: job.title, company: job.company,
        companyLogo: job.companyLogo, location: job.location,
        employmentType: job.employmentType, workMode: job.workMode,
        salary: job.salary, skills: job.skills, description: job.description,
        postedDate: job.postedDate, applyUrl: job.applyUrl, source: job.source,
      });
      setSavedJobIds((prev) => new Set(prev).add(job.id));
      setSavedJobs((prev) => [{ jobId: job.id, ...job }, ...prev]);
      toast.success("Job saved!");
    }
  }

  // Read state from URL
  const searchInput = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "recent";
  const filters = {
    workMode: searchParams.get("workMode") || "",
    jobType: searchParams.get("jobType") || "",
    company: searchParams.get("company") || "",
  };

  const [localSearch, setLocalSearch] = useState(searchInput);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedSearch) next.set("search", debouncedSearch);
        else next.delete("search");
        next.delete("page");
        return next;
      },
      { replace: true }
    );
    setVisibleCount(PAGE_SIZE);
  }, [debouncedSearch]);

  function updateFilter(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete("page");
        return next;
      },
      { replace: true }
    );
    setVisibleCount(PAGE_SIZE);
  }

  function updateSort(value) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", value);
      return next;
    }, { replace: true });
  }

  function clearFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      ["workMode", "jobType", "company"].forEach((k) => next.delete(k));
      return next;
    }, { replace: true });
  }

  const queryParams = {
    search: searchParams.get("search") || "",
    workMode: filters.workMode,
    jobType: filters.jobType,
    company: filters.company,
    sort,
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["jobs", queryParams],
    queryFn: () => fetchJobs(queryParams),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const jobs = data?.jobs || [];
  const companies = data?.companies || [];
  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < jobs.length;

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (localSearch) next.set("search", localSearch);
        else next.delete("search");
        return next;
      }, { replace: true });
    },
    [localSearch, setSearchParams]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Job Search</h1>
          <p className="text-white/50 text-sm">Jobs from Findwork and ITPro.lk in one place</p>
        </div>
        <div className="flex items-center gap-1 bg-[#071025] border border-[#7B5CFF]/20 rounded-xl p-1 flex-shrink-0">
          <button
            onClick={() => setView("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === "all" ? "bg-[#7B5CFF] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <BriefcaseIcon className="size-4" />
            <span className="hidden sm:inline">All Jobs</span>
          </button>
          <button
            onClick={() => setView("saved")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === "saved" ? "bg-[#7B5CFF] text-white" : "text-white/50 hover:text-white"
            }`}
          >
            <BookmarkIcon className={`size-4 ${view === "saved" ? "fill-white" : ""}`} />
            <span className="hidden sm:inline">Saved</span>
            {savedJobs.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${view === "saved" ? "bg-white/20" : "bg-[#7B5CFF]/30 text-[#A66CFF]"}`}>
                {savedJobs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search + filters — only shown in All Jobs view */}
      {view === "all" && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search jobs, skills, or keywords..."
                  className="w-full pl-11 pr-4 py-3 bg-[#071025] border border-[#7B5CFF]/30 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#7B5CFF]/60 focus:ring-2 focus:ring-[#7B5CFF]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            <div className="hidden md:flex items-center justify-between gap-4">
              <JobFilters filters={filters} companies={companies} onChange={updateFilter} onClear={clearFilters} />
              <SortDropdown value={sort} onChange={updateSort} />
            </div>
            <div className="flex md:hidden items-center justify-between gap-2">
              <JobFilterDrawer filters={filters} companies={companies} onChange={updateFilter} onClear={clearFilters} />
              <SortDropdown value={sort} onChange={updateSort} />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4 flex items-center justify-between">
            <p className="text-white/50 text-sm">
              {isLoading ? "Searching..." : isError ? "Search failed" : (
                <><span className="text-white font-semibold">{jobs.length}</span> jobs found</>
              )}
            </p>
            {isFetching && !isLoading && <RefreshCwIcon className="size-4 text-[#7B5CFF] animate-spin" />}
          </div>
        </>
      )}

      {/* Job list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {view === "saved" ? (
          savedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <BookmarkIcon className="size-16 text-white/20 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No saved jobs yet</h3>
              <p className="text-white/50 mb-6 max-w-sm">
                Browse jobs and click the bookmark icon to save ones you're interested in.
              </p>
              <button
                onClick={() => setView("all")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {savedJobs.map((saved) => {
                const job = normalizeSaved(saved);
                return (
                  <JobCard key={saved.jobId} job={job} onClick={() => setSelectedJob(job)} isSaved={true} onToggleSave={handleToggleSave} />
                );
              })}
            </div>
          )
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : jobs.length === 0 ? (
          <EmptyState onClear={() => { clearFilters(); setLocalSearch(""); }} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} isSaved={savedJobIds.has(job.id)} onToggleSave={handleToggleSave} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
                >
                  <ChevronDownIcon className="size-4" />
                  Load More ({jobs.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

function SortDropdown({ value, onChange }) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 bg-[#0b1220] border border-[#7B5CFF]/20 rounded-xl text-white/70 text-sm font-medium focus:outline-none focus:border-[#7B5CFF]/40 cursor-pointer hover:border-[#7B5CFF]/40 transition-all"
      >
        <option value="recent" className="bg-[#1B1443]">Most Recent</option>
        <option value="relevance" className="bg-[#1B1443]">Relevance</option>
      </select>
      <ChevronDownIcon className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-bold text-white mb-2">No jobs found</h3>
      <p className="text-white/50 mb-6 max-w-sm">
        Try changing your search keywords or clearing your filters.
      </p>
      <button
        onClick={onClear}
        className="px-6 py-2.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
      >
        Clear Search & Filters
      </button>
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl font-bold text-white mb-2">Unable to load jobs</h3>
      <p className="text-white/50 mb-6">Please try again.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
      >
        <RefreshCwIcon className="size-4" />
        Retry
      </button>
    </div>
  );
}

export default JobsPage;
