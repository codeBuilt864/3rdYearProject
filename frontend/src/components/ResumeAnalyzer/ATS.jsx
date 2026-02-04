import ScoreGauge from './ScoreGauge';

export default function ATS({ scores = {} }) {
  const { ats = 0, tone = 0, content = 0, structure = 0, skills = 0 } = scores;

  return (
    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">ATS & Scoring Breakdown</h3>
      <div className="space-y-4">
        <ScoreGauge label="ATS Score (Keyword Match)" score={ats} height={10} />
        <ScoreGauge label="Tone & Professionalism" score={tone} height={10} />
        <ScoreGauge label="Content Quality" score={content} height={10} />
        <ScoreGauge label="Structure & Organization" score={structure} height={10} />
        <ScoreGauge label="Skills Relevance" score={skills} height={10} />
      </div>
    </div>
  );
}
