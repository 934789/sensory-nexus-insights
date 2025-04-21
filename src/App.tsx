
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
import Surveys from "./pages/Surveys";
import SurveyDetail from "./pages/SurveyDetail";
import Scheduling from "./pages/Scheduling";
import SchedulingDetail from "./pages/SchedulingDetail";
import SchedulingPreview from "./pages/SchedulingPreview";
import Profile from "./pages/Profile";
import RecruiterProfile from "./pages/RecruiterProfile";
import ConsumerProfile from "./pages/ConsumerProfile";
import DeliveryManagement from "./pages/DeliveryManagement";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/create" element={<SurveyCreate />} />
          <Route path="/surveys/:id" element={<SurveyDetail />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/scheduling/create" element={<SchedulingCreate />} />
          <Route path="/scheduling/:id" element={<SchedulingDetail />} />
          <Route path="/scheduling/:id/preview" element={<SchedulingPreview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recruiter-profile" element={<RecruiterProfile />} />
          <Route path="/consumer-profile" element={<ConsumerProfile />} />
          <Route path="/delivery-management" element={<DeliveryManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
