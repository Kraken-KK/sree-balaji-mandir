
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // Mock data for demonstration
  const statsData = [
    { title: 'Total Visitors Today', value: '1,247', change: '+12%' },
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

  const recentRegistrations = [
    { id: 1, fullName: 'Rajesh Kumar', event: 'Diwali Celebration', members: 4, timestamp: '2024-01-15 10:30' },
    { id: 2, fullName: 'Priya Sharma', event: 'Morning Aarti', members: 2, timestamp: '2024-01-15 09:15' },
    { id: 3, fullName: 'Amit Patel', event: 'Special Puja', members: 6, timestamp: '2024-01-14 16:45' },
    { id: 4, fullName: 'Sunita Singh', event: 'Holi Festival', members: 3, timestamp: '2024-01-14 14:20' },
  ];

  const recentDonations = [
    { id: 1, donor: 'Anonymous', amount: 5000, date: '2024-01-15', method: 'UPI' },
    { id: 2, donor: 'Ramesh Family', amount: 2500, date: '2024-01-15', method: 'QR Code' },
    { id: 3, donor: 'Local Community', amount: 10000, date: '2024-01-14', method: 'UPI' },
    { id: 4, donor: 'Devotee Group', amount: 1500, date: '2024-01-14', method: 'QR Code' },
  ];

  const servicesData = [
    { service: 'Special Puja', bookings: 25, revenue: 125000 },
    { service: 'Annadanam', bookings: 150, revenue: 15000 },
    { service: 'Archana Service', bookings: 80, revenue: 12000 },
    { service: 'Wedding Ceremonies', bookings: 3, revenue: 90000 },
    { service: 'Hawan/Homa', bookings: 12, revenue: 48000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor temple activities, registrations, and donations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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
          <Card>
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

          <Card>
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

          <Card>
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

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors">
                Send Event Notification
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors">
                Generate Monthly Report
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors">
                Update Service Prices
              </button>
              <button className="w-full p-3 text-left border rounded hover:bg-accent transition-colors">
                Manage User Accounts
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="registrations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registrations">Event Registrations</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

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
                    {recentRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.fullName}</TableCell>
                        <TableCell>{registration.event}</TableCell>
                        <TableCell>{registration.members}</TableCell>
                        <TableCell>{registration.timestamp}</TableCell>
                      </TableRow>
                    ))}
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
                    {recentDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{donation.donor}</TableCell>
                        <TableCell>₹{donation.amount.toLocaleString()}</TableCell>
                        <TableCell>{donation.date}</TableCell>
                        <TableCell>{donation.method}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
                <CardDescription>Bookings and revenue by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Bookings</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicesData.map((service, index) => (
                      <TableRow key={index}>
                        <TableCell>{service.service}</TableCell>
                        <TableCell>{service.bookings}</TableCell>
                        <TableCell>₹{service.revenue.toLocaleString()}</TableCell>
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
