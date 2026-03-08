
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Landing from '@/pages/Landing';
import Services from '@/pages/Services';
import Events from '@/pages/Events';
import Donations from '@/pages/Donations';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import SignUp from '@/pages/SignUp';
import Settings from '@/pages/Settings';
import History from '@/pages/History';
import AdminDashboard from '@/pages/AdminDashboard';
import PaymentSuccess from '@/pages/PaymentSuccess';
import Sribot from '@/components/Sribot';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/donations" element={<Donations />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                </Routes>
                <Toaster />
                <Sribot />
                <PWAInstallPrompt />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
