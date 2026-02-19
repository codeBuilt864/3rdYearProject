import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, FileTextIcon, MicIcon, BriefcaseIcon, TrendingUpIcon } from 'lucide-react'
import { UserButton } from '@clerk/clerk-react';


function Navbar() {
   const location = useLocation();
  const [showJobs, setShowJobs] = useState(false);
  const jobsRef = useRef(null);
  const [panelStyle, setPanelStyle] = useState({});

  const JOB_GROUPS = [
    {
      title: 'Core Platforms',
      items: ['All Specialties', 'Enterprise Software', 'Cloud Solutions', 'Digital Solutions', 'Custom Software'],
    },
    {
      title: 'Integration & Identity',
      items: ['API Gateway', 'Integration Platform', 'Identity Management', 'Cloud CCaaS'],
    },
    {
      title: 'AI & Data',
      items: ['AI Integration', 'AI/ML Solutions', 'Digital Engineering'],
    },
    {
      title: 'Engineering & Delivery',
      items: ['Agile Development', 'Digital Transformation', 'Cloud Services', 'Telecommunications'],
    },
    {
      title: 'Customer & Payments',
      items: ['Contact Center Tech', 'Customer Experience', 'Digital Payments', 'Financial Software', 'Blockchain'],
    },
    {
      title: 'Testing & QA',
      items: ['Test Automation', 'AI QA', 'Software Testing'],
    },
  ];

  const isActive = (path) => location.pathname === path;
  


  return (
      <nav className="bg-[#1B1443]/80 backdrop-blur-md border-b border-[#7B5CFF]/30 sticky top-0 z-50 shadow-lg shadow-[#7B5CFF]/20">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        
        <Link
          to="/"
          className="group flex items-center gap-2 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-lg bg-gradient-to-br from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] flex items-center justify-center shadow-lg shadow-[#7B5CFF]/30">
            <span className="text-lg font-bold text-white">✓</span>
          </div>

          <div className="flex flex-col">
            <span className="font-black text-sm bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] bg-clip-text text-transparent tracking-wider">
              MENTOR LENZO
            </span>
            <span className="text-[10px] text-white/60 font-semibold -mt-1">AI</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link to={"/problems"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              `}
          >
            <div className="flex items-center gap-x-2">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Coding</span>
            </div>
          </Link>

          <Link to={"/resumeanalyze"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                isActive("/resumeanalyze")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              `}
          >
            <div className="flex items-center gap-x-2">
              <FileTextIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Resume</span>
            </div>
          </Link>

          <Link to={"/mockinterview"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                isActive("/mockinterview")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              `}
          >
            <div className="flex items-center gap-x-2">
              <MicIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Interview</span>
            </div>
          </Link>

          <div className="relative">
            <button
  

              className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-x-2 ${isActive('/companies') ? 'bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40' : 'hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white'}`}
            >
              <BriefcaseIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Jobs</span>
            </button>

            {/* jobs portal removed — using sticky panel below to push content */}
          </div>

          {showJobs && (
            <div className="sticky top-16 z-40 w-full backdrop-blur-md bg-gradient-to-br from-[#7B5CFF]/12 to-[#A66CFF]/12 border-t border-[#7B5CFF]/20 shadow-inner">
              <div className="max-w-7xl mx-auto p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="space-y-4">
                      {JOB_GROUPS.map((group) => (
                        <div key={group.title}>
                          <div className="text-sm font-semibold text-white/80 mb-2">{group.title}</div>
                          <div className="flex flex-wrap gap-3">
                            {group.items.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => { setShowJobs(false); window.location.href = '/companies'; }}
                                className="px-4 py-2 rounded-full bg-gradient-to-br from-[#24143a]/20 to-[#34204f]/10 text-white/90 border border-[#7B5CFF]/12 hover:from-[#24143a]/30 hover:to-[#34204f]/20 transition text-sm"
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-shrink-0 ml-4">
                    <button onClick={() => setShowJobs(false)} className="px-3 py-2 rounded-lg bg-transparent border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Link to={"/strategies"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                isActive("/strategies")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              `}
          >
            <div className="flex items-center gap-x-2">
              <TrendingUpIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Profile</span>
            </div>
          </Link>

           <Link
            to={"/dashboard"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">Dashboard</span>
            </div>
          </Link>
          
          

          <div className="ml-4">
            
            <UserButton/>
          </div>
          </div>

</div>
    
    </nav>
  )
}

export default Navbar
