import React from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  MicIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  BrainIcon,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#1B1443]/80 backdrop-blur-md border-b border-[#7B5CFF]/30 sticky top-0 z-50 shadow-lg shadow-[#7B5CFF]/20">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-[#7B5CFF]/30">
            <img src="/logo/main_logo.jpeg" alt="Mentor Lenzo" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="font-black text-sm uppercase tracking-[0.2em] text-white">
              Mentor Lenzo
            </span>
            <span className="text-[10px] text-white/60 font-semibold -mt-0.5">
              Career AI
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to={"/questions"}
            className={`px-3 py-2 rounded-lg transition-all duration-200 
              ${
                location.pathname.startsWith("/questions")
                  ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40"
                  : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"
              }
              `}
          >
            <div className="flex items-center gap-x-2">
              <BrainIcon className="size-4" />
              <span className="font-medium hidden sm:inline text-sm">
                Questions
              </span>
            </div>
          </Link>

          <Link
            to={"/resumeanalyze"}
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
              <span className="font-medium hidden sm:inline text-sm">
                Resume
              </span>
            </div>
          </Link>

          <Link
            to={"/mockinterview"}
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
              <span className="font-medium hidden sm:inline text-sm">
                Interview
              </span>
            </div>
          </Link>

          <Link
            to="/jobs"
            className={`px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-x-2 ${location.pathname.startsWith("/jobs") ? "bg-[#7B5CFF] text-white shadow-lg shadow-[#7B5CFF]/40" : "hover:bg-[#7B5CFF]/20 text-white/70 hover:text-white"}`}
          >
            <BriefcaseIcon className="size-4" />
            <span className="font-medium hidden sm:inline text-sm">Jobs</span>
          </Link>

          <Link
            to={"/strategies"}
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
              <span className="font-medium hidden sm:inline text-sm">
                tips & tricks
              </span>
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
              <span className="font-medium hidden sm:inline text-sm">
                Dashboard
              </span>
            </div>
          </Link>

          <div className="ml-4">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
