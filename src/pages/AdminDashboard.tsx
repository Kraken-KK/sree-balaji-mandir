
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  Users, 
  QrCode, 
  Settings, 
  Calendar,
  Image,
  CreditCard,
  Activity,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { AdminCodeInput } from '@/components/AdminCodeInput';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { AdminEventManager } from '@/components/AdminEventManager';
import QRScanner from '@/components/QRScanner';

interface TicketData {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  created_at: string;
  services: {
    name: string;
    price: number;
  } | null;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllTickets();
    }
  }, [isAuthenticated]);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, price)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        throw error;
      }

      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'scanner', label: 'QR Scanner', icon: QrCode, color: 'from-green-500 to-emerald-500' },
    { id: 'tickets', label: 'Tickets', icon: CreditCard, color: 'from-purple-500 to-violet-500' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'from-orange-500 to-red-500' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AdminCodeInput onSuccess={handleAuthentication} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-black/20 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 p-6 space-y-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">Admin Control</h1>
                <p className="text-gray-400 text-sm">Management Dashboard</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{item.label}</h3>
                    <p className="text-gray-400 text-sm">Manage {item.label.toLowerCase()}</p>
                  </div>
                </div>
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900/95 backdrop-blur-md w-80 h-full p-6 space-y-4 border-r border-white/10">
              <div className="grid grid-cols-2 gap-3 mt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                      activeTab === item.id
                        ? 'bg-white/10 backdrop-blur-md border border-white/20'
                        : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
                    <p className="text-gray-400">Real-time insights and data visualization</p>
                  </div>
                </div>
                <AdminAnalytics />
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">QR Code Scanner</h2>
                    <p className="text-gray-400">Scan and verify tickets</p>
                  </div>
                </div>
                <QRScanner />
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Ticket Management</h2>
                      <p className="text-gray-400">View and manage all tickets</p>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchAllTickets} 
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-white font-bold">{ticket.ticket_number}</span>
                              <Badge 
                                variant={ticket.status === 'active' ? 'default' : ticket.status === 'used' ? 'destructive' : 'secondary'}
                                className="capitalize"
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="text-gray-300">
                              <p><strong>Customer:</strong> {ticket.customer_name}</p>
                              <p><strong>Email:</strong> {ticket.customer_email}</p>
                              <p><strong>Service:</strong> {ticket.services?.name || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">₹{ticket.services?.price || 0}</p>
                            <p className="text-gray-400 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {tickets.length === 0 && !loading && (
                  <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardContent className="p-12 text-center">
                      <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
                      <p className="text-gray-400">No tickets have been created yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Event Management</h2>
                    <p className="text-gray-400">Create and manage events</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                  <AdminEventManager />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
