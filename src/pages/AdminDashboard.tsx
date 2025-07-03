import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  X,
  Wrench,
  Camera,
  UserCheck,
  Send
} from 'lucide-react';
import { AdminCodeInput } from '@/components/AdminCodeInput';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { AdminEventManager } from '@/components/AdminEventManager';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { AdminGalleryManager } from '@/components/AdminGalleryManager';
import { AdminBroadcastManager } from '@/components/AdminBroadcastManager';
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

interface UserData {
  id: string;
  user_id: string;
  created_at: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  bio: string | null;
  location: string | null;
  updated_at: string | null;
}

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      initializeAdminData();
    }
  }, [isAuthenticated]);

  const initializeAdminData = async () => {
    setConnectionStatus('connecting');
    try {
      await Promise.all([
        fetchAllTickets(),
        fetchAllUsers()
      ]);
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      console.error('Failed to initialize admin data:', error);
    }
  };

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      console.log('Fetching all tickets...');
      
      // Use the admin RPC function to get all tickets
      const { data, error } = await supabase.rpc('get_all_tickets_admin');

      if (error) {
        console.error('RPC error:', error);
        // Fallback to regular query if RPC doesn't work
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('tickets')
          .select(`
            *,
            services (name, price)
          `)
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        
        // Transform fallback data to match expected format
        const transformedData = fallbackData?.map(ticket => ({
          ...ticket,
          services: ticket.services ? {
            name: ticket.services.name,
            price: ticket.services.price
          } : null
        })) || [];
        
        setTickets(transformedData);
      } else {
        // Transform RPC data to match expected format
        const transformedData = data?.map((ticket: any) => ({
          id: ticket.id,
          ticket_number: ticket.ticket_number,
          customer_name: ticket.customer_name,
          customer_email: ticket.customer_email,
          status: ticket.status,
          created_at: ticket.created_at,
          services: ticket.services && typeof ticket.services === 'object' ? {
            name: ticket.services.name || 'N/A',
            price: ticket.services.price || 0
          } : null
        })) || [];
        
        setTickets(transformedData);
      }

      console.log('Fetched tickets:', data?.length || 0);
      
      if (data && data.length > 0) {
        toast({
          title: "Data Loaded",
          description: `Successfully loaded ${data.length} tickets.`,
        });
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Connection Error",
        description: "Failed to fetch tickets. Retrying connection...",
        variant: "destructive",
      });
      
      // Retry mechanism
      setTimeout(() => {
        fetchAllTickets();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      console.log('Fetching all users...');
      
      // Use the admin RPC function to get all users
      const { data, error } = await supabase.rpc('get_all_users_admin');

      if (error) {
        console.error('RPC error:', error);
        // Fallback to regular query if RPC doesn't work
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) throw fallbackError;
        setUsers(fallbackData || []);
      } else {
        setUsers(data || []);
      }

      console.log('Fetched users:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "User Data Error",
        description: "Failed to fetch user data.",
        variant: "destructive",
      });
    }
  };

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'from-blue-500 to-cyan-500' },
    { id: 'scanner', label: 'QR Scanner', icon: QrCode, color: 'from-green-500/20 to-emerald-500/20', iconColor: 'from-green-500 to-emerald-500' },
    { id: 'broadcast', label: 'Broadcast', icon: Send, color: 'from-yellow-500/20 to-amber-500/20', iconColor: 'from-yellow-500 to-amber-500' },
    { id: 'tickets', label: 'Tickets', icon: CreditCard, color: 'from-purple-500/20 to-violet-500/20', iconColor: 'from-purple-500 to-violet-500' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'from-orange-500/20 to-red-500/20', iconColor: 'from-orange-500 to-red-500' },
    { id: 'services', label: 'Services', icon: Wrench, color: 'from-pink-500/20 to-rose-500/20', iconColor: 'from-pink-500 to-rose-500' },
    { id: 'gallery', label: 'Gallery', icon: Image, color: 'from-indigo-500/20 to-purple-500/20', iconColor: 'from-indigo-500 to-purple-500' },
    { id: 'users', label: 'Users', icon: Users, color: 'from-teal-500/20 to-emerald-500/20', iconColor: 'from-teal-500 to-emerald-500' },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden backdrop-blur-xl bg-black/30 border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Control
              </h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400 animate-pulse'
                }`}></div>
                <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 p-6 space-y-4 relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Control
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50' : 'bg-red-400 animate-pulse shadow-lg shadow-red-400/50'
                  }`}></div>
                  <span className="text-sm text-gray-300 capitalize font-medium">{connectionStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 backdrop-blur-xl border ${
                  activeTab === item.id
                    ? 'bg-white/20 shadow-2xl shadow-white/20 border-white/40 scale-105'
                    : 'bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/30 hover:scale-102'
                } transform hover:shadow-2xl`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconColor} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-white font-semibold text-lg">{item.label}</h3>
                    <p className="text-gray-400 text-sm">Manage {item.label.toLowerCase()}</p>
                  </div>
                </div>
                {activeTab === item.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl opacity-30`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl w-80 h-full p-6 space-y-4 border-r border-white/20">
              <div className="grid grid-cols-1 gap-4 mt-8">
                {menuItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 backdrop-blur-xl border ${
                      activeTab === item.id
                        ? 'bg-white/20 border-white/40 shadow-xl'
                        : 'bg-white/5 hover:bg-white/15 border-white/10'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <span className="text-white text-base font-semibold">{item.label}</span>
                        <p className="text-gray-400 text-xs">Manage {item.label.toLowerCase()}</p>
                      </div>
                    </div>
                    {activeTab === item.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-40`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h2>
                    <p className="text-gray-400 text-lg">Real-time insights and data visualization</p>
                  </div>
                </div>
                <AdminAnalytics />
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30">
                    <QrCode className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      QR Code Scanner
                    </h2>
                    <p className="text-gray-400 text-lg">Scan and verify tickets</p>
                  </div>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <QRScanner />
                </div>
              </div>
            )}

            {activeTab === 'broadcast' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-2xl shadow-yellow-500/30">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                      Email Broadcast
                    </h2>
                    <p className="text-gray-400 text-lg">Send announcements to your community</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <AdminBroadcastManager />
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                        All Tickets Management
                      </h2>
                      <p className="text-gray-400 text-lg">View and manage all user tickets ({tickets.length} total)</p>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchAllTickets} 
                    disabled={loading}
                    className="bg-gradient-to-br from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 backdrop-blur-xl border border-white/20 shadow-2xl shadow-purple-500/20 rounded-2xl px-6 py-3"
                  >
                    {loading ? 'Loading...' : 'Refresh Data'}
                  </Button>
                </div>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {tickets.map((ticket, index) => (
                    <Card key={ticket.id} className="bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all duration-500 shadow-2xl hover:shadow-white/10 rounded-3xl group"
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}>
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4 flex-wrap">
                              <span className="font-mono text-white font-bold text-xl bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                {ticket.ticket_number}
                              </span>
                              <Badge 
                                variant={ticket.status === 'active' ? 'default' : ticket.status === 'used' ? 'destructive' : 'secondary'}
                                className="capitalize backdrop-blur-sm px-3 py-1 rounded-xl"
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="text-gray-300 space-y-2 text-sm lg:text-base">
                              <p><strong className="text-white">Customer:</strong> {ticket.customer_name}</p>
                              <p><strong className="text-white">Email:</strong> {ticket.customer_email}</p>
                              <p><strong className="text-white">Service:</strong> {ticket.services?.name || 'N/A'}</p>
                              <p className="text-gray-400">{new Date(ticket.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              ₹{ticket.services?.price || 0}
                            </p>
                            <p className="text-gray-400 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {tickets.length === 0 && !loading && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
                    <CardContent className="p-12 text-center">
                      <CreditCard className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-white mb-4">No Tickets Found</h3>
                      <p className="text-gray-400 text-lg">No tickets have been created yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-orange-500/30">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      Event Management
                    </h2>
                    <p className="text-gray-400 text-lg">Create and manage events</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <AdminEventManager />
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-pink-500/30">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Service Management
                    </h2>
                    <p className="text-gray-400 text-lg">Manage services and offerings</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <AdminServiceManager />
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      Gallery Management
                    </h2>
                    <p className="text-gray-400 text-lg">Manage images and media</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <AdminGalleryManager />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-2xl shadow-teal-500/30">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                        All Users Management
                      </h2>
                      <p className="text-gray-400 text-lg">View and manage all registered users ({users.length} total)</p>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchAllUsers} 
                    disabled={loading}
                    className="bg-gradient-to-br from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 backdrop-blur-xl border border-white/20 shadow-2xl shadow-teal-500/20 rounded-2xl px-6 py-3"
                  >
                    {loading ? 'Loading...' : 'Refresh Data'}
                  </Button>
                </div>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {users.map((user, index) => (
                    <Card key={user.id} className="bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all duration-500 shadow-2xl hover:shadow-white/10 rounded-3xl group"
                      style={{
                        animationDelay: `${index * 50}ms`
                      }}>
                      <CardContent className="p-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <UserCheck className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-xl">{user.full_name || 'Unknown User'}</h3>
                            <p className="text-gray-400 font-mono text-sm">{user.user_id}</p>
                            <p className="text-gray-400 text-base">{user.phone || 'No phone'}</p>
                            <p className="text-gray-400 text-sm">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {users.length === 0 && !loading && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
                    <CardContent className="p-12 text-center">
                      <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold text-white mb-4">No Users Found</h3>
                      <p className="text-gray-400 text-lg">No users have registered yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
