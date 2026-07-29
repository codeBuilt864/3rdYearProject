export default function Summary({ analysis = {} }) {
  const { overallScore = 0, parsed = {}, wordCount = 0, sections = {} } = analysis;

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{parsed.name || 'Resume'}</h3>
          <div className="text-sm text-gray-600 mt-1">
            {parsed.email && <div>✉️ {parsed.email}</div>}
            {parsed.phone && <div>📞 {parsed.phone}</div>}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-5xl font-extrabold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </div>
          <div className="text-xs text-gray-600 mt-1">Overall Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
        <div>
          <div className="text-gray-600 text-sm">Word Count</div>
          <div className="font-bold text-lg text-gray-800">{wordCount}</div>
        </div>
        <div>
          <div className="text-gray-600 text-sm">Sections Found</div>
          <div className="text-sm text-gray-700 mt-1">
            {sections.hasExperience && <span className="inline-block mr-2">💼 Exp</span>}
            {sections.hasEducation && <span className="inline-block mr-2">🎓 Edu</span>}
            {sections.hasCertifications && <span className="inline-block mr-2">📜 Cert</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
