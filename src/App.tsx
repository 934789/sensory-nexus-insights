
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
import { useState, useEffect } from "react";
import { supabase } from "./integrations/supabase/client";

// Auth protection component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  if (isAuthenticated === null) {
    // Loading state
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/surveys" element={<ProtectedRoute><Surveys /></ProtectedRoute>} />
          <Route path="/surveys/create" element={<ProtectedRoute><SurveyCreate /></ProtectedRoute>} />
          <Route path="/surveys/:id" element={<ProtectedRoute><SurveyDetail /></ProtectedRoute>} />
          <Route path="/scheduling" element={<ProtectedRoute><Scheduling /></ProtectedRoute>} />
          <Route path="/scheduling/create" element={<ProtectedRoute><SchedulingCreate /></ProtectedRoute>} />
          <Route path="/scheduling/:id" element={<ProtectedRoute><SchedulingDetail /></ProtectedRoute>} />
          <Route path="/scheduling/:id/preview" element={<ProtectedRoute><SchedulingPreview /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/recruiter-profile" element={<ProtectedRoute><RecruiterProfile /></ProtectedRoute>} />
          <Route path="/consumer-profile" element={<ProtectedRoute><ConsumerProfile /></ProtectedRoute>} />
          <Route path="/delivery-management" element={<ProtectedRoute><DeliveryManagement /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
