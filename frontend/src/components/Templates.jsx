import React from "react";

function CopyButton({ text }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Template copied to clipboard");
    } catch (e) {
      alert("Copy failed — select and copy manually.");
    }
  };

  return (
    <button onClick={handleCopy} className="btn btn-sm btn-outline">
      Copy
    </button>
  );
}

function Templates() {
  const emailTemplate = `Subject: Application for Frontend Engineer - Yaseer\n\nHello [Name],\n\nI recently applied for the Frontend Engineer role at [Company]. I have 3 years experience building React applications, including a project that reduced load time by 40%. I'm available for a 30-minute call on Tue/Wed between 10-12 or Thu 14-16. My resume is attached.\n\nBest regards,\nYaseer`;

  const linkedinMessage = `Hi [Recruiter Name],\n\nI noticed your opening for [Role] at [Company]. I have experience in React and Typescript and recently launched [project]. Would you be open to a quick chat this week?\n\nThanks,\nYaseer`;

  const followUp = `Hi [Name],\n\nFollowing up on my application for [Role]. I'm very interested and available for an interview. Please let me know if you need any additional information.\n\nRegards,\nYaseer`;

  return (
    <div className="bg-base-100 rounded-xl border border-base-300 p-6">
      <h3 className="text-2xl font-bold mb-4">Ready-to-use Templates & Checklists</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold mb-2">Email Template</h4>
          <pre className="text-sm whitespace-pre-wrap mb-2">{emailTemplate}</pre>
          <CopyButton text={emailTemplate} />
        </div>

        <div className="p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold mb-2">LinkedIn Message</h4>
          <pre className="text-sm whitespace-pre-wrap mb-2">{linkedinMessage}</pre>
          <CopyButton text={linkedinMessage} />
        </div>

        <div className="p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold mb-2">Follow-up Template</h4>
          <pre className="text-sm whitespace-pre-wrap mb-2">{followUp}</pre>
          <CopyButton text={followUp} />
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Interview Day Checklist</h4>
        <ul className="list-disc list-inside text-sm">
          <li>Confirm time and timezone; add calendar invite.</li>
          <li>Prepare 3 STAR stories and 3 technical examples.</li>
          <li>Test camera, microphone, and internet speed.</li>
          <li>Have a quiet, well-lit space and a charger ready.</li>
        </ul>
      </div>
    </div>
  );
}

export default Templates;
