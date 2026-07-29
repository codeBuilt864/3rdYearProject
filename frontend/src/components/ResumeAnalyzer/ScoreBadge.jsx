export default function ScoreBadge({ score = 0 }) {
  const color = score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-error';
  return (
    <div className="flex items-center gap-4">
      <div className={`text-5xl font-extrabold ${color}`}>{score}</div>
      <div>
        <div className="text-sm opacity-70">Overall Score</div>
        <div className="w-48 h-2 bg-base-200 rounded mt-2">
          <div className="h-2 rounded" style={{ width: `${score}%`, background: score >= 80 ? '#16a34a' : score >= 60 ? '#f59e0b' : '#dc2626' }} />
        </div>
      </div>
    </div>
  );
}
