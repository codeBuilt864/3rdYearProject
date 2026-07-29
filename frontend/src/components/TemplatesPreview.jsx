import React, { useState } from "react";
import Templates from "./Templates";

function SmallCopy({ text }) {
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <button onClick={handle} className="px-2 py-1 bg-white/6 rounded text-white text-xs">Copy</button>
  );
}

export default function TemplatesPreview() {
  const [open, setOpen] = useState(false);

  const email = `Hi [Name],\n\nI recently applied for the [Role] at [Company]. I'm excited about the opportunity...`;
  const linkedin = `Hi [Recruiter],\n\nI saw your posting for [Role] at [Company]. I'd love to connect...`;
  const follow = `Hi [Name],\n\nFollowing up on my application for [Role]. I'm available for an interview...`;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[{t:"Email", s:email},{t:"LinkedIn", s:linkedin},{t:"Follow-up", s:follow}].map((it) => (
          <div key={it.t} className="p-3 bg-[#0f0c1a]/40 border border-[#7B5CFF]/10 rounded-lg flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{it.t}</p>
              <p className="text-xs text-white/60 mt-2 line-clamp-3">{it.s}</p>
            </div>
            <div className="mt-3 flex justify-end">
              <SmallCopy text={it.s} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white text-sm">View all templates</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative max-w-4xl w-full max-h-[82vh] overflow-auto rounded-2xl">
            <div className="p-4 bg-transparent">
              <div className="flex items-center justify-end mb-3">
                <button onClick={() => setOpen(false)} className="px-3 py-1 bg-white/6 rounded text-white">Close</button>
              </div>
              <div className="bg-transparent">
                <Templates compact={true} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
