import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

function ITCompaniesPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // fetch IT companies data
    // setCompanies(data);
  }, []);

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel - Companies List */}
          <Panel defaultSize={35} minSize={25}>
            <div className="h-full p-4 border-r border-base-300 overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">IT Companies</h2>
              <div className="space-y-2">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <div
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCompany?.id === company.id
                          ? "bg-primary text-primary-content"
                          : "bg-base-200 hover:bg-base-300"
                      }`}
                    >
                      <p className="font-semibold">{company.name}</p>
                      <p className="text-sm opacity-75">{company.industry}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-base-content/60">No companies available</p>
                )}
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* Right panel - Company Details */}
          <Panel defaultSize={65} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Company Info */}
              <Panel defaultSize={60} minSize={30}>
                <div className="h-full p-4 border-b border-base-300 overflow-y-auto">
                  {selectedCompany ? (
                    <div>
                      <h2 className="text-3xl font-bold mb-4">
                        {selectedCompany.name}
                      </h2>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-base-content/60">Industry</p>
                          <p className="text-lg font-semibold">
                            {selectedCompany.industry}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/60">
                            Headquarters
                          </p>
                          <p className="text-lg font-semibold">
                            {selectedCompany.headquarters}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/60">
                            Description
                          </p>
                          <p className="text-base">{selectedCompany.description}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base-content/60">
                      Select a company to view details
                    </p>
                  )}
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Opportunities */}
              <Panel defaultSize={40} minSize={30}>
                <div className="h-full p-4 overflow-y-auto">
                  <h2 className="text-lg font-bold mb-4">Job Opportunities</h2>
                  {selectedCompany ? (
                    <div className="space-y-2">
                      <p className="text-base-content/60">
                        View open positions for {selectedCompany.name}
                      </p>
                      {/* Job listings will go here */}
                    </div>
                  ) : (
                    <p className="text-base-content/60">
                      Select a company to see opportunities
                    </p>
                  )}
                </div>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ITCompaniesPage;
