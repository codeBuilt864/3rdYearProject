import { ChevronRightIcon, Code2Icon} from 'lucide-react';
import Navbar from '../components/Navbar'
import { PROBLEMS } from '../data/problems';
import { getDifficultyBadgeClass } from '../lib/utils';
import { Link } from 'react-router';
import { useActiveSessions } from '../hooks/useSessions';

function ProblemsPage() {

     const problems=Object.values(PROBLEMS);

     const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
     const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
     const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

    const{data:activeSessionsData,isLoading,error} = useActiveSessions();
    
    // console.log(activeSessions);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent">Practice Problems</h1>
          <p className="text-white/70">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
                  {problems.map((problem) => (
                    <Link
                      key={problem.id}
                      to={`/problem/${problem.id}`}
                      className="bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl hover:border-[#7B5CFF]/50 hover:shadow-lg hover:shadow-[#7B5CFF]/20 transition-all duration-300 hover:scale-[1.01]"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          {/* LEFT SIDE */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="size-12 rounded-lg bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 flex items-center justify-center">
                                <Code2Icon className="size-6 text-[#7B5CFF]" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h2 className="text-xl font-bold text-white">{problem.title}</h2>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    problem.difficulty === "Easy"
                                      ? "bg-green-500/30 text-green-300 border border-green-500/50"
                                      : problem.difficulty === "Medium"
                                      ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50"
                                      : "bg-red-500/30 text-red-300 border border-red-500/50"
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                    
                                   
                                </div>
                                <p className="text-sm text-white/70"> {problem.category}</p>
                              </div>
                            </div>
                            <p className="text-white/80 mb-3">{problem.description.text}</p>
                          </div>
                          {/* RIGHT SIDE */}
        
                          <div className="flex items-center gap-2 text-[#7B5CFF]">
                            <span className="font-medium">Solve</span>
                            <ChevronRightIcon className='size-5'/>

                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* STATS FOOTER */}
        <div className="mt-12 bg-gradient-to-br from-[#1B1443]/80 to-[#3A1C71]/80 backdrop-blur-md border border-[#7B5CFF]/20 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all">
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-white/70 mb-2">Total Problems</div>
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text">{problems.length}</div>
              </div>

               <div>
                <div className="text-sm text-white/70 mb-2">Easy</div>
                <div className="text-4xl font-black text-green-400">{easyProblemsCount}</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-2">Medium</div>
                <div className="text-4xl font-black text-yellow-400">{mediumProblemsCount}</div>
              </div>
              <div>
                <div className="text-sm text-white/70 mb-2">Hard</div>
                <div className="text-4xl font-black text-red-400">{hardProblemsCount}</div>
              </div>

              
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}

export default ProblemsPage
