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
          "https://images.unsplash.com/photo-1698047681452-08eba22d0c64?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        steps: [
          "Monitor company careers pages and set daily alerts for roles.",
          "Apply early with a tailored resume and short cover note calling out 2 qualifications.",
          "Send a polite follow-up after 3 days with availability for a 30-minute call.",
          "Offer multiple time slots (2–3) in the first reply to speed scheduling.",
          "When invited, confirm immediately and attach calendar invite.",
        ],
        resources: [
          {
            label: "How to Ask for an Interview (examples)",
            href: "https://www.themuse.com/advice/how-to-ask-for-an-interview",
          },
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
          {
            label: "LinkedIn Profile Checklist (official)",
            href: "https://www.linkedin.com/help/linkedin/answer/",
          },
          {
            label: "How Recruiters Use LinkedIn",
            href: "https://business.linkedin.com/talent-solutions/blog",
          },
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
          {
            label: "Email Templates for Job Seekers",
            href: "https://hbr.org/2014/02/the-right-way-to-follow-up-after-a-job-interview",
          },
        ],
      },
      {
        id: 4,
        icon: "🧍‍♂️",
        title: "Body Language & Presence",
        intro:
          "Small non-verbal cues influence hiring decisions — learn simple habits that convey confidence.",
        image:
          "https://plus.unsplash.com/premium_photo-1667516475120-c6dddd1d76a3?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        steps: [
          "Eye contact: match interviewer rhythm and hold natural eye contact when speaking.",
          "Posture: sit upright, lean slightly forward to show engagement.",
          "Hand gestures: use small, purposeful gestures — avoid fidgeting.",
          "Smile and mirror tone: match energy levels, and pause before answering technical questions to collect thoughts.",
          "Video tip: check camera angle (eye-level), soft front light, quiet background.",
        ],
        resources: [
          {
            label: "Body Language Tips for Interviews",
            href: "https://www.forbes.com/sites/theyec/2019/01/23/five-body-language-tips/",
          },
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
          "Use role-specific keywords and quantify results (" +
            "'reduced load time by 40%'" +
            ").",
          "Avoid headers/footers, use standard fonts and simple bullets for ATS readability.",
          "Export as PDF named professionally and attach to emails and LinkedIn messages.",
        ],
        resources: [
          {
            label: "ATS Friendly Resume Tips",
            href: "https://www.jobscan.co/blog/ats-resume/",
          },
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
          {
            label: "STAR Method Interview Guide",
            href: "https://www.themuse.com/advice/what-is-the-star-interview-response-technique",
          },
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
          {
            label: "Informational Interview Guide",
            href: "https://hbr.org/2012/07/how-to-conduct-an-informational-interview",
          },
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
          {
            label: "How to Write a Great README",
            href: "https://www.freecodecamp.org/news/how-to-write-a-readme/",
          },
        ],
      },
      {
        id: 9,
        icon: "💬",
        title: "Reach Recruiters Directly",
        intro:
          "Short, respectful messages to recruiters that highlight fit and availability.",
        image:
          "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        steps: [
          "Find recruiter who hired for similar roles and open a short message with 2-lines of fit.",
          "Attach resume link and 1-sentence ask: 'Are you hiring or can you refer me?'.",
          "Follow up politely if no response in 5 business days.",
        ],
        resources: [
          {
            label: "Best Practices for Recruiter Outreach",
            href: "https://www.linkedin.com/pulse/how-get-recruiters-notice-you-heres-what-you-should-do/",
          },
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
          {
            label: "ikman Jobs",
            href: "https://ikman.lk/en/ads/sri-lanka/jobs",
          },
          {
            label: "LinkedIn Jobs (Sri Lanka)",
            href: "https://www.linkedin.com/jobs/",
          },
        ],
      },
      {
        id: 11,
        icon: "📝",
        title: "Follow-up & Offer Handling",
        intro:
          "How to follow up, ask for time to consider offers, and negotiate respectfully.",
        image:
          "https://plus.unsplash.com/premium_photo-1683121291576-786e1d36fc2c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        steps: [
          "When you get an offer, ask for 48 hours to evaluate and request total comp breakdown.",
          "Negotiate on growth opportunities, title, and learning budget if base salary is fixed.",
          "Get the offer in writing and confirm start date, reporting manager, and probation terms.",
        ],
        resources: [
          {
            label: "How to Negotiate Job Offers",
            href: "https://www.themuse.com/advice/how-to-negotiate-salary",
          },
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
          {
            label: "Productive Job Search Schedule",
            href: "https://hbr.org/2020/07/how-to-run-a-more-effective-job-search",
          },
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
        el.scrollIntoView({ behavior: "smooth", block: "center" });
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
        if (dx > 0)
          setActiveIndex((i) => (i - 1 + cards.length) % cards.length);
        else setActiveIndex((i) => (i + 1) % cards.length);
        dragStartX.current = x;
        dragging.current = false;
      }
    }
    function onUp() {
      dragging.current = false;
    }

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [cards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8 w-full">
        {/* Enhanced Header */}
        <header className="mb-12">
          <div className="relative mb-6">
            <div className="absolute -left-4 -top-4 w-72 h-72 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#FF6B9D] bg-clip-text text-transparent">
              Land Your Dream Job
            </h1>
          </div>
          <p className="text-lg text-white/80 max-w-3xl mb-6">
            Proven strategies to get interviews faster, impress recruiters, and
            negotiate better offers. Follow 12 practical guides built for
            success.
          </p>

          {/* Progress Badge */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/40 rounded-full px-4 py-2">
              <span className="text-xl">📚</span>
              <span className="text-sm text-white/80">
                <span className="font-bold text-[#A66CFF]">{cards.length}</span>{" "}
                Proven Strategies
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B9D]/20 to-[#A66CFF]/20 border border-[#FF6B9D]/40 rounded-full px-4 py-2">
              <span className="text-xl">⏱️</span>
              <span className="text-sm text-white/80">20 min read</span>
            </div>
          </div>
        </header>

        {/* Coverflow Preview (readable, centered) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">
                Choose Your Strategy
              </h2>
              <p className="text-white/60 text-sm">
                Click cards or drag to explore different job hunting approaches
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-xs text-white/60">
                Strategy{" "}
                <span className="font-bold text-[#A66CFF]">
                  {activeIndex + 1}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#A66CFF]">{cards.length}</span>
              </span>
            </div>
          </div>

          <div
            ref={coverRef}
            onMouseEnter={() => {
              isHovering.current = true;
            }}
            onMouseLeave={() => {
              isHovering.current = false;
            }}
            className="w-full flex items-center justify-center relative"
          >
            <div
              className="relative w-full max-w-6xl h-[400px] mx-auto"
              style={{ perspective: 1400 }}
            >
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
                  const scale =
                    diff === 0 ? 1 : Math.max(0.78, 1 - Math.abs(diff) * 0.08);
                  const opacity =
                    Math.abs(diff) > 3 ? 0 : 1 - Math.abs(diff) * 0.18;
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
                      className="absolute w-80 transition-all duration-500 cursor-pointer group hover:scale-105"
                      aria-hidden={i !== activeIndex}
                    >
                      <div
                        className={`rounded-3xl p-6 shadow-2xl backdrop-blur-md border transition-all duration-300 ${i === activeIndex ? "bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 border-[#7B5CFF]/60 shadow-lg shadow-[#7B5CFF]/30" : "bg-[#0f0c1a]/50 border-[#7B5CFF]/20 hover:border-[#7B5CFF]/40 hover:bg-[#0f0c1a]/70"}`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-lg">
                            {c.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-black mb-2 text-white leading-tight">
                              {c.title}
                            </h4>
                            <p className="text-xs text-white/70 line-clamp-2">
                              {c.intro}
                            </p>
                          </div>
                        </div>
                        {i === activeIndex && (
                          <div className="mt-4 pt-4 border-t border-[#7B5CFF]/30 text-xs text-white/60 animate-pulse">
                            ✨ Click or swipe to explore →
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced controls */}
              <button
                onClick={() =>
                  setActiveIndex((i) => (i - 1 + cards.length) % cards.length)
                }
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-gradient-to-r from-[#7B5CFF]/20 to-[#A66CFF]/20 hover:from-[#7B5CFF]/40 hover:to-[#A66CFF]/40 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-[#7B5CFF]/30 hover:border-[#7B5CFF]/60 transition-all duration-300 font-bold text-lg"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => setActiveIndex((i) => (i + 1) % cards.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-gradient-to-r from-[#7B5CFF]/20 to-[#A66CFF]/20 hover:from-[#7B5CFF]/40 hover:to-[#A66CFF]/40 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-[#7B5CFF]/30 hover:border-[#7B5CFF]/60 transition-all duration-300 font-bold text-lg"
                aria-label="Next"
              >
                ›
              </button>

              {/* Enhanced indicators */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3 items-center">
                {cards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`transition-all duration-300 relative group ${idx === activeIndex ? "w-8" : "w-2"} h-2 rounded-full ${idx === activeIndex ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF]" : "bg-white/25 hover:bg-white/40"}`}
                    aria-label={`Go to ${idx + 1}`}
                    title={cards[idx]?.title}
                  >
                    {idx === activeIndex && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {idx + 1}.{" "}
                        {cards[idx]?.title.split(" ").slice(0, 2).join(" ")}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-8 mt-8">
          {/* Section Header */}
          <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-[#0F0C29]/30">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#A66CFF]/70 mb-3">
                  Strategy frameworks for every stage
                </p>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                  Detailed Strategy Guides
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Learn step-by-step how to execute each strategy effectively,
                  from recruiter-ready follow-up to offer negotiation. This
                  section is built for clarity, confidence, and measurable
                  progress.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-[#7B5CFF]/20 bg-[#0F0C29]/80 px-4 py-3 text-sm text-white/80">
                <span className="rounded-full bg-[#7B5CFF]/15 px-3 py-1 text-[#A66CFF] font-semibold">
                  12 Guides
                </span>
                <span>Proven tactics, polished execution</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#7B5CFF]/15 bg-[#0F0C29]/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#A66CFF]/70 mb-2">
                  Fast impact
                </p>
                <p className="text-sm text-white/70">
                  Get high-value actions you can implement immediately.
                </p>
              </div>
              <div className="rounded-3xl border border-[#7B5CFF]/15 bg-[#0F0C29]/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#A66CFF]/70 mb-2">
                  Structured moves
                </p>
                <p className="text-sm text-white/70">
                  Follow a smooth path from application to interview to offer.
                </p>
              </div>
              <div className="rounded-3xl border border-[#7B5CFF]/15 bg-[#0F0C29]/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-[#A66CFF]/70 mb-2">
                  Recruiter-ready
                </p>
                <p className="text-sm text-white/70">
                  Use methods designed to impress both ATS and hiring teams.
                </p>
              </div>
            </div>
          </div>

          {cards.map((c, idx) => (
            <div
              key={c.id}
              ref={(el) => (detailRefs.current[idx] = el)}
              className={`relative transition-all duration-500 transform ${highlightedIndex === idx ? "ring-4 ring-[#7B5CFF]/60 rounded-3xl shadow-2xl shadow-[#7B5CFF]/30 scale-105" : "hover:shadow-xl hover:shadow-[#7B5CFF]/20"}`}
            >
              {/* Number badge */}
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-[#0F0C29] z-10">
                {idx + 1}
              </div>

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

          {/* Section Divider */}
          <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#7B5CFF]/30 to-transparent"></div>

          {/* Templates Section */}
          <div className="mt-8">
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white mb-2">
                💼 Ready-to-Use Templates
              </h2>
              <p className="text-white/60">
                Copy & customize these templates for your job search
              </p>
            </div>
            <Templates />
          </div>

          {/* Footer CTA */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/40 backdrop-blur-md text-center">
            <h3 className="text-2xl font-black text-white mb-3">
              Ready to Land Your Dream Job?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Start with one strategy today. Consistency beats perfection.
              You've got this! 🚀
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold hover:shadow-lg hover:shadow-[#7B5CFF]/50 transition-all duration-300 hover:scale-105">
                👉 Start Today
              </button>
              <button className="px-6 py-3 rounded-lg bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all duration-300">
                📧 Save for Later
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JobHuntingStrategiesPage;
