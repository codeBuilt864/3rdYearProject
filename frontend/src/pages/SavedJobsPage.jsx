import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2Icon, BookmarkIcon } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import JobCard from "../components/Jobs/JobCard";
import JobDetails from "../components/Jobs/JobDetails";
import axiosInstance from "../lib/axios";

function SavedJobsPage() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axiosInstance.get("/api/saved-jobs")
      .then(({ data }) => setSavedJobs(data.savedJobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleUnsave(job) {
    await axiosInstance.delete(`/api/saved-jobs/${encodeURIComponent(job.id || job.jobId)}`);
    setSavedJobs((prev) => prev.filter((j) => j.jobId !== (job.id || job.jobId)));
    toast.success("Job removed from saved");
  }

  // Normalize saved job from DB shape to job card shape
  function normalize(saved) {
    return {
      id: saved.jobId,
      title: saved.title,
      company: saved.company,
      companyLogo: saved.companyLogo,
      location: saved.location,
      employmentType: saved.employmentType,
      workMode: saved.workMode,
      salary: saved.salary,
      skills: saved.skills || [],
      description: saved.description,
      postedDate: saved.postedDate,
      applyUrl: saved.applyUrl,
      source: saved.source,
    };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2Icon className="size-12 animate-spin text-[#7B5CFF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <BookmarkIcon className="size-7 fill-[#7B5CFF] text-[#7B5CFF]" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Saved Jobs</h1>
          <span className="text-white/40 text-lg font-semibold">({savedJobs.length})</span>
        </div>

        {savedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookmarkIcon className="size-16 text-white/20 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No saved jobs yet</h3>
            <p className="text-white/50 mb-6 max-w-sm">
              Browse jobs and click the bookmark icon to save ones you're interested in.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-2.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {savedJobs.map((saved) => {
              const job = normalize(saved);
              return (
                <JobCard
                  key={saved.jobId}
                  job={job}
                  onClick={() => setSelectedJob(job)}
                  isSaved={true}
                  onToggleSave={handleUnsave}
                />
              );
            })}
          </div>
        )}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}

export default SavedJobsPage;
