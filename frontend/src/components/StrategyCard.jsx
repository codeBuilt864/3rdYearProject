import React from "react";

function StrategyCard({ icon, title, image, intro, steps, resources }) {
  return (
    <div className="bg-base-100 rounded-2xl shadow-md border border-base-300 overflow-hidden">
      <div className="flex gap-4 p-6">
        <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-1">{title}</h3>
          <p className="text-base-content/80 mb-3 text-lg">{intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ol className="list-decimal list-inside space-y-2 text-base">
                {steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">{s}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-3">
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-36 object-cover rounded-lg border border-base-200"
                />
              )}
              <div className="text-sm text-base-content/70">
                {resources && (
                  <>
                    <p className="font-semibold mb-1">Resources</p>
                    <ul className="list-disc list-inside space-y-1">
                      {resources.map((r, idx) => (
                        <li key={idx}>
                          <a
                            href={r.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {r.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StrategyCard;
