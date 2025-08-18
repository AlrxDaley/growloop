import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Tasks from "./pages/Tasks";
import Zones from "./pages/Zones";
import ZoneDetails from "./pages/ZoneDetails";
import Photos from "./pages/Photos";
import Schedule from "./pages/Schedule";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import PlantTracker from "./pages/PlantTracker";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* CRM Routes */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/clients" element={<Layout><Clients /></Layout>} />
            <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
            <Route path="/zones" element={<Layout><Zones /></Layout>} />
            <Route path="/zones/:id" element={<Layout><ZoneDetails /></Layout>} />
            <Route path="/photos" element={<Layout><Photos /></Layout>} />
            <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
            
            {/* Marketing/Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/plant-tracker" element={<PlantTracker />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
