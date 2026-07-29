import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeftIcon,
  Loader2Icon,
  UploadIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  XCircleIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const SECTIONS = {
  ats: "ATS Compatibility",
  jobMatch: "Job Match",
  writingAndFormatting: "Writing & Formatting",
  keywordCoverage: "Keyword Coverage",
  other: "Additional Insights",
};

function ScoreBadge({ score }) {
  if (score == null) return null;
  if (score >= 8) return <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/40">Excellent</span>;
  if (score >= 6) return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">Ok</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40">Needs Work</span>;
}

function FeedbackItem({ type, name, message }) {
  const styles = {
    strength: { bg: "bg-green-500/10 border-green-500/30", icon: <CheckCircleIcon className="size-4 text-green-400 flex-shrink-0 mt-0.5" /> },
    "minor-improvement": { bg: "bg-amber-500/10 border-amber-500/30", icon: <AlertCircleIcon className="size-4 text-amber-400 flex-shrink-0 mt-0.5" /> },
    "major-improvement": { bg: "bg-red-500/10 border-red-500/30", icon: <XCircleIcon className="size-4 text-red-400 flex-shrink-0 mt-0.5" /> },
  };
  const s = styles[type] ?? styles["minor-improvement"];

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${s.bg}`}>
      {s.icon}
      <div>
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-white/60 text-sm mt-0.5">{message}</p>
      </div>
    </div>
  );
}

function CategoryAccordion({ sectionKey, title, category }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#7B5CFF]/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#071025] hover:bg-[#0b1220] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold">{title}</span>
          <ScoreBadge score={category?.score} />
        </div>
        <span className="text-white/50 text-sm">{category?.score != null ? `${category.score}/10` : ""} {open ? "▲" : "▼"}</span>
      </button>

      {open && category && (
        <div className="px-6 py-4 bg-[#0b1220] space-y-4">
          <p className="text-white/60 text-sm">{category.summary}</p>
          <div className="space-y-3">
            {category.feedback?.map((item, i) => (
              <FeedbackItem key={i} {...item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResumeAnalyzeDetailPage() {
  const { jobInfoId, analysisId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isNew = analysisId == null;

  useEffect(() => {
    async function load() {
      try {
        if (isNew) {
          const { data } = await axiosInstance.get(`/api/resume-analyzer/job-infos/${jobInfoId}`);
          setJobInfo(data.jobInfo);
        } else {
          const { data } = await axiosInstance.get(`/api/resume-analyzer/analyses/${analysisId}`);
          setAnalysis(data.analysis);
          setJobInfo(data.analysis.jobInfoId);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load");
        navigate(`/resumeanalyze/${jobInfoId}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [analysisId, jobInfoId, isNew]);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);
      formData.append("jobInfoId", jobInfoId);

      const { data } = await axiosInstance.post("/api/resume-analyzer/analyses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/resumeanalyze/${jobInfoId}/analyses/${data.analysis._id}`, { replace: true });
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      toast.error("Failed to analyze resume");
    } finally {
      setUploading(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full p-6 space-y-6">
        <button
          onClick={() => navigate(`/resumeanalyze/${jobInfoId}`)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          All Analyses
        </button>

        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-white">{jobInfo?.name}</h1>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
              {jobInfo?.experienceLevel}
            </span>
            {jobInfo?.title && (
              <span className="text-xs px-2 py-1 rounded-full border border-[#7B5CFF]/40 text-[#A66CFF]">
                {jobInfo.title}
              </span>
            )}
          </div>
        </div>

        {/* Upload area — shown when new or no analysis yet */}
        {(isNew || !analysis) && (
          <div className="bg-[#071025] border border-[#7B5CFF]/20 rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-bold text-white">
              {uploading ? "Analyzing your resume..." : "Upload your resume"}
            </h2>
            <p className="text-white/50 text-sm">
              {uploading ? "This may take a moment" : "Get personalized AI feedback based on the job description"}
            </p>

            {uploading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2Icon className="size-16 animate-spin text-[#7B5CFF]" />
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  isDragOver
                    ? "border-[#7B5CFF] bg-[#7B5CFF]/10"
                    : "border-[#7B5CFF]/30 hover:border-[#7B5CFF]/60"
                }`}
              >
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="opacity-0 absolute inset-0 cursor-pointer"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <div className="flex flex-col items-center gap-4">
                  <UploadIcon className="size-12 text-[#7B5CFF]" />
                  <div>
                    <p className="text-white font-semibold text-lg">Drag your resume here or click to upload</p>
                    <p className="text-white/50 text-sm mt-1">Supported: PDF, Word, TXT — max 10MB</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis results */}
        {analysis && (
          <div className="space-y-6">
            {/* Overall score */}
            <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/40 rounded-2xl p-8 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-semibold tracking-widest">OVERALL SCORE</p>
                <p className="text-white/50 text-sm mt-1">{analysis.fileName}</p>
              </div>
              <div className="text-7xl font-black bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent">
                {analysis.overallScore}/10
              </div>
            </div>

            {/* Category accordions */}
            <div className="space-y-3">
              {Object.entries(SECTIONS).map(([key, title]) => (
                <CategoryAccordion
                  key={key}
                  sectionKey={key}
                  title={title}
                  category={analysis[key]}
                />
              ))}
            </div>

            {/* Analyze another */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => navigate(`/resumeanalyze/${jobInfoId}/new`)}
                className="px-8 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzeDetailPage;
