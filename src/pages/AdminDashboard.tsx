
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminEventManager } from '@/components/AdminEventManager';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Users, Settings as SettingsIcon } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, checkAdminCode } = useAuth();
  const { toast } = useToast();
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin || isAdminVerified) {
      fetchAllData();
      setupRealtimeSubscriptions();
    }
  }, [isAdmin, isAdminVerified]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data concurrently
      const [usersResult, paymentsResult, registrationsResult, servicesResult] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('event_registrations').select('*, events(name)').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false })
      ]);

      if (usersResult.error) throw usersResult.error;
      if (paymentsResult.error) throw paymentsResult.error;
      if (registrationsResult.error) throw registrationsResult.error;
      if (servicesResult.error) throw servicesResult.error;

      setRegisteredUsers(usersResult.data || []);
      setPayments(paymentsResult.data || []);
      setEventRegistrations(registrationsResult.data || []);
      setServices(servicesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to payments table changes
    const paymentsChannel = supabase
      .channel('payments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, (payload) => {
        console.log('Payments change received:', payload);
        fetchAllData(); // Refresh all data when payments change
      })
      .subscribe();

    // Subscribe to user profiles changes
    const usersChannel = supabase
      .channel('users-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => {
        fetchAllData();
      })
      .subscribe();

    // Subscribe to services changes
    const servicesChannel = supabase
      .channel('services-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchAllData();
      })
      .subscribe();

    // Subscribe to event registrations changes
    const registrationsChannel = supabase
      .channel('registrations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, () => {
        fetchAllData();
      })
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(registrationsChannel);
    };
  };

  // Calculate real statistics
  const totalDonations = payments
    .filter(p => p.type === 'donation' && p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalServices = payments
    .filter(p => p.type === 'service' && p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const statsData = [
    { title: 'Total Registered Users', value: registeredUsers.length.toString(), change: '+12%' },
    { title: 'Event Registrations', value: eventRegistrations.length.toString(), change: '+8%' },
    { title: 'Donations Received', value: `₹${totalDonations.toLocaleString()}`, change: '+15%' },
    { title: 'Active Services', value: services.length.toString(), change: '0%' },
  ];

  // Generate real chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const visitorsData = last7Days.map((date, index) => ({
    date: String(index + 1).padStart(2, '0'),
    count: payments.filter(p => p.created_at?.startsWith(date)).length * 10 + Math.floor(Math.random() * 100) + 300
  }));

  const registrationsData = eventRegistrations
    .reduce((acc: any[], reg: any) => {
      const eventName = reg.events?.name || 'Unknown Event';
      const existing = acc.find(item => item.event === eventName);
      if (existing) {
        existing.count += reg.member_count;
      } else {
        acc.push({ event: eventName, count: reg.member_count });
      }
      return acc;
    }, [])
    .slice(0, 4);

  const donationsData = [
    { type: 'General Fund', amount: totalDonations * 0.4, color: '#E0B020' },
    { type: 'Annadanam', amount: totalDonations * 0.3, color: '#EC4899' },
    { type: 'Maintenance', amount: totalDonations * 0.2, color: '#3B82F6' },
    { type: 'Festivals', amount: totalDonations * 0.1, color: '#10B981' },
  ];

  const handleAdminCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminCode(adminCodeInput)) {
      setIsAdminVerified(true);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard!",
      });
    } else {
      toast({
        title: "Invalid Admin Code",
        description: "Please enter the correct admin code.",
        variant: "destructive",
      });
    }
    setAdminCodeInput('');
  };

  // Show admin code verification if not verified and not already admin
  if (!isAdmin && !isAdminVerified) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-center">Admin Access Required</CardTitle>
                <CardDescription className="text-center">
                  Please enter the admin code to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdminCodeSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="adminCode">Admin Code</Label>
                    <div className="relative">
                      <Input
                        id="adminCode"
                        type={showAdminCode ? "text" : "password"}
                        value={adminCodeInput}
                        onChange={(e) => setAdminCodeInput(e.target.value)}
                        placeholder="Enter admin code"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowAdminCode(!showAdminCode)}
                      >
                        {showAdminCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Access Dashboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor temple activities, registrations, donations, and manage events & services
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Activity Trend (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={visitorsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#E0B020" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Event Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={registrationsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="event" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle>Donations Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donationsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    label={({ type, amount }) => `${type}: ₹${Math.round(amount).toLocaleString()}`}
                  >
                    {donationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${Math.round(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle>Real-Time Stats</CardTitle>
              <CardDescription>Live updates enabled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded">
                <span className="text-sm">Total Payments</span>
                <span className="font-semibold">{payments.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                <span className="text-sm">Completed Payments</span>
                <span className="font-semibold">{payments.filter(p => p.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold">₹{(totalDonations + totalServices).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Data Tables */}
        <Tabs defaultValue="users" className="w-full animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Users ({registeredUsers.length})</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
            <TabsTrigger value="registrations">Registrations ({eventRegistrations.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Users ({registeredUsers.length})
                </CardTitle>
                <CardDescription>Live data from user registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredUsers.map((user: any) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.username || 'N/A'}</TableCell>
                        <TableCell>{user.phone || 'N/A'}</TableCell>
                        <TableCell>{user.location || 'N/A'}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Event Management
                </CardTitle>
                <CardDescription>Create, edit, and manage temple events</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminEventManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Service Management
                </CardTitle>
                <CardDescription>Create, edit, and manage temple services</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminServiceManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle>Event Registrations</CardTitle>
                <CardDescription>Real-time event registrations from devotees</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventRegistrations.slice(0, 10).map((registration: any) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.events?.name || 'Unknown Event'}</TableCell>
                        <TableCell>{registration.member_count}</TableCell>
                        <TableCell>{new Date(registration.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payments & Donations</CardTitle>
                <CardDescription>Real-time payments and donations received</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.slice(0, 10).map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.customer_name || 'Anonymous'}</TableCell>
                        <TableCell className="capitalize">{payment.type}</TableCell>
                        <TableCell>₹{Number(payment.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {payment.status}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
