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
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content p-8">
          <h1 className="text-4xl font-bold mb-2">Sri Lanka IT Companies</h1>
          <p className="text-lg opacity-90">
            Discover leading IT companies, their opportunities, and connect with industry leaders
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-base-100 border-b border-base-300 p-6 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="🔍 Search companies by name or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input input-bordered bg-base-200 focus:bg-base-100 focus:outline-none"
            />
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterSpecialty("All")}
                className={`btn btn-sm ${
                  filterSpecialty === "All"
                    ? "btn-primary"
                    : "btn-ghost btn-outline"
                }`}
              >
                All Specialties
              </button>
              {allSpecialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setFilterSpecialty(specialty)}
                  className={`btn btn-sm ${
                    filterSpecialty === specialty
                      ? "btn-primary"
                      : "btn-ghost btn-outline"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>

            <p className="text-sm text-base-content/60">
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
                    <h2 className="text-2xl font-bold text-base-content mb-4">
                      Companies List
                    </h2>
                    {filteredCompanies.map((company) => (
                      <div
                        key={company.id}
                        onClick={() => setSelectedCompany(company)}
                        className={`p-4 rounded-lg cursor-pointer transition-all transform hover:scale-102 ${
                          selectedCompany?.id === company.id
                            ? "bg-primary text-primary-content shadow-lg scale-105"
                            : "bg-base-100 hover:bg-base-200 border border-base-300"
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
                      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-5xl mb-3">{selectedCompany.logo}</div>
                            <h2 className="text-4xl font-bold text-base-content">
                              {selectedCompany.name}
                            </h2>
                            <p className="text-lg text-base-content/70 mt-2">
                              {selectedCompany.industry}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="badge badge-lg badge-primary mb-2">
                              Founded {selectedCompany.founded}
                            </div>
                            <div className="badge badge-lg badge-secondary">
                              {selectedCompany.employees}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-base-100 rounded-lg p-6 border border-base-300">
                        <h3 className="text-xl font-bold mb-3 text-base-content">
                          About
                        </h3>
                        <p className="text-base-content/80 leading-relaxed">
                          {selectedCompany.description}
                        </p>
                      </div>

                      {/* Specialties */}
                      <div className="bg-base-100 rounded-lg p-6 border border-base-300">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-base-content">
                          <Briefcase size={20} /> Specialties
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.specialties.map((specialty, idx) => (
                            <div key={idx} className="badge badge-outline badge-lg">
                              {specialty}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-base-100 rounded-lg p-6 border border-base-300">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-base-content">
                          <MapPin size={20} /> Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Globe className="text-primary" size={20} />
                            <div>
                              <p className="text-sm text-base-content/60">Website</p>
                              <a
                                href={`https://${selectedCompany.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-semibold hover:underline"
                              >
                                {selectedCompany.website}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Mail className="text-primary" size={20} />
                            <div>
                              <p className="text-sm text-base-content/60">Email</p>
                              <a
                                href={`mailto:${selectedCompany.email}`}
                                className="text-primary font-semibold hover:underline"
                              >
                                {selectedCompany.email}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Phone className="text-primary" size={20} />
                            <div>
                              <p className="text-sm text-base-content/60">Phone</p>
                              <a
                                href={`tel:${selectedCompany.phone}`}
                                className="text-primary font-semibold hover:underline"
                              >
                                {selectedCompany.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MapPin className="text-primary mt-1" size={20} />
                            <div>
                              <p className="text-sm text-base-content/60">Address</p>
                              <p className="text-base font-semibold">
                                {selectedCompany.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Leadership */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-base-800 dark:to-base-700 rounded-lg p-6 border border-blue-200 dark:border-base-600">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-base-content">
                          <Star size={20} className="text-yellow-500" /> Leadership
                        </h3>
                        <div className="bg-base-100 dark:bg-base-900 rounded-lg p-4 border border-base-300">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                              {selectedCompany.ceo.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-base-content">
                                {selectedCompany.ceo.name}
                              </h4>
                              <p className="text-sm text-base-content/70 mb-2">
                                {selectedCompany.ceo.title}
                              </p>
                              <a
                                href={`https://${selectedCompany.ceo.linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
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
                          className="btn btn-primary flex-1"
                        >
                          <Briefcase size={18} /> View Careers Page
                        </a>
                        <a
                          href={`https://${selectedCompany.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-primary flex-1"
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
                <h3 className="text-2xl font-bold text-base-content mb-2">
                  No Companies Found
                </h3>
                <p className="text-base-content/60">
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
