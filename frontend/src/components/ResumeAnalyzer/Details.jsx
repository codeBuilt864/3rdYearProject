export default function Details({ suggestions = [], rawText }) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-white">📄 Raw Resume Text</h3>
      <div className="p-4 bg-slate-700 rounded border border-slate-600 max-h-64 overflow-y-auto text-sm text-gray-200 whitespace-pre-wrap font-mono">
        {rawText || 'No text available'}
      </div>
    </div>
  );
}
