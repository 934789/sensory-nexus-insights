
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SurveyCreate from "./pages/SurveyCreate";
import SchedulingCreate from "./pages/SchedulingCreate";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Surveys from "./pages/Surveys";
import Scheduling from "./pages/Scheduling";
import SchedulingDetail from "./pages/SchedulingDetail";
import SchedulingPreview from "./pages/SchedulingPreview";
import Profile from "./pages/Profile";
import RecruiterProfile from "./pages/RecruiterProfile";

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
          <Route path="/scheduling/:id" element={<SchedulingDetail />} />
          <Route path="/scheduling/:id/preview" element={<SchedulingPreview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recruiter-profile" element={<RecruiterProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
