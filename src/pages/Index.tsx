import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import TopNav from "@/components/TopNav";
import { Routes, Route } from "react-router-dom";
import Overview from "./dashboard/Overview";
import Pipeline from "./dashboard/Pipeline";
import Performance from "./dashboard/Performance";
import Companies from "./dashboard/Companies";
import Velocity from "./dashboard/Velocity";
import Forecasting from "./dashboard/Forecasting";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto w-full px-4 md:px-6">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/dashboard" element={<Overview />} />
              <Route path="/dashboard/pipeline" element={<Pipeline />} />
              <Route path="/dashboard/performance" element={<Performance />} />
              <Route path="/dashboard/companies" element={<Companies />} />
              <Route path="/dashboard/velocity" element={<Velocity />} />
              <Route path="/dashboard/forecasting" element={<Forecasting />} />
            </Routes>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;