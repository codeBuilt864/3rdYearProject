import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import StrategyCard from "../components/StrategyCard";
import Templates from "../components/Templates";

function JobHuntingStrategiesPage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards([
      {
        id: 1,
        icon: "📆",
        title: "Schedule Interviews Fast",
        intro:
          "A step-by-step process to find openings, request interviews, and get scheduled quickly.",
        image:
          "https://images.unsplash.com/photo-1520975912823-3b43e6d8d4f2?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=9d0c3f3c9a9e3f1c5b8a6b1a2f2b3c4d",
        steps: [
          "Monitor company careers pages and set daily alerts for roles.",
          "Apply early with a tailored resume and short cover note calling out 2 qualifications.",
          "Send a polite follow-up after 3 days with availability for a 30-minute call.",
          "Offer multiple time slots (2–3) in the first reply to speed scheduling.",
          "When invited, confirm immediately and attach calendar invite.",
        ],
        resources: [
          { label: "How to Ask for an Interview (examples)", href: "https://www.themuse.com/advice/how-to-ask-for-an-interview" },
        ],
      },
      {
        id: 2,
        icon: "🔗",
        title: "Optimize LinkedIn to Attract Recruiters",
        intro:
          "Make your profile discoverable and message-ready so recruiters reach out with offers.",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f2b3c4d5e6f7g8h9i0j",
        steps: [
          "Headline: include job title + 2 key skills (e.g., 'Frontend Engineer • React • Typescript').",
          "About: 3 short paragraphs — who you are, what you build, what roles you want.",
          "Experience: quantifiable achievements (metrics > descriptions).",
          "Skills & endorsements: add top 10 skills and request endorsements from 3 colleagues.",
          "Open to Work: enable 'Open to work' with specific job titles and locations.",
          "Networking: message 5 new relevant recruiters weekly with a short context and CV link.",
        ],
        resources: [
          { label: "LinkedIn Profile Checklist (official)", href: "https://www.linkedin.com/help/linkedin/answer/" },
          { label: "How Recruiters Use LinkedIn", href: "https://business.linkedin.com/talent-solutions/blog" },
        ],
      },
      {
        id: 3,
        icon: "✉️",
        title: "Professional Email & Follow-up",
        intro:
          "Write concise, polite, and action-focused emails that get responses from recruiters.",
        image:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc123def456",
        steps: [
          "Subject: specific and short — 'Application: Frontend Engineer — Yaseer (3 yrs)'.",
          "First line: 1-sentence summary of fit and availability.",
          "Body: 3 lines — role applied, 2 relevant accomplishments, request for next step.",
          "Use bullet points for availability and attach a 1-page resume PDF named 'Firstname_Lastname.pdf'.",
          "Always include a 1–2 line polite follow-up after 3–5 business days.",
        ],
        resources: [
          { label: "Email Templates for Job Seekers", href: "https://hbr.org/2014/02/the-right-way-to-follow-up-after-a-job-interview" },
        ],
      },
      {
        id: 4,
        icon: "🧍‍♂️",
        title: "Body Language & Presence",
        intro:
          "Small non-verbal cues influence hiring decisions — learn simple habits that convey confidence.",
        image:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=def456ghi789",
        steps: [
          "Eye contact: match interviewer rhythm and hold natural eye contact when speaking.",
          "Posture: sit upright, lean slightly forward to show engagement.",
          "Hand gestures: use small, purposeful gestures — avoid fidgeting.",
          "Smile and mirror tone: match energy levels, and pause before answering technical questions to collect thoughts.",
          "Video tip: check camera angle (eye-level), soft front light, quiet background.",
        ],
        resources: [
          { label: "Body Language Tips for Interviews", href: "https://www.forbes.com/sites/theyec/2019/01/23/five-body-language-tips/" },
        ],
      },
      {
        id: 5,
        icon: "🧾",
        title: "Resume & ATS Optimization",
        intro:
          "Format and keywords matter — pass ATS and make it easy for humans to hire you.",
        image:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=ghi789jkl012",
        steps: [
          "One-page (for early-career) — clear sections: Summary, Experience, Skills, Education.",
          "Use role-specific keywords and quantify results (" + "'reduced load time by 40%'" + ").",
          "Avoid headers/footers, use standard fonts and simple bullets for ATS readability.",
          "Export as PDF named professionally and attach to emails and LinkedIn messages.",
        ],
        resources: [
          { label: "ATS Friendly Resume Tips", href: "https://www.jobscan.co/blog/ats-resume/" },
        ],
      },
      {
        id: 6,
        icon: "🧠",
        title: "Interview Prep & Negotiation",
        intro:
          "A clear prep flow for technical and behavioral rounds plus simple negotiation tactics.",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=jkl012mno345",
        steps: [
          "Map the interview process for the company (phone -> technical -> HR).",
          "Practice 2–3 system design or algorithm problems and 4 STAR behavioral stories.",
          "Ask 3 questions at the end that show product/impact thinking.",
          "For offers: ask for 48 hours to consider, evaluate total compensation and growth.",
        ],
        resources: [
          { label: "STAR Method Interview Guide", href: "https://www.themuse.com/advice/what-is-the-star-interview-response-technique" },
        ],
      },
      {
        id: 7,
        icon: "🤝",
        title: "Networking that Converts",
        intro:
          "Build relationships that lead to referrals — targeted and respectful outreach.",
        image:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=netwk",
        steps: [
          "Map 20 alumni, ex-colleagues, and recruiters in your target companies.",
          "Send personalized messages referencing a shared detail (project, school).",
          "Ask for 15 minutes informational call and one introduction to the hiring team.",
          "Give value: share a relevant article or quick idea related to their work.",
        ],
        resources: [
          { label: "Informational Interview Guide", href: "https://hbr.org/2012/07/how-to-conduct-an-informational-interview" },
        ],
      },
      {
        id: 8,
        icon: "📁",
        title: "Portfolio & GitHub Showcase",
        intro:
          "Make a small portfolio that shows impact — projects with live demos and code.",
        image:
          "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=port",
        steps: [
          "Pick 3 projects with clear problem -> solution -> impact structure.",
          "Add README with setup steps, tech stack, and your specific contributions.",
          "Deploy a demo (Netlify/Vercel) and link from your resume and LinkedIn.",
        ],
        resources: [
          { label: "How to Write a Great README", href: "https://www.freecodecamp.org/news/how-to-write-a-readme/" },
        ],
      },
      {
        id: 9,
        icon: "💬",
        title: "Reach Recruiters Directly",
        intro:
          "Short, respectful messages to recruiters that highlight fit and availability.",
        image:
          "https://images.unsplash.com/photo-1520975912823-3b43e6d8d4f2?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=recruit",
        steps: [
          "Find recruiter who hired for similar roles and open a short message with 2-lines of fit.",
          "Attach resume link and 1-sentence ask: 'Are you hiring or can you refer me?'.",
          "Follow up politely if no response in 5 business days.",
        ],
        resources: [
          { label: "Best Practices for Recruiter Outreach", href: "https://www.linkedin.com/pulse/how-get-recruiters-notice-you-heres-what-you-should-do/" },
        ],
      },
      {
        id: 10,
        icon: "📣",
        title: "Local Job Boards & Recruiters (Sri Lanka)",
        intro:
          "Key local places to find IT roles in Sri Lanka plus recruiter groups and company career pages.",
        image:
          "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=jobs",
        steps: [
          "Monitor: TopJobs (topjobs.lk), ikman Jobs (ikman.lk/jobs), Jobs.LK, and LinkedIn Jobs (filter Sri Lanka).",
          "Follow company career pages and set alerts for keyword matches.",
          "Join Sri Lanka tech & recruiter groups on LinkedIn and Facebook; engage weekly.",
        ],
        resources: [
          { label: "TopJobs Sri Lanka", href: "https://www.topjobs.lk/" },
          { label: "ikman Jobs", href: "https://ikman.lk/en/ads/sri-lanka/jobs" },
          { label: "LinkedIn Jobs (Sri Lanka)", href: "https://www.linkedin.com/jobs/" },
        ],
      },
      {
        id: 11,
        icon: "📝",
        title: "Follow-up & Offer Handling",
        intro:
          "How to follow up, ask for time to consider offers, and negotiate respectfully.",
        image:
          "https://images.unsplash.com/photo-1542223616-1f78d8f6c3b6?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=offer",
        steps: [
          "When you get an offer, ask for 48 hours to evaluate and request total comp breakdown.",
          "Negotiate on growth opportunities, title, and learning budget if base salary is fixed.",
          "Get the offer in writing and confirm start date, reporting manager, and probation terms.",
        ],
        resources: [
          { label: "How to Negotiate Job Offers", href: "https://www.themuse.com/advice/how-to-negotiate-salary" },
        ],
      },
      {
        id: 12,
        icon: "🎯",
        title: "Smart Daily Routine for Faster Hiring",
        intro:
          "A focused daily routine that balances applications, networking, and skill sharpening.",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=routine",
        steps: [
          "Morning: 1 hour — apply to 3 tailored roles and send 2 recruiter messages.",
          "Afternoon: 1 hour — coding practice or portfolio improvements.",
          "Evening: 30 mins — follow-ups and networking replies.",
        ],
        resources: [
          { label: "Productive Job Search Schedule", href: "https://hbr.org/2020/07/how-to-run-a-more-effective-job-search" },
        ],
      },
    ]);
  }, []);

  // Coverflow carousel state
  const [activeIndex, setActiveIndex] = useState(0);
  const coverRef = useRef(null);
  const isHovering = useRef(false);
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const detailRefs = useRef([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  function handleCarouselClick(i) {
    setActiveIndex(i);
    // scroll to detail card after short delay to allow animation
    setTimeout(() => {
      const el = detailRefs.current[i];
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedIndex(i);
        setTimeout(() => setHighlightedIndex(null), 2800);
      }
    }, 320);
  }

  // autoplay
  useEffect(() => {
    if (!cards || cards.length === 0) return;
    const t = setInterval(() => {
      if (!isHovering.current && !dragging.current) {
        setActiveIndex((i) => (i + 1) % cards.length);
      }
    }, 3500);
    return () => clearInterval(t);
  }, [cards]);

  // drag / swipe to change index
  useEffect(() => {
    const el = coverRef.current;
    if (!el) return;

    function onDown(e) {
      dragging.current = true;
      dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    }
    function onMove(e) {
      if (!dragging.current) return;
      const x = e.clientX || e.touches?.[0]?.clientX || 0;
      const dx = x - dragStartX.current;
      if (Math.abs(dx) > 60) {
        if (dx > 0) setActiveIndex((i) => (i - 1 + cards.length) % cards.length);
        else setActiveIndex((i) => (i + 1) % cards.length);
        dragStartX.current = x;
        dragging.current = false;
      }
    }
    function onUp() { dragging.current = false; }

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [cards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 w-full">
        <header className="mb-12">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] bg-clip-text text-transparent">Practical Job Hunting Strategies</h1>
          <p className="text-lg text-white/80 max-w-3xl">Step-by-step, practical guides to help you land interviews faster and get offers from top recruiters.</p>
        </header>

        {/* Coverflow Preview (readable, centered) */}
        <div
          ref={coverRef}
          onMouseEnter={() => { isHovering.current = true; }}
          onMouseLeave={() => { isHovering.current = false; }}
          className="w-full my-12 flex items-center justify-center relative"
        >
          <div className="relative w-full max-w-6xl h-[360px] mx-auto" style={{ perspective: 1400 }}>
            <div className="absolute inset-0 flex items-center justify-center">
              {cards.map((c, i) => {
                if (!cards || cards.length === 0) return null;
                const len = cards.length;
                let diff = i - activeIndex;
                const half = Math.floor(len / 2);
                if (diff > half) diff -= len;
                if (diff < -half) diff += len;

                const x = diff * 160; // horizontal offset
                const rotate = diff * -22; // tilt angle
                const z = diff === 0 ? 180 : -Math.abs(diff) * 60; // depth
                const scale = diff === 0 ? 1 : Math.max(0.78, 1 - Math.abs(diff) * 0.08);
                const opacity = Math.abs(diff) > 3 ? 0 : 1 - Math.abs(diff) * 0.18;
                const zIndex = 100 - Math.abs(diff);

                const style = {
                  transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                };

                return (
                  <div
                    key={c.id}
                    onClick={() => handleCarouselClick(i)}
                    style={style}
                    className="absolute w-80 transition-all duration-500 cursor-pointer"
                    aria-hidden={i !== activeIndex}
                  >
                    <div className={`rounded-2xl p-4 shadow-2xl backdrop-blur-md border border-[#7B5CFF]/20 ${i === activeIndex ? 'bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30' : 'bg-[#0f0c1a]/40'}`}>
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center text-2xl font-bold">{c.icon}</div>
                        <div>
                          <h4 className="text-lg font-black mb-1 text-white">{c.title}</h4>
                          <p className="text-sm text-white/70 line-clamp-3">{c.intro}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* controls */}
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + cards.length) % cards.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/6 hover:bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center shadow"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % cards.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/6 hover:bg-white/10 text-white rounded-full w-10 h-10 flex items-center justify-center shadow"
              aria-label="Next"
            >
              ›
            </button>

            {/* indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full ${idx === activeIndex ? 'bg-white' : 'bg-white/30'}`}
                  aria-label={`Go to ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-8">
          {cards.map((c, idx) => (
            <div
              key={c.id}
              ref={(el) => (detailRefs.current[idx] = el)}
              className={`${highlightedIndex === idx ? 'ring-4 ring-[#7B5CFF]/40 rounded-3xl transition-shadow' : ''}`}
            >
              <StrategyCard
                icon={c.icon}
                title={c.title}
                image={c.image}
                intro={c.intro}
                steps={c.steps}
                resources={c.resources}
              />
            </div>
          ))}

          <div className="mt-8">
            <Templates />
          </div>
        </section>
      </div>
    </div>
  );
}

export default JobHuntingStrategiesPage;
