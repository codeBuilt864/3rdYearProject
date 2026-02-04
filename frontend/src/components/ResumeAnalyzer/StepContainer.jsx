export default function StepContainer({ children, title, description }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        {description && <p className="text-gray-300 text-lg">{description}</p>}
      </div>
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}
