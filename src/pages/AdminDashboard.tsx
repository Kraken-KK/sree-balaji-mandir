
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
  UserCheck
} from 'lucide-react';
import { AdminCodeInput } from '@/components/AdminCodeInput';
import { AdminAnalytics } from '@/components/AdminAnalytics';
import { AdminEventManager } from '@/components/AdminEventManager';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { AdminGalleryManager } from '@/components/AdminGalleryManager';
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
  email: string;
  created_at: string;
  last_sign_in_at: string;
  user_profiles?: {
    full_name: string;
    phone: string;
  } | null;
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
      
      // Multi-layer connection check
      const { data: connectionTest } = await supabase.from('tickets').select('count').limit(1);
      if (!connectionTest) {
        throw new Error('Database connection failed');
      }

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

      console.log('Fetched tickets:', data?.length || 0);
      setTickets(data || []);
      
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
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Fetched users:', data?.length || 0);
      setUsers(data || []);
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
          <AdminCodeInput onSubmit={handleAuthentication} />
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
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Control</h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10 backdrop-blur-sm"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 p-6 space-y-4 relative z-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">Admin Control</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-400' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`}></div>
                  <span className="text-sm text-gray-400 capitalize">{connectionStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full group relative overflow-hidden rounded-2xl p-4 transition-all duration-500 backdrop-blur-xl border border-white/10 ${
                  activeTab === item.id
                    ? 'bg-white/15 shadow-2xl shadow-white/10 border-white/30'
                    : 'bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{item.label}</h3>
                    <p className="text-gray-400 text-sm">Manage {item.label.toLowerCase()}</p>
                  </div>
                </div>
                {activeTab === item.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-50`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-900/95 backdrop-blur-xl w-80 h-full p-6 space-y-4 border-r border-white/10">
              <div className="grid grid-cols-2 gap-3 mt-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-500 backdrop-blur-xl border border-white/10 ${
                      activeTab === item.id
                        ? 'bg-white/15 border-white/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.iconColor} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">{item.label}</span>
                    </div>
                    {activeTab === item.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl opacity-50`} />
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
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl">
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center shadow-2xl">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Ticket Management</h2>
                      <p className="text-gray-400">View and manage all tickets ({tickets.length} total)</p>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchAllTickets} 
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 backdrop-blur-xl border border-white/20 shadow-2xl"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>

                <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-white/10">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-white font-bold text-lg">{ticket.ticket_number}</span>
                              <Badge 
                                variant={ticket.status === 'active' ? 'default' : ticket.status === 'used' ? 'destructive' : 'secondary'}
                                className="capitalize backdrop-blur-sm"
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                            <div className="text-gray-300 space-y-1">
                              <p><strong>Customer:</strong> {ticket.customer_name}</p>
                              <p><strong>Email:</strong> {ticket.customer_email}</p>
                              <p><strong>Service:</strong> {ticket.services?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-400">{new Date(ticket.created_at).toLocaleString()}</p>
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
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Event Management</h2>
                    <p className="text-gray-400">Create and manage events</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <AdminEventManager />
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl">
                    <Wrench className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Service Management</h2>
                    <p className="text-gray-400">Manage services and offerings</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <AdminServiceManager />
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center shadow-2xl">
                    <Image className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Gallery Management</h2>
                    <p className="text-gray-400">Manage images and media</p>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <AdminGalleryManager />
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">User Management</h2>
                      <p className="text-gray-400">View and manage all users ({users.length} total)</p>
                    </div>
                  </div>
                  <Button 
                    onClick={fetchAllUsers} 
                    disabled={loading}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 backdrop-blur-xl border border-white/20 shadow-2xl"
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>

                <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-white/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <UserCheck className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{user.user_profiles?.full_name || 'Unknown User'}</h3>
                            <p className="text-gray-400">{user.id}</p>
                            <p className="text-gray-400 text-sm">{user.user_profiles?.phone || 'No phone'}</p>
                            <p className="text-gray-400 text-sm">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {users.length === 0 && !loading && (
                  <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
                    <CardContent className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
                      <p className="text-gray-400">No users have registered yet.</p>
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
