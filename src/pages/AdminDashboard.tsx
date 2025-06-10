
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { AdminCodeInput } from '@/components/AdminCodeInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminEventManager } from '@/components/AdminEventManager';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { AdminGalleryManager } from '@/components/AdminGalleryManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Settings,
  Image as ImageIcon,
  Plus,
  Upload
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, checkAdminCode } = useAuth();
  const { toast } = useToast();
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminCodeLoading, setAdminCodeLoading] = useState(false);

  // Data states
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    if (isAdmin || isAdminVerified) {
      fetchAllData();
      setupRealtimeSubscriptions();
    }
  }, [isAdmin, isAdminVerified]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [usersRes, paymentsRes, eventsRes, servicesRes, registrationsRes] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('created_at', { ascending: false }),
        supabase.from('event_registrations').select('*, events(name)').order('created_at', { ascending: false })
      ]);

      setUsers(usersRes.data || []);
      setPayments(paymentsRes.data || []);
      setEvents(eventsRes.data || []);
      setServices(servicesRes.data || []);
      setRegistrations(registrationsRes.data || []);
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
    const channels = [
      supabase.channel('users-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, fetchAllData),
      supabase.channel('payments-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchAllData),
      supabase.channel('events-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, fetchAllData),
      supabase.channel('services-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchAllData),
      supabase.channel('registrations-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, fetchAllData)
    ];

    channels.forEach(channel => channel.subscribe());

    return () => channels.forEach(channel => supabase.removeChannel(channel));
  };

  const handleAdminCodeSubmit = (code: string) => {
    setAdminCodeLoading(true);
    setTimeout(() => {
      if (checkAdminCode(code)) {
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
      setAdminCodeLoading(false);
    }, 1000);
  };

  if (!isAdmin && !isAdminVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <AdminCodeInput onSubmit={handleAdminCodeSubmit} loading={adminCodeLoading} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalDonations = payments.filter(p => p.type === 'donation' && p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalServices = payments.filter(p => p.type === 'service' && p.status === 'completed').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalRevenue = totalDonations + totalServices;
  const completedPayments = payments.filter(p => p.status === 'completed').length;

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyStats = last7Days.map(date => {
    const dayPayments = payments.filter(p => p.created_at?.startsWith(date));
    const dayRegistrations = registrations.filter(r => r.created_at?.startsWith(date));
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      payments: dayPayments.length,
      registrations: dayRegistrations.length,
      revenue: dayPayments.reduce((sum, p) => sum + Number(p.amount), 0)
    };
  });

  const revenueData = [
    { name: 'Donations', value: totalDonations, color: '#E0B020' },
    { name: 'Services', value: totalServices, color: '#EC4899' }
  ];

  const statsCards = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      change: '+15%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Event Registrations',
      value: registrations.length.toString(),
      change: '+8%',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Active Services',
      value: services.length.toString(),
      change: '0%',
      icon: Settings,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive temple management and analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted/50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Activity Trends
              </CardTitle>
              <CardDescription>Daily payments and registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="payments" stackId="1" stroke="#E0B020" fill="#E0B020" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="registrations" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Revenue Distribution
              </CardTitle>
              <CardDescription>Breakdown by source</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="users" className="w-full animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Registered Users
                </CardTitle>
                <CardDescription>All registered temple community members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.slice(0, 10).map((user: any) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.username || 'N/A'}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>{user.location || 'N/A'}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
                <CardDescription>Create and manage temple events</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminEventManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Management</CardTitle>
                <CardDescription>Create and manage temple services</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminServiceManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Gallery Management
                </CardTitle>
                <CardDescription>Upload and manage temple gallery images</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminGalleryManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment History
                </CardTitle>
                <CardDescription>Real-time payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                          <TableCell className="font-medium">{payment.customer_name || 'Anonymous'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.type}</Badge>
                          </TableCell>
                          <TableCell>₹{Number(payment.amount).toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              payment.status === 'completed' ? 'default' :
                              payment.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Event Registrations
                </CardTitle>
                <CardDescription>Live event registration data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.slice(0, 10).map((reg: any) => (
                        <TableRow key={reg.id}>
                          <TableCell className="font-medium">{reg.events?.name || 'Unknown Event'}</TableCell>
                          <TableCell>{reg.member_count}</TableCell>
                          <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
