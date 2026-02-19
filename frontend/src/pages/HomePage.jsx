import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  BookOpenIcon,
  FileTextIcon,
  MicIcon,
  BriefcaseIcon,
  HeartIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      {/* Navigation */}
      <nav className="bg-[#1B1443]/80 backdrop-blur-md border-b border-[#7B5CFF]/30 sticky top-0 z-50 shadow-lg shadow-[#7B5CFF]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <div className="size-12 rounded-lg bg-gradient-to-br from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] flex items-center justify-center shadow-lg shadow-[#7B5CFF]/30">
              <span className="text-xl font-bold text-white">✓</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] bg-clip-text text-transparent tracking-wider">
                MENTOR LENZO AI
              </span>
            </div>
          </Link>
          <SignInButton mode="modal">
            <button className="px-6 py-2.5 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm shadow-lg shadow-[#7B5CFF]/40 hover:shadow-xl hover:shadow-[#7B5CFF]/60 transition-all duration-200 hover:scale-105">
              Sign In
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        <div className="text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-[#7B5CFF] via-[#A66CFF] to-[#7B5CFF] bg-clip-text text-transparent">
              Boost your IT career
            </span>
            <br />
            <span className="text-transparent bg-gradient-to-r from-[#B8A0FF] to-[#D4B8FF] bg-clip-text">
              with AI-powered interview practice.
            </span>
          </h1>
          
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Prepare for your dream job with our AI-driven mock interviews, resume analysis, coding challenges, and career guidance.
          </p>

          <SignInButton mode="modal">
            <button className="px-8 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-xl text-white font-bold text-lg shadow-lg shadow-[#7B5CFF]/50 hover:shadow-2xl hover:shadow-[#7B5CFF]/70 transition-all duration-200 hover:scale-105 inline-flex items-center gap-3">
              Get Started
              <ArrowRightIcon className="size-5" />
            </button>
          </SignInButton>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* AI Mock Interviews */}
          <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-8 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 group">
            <div className="size-16 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all">
              <MicIcon className="size-8 text-[#7B5CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Mock Interviews</h3>
            <p className="text-white/70">Integrated AI platform to test some preparation system or last goals</p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text">63%</div>
              <div className="text-sm text-white/70">Progress</div>
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7B5CFF]/40 transition-all">
              Get Started
            </button>
          </div>

          {/* Resume Analysis */}
          <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-8 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 group">
            <div className="size-16 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all">
              <FileTextIcon className="size-8 text-[#A66CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Resume Analysis</h3>
            <p className="text-white/70">Tracked mock chat documenting mock analysis information on interviews</p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#A66CFF] to-[#7B5CFF] bg-clip-text">579%</div>
              <div className="text-sm text-white/70">Progress</div>
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7B5CFF]/40 transition-all">
              Continue
            </button>
          </div>

          {/* Coding Practice */}
          <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-8 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 group">
            <div className="size-16 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all">
              <Code2Icon className="size-8 text-[#7B5CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Coding Practice</h3>
            <p className="text-white/70">Prepared all possible practical test some practical engaged exercises</p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text">159%</div>
              <div className="text-sm text-white/70">Progress</div>
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7B5CFF]/40 transition-all">
              Explore
            </button>
          </div>

          {/* Job Search Support */}
          <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-8 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 group">
            <div className="size-16 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all">
              <BriefcaseIcon className="size-8 text-[#A66CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Job Search Support</h3>
            <p className="text-white/70">Tracked meet help supports you mock information documentation</p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#A66CFF] to-[#7B5CFF] bg-clip-text">799%</div>
              <div className="text-sm text-white/70">Progress</div>
            </div>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7B5CFF]/40 transition-all">
              Explore
            </button>
          </div>

          {/* Interview Tips */}
          <div className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl p-8 hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 group md:col-span-2 lg:col-span-1">
            <div className="size-16 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-[#7B5CFF]/50 group-hover:to-[#A66CFF]/50 transition-all">
              <HeartIcon className="size-8 text-[#A66CFF]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Interview Tips & Guidance</h3>
            <p className="text-white/70">Get expert advice to ace your job interviews</p>
            <button className="mt-6 px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#7B5CFF]/40 transition-all">
              Explore
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <SignInButton mode="modal">
            <button className="px-12 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] rounded-xl text-white font-bold text-lg shadow-lg shadow-[#7B5CFF]/50 hover:shadow-2xl hover:shadow-[#7B5CFF]/70 transition-all duration-200 hover:scale-105">
              Get Started
            </button>
          </SignInButton>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#7B5CFF]/20 bg-[#0F0C29]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4">Mentor Lenzo AI</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link to="/" className="hover:text-white transition">Learn</Link></li>
              <li><Link to="/" className="hover:text-white transition">Interview</Link></li>
              <li><Link to="/" className="hover:text-white transition">Resume</Link></li>
              <li><Link to="/" className="hover:text-white transition">Coding</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">About</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li><Link to="/" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/" className="hover:text-white transition">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-white/70">
              <Link to="/" className="hover:text-white transition">Facebook</Link>
              <Link to="/" className="hover:text-white transition">Twitter</Link>
              <Link to="/" className="hover:text-white transition">Instagram</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[#7B5CFF]/20 py-6 text-center text-white/50 text-sm">
          <p>&copy; 2024 Mentor Lenzo AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
