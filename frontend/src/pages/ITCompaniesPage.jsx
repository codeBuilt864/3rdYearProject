import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Mail, Phone, Globe, Linkedin, MapPin, Users, Briefcase, Star } from "lucide-react";

const COMPANIES_DATA = [
  {
    id: 1,
    name: "IFS",
    logo: "🏢",
    industry: "Enterprise Software",
    headquarters: "Colombo, Sri Lanka",
    founded: "1983",
    employees: "4,500+",
    description: "Global leader in enterprise software for field service, manufacturing, and asset management. IFS has a strong presence in Sri Lanka with software development centers.",
    website: "www.ifs.com",
    email: "contact@ifs.com",
    phone: "+94 11 2398 100",
    address: "IFS Global HQ, Colombo, Sri Lanka",
    ceo: {
      name: "Fredrik Dahlgren",
      linkedin: "linkedin.com/in/freddahlgren/",
      title: "President & CEO"
    },
    specialties: ["Enterprise Software", "Cloud Solutions", "AI Integration"],
    careers: "careers.ifs.com"
  },
  {
    id: 2,
    name: "WSO2",
    logo: "⚙️",
    industry: "API Management & Integration",
    headquarters: "Colombo, Sri Lanka",
    founded: "2005",
    employees: "800+",
    description: "Pioneer in open-source API management, integration, and identity management. Founded in Sri Lanka, WSO2 serves enterprises globally with cloud-native solutions.",
    website: "www.wso2.com",
    email: "info@wso2.com",
    phone: "+94 11 7462 000",
    address: "No. 20, Palm Grove, Colombo 03, Sri Lanka",
    ceo: {
      name: "Paul Fremantle",
      linkedin: "linkedin.com/in/paulfremantle/",
      title: "Chief Strategy Officer"
    },
    specialties: ["API Gateway", "Identity Management", "Integration Platform"],
    careers: "careers.wso2.com"
  },
  {
    id: 3,
    name: "99x Technology",
    logo: "💻",
    industry: "Software Development & Consulting",
    headquarters: "Colombo, Sri Lanka",
    founded: "2007",
    employees: "600+",
    description: "Leading software engineering company providing custom development, digital transformation, and IT consulting services to global clients across various industries.",
    website: "www.99xtechnology.com",
    email: "info@99xtechnology.com",
    phone: "+94 11 4654 000",
    address: "99x Tower, Colombo 03, Sri Lanka",
    ceo: {
      name: "Hasantha Jayasena",
      linkedin: "linkedin.com/in/hasanthajayasena/",
      title: "Founder & CEO"
    },
    specialties: ["Custom Software", "Agile Development", "Digital Transformation"],
    careers: "careers.99xtechnology.com"
  },
  {
    id: 4,
    name: "Virtusa",
    logo: "🌐",
    industry: "IT Services & Digital Transformation",
    headquarters: "Colombo, Sri Lanka",
    founded: "1996",
    employees: "20,000+",
    description: "Publicly listed global IT services company providing digital engineering, IT services, and business consulting. Major presence in Sri Lanka with multiple development centers.",
    website: "www.virtusa.com",
    email: "careers@virtusa.com",
    phone: "+94 11 5449 000",
    address: "Colombo, Sri Lanka",
    ceo: {
      name: "Karthik Natarajan",
      linkedin: "linkedin.com/in/karthiknatarajan/",
      title: "President & CEO"
    },
    specialties: ["Digital Engineering", "Cloud Services", "AI/ML Solutions"],
    careers: "careers.virtusa.com"
  },
  {
    id: 5,
    name: "Dialog Axiata",
    logo: "📱",
    industry: "Telecommunications & IT Solutions",
    headquarters: "Colombo, Sri Lanka",
    founded: "1997",
    employees: "3,000+",
    description: "Sri Lanka's leading telecom operator with strong IT division providing IT solutions, digital services, and telecommunications infrastructure.",
    website: "www.dialog.lk",
    email: "info@dialog.lk",
    phone: "+94 11 2400 000",
    address: "41, Galle Road, Colombo 04, Sri Lanka",
    ceo: {
      name: "Supun Weerasooriya",
      linkedin: "linkedin.com/in/supun-weerasooriya/",
      title: "Chief Executive Officer"
    },
    specialties: ["Telecommunications", "Digital Solutions", "Cloud Services"],
    careers: "careers.dialog.lk"
  },
  {
    id: 6,
    name: "Callsure Solutions",
    logo: "☎️",
    industry: "Contact Center Solutions",
    headquarters: "Colombo, Sri Lanka",
    founded: "2007",
    employees: "500+",
    description: "Innovative contact center and customer experience solutions provider with cutting-edge technology platform serving multinational clients.",
    website: "www.callsure.com",
    email: "careers@callsure.com",
    phone: "+94 11 4388 000",
    address: "Colombo, Sri Lanka",
    ceo: {
      name: "Damith Kumaratunge",
      linkedin: "linkedin.com/in/damithk/",
      title: "Founder & Managing Director"
    },
    specialties: ["Contact Center Tech", "Customer Experience", "Cloud CCaaS"],
    careers: "careers.callsure.com"
  },
  {
    id: 7,
    name: "Fintech Hub Lanka",
    logo: "💰",
    industry: "Financial Technology",
    headquarters: "Colombo, Sri Lanka",
    founded: "2018",
    employees: "200+",
    description: "Sri Lanka's emerging fintech leader providing digital payment solutions, blockchain technology, and financial software development.",
    website: "www.fintechhubuniverse.com",
    email: "info@fintechhubuniverse.com",
    phone: "+94 11 5544 000",
    address: "Colombo, Sri Lanka",
    ceo: {
      name: "Isuru Gupta",
      linkedin: "linkedin.com/in/isurugupta/",
      title: "CEO & Founder"
    },
    specialties: ["Blockchain", "Digital Payments", "Financial Software"],
    careers: "careers.fintechhubuniverse.com"
  },
  {
    id: 8,
    name: "Accelq Technologies",
    logo: "🚀",
    industry: "Software Testing & QA",
    headquarters: "Colombo, Sri Lanka",
    founded: "2011",
    employees: "300+",
    description: "Global leader in AI-driven test automation providing innovative QA solutions and software testing services to enterprises worldwide.",
    website: "www.accelq.com",
    email: "careers@accelq.com",
    phone: "+94 11 4544 000",
    address: "Colombo, Sri Lanka",
    ceo: {
      name: "Priyank Sharma",
      linkedin: "linkedin.com/in/priyanksharma/",
      title: "Founder & CEO"
    },
    specialties: ["Test Automation", "AI QA", "Software Testing"],
    careers: "careers.accelq.com"
  }
];

function ITCompaniesPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("All");

  useEffect(() => {
    setCompanies(COMPANIES_DATA);
    setSelectedCompany(COMPANIES_DATA[0]);
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      filterSpecialty === "All" ||
      company.specialties.includes(filterSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const allSpecialties = Array.from(
    new Set(companies.flatMap((c) => c.specialties))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71] flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#7B5CFF]/40 to-[#A66CFF]/40 backdrop-blur-md border-b border-[#7B5CFF]/30 text-white p-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent">Sri Lanka IT Companies</h1>
          <p className="text-lg opacity-90">
            Discover leading IT companies, their opportunities, and connect with industry leaders
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gradient-to-br from-[#7B5CFF]/5 to-[#A66CFF]/5 backdrop-blur-sm border-b border-[#7B5CFF]/30 p-6 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="🔍 Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#7B5CFF]/60 focus:ring-2 focus:ring-[#7B5CFF]/20 transition-all"
            />
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterSpecialty("All")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  filterSpecialty === "All"
                    ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white ring-1 ring-[#7B5CFF]/20"
                    : "bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 text-white hover:border-[#7B5CFF]/60"
                }`}
              >
                All Specialties
              </button>
              {allSpecialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setFilterSpecialty(specialty)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      filterSpecialty === specialty
                        ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white ring-1 ring-[#7B5CFF]/20"
                        : "bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 text-white hover:border-[#7B5CFF]/60"
                    }`}
                >
                  {specialty}
                </button>
              ))}
            </div>

            <p className="text-sm text-white/60">
              Showing {filteredCompanies.length} of {companies.length} companies
            </p>
          </div>
        </div>

        {/* Companies Grid Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Companies List */}
                <div className="lg:col-span-1">
                  <div className="space-y-3 sticky top-24">
                    <h2 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text">
                      Companies List
                    </h2>
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className={`p-4 rounded-xl cursor-pointer transition-all transform ${
                          selectedCompany?.id === company.id
                            ? "bg-gradient-to-br from-[#7B5CFF]/60 to-[#A66CFF]/60 backdrop-blur-md text-white shadow-lg shadow-[#7B5CFF]/40 scale-105 border border-[#7B5CFF]/80"
                            : "bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 backdrop-blur-md border border-[#7B5CFF]/30 text-white hover:border-[#7B5CFF]/60 hover:shadow-lg hover:shadow-[#7B5CFF]/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{company.logo}</span>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{company.name}</p>
                            <p className="text-xs opacity-75">{company.industry}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Users size={14} />
                              <span className="text-xs">{company.employees}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Company Details */}
                <div className="lg:col-span-2">
                  {selectedCompany && (
                    <div className="space-y-6">
                      {/* Company Header Card */}
                      <div className="bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 backdrop-blur-md border border-[#7B5CFF]/50 rounded-3xl p-6 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-5xl mb-3">{selectedCompany.logo}</div>
                            <h2 className="text-4xl font-bold text-white drop-shadow-sm">
                              {selectedCompany.name}
                            </h2>
                            <p className="text-lg text-white/70 mt-2">
                              {selectedCompany.industry}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white text-sm font-bold rounded-lg mb-2">
                              Founded {selectedCompany.founded}
                            </div>
                            <div className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-[#7B5CFF] text-white text-sm font-bold rounded-lg">
                              {selectedCompany.employees}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md rounded-3xl p-6 border border-[#7B5CFF]/30 shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all">
                        <h3 className="text-xl font-bold mb-3 text-white">
                          About
                        </h3>
                        <p className="text-white/80 leading-relaxed">
                          {selectedCompany.description}
                        </p>
                      </div>

                      {/* Specialties */}
                      <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md rounded-3xl p-6 border border-[#7B5CFF]/30 shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                          <Briefcase size={20} /> Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.specialties.map((specialty, idx) => (
                            <div key={idx} className="px-3 py-1 bg-gradient-to-r from-[#7B5CFF]/30 to-[#A66CFF]/30 border border-[#7B5CFF]/50 text-white rounded-lg text-sm font-semibold">
                              {specialty}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md rounded-3xl p-6 border border-[#7B5CFF]/30 shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                          <MapPin size={20} /> Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Globe className="text-[#7B5CFF]" size={20} />
                            <div>
                              <p className="text-sm text-white/60">Website</p>
                              <a
                                href={`https://${selectedCompany.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#7B5CFF] font-semibold hover:text-[#A66CFF] transition-colors"
                              >
                                {selectedCompany.website}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Mail className="text-[#7B5CFF]" size={20} />
                            <div>
                              <p className="text-sm text-white/60">Email</p>
                              <a
                                href={`mailto:${selectedCompany.email}`}
                                className="text-[#7B5CFF] font-semibold hover:text-[#A66CFF] transition-colors"
                              >
                                {selectedCompany.email}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Phone className="text-[#7B5CFF]" size={20} />
                            <div>
                              <p className="text-sm text-white/60">Phone</p>
                              <a
                                href={`tel:${selectedCompany.phone}`}
                                className="text-[#7B5CFF] font-semibold hover:text-[#A66CFF] transition-colors"
                              >
                                {selectedCompany.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="text-[#7B5CFF] mt-1" size={20} />
                            <div>
                              <p className="text-sm text-white/60">Address</p>
                              <p className="text-base font-semibold text-white">
                                {selectedCompany.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Leadership */}
                      <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-3xl p-6 border border-cyan-500/40 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 transition-all">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                          <Star size={20} className="text-yellow-400" /> Leadership
                        </h3>
                        <div className="bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 backdrop-blur-md rounded-2xl p-4 border border-[#7B5CFF]/30">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                              {selectedCompany.ceo.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white">
                                {selectedCompany.ceo.name}
                              </h4>
                              <p className="text-sm text-white/70 mb-2">
                                {selectedCompany.ceo.title}
                              </p>
                              <a
                                href={`https://${selectedCompany.ceo.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[#7B5CFF] hover:text-[#A66CFF] font-semibold transition-colors"
                              >
                                <Linkedin size={18} />
                                LinkedIn Profile
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://${selectedCompany.careers}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/30 transition-all"
                        >
                          <Briefcase size={18} /> View Careers Page
                        </a>
                        <a
                          href={`https://${selectedCompany.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/50 hover:border-[#7B5CFF]/80 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-[#7B5CFF]/20 transition-all"
                        >
                          <Globe size={18} /> Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Companies Found
                </h3>
                <p className="text-white/60">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ITCompaniesPage;
