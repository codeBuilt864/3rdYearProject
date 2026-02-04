export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div key={idx} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
              idx < currentStep
                ? 'bg-green-500 text-white'
                : idx === currentStep
                ? 'bg-blue-500 text-white ring-4 ring-blue-300'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {idx < currentStep ? '✓' : idx + 1}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 transition-all ${
                idx < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
