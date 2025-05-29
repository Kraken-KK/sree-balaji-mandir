import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration (in real app, this would come from Supabase)
  const statsData = [
    { title: 'Total Registered Users', value: registeredUsers.length.toString(), change: '+12%' },
    { title: 'Event Registrations', value: '89', change: '+8%' },
    { title: 'Donations Received', value: '₹45,600', change: '+15%' },
    { title: 'Active Services', value: '12', change: '0%' },
  ];

  const visitorsData = [
    { date: '01', count: 450 },
    { date: '02', count: 380 },
    { date: '03', count: 520 },
    { date: '04', count: 610 },
    { date: '05', count: 480 },
    { date: '06', count: 720 },
    { date: '07', count: 650 },
  ];

  const registrationsData = [
    { event: 'Diwali', count: 45 },
    { event: 'Morning Aarti', count: 32 },
    { event: 'Holi', count: 28 },
    { event: 'Special Puja', count: 15 },
  ];

  const donationsData = [
    { type: 'General Fund', amount: 25000, color: '#E0B020' },
    { type: 'Annadanam', amount: 15000, color: '#EC4899' },
    { type: 'Maintenance', amount: 8000, color: '#3B82F6' },
    { type: 'Festivals', amount: 12000, color: '#10B981' },
  ];

  useEffect(() => {
    fetchRegisteredUsers();
  }, []);

  const fetchRegisteredUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegisteredUsers(profiles || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch registered users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <CardTitle>Visitors Trend (Last 7 Days)</CardTitle>
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
              <CardTitle>Registrations by Event</CardTitle>
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
                    label={({ type, amount }) => `${type}: ₹${amount.toLocaleString()}`}
                  >
                    {donationsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors hover-lift">
                Send Event Notification
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors hover-lift">
                Generate Monthly Report
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors hover-lift">
                Update Service Prices
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors hover-lift">
                Manage User Accounts
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Data Tables */}
        <Tabs defaultValue="users" className="w-full animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">Registered Users</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="services">Service Management</TabsTrigger>
            <TabsTrigger value="registrations">Event Registrations</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
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
                {loading ? (
                  <div className="text-center py-8">Loading users...</div>
                ) : (
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
                )}
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
                <CardTitle>Recent Event Registrations</CardTitle>
                <CardDescription>Latest event registrations from devotees</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Rajesh Kumar</TableCell>
                      <TableCell>Diwali Celebration</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>2024-01-15 10:30</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Priya Sharma</TableCell>
                      <TableCell>Morning Aarti</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>2024-01-15 09:15</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Latest donations received</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Anonymous</TableCell>
                      <TableCell>₹5,000</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>UPI</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ramesh Family</TableCell>
                      <TableCell>₹2,500</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>QR Code</TableCell>
                    </TableRow>
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
