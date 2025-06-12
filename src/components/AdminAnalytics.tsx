
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, CreditCard, Calendar, Activity, DollarSign } from 'lucide-react';

interface AnalyticsData {
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  totalRevenue: number;
  totalUsers: number;
  recentTickets: any[];
  monthlyData: any[];
  serviceData: any[];
  dailyData: any[];
}

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTickets: 0,
    activeTickets: 0,
    usedTickets: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentTickets: [],
    monthlyData: [],
    serviceData: [],
    dailyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all tickets with services
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, price)
        `);

      if (ticketsError) throw ticketsError;

      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('*');

      if (usersError) throw usersError;

      // Process tickets data
      const totalTickets = tickets?.length || 0;
      const activeTickets = tickets?.filter(t => t.status === 'active').length || 0;
      const usedTickets = tickets?.filter(t => t.status === 'used').length || 0;
      const totalRevenue = tickets?.reduce((sum, ticket) => {
        return sum + (ticket.services?.price || 0);
      }, 0) || 0;

      // Process monthly data for the last 12 months
      const monthlyData = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthTickets = tickets?.filter(ticket => {
          const ticketDate = new Date(ticket.created_at);
          return ticketDate >= monthStart && ticketDate <= monthEnd;
        }) || [];

        const monthRevenue = monthTickets.reduce((sum, ticket) => {
          return sum + (ticket.services?.price || 0);
        }, 0);

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          tickets: monthTickets.length,
          revenue: monthRevenue,
          active: monthTickets.filter(t => t.status === 'active').length,
          used: monthTickets.filter(t => t.status === 'used').length
        });
      }

      // Process daily data for the last 30 days
      const dailyData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const dayTickets = tickets?.filter(ticket => {
          const ticketDate = new Date(ticket.created_at);
          return ticketDate >= dayStart && ticketDate < dayEnd;
        }) || [];

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tickets: dayTickets.length,
          revenue: dayTickets.reduce((sum, ticket) => sum + (ticket.services?.price || 0), 0)
        });
      }

      // Process service data
      const serviceMap = new Map();
      tickets?.forEach(ticket => {
        if (ticket.services) {
          const serviceName = ticket.services.name;
          if (serviceMap.has(serviceName)) {
            serviceMap.set(serviceName, {
              ...serviceMap.get(serviceName),
              count: serviceMap.get(serviceName).count + 1,
              revenue: serviceMap.get(serviceName).revenue + ticket.services.price
            });
          } else {
            serviceMap.set(serviceName, {
              name: serviceName,
              count: 1,
              revenue: ticket.services.price,
              price: ticket.services.price
            });
          }
        }
      });

      const serviceData = Array.from(serviceMap.values());

      // Get recent tickets (last 10)
      const recentTickets = tickets?.slice(0, 10) || [];

      setAnalytics({
        totalTickets,
        activeTickets,
        usedTickets,
        totalRevenue,
        totalUsers: users?.length || 0,
        recentTickets,
        monthlyData,
        serviceData,
        dailyData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-white/10 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Tickets</p>
                <p className="text-3xl font-bold text-white">{analytics.totalTickets}</p>
                <p className="text-blue-400 text-sm">All time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Active Tickets</p>
                <p className="text-3xl font-bold text-white">{analytics.activeTickets}</p>
                <p className="text-green-400 text-sm">Ready to use</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
                <p className="text-purple-400 text-sm">All time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-white">{analytics.totalUsers}</p>
                <p className="text-orange-400 text-sm">Registered</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Monthly Trends (Scrollable)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ width: Math.max(600, analytics.monthlyData.length * 60) }}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.monthlyData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="tickets" stroke="#82ca9d" fillOpacity={1} fill="url(#colorTickets)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(12px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity (Last 30 Days) */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Activity (Last 30 Days - Scrollable)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ width: Math.max(800, analytics.dailyData.length * 30) }}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(12px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tickets" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">Ticket Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Active', count: analytics.activeTickets, fill: '#10b981' },
                { name: 'Used', count: analytics.usedTickets, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
