import { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === idx ? -1 : idx)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 font-medium text-left text-gray-700 flex justify-between items-center transition-colors"
          >
            {item.title}
            <span className={`text-lg transform transition-transform ${expanded === idx ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          {expanded === idx && (
            <div className="px-4 py-3 bg-white border-t border-gray-200 text-sm text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
