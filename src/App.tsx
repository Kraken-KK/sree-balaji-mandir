
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import Events from "./pages/Events";
import Services from "./pages/Services";
import Donations from "./pages/Donations";
import Gallery from "./pages/Gallery";
import History from "./pages/History";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Sribot from "./components/Sribot";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('temple-has-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('temple-has-visited', 'true');
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/landing" element={isFirstVisit ? <Landing /> : <Navigate to="/" replace />} />
                  <Route path="/" element={isFirstVisit ? <Navigate to="/landing" replace /> : <Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                  <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
                  <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
                  <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <SribotWithConditionalRender />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Component to conditionally render Sribot based on current route
function SribotWithConditionalRender() {
  const location = useLocation();
  const authPages = ['/auth', '/signup', '/landing'];
  
  // Don't show Sribot on authentication pages and landing page
  if (authPages.includes(location.pathname)) {
    return null;
  }
  
  return <Sribot />;
}

export default App;
