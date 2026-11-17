export default function ScoreGauge({ label, score, height = 8 }) {
  const getColor = (s) => {
    if (s >= 80) return '#16a34a'; // green
    if (s >= 60) return '#f59e0b'; // amber
    return '#dc2626'; // red
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
          {score}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: `${height}px` }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: getColor(score) }}
        />
      </div>
    </div>
  );
}
