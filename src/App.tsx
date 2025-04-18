
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SurveyCreate from "./pages/SurveyCreate";
import SchedulingCreate from "./pages/SchedulingCreate";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Create pages for routes that are linked in navigation but don't exist yet
import Surveys from "./pages/Surveys";
import Scheduling from "./pages/Scheduling";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/create" element={<SurveyCreate />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/scheduling/create" element={<SchedulingCreate />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
