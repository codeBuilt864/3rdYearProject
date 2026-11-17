import { CheckIcon, ClipboardListIcon, CopyIcon, MailIcon, MessageSquareIcon, ReplyIcon } from "lucide-react";
import toast from "react-hot-toast";

const checklist = [
  "Confirm time and timezone; add calendar invite.",
  "Prepare 3 STAR stories and 3 technical examples.",
  "Test camera, microphone, and internet speed.",
  "Have a quiet, well-lit space and a charger ready.",
];

export default function Templates({ compact = false }) {
  const emailTemplate = `Subject: Application for Frontend Engineer - Yaseer\n\nHello [Name],\n\nI recently applied for the Frontend Engineer role at [Company]. I have 3 years experience building React applications, including a project that reduced load time by 40%. I'm available for a 30-minute call on Tue/Wed between 10-12 or Thu 14-16. My resume is attached.\n\nBest regards,\nYaseer`;

  const linkedinMessage = `Hi [Recruiter Name],\n\nI noticed your opening for [Role] at [Company]. I have experience in React and Typescript and recently launched [project]. Would you be open to a quick chat this week?\n\nThanks,\nYaseer`;

  const followUp = `Hi [Name],\n\nFollowing up on my application for [Role]. I'm very interested and available for an interview. Please let me know if you need any additional information.\n\nRegards,\nYaseer`;

  const templates = [
    { title: "Application email", icon: MailIcon, description: "Introduce your fit for a role and offer your availability.", text: emailTemplate },
    { title: "LinkedIn message", icon: MessageSquareIcon, description: "Start a brief, relevant conversation with a recruiter.", text: linkedinMessage },
    { title: "Application follow-up", icon: ReplyIcon, description: "Check in politely and make the next step easy.", text: followUp },
  ];

  async function copyTemplate(template) {
    try {
      await navigator.clipboard.writeText(template.text);
      toast.success("Template copied. Replace the example details before sending.");
    } catch {
      toast.error("Could not copy the template. Select the text and copy it manually.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
        {templates.map((template) => {
          const Icon = template.icon;
          return <article key={template.title} className={`rounded-2xl border border-white/10 bg-[#0F0C29]/50 flex flex-col ${compact ? "p-4" : "p-5 sm:p-6"}`}>
            <Icon aria-hidden="true" className="size-5 text-[#B899FF] mb-4" />
            <h2 className="text-lg font-semibold text-white">{template.title}</h2>
            <p className="text-sm text-white/60 mt-2 mb-4">{template.description}</p>
            <pre tabIndex={0} aria-label={`${template.title} example`} className="font-sans text-sm text-white/75 whitespace-pre-wrap break-words leading-relaxed bg-black/15 rounded-xl p-4 max-h-80 overflow-y-auto mb-5 flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A66CFF]">{template.text}</pre>
            <button onClick={() => copyTemplate(template)} aria-label={`Copy ${template.title.toLowerCase()}`} className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#7B5CFF]/40 bg-[#7B5CFF]/15 px-4 py-2 text-sm font-semibold text-[#D4C4FF] hover:bg-[#7B5CFF]/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A66CFF]">
              <CopyIcon aria-hidden="true" className="size-4" />Copy template
            </button>
          </article>;
        })}
      </div>
      <section className={`rounded-2xl border border-white/10 bg-[#0F0C29]/40 ${compact ? "p-4" : "p-5 sm:p-6"}`}>
        <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4"><ClipboardListIcon aria-hidden="true" className="size-5 text-[#B899FF]" />Interview day checklist</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm text-white/70 leading-relaxed"><CheckIcon aria-hidden="true" className="size-4 text-[#B899FF] shrink-0 mt-0.5" />{item}</li>)}
        </ul>
      </section>
    </div>
  );
}