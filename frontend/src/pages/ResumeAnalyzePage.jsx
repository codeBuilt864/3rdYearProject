import { useState } from "react";
import Navbar from "../components/Navbar";
import StepIndicator from "../components/ResumeAnalyzer/StepIndicator";
import StepContainer from "../components/ResumeAnalyzer/StepContainer";
import ScoreCircle from "../components/ResumeAnalyzer/ScoreCircle";
import ATS from "../components/ResumeAnalyzer/ATS";
import Accordion from "../components/ResumeAnalyzer/Accordion";
import { analyzeResume } from "../lib/puter";
import { extractPdfText, extractTextFile } from "../lib/pdfExtractor";

function ResumeAnalyzePage() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractionError, setExtractionError] = useState(null);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setResumeFile({ name: file.name, status: 'reading' });
    setExtractionError(null);

    try {
      let text = null;

      // Try PDF extraction first
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setResumeFile({ name: file.name, status: 'extracting' });
        text = await extractPdfText(file);
      }

      // Fallback to text extraction
      if (!text) {
        text = await extractTextFile(file);
      }

      if (text) {
        setResumeText(text);
        setResumeFile({ name: file.name, status: 'done' });
        setStep(2);
      } else {
        setExtractionError('Could not extract readable text. Try .txt or .docx format.');
        setResumeFile({ name: file.name, status: 'error' });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setExtractionError('Error reading file. Please try again.');
      setResumeFile({ name: file.name, status: 'error' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      // Try server-side AI analysis first
      let res = null;
      try {
        const r = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: resumeText, jobDescription })
        });
        if (r.ok) {
          res = await r.json();
        } else {
          console.warn('Server analysis failed, using local fallback');
        }
      } catch (e) {
        console.warn('Server analyze error, using local fallback', e);
      }

      if (!res) {
        res = await analyzeResume(resumeText, jobDescription);
      }
      setAnalysis(res);
      setStep(5);
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <StepIndicator currentStep={step} totalSteps={5} />

        {/* Step 1: Upload Resume */}
        {step === 1 && (
          <StepContainer title="📄 Upload Your Resume" description="Select your resume file to begin the analysis">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-4 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-blue-400 bg-blue-500/20 shadow-2xl shadow-blue-500/30'
                  : 'border-gray-400 bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700'
              }`}
            >
              <div className="text-8xl mb-6">📤</div>
              <p className="text-white font-bold text-3xl mb-3">Drag & drop your resume</p>
              <p className="text-gray-300 text-lg mb-6">or click below to browse</p>
              <input
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg cursor-pointer transition-all shadow-xl hover:shadow-2xl"
              >
                📁 Choose File
              </label>
              <div className="text-gray-400 text-base mt-8 space-y-2">
                <p className="font-semibold">Supported formats:</p>
                <p>.PDF • .DOC • .DOCX • .TXT • .MD</p>
              </div>
            </div>

            {resumeFile && (
              <div className={`mt-8 p-6 rounded-xl border-2 flex items-start gap-4 text-lg ${
                resumeFile.status === 'error'
                  ? 'bg-red-900/30 border-red-500'
                  : resumeFile.status === 'done'
                  ? 'bg-green-900/30 border-green-500'
                  : 'bg-blue-900/30 border-blue-500'
              }`}>
                <div className="text-4xl">
                  {resumeFile.status === 'error' ? '❌' : resumeFile.status === 'done' ? '✅' : '⏳'}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-xl">{resumeFile.name}</p>
                  {resumeFile.status === 'extracting' && <p className="text-blue-300 text-base mt-1">Extracting text from PDF...</p>}
                  {resumeFile.status === 'reading' && <p className="text-blue-300 text-base mt-1">Reading file...</p>}
                  {resumeFile.status === 'done' && <p className="text-green-300 text-base mt-1">✨ Ready to continue!</p>}
                </div>
              </div>
            )}

            {extractionError && (
              <div className="mt-6 p-6 bg-red-900/30 border-2 border-red-500 rounded-xl">
                <p className="text-red-300 text-lg">⚠️ {extractionError}</p>
              </div>
            )}

            <div className="flex justify-end mt-10">
              <button
                disabled={!resumeFile || resumeFile.status !== 'done'}
                onClick={() => setStep(2)}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Continue → 
              </button>
            </div>
          </StepContainer>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <StepContainer
            title="💼 Job Description (Optional)"
            description="Add the job description for more targeted feedback"
          >
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get tailored suggestions on skill relevance..."
              className="w-full h-64 p-6 bg-slate-700/50 text-white rounded-xl border-2 border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none text-lg leading-relaxed font-medium"
            />
            <p className="text-gray-300 text-base mt-4 flex items-center gap-2">
              <span>💡</span> Adding a job description helps us match your skills with what employers need.
            </p>

            <div className="flex justify-between gap-4 mt-10">
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
              >
                Continue →
              </button>
            </div>
          </StepContainer>
        )}

        {/* Step 3: Review Resume */}
        {step === 3 && (
          <StepContainer
            title="👀 Review Your Resume"
            description="Verify the extracted content looks correct"
          >
            <div className="bg-slate-800/60 rounded-xl border-2 border-slate-600 p-8 max-h-96 overflow-y-auto text-gray-100 whitespace-pre-wrap font-base text-base leading-relaxed tracking-wide">
              {resumeText || 'No content available'}
            </div>

            <div className="mt-6 p-5 bg-blue-900/30 border-2 border-blue-500 rounded-xl">
              <p className="text-blue-300 text-base flex items-center gap-2">
                <span>💡</span> If the text looks corrupted, go back and try converting to .TXT or .DOCX format.
              </p>
            </div>

            <div className="flex justify-between gap-4 mt-10">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
              >
                Continue →
              </button>
            </div>
          </StepContainer>
        )}

        {/* Step 4: Ready to Analyze */}
        {step === 4 && (
          <StepContainer
            title="🔍 Ready to Analyze?"
            description="Review your information before we begin"
          >
            <div className="space-y-4 mb-8">
              <div className="p-6 bg-slate-700/50 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-all">
                <p className="text-gray-400 text-sm font-semibold mb-2">📄 RESUME FILE</p>
                <p className="text-white font-bold text-lg">{resumeFile?.name}</p>
              </div>
              <div className="p-6 bg-slate-700/50 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-all">
                <p className="text-gray-400 text-sm font-semibold mb-2">📊 CONTENT ANALYSIS</p>
                <p className="text-white font-bold text-lg">{resumeText.split(/\s+/).length} words detected</p>
              </div>
              {jobDescription && (
                <div className="p-6 bg-slate-700/50 rounded-xl border-2 border-slate-600 hover:border-blue-500 transition-all">
                  <p className="text-gray-400 text-sm font-semibold mb-2">🎯 JOB DESCRIPTION</p>
                  <p className="text-white font-bold text-lg">Added ({jobDescription.split(/\s+/).length} words)</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500 rounded-xl mb-8">
              <p className="text-green-300 text-lg font-semibold">
                ✨ Click analyze to get your comprehensive resume assessment with actionable suggestions!
              </p>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setStep(3)}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl disabled:cursor-not-allowed"
              >
                {isLoading ? '⏳ Analyzing...' : '🚀 Analyze My Resume'}
              </button>
            </div>
          </StepContainer>
        )}

        {/* Step 5: Results */}
        {step === 5 && analysis && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-black text-white mb-4">✅ Analysis Complete!</h2>
              <p className="text-gray-300 text-xl">Here's your comprehensive resume assessment</p>
            </div>

            {/* Overall Score - Large and Prominent */}
            <div className="bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-pink-600/30 border-3 border-blue-500/50 rounded-2xl p-10 mb-10 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-bold tracking-widest mb-2">OVERALL SCORE</p>
                  <p className="text-gray-400 text-lg">Based on 5 comprehensive dimensions</p>
                </div>
                <div className={`text-9xl font-black ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}
                </div>
              </div>
            </div>

            {/* Score Circles */}
            <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-10 mb-10">
              <h3 className="text-3xl font-bold text-white mb-8">📊 Detailed Score Breakdown</h3>
              <div className="grid grid-cols-5 gap-6 mb-10">
                <ScoreCircle label="ATS Match" score={analysis.scores.ats} size={120} />
                <ScoreCircle label="Tone" score={analysis.scores.tone} size={120} />
                <ScoreCircle label="Content" score={analysis.scores.content} size={120} />
                <ScoreCircle label="Structure" score={analysis.scores.structure} size={120} />
                <ScoreCircle label="Skills" score={analysis.scores.skills} size={120} />
              </div>
              <ATS scores={analysis.scores} />
            </div>

            {/* Suggestions */}
            <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-10 mb-10">
              <h3 className="text-3xl font-bold text-white mb-6">💡 Key Recommendations</h3>
              {analysis.suggestions && analysis.suggestions.length > 0 ? (
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div
                      key={i}
                      className="p-5 bg-amber-900/40 border-l-4 border-amber-500 rounded-lg text-amber-100 text-base font-medium leading-relaxed"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-green-900/40 border-2 border-green-500 rounded-xl text-green-100 text-lg font-semibold">
                  🎉 Excellent work! Your resume is well-optimized. Keep it up!
                </div>
              )}
            </div>

            {/* Details Accordion */}
            <div className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-10 mb-10">
              <h3 className="text-3xl font-bold text-white mb-6">📑 Detailed Information</h3>
              <Accordion
                items={[
                  {
                    title: "📋 Contact Information",
                    content: (
                      <div className="space-y-3 text-base">
                        <div className="flex justify-between"><span className="font-bold">Name:</span> <span className="text-gray-300">{analysis.parsed.name || "Not detected"}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Email:</span> <span className="text-gray-300">{analysis.parsed.email || "Not found"}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Phone:</span> <span className="text-gray-300">{analysis.parsed.phone || "Not found"}</span></div>
                      </div>
                    ),
                  },
                  {
                    title: "🛠️ Technical Skills Detected",
                    content: (
                      <div>
                        {analysis.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {analysis.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-blue-500/40 text-blue-200 rounded-full text-base font-semibold border border-blue-500/60"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-base">No skills detected. Add more technical skills to your resume.</p>
                        )}
                      </div>
                    ),
                  },
                  {
                    title: "📊 Document Statistics",
                    content: (
                      <div className="space-y-3 text-base">
                        <div className="flex justify-between"><span className="font-bold">Total Words:</span> <span className="text-gray-300">{analysis.wordCount}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Experience Section:</span> <span className={analysis.sections.hasExperience ? "text-green-400" : "text-red-400"}>{analysis.sections.hasExperience ? "✅ Present" : "❌ Missing"}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Education:</span> <span className={analysis.sections.hasEducation ? "text-green-400" : "text-red-400"}>{analysis.sections.hasEducation ? "✅ Present" : "❌ Missing"}</span></div>
                        <div className="flex justify-between"><span className="font-bold">Certifications:</span> <span className={analysis.sections.hasCertifications ? "text-green-400" : "text-red-400"}>{analysis.sections.hasCertifications ? "✅ Present" : "❌ Missing"}</span></div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mb-12">
              <button
                onClick={() => {
                  setStep(1);
                  setResumeFile(null);
                  setResumeText("");
                  setJobDescription("");
                  setAnalysis(null);
                  setExtractionError(null);
                }}
                className="px-10 py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
              >
                ← Analyze Another Resume
              </button>
              <a
                href="/"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
              >
                🏠 Back to Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzePage;

