import { useUser } from "@clerk/clerk-react";

import Navbar from "../components/Navbar";
import DashboardOverview from "../components/DashboardOverview";
import useDashboard from "../hooks/useDashboard";

function DashboardPage() {
  const dashboardQuery = useDashboard();
  const { user } = useUser();
  const firstName = user?.firstName || user?.fullName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0C29] via-[#1B1443] to-[#3A1C71]">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#7B5CFF] to-[#A66CFF]">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Centralized tools — resume, company research, and interview prep.
          </p>
        </div>

        <DashboardOverview query={dashboardQuery} />
      </main>
    </div>
  );
}

export default DashboardPage;
