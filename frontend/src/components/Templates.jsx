import React from "react";

function CopyButton({ text }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Template copied to clipboard!");
    } catch (e) {
      alert("Copy failed — select and copy manually.");
    }
  };

  return (
    <button 
      onClick={handleCopy} 
      className="px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg duration-300"
    >
      Copy
    </button>
  );
}

function Templates() {
  const emailTemplate = `Subject: Application for Frontend Engineer - Yaseer\n\nHello [Name],\n\nI recently applied for the Frontend Engineer role at [Company]. I have 3 years experience building React applications, including a project that reduced load time by 40%. I'm available for a 30-minute call on Tue/Wed between 10-12 or Thu 14-16. My resume is attached.\n\nBest regards,\nYaseer`;

  const linkedinMessage = `Hi [Recruiter Name],\n\nI noticed your opening for [Role] at [Company]. I have experience in React and Typescript and recently launched [project]. Would you be open to a quick chat this week?\n\nThanks,\nYaseer`;

  const followUp = `Hi [Name],\n\nFollowing up on my application for [Role]. I'm very interested and available for an interview. Please let me know if you need any additional information.\n\nRegards,\nYaseer`;

  return (
    <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md border border-[#7B5CFF]/30 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all duration-300 p-8">
      <h3 className="text-3xl font-black text-white mb-8 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text">Ready-to-use Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl hover:border-[#7B5CFF]/60 transition-all duration-300">
          <h4 className="font-bold text-white mb-3 text-lg">📧 Email Template</h4>
          <pre className="text-sm text-white/70 whitespace-pre-wrap mb-4 bg-black/20 p-4 rounded-lg overflow-x-auto">{emailTemplate}</pre>
          <CopyButton text={emailTemplate} />
        </div>

        <div className="p-6 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl hover:border-[#7B5CFF]/60 transition-all duration-300">
          <h4 className="font-bold text-white mb-3 text-lg">💼 LinkedIn Message</h4>
          <pre className="text-sm text-white/70 whitespace-pre-wrap mb-4 bg-black/20 p-4 rounded-lg overflow-x-auto">{linkedinMessage}</pre>
          <CopyButton text={linkedinMessage} />
        </div>

        <div className="p-6 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-2xl hover:border-[#7B5CFF]/60 transition-all duration-300">
          <h4 className="font-bold text-white mb-3 text-lg">↩️ Follow-up Template</h4>
          <pre className="text-sm text-white/70 whitespace-pre-wrap mb-4 bg-black/20 p-4 rounded-lg overflow-x-auto">{followUp}</pre>
          <CopyButton text={followUp} />
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/40 rounded-2xl">
        <h4 className="font-bold text-white mb-4 text-lg flex items-center gap-2">
          <span>✅</span>
          Interview Day Checklist
        </h4>
        <ul className="space-y-3 text-white/80 text-sm">
          <li className="flex gap-3">
            <span className="text-lg">•</span>
            <span>Confirm time and timezone; add calendar invite.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">•</span>
            <span>Prepare 3 STAR stories and 3 technical examples.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">•</span>
            <span>Test camera, microphone, and internet speed.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-lg">•</span>
            <span>Have a quiet, well-lit space and a charger ready.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Templates;
