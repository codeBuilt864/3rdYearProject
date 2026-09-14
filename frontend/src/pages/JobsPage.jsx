import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, RefreshCwIcon, ChevronDownIcon } from "lucide-react";
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

function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedJob, setSelectedJob] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Sync debounced search to URL
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Job Search</h1>
        <p className="text-white/50 text-sm">Jobs from Findwork and ITPro.lk in one place</p>
      </div>

      {/* Search bar */}
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

      {/* Filters + sort row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
        {/* Desktop filters */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <JobFilters
            filters={filters}
            companies={companies}
            onChange={updateFilter}
            onClear={clearFilters}
          />
          <SortDropdown value={sort} onChange={updateSort} />
        </div>

        {/* Mobile filters */}
        <div className="flex md:hidden items-center justify-between gap-2">
          <JobFilterDrawer
            filters={filters}
            companies={companies}
            onChange={updateFilter}
            onClear={clearFilters}
          />
          <SortDropdown value={sort} onChange={updateSort} />
        </div>
      </div>

      {/* Results count + source status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4 flex items-center justify-between">
        <p className="text-white/50 text-sm">
          {isLoading ? (
            "Searching..."
          ) : isError ? (
            "Search failed"
          ) : (
            <>
              <span className="text-white font-semibold">{jobs.length}</span> jobs found

            </>
          )}
        </p>
        {isFetching && !isLoading && (
          <RefreshCwIcon className="size-4 text-[#7B5CFF] animate-spin" />
        )}
      </div>

      {/* Job list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {isLoading ? (
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
                <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
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

      {/* Job details modal */}
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
