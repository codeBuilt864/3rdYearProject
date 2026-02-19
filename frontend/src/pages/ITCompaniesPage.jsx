import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { Mail, Phone, Globe, Linkedin, MapPin, Users, Briefcase, Star, X, ExternalLink, Award, Zap } from "lucide-react";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("All");

  useEffect(() => {
    setCompanies(COMPANIES_DATA);
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

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#7B5CFF]/40 to-[#A66CFF]/40 backdrop-blur-md border-b border-[#7B5CFF]/30 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] bg-clip-text text-transparent mb-3">
            Sri Lanka IT Companies Directory
          </h1>
          <p className="text-lg text-white/80 max-w-3xl">
            Explore leading IT companies, discover career opportunities, and connect with industry innovators in Sri Lanka's thriving tech ecosystem.
          </p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-40 bg-gradient-to-br from-[#1B1443]/95 to-[#3A1C71]/95 backdrop-blur-xl border-b border-[#7B5CFF]/30 py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 bg-gradient-to-br from-[#7B5CFF]/10 to-[#A66CFF]/10 border border-[#7B5CFF]/40 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#7B5CFF]/80 focus:ring-2 focus:ring-[#7B5CFF]/30 transition-all duration-300 shadow-lg"
            />
          </div>

          {/* Filter Buttons */}
          <div>
            <p className="text-sm text-white/60 font-semibold mb-3 uppercase tracking-wide">Filter by Specialty</p>
            <div className="flex flex-wrap gap-2 max-h-16 overflow-y-auto pb-2">
              <button
                onClick={() => setFilterSpecialty("All")}
                className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                  filterSpecialty === "All"
                    ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white shadow-lg shadow-[#7B5CFF]/40 scale-105"
                    : "bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/40 text-white hover:border-[#7B5CFF]/70 hover:shadow-md"
                }`}
              >
                All Specialties
              </button>
              {allSpecialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setFilterSpecialty(specialty)}
                  className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                    filterSpecialty === specialty
                      ? "bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white shadow-lg shadow-[#7B5CFF]/40 scale-105"
                      : "bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/40 text-white hover:border-[#7B5CFF]/70 hover:shadow-md"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm">
            <p className="text-white/70 font-medium">
              📊 Showing <span className="text-[#7B5CFF] font-bold">{filteredCompanies.length}</span> of <span className="text-[#A66CFF] font-bold">{companies.length}</span> companies
            </p>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                >
                  <div className="h-full bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 backdrop-blur-md border border-[#7B5CFF]/40 rounded-2xl p-6 hover:border-[#7B5CFF]/80 hover:shadow-2xl hover:shadow-[#7B5CFF]/40 transition-all duration-300 flex flex-col">
                    {/* Company Logo & Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{company.logo}</div>
                      <Award className="text-[#A66CFF] opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                    </div>

                    {/* Company Name & Industry */}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {company.name}
                    </h3>
                    <p className="text-sm text-white/60 mb-4 font-medium">
                      {company.industry}
                    </p>

                    {/* Key Info Cards */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 rounded-lg p-3 border border-[#7B5CFF]/30">
                        <p className="text-xs text-white/60 mb-1">Founded</p>
                        <p className="text-sm font-bold text-white">{company.founded}</p>
                      </div>
                      <div className="bg-gradient-to-br from-[#7B5CFF]/40 to-[#A66CFF]/40 rounded-lg p-3 border border-[#7B5CFF]/30">
                        <p className="text-xs text-white/60 mb-1 flex items-center gap-1">
                          <Users size={12} />
                          Team Size
                        </p>
                        <p className="text-sm font-bold text-white">{company.employees}</p>
                      </div>
                    </div>

                    {/* Specialties Tags */}
                    <div className="mb-4">
                      <p className="text-xs text-white/60 font-semibold mb-2 uppercase tracking-wide">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {company.specialties.slice(0, 2).map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gradient-to-r from-[#7B5CFF]/50 to-[#A66CFF]/50 text-white text-xs font-semibold rounded-full border border-[#7B5CFF]/40"
                          >
                            {specialty}
                          </span>
                        ))}
                        {company.specialties.length > 2 && (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 text-white text-xs font-semibold rounded-full border border-blue-400/40">
                            +{company.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-white/70 mb-4 line-clamp-2 flex-grow">
                      {company.description}
                    </p>

                    {/* View Details Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group">
                      View Details
                      <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 animate-bounce">🔍</div>
              <h3 className="text-3xl font-bold text-white mb-3">No Companies Found</h3>
              <p className="text-white/60 text-lg max-w-md mx-auto">
                Try adjusting your search or filter criteria to find the perfect company
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterSpecialty("All");
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Company Modal */}
      {isModalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8 bg-gradient-to-br from-[#1B1443]/95 to-[#3A1C71]/95 backdrop-blur-xl border border-[#7B5CFF]/40 rounded-3xl shadow-2xl shadow-[#7B5CFF]/30 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#7B5CFF]/40 to-[#A66CFF]/40 border-b border-[#7B5CFF]/30 p-8 flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="text-6xl">{selectedCompany.logo}</div>
                <div>
                  <h2 className="text-4xl font-black text-white mb-2">
                    {selectedCompany.name}
                  </h2>
                  <p className="text-lg text-white/80">{selectedCompany.industry}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-4 py-1 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] text-white text-sm font-bold rounded-full">
                      Founded {selectedCompany.founded}
                    </span>
                    <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                      <Users size={16} /> {selectedCompany.employees}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={28} className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Zap size={24} className="text-[#A66CFF]" />
                  About Company
                </h3>
                <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 rounded-2xl p-6">
                  <p className="text-white/80 text-lg leading-relaxed">
                    {selectedCompany.description}
                  </p>
                </div>
              </div>

              {/* Specialties Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Briefcase size={24} className="text-[#A66CFF]" />
                  Core Specialties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedCompany.specialties.map((specialty, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 border border-[#7B5CFF]/40 rounded-xl p-4 text-center"
                    >
                      <p className="text-white font-bold">{specialty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <MapPin size={24} className="text-[#A66CFF]" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Website */}
                  <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="text-[#7B5CFF]" size={20} />
                      <p className="text-white/60 font-semibold">Website</p>
                    </div>
                    <a
                      href={`https://${selectedCompany.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7B5CFF] font-bold text-lg hover:text-[#A66CFF] transition-colors flex items-center gap-2"
                    >
                      {selectedCompany.website}
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  {/* Email */}
                  <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="text-[#7B5CFF]" size={20} />
                      <p className="text-white/60 font-semibold">Email</p>
                    </div>
                    <a
                      href={`mailto:${selectedCompany.email}`}
                      className="text-[#7B5CFF] font-bold text-lg hover:text-[#A66CFF] transition-colors flex items-center gap-2"
                    >
                      {selectedCompany.email}
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="text-[#7B5CFF]" size={20} />
                      <p className="text-white/60 font-semibold">Phone</p>
                    </div>
                    <a
                      href={`tel:${selectedCompany.phone}`}
                      className="text-[#7B5CFF] font-bold text-lg hover:text-[#A66CFF] transition-colors"
                    >
                      {selectedCompany.phone}
                    </a>
                  </div>

                  {/* Address */}
                  <div className="bg-gradient-to-br from-[#7B5CFF]/20 to-[#A66CFF]/20 border border-[#7B5CFF]/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="text-[#7B5CFF]" size={20} />
                      <p className="text-white/60 font-semibold">Address</p>
                    </div>
                    <p className="text-white font-semibold">{selectedCompany.address}</p>
                  </div>
                </div>
              </div>

              {/* Leadership Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Star size={24} className="text-yellow-400" />
                  Leadership
                </h3>
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-2xl p-6 flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#7B5CFF] to-[#A66CFF] flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                    {selectedCompany.ceo.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-2xl font-bold text-white mb-1">
                      {selectedCompany.ceo.name}
                    </h4>
                    <p className="text-white/70 text-lg font-semibold mb-4">
                      {selectedCompany.ceo.title}
                    </p>
                    <a
                      href={`https://${selectedCompany.ceo.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                    >
                      <Linkedin size={20} />
                      View LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="border-t border-[#7B5CFF]/30 bg-gradient-to-r from-[#1B1443]/50 to-[#3A1C71]/50 p-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`https://${selectedCompany.careers}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF] hover:from-[#8A6FFF] hover:to-[#B380FF] text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Briefcase size={20} />
                Explore Careers
              </a>
              <a
                href={`https://${selectedCompany.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-4 bg-gradient-to-br from-[#7B5CFF]/30 to-[#A66CFF]/30 border border-[#7B5CFF]/60 hover:border-[#7B5CFF]/90 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Globe size={20} />
                Visit Website
              </a>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 bg-gradient-to-br from-white/20 to-white/10 border border-white/30 hover:border-white/60 text-white font-bold text-lg rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ITCompaniesPage;
