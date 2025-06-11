import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Calendar, 
  Image, 
  Settings,
  Ticket,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Scan
} from 'lucide-react';
import { AdminEventManager } from '@/components/AdminEventManager';
import { AdminGalleryManager } from '@/components/AdminGalleryManager';
import { AdminServiceManager } from '@/components/AdminServiceManager';
import { AdminCodeInput } from '@/components/AdminCodeInput';
import QRScanner from '@/components/QRScanner';
import { AdminAnalytics } from '@/components/AdminAnalytics';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
      
      // Set up real-time subscription for tickets
      const channel = supabase
        .channel('admin-tickets')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tickets'
          },
          () => {
            fetchTickets();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const checkAdminAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has admin privileges (you can implement your own logic here)
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, category),
          user_profiles (full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive",
      });
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.services?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>Enter admin code to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCodeInput onSuccess={() => setIsAuthenticated(true)} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Created by tag */}
        <div className="fixed bottom-4 right-4 bg-primary/10 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-primary border border-primary/20">
          Created by <strong>Karthikeya Ramarapu</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage temple services, events, and tickets</p>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 gap-2">
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs md:text-sm">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2 text-xs md:text-sm">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 text-xs md:text-sm">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 text-xs md:text-sm">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 text-xs md:text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2 text-xs md:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="qr-scanner" className="flex items-center gap-2 text-xs md:text-sm">
              <Scan className="w-4 h-4" />
              <span className="hidden sm:inline">QR Scanner</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Ticket Management
                </CardTitle>
                <CardDescription>
                  View and manage all service tickets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Tickets</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by ticket number, customer name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="md:w-48">
                    <Label htmlFor="status-filter">Filter by Status</Label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="used">Used</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={fetchTickets} variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Tickets Grid */}
                <div className="grid gap-4">
                  {filteredTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No tickets found matching your criteria
                    </div>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            <div>
                              <p className="font-mono text-sm font-medium">{ticket.ticket_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-sm">{ticket.customer_name}</p>
                              <p className="text-xs text-muted-foreground">{ticket.customer_email}</p>
                            </div>
                            <div>
                              <p className="text-sm">{ticket.services?.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{ticket.services?.category}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={`${getStatusColor(ticket.status)} text-xs`}>
                                {ticket.status.toUpperCase()}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold">{tickets.length}</p>
                      <p className="text-xs text-muted-foreground">Total Tickets</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {tickets.filter(t => t.status === 'active').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {tickets.filter(t => t.status === 'used').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Used</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-gray-600">
                        {tickets.filter(t => t.status === 'expired').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Expired</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <AdminEventManager />
          </TabsContent>

          <TabsContent value="gallery">
            <AdminGalleryManager />
          </TabsContent>

          <TabsContent value="services">
            <AdminServiceManager />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-scanner" className="space-y-6">
            <QRScanner />
          </TabsContent>
        </Tabs>
      </div>

      {/* Created by tag */}
      <div className="fixed bottom-4 right-4 bg-primary/10 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-primary border border-primary/20 z-50">
        Created by <strong>Karthikeya Ramarapu</strong>
      </div>
    </div>
  );
};

export default AdminDashboard;

}
