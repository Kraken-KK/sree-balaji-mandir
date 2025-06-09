
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { AdminGalleryManager } from '@/components/AdminGalleryManager';
import { QRScanner } from '@/components/QRScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  CreditCard, 
  Ticket, 
  Image as ImageIcon,
  TrendingUp, 
  Calendar,
  Scan,
  Settings,
  BarChart3,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    totalTickets: 0,
    activeTickets: 0,
    totalRevenue: 0,
    totalGalleryItems: 0,
    recentPayments: [],
    recentTickets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, paymentsRes, ticketsRes, revenueRes, galleryRes] = await Promise.all([
        supabase.from('user_profiles').select('id'),
        supabase.from('payments').select('*').eq('status', 'completed'),
        supabase.from('tickets').select('*'),
        supabase.from('payments').select('amount').eq('status', 'completed'),
        supabase.from('gallery').select('id')
      ]);

      const totalRevenue = revenueRes.data?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
      const activeTickets = ticketsRes.data?.filter(ticket => ticket.status === 'active').length || 0;

      // Get recent data
      const recentPayments = paymentsRes.data?.slice(0, 5) || [];
      const recentTickets = ticketsRes.data?.slice(0, 5) || [];

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalPayments: paymentsRes.data?.length || 0,
        totalTickets: ticketsRes.data?.length || 0,
        activeTickets,
        totalRevenue,
        totalGalleryItems: galleryRes.data?.length || 0,
        recentPayments,
        recentTickets
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 animate-pulse-soft">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage temple services and monitor activity</p>
        </div>

        <Tabs defaultValue="overview" className="w-full animate-slide-up">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center gap-2">
              <Scan className="w-4 h-4" />
              QR Scanner
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-entrance hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered members</p>
                </CardContent>
              </Card>

              <Card className="card-entrance hover-lift" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">From all payments</p>
                </CardContent>
              </Card>

              <Card className="card-entrance hover-lift" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{stats.activeTickets}</div>
                  <p className="text-xs text-muted-foreground">Ready to use</p>
                </CardContent>
              </Card>

              <Card className="card-entrance hover-lift" style={{ animationDelay: '0.3s' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.totalGalleryItems}</div>
                  <p className="text-xs text-muted-foreground">Uploaded images</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-slide-in-left">
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentPayments.length > 0 ? (
                    stats.recentPayments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium">{payment.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{payment.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{Number(payment.amount).toLocaleString()}</p>
                          <Badge variant={payment.type === 'donation' ? 'secondary' : 'default'}>
                            {payment.type}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent payments</p>
                  )}
                </CardContent>
              </Card>

              <Card className="animate-slide-in-right">
                <CardHeader>
                  <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.recentTickets.length > 0 ? (
                    stats.recentTickets.map((ticket: any) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium">{ticket.ticket_number}</p>
                          <p className="text-sm text-muted-foreground">{ticket.customer_name}</p>
                        </div>
                        <Badge variant={ticket.status === 'active' ? 'default' : ticket.status === 'used' ? 'secondary' : 'destructive'}>
                          {ticket.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No recent tickets</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scanner">
            <QRScanner />
          </TabsContent>

          <TabsContent value="services">
            <AdminServiceManager />
          </TabsContent>

          <TabsContent value="gallery">
            <AdminGalleryManager />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg hover-lift bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                      <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">Revenue Breakdown</h4>
                      <p className="text-sm text-muted-foreground mb-3">Services vs Donations</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Services: </span>
                          <span className="font-medium">₹{(stats.totalRevenue * 0.7).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Donations: </span>
                          <span className="font-medium">₹{(stats.totalRevenue * 0.3).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 border rounded-lg hover-lift bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                      <h4 className="font-semibold mb-3 text-green-700 dark:text-green-300">Ticket Usage</h4>
                      <p className="text-sm text-muted-foreground mb-3">Active vs Used</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active: </span>
                          <span className="font-medium">{stats.activeTickets}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Used: </span>
                          <span className="font-medium">{stats.totalTickets - stats.activeTickets}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 border rounded-lg hover-lift bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                      <h4 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">User Engagement</h4>
                      <p className="text-sm text-muted-foreground mb-3">Average per user</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Avg revenue: </span>
                          <span className="font-medium">₹{stats.totalUsers > 0 ? Math.round(stats.totalRevenue / stats.totalUsers) : 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gallery items: </span>
                          <span className="font-medium">{stats.totalGalleryItems}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
