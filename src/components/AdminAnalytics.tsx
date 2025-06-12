
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Activity,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalTickets: number;
  activeTickets: number;
  usedTickets: number;
  expiredTickets: number;
  totalRevenue: number;
  monthlyTickets: Array<{ month: string; count: number; revenue: number }>;
  serviceBreakdown: Array<{ name: string; value: number; revenue: number }>;
  recentActivity: Array<{ date: string; tickets: number }>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  active: {
    label: "Active",
    color: "hsl(var(--chart-3))",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-4))",
  },
  expired: {
    label: "Expired",
    color: "hsl(var(--chart-5))",
  },
};

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTickets: 0,
    activeTickets: 0,
    usedTickets: 0,
    expiredTickets: 0,
    totalRevenue: 0,
    monthlyTickets: [],
    serviceBreakdown: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch ALL tickets regardless of user - this is for admin global view
      const { data: tickets, error: ticketsError } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, price, category)
        `);

      if (ticketsError) throw ticketsError;

      // Calculate basic stats for ALL tickets
      const totalTickets = tickets?.length || 0;
      const activeTickets = tickets?.filter(t => t.status === 'active').length || 0;
      const usedTickets = tickets?.filter(t => t.status === 'used').length || 0;
      const expiredTickets = tickets?.filter(t => t.status === 'expired').length || 0;
      const totalRevenue = tickets?.reduce((sum, ticket) => sum + (ticket.services?.price || 0), 0) || 0;

      // Monthly data for the last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthTickets = tickets?.filter(ticket => {
          const ticketDate = new Date(ticket.created_at);
          return ticketDate >= monthStart && ticketDate <= monthEnd;
        }) || [];

        const monthRevenue = monthTickets.reduce((sum, ticket) => sum + (ticket.services?.price || 0), 0);

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          count: monthTickets.length,
          revenue: monthRevenue,
        });
      }

      // Service breakdown
      const serviceMap = new Map();
      tickets?.forEach(ticket => {
        if (ticket.services) {
          const service = ticket.services.name;
          if (serviceMap.has(service)) {
            const existing = serviceMap.get(service);
            serviceMap.set(service, {
              name: service,
              value: existing.value + 1,
              revenue: existing.revenue + ticket.services.price,
            });
          } else {
            serviceMap.set(service, {
              name: service,
              value: 1,
              revenue: ticket.services.price,
            });
          }
        }
      });

      const serviceBreakdown = Array.from(serviceMap.values());

      // Recent activity (last 7 days)
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        
        const dayTickets = tickets?.filter(ticket => {
          const ticketDate = new Date(ticket.created_at);
          return ticketDate >= dayStart && ticketDate < dayEnd;
        }).length || 0;

        recentActivity.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tickets: dayTickets,
        });
      }

      setAnalytics({
        totalTickets,
        activeTickets,
        usedTickets,
        expiredTickets,
        totalRevenue,
        monthlyTickets: monthlyData,
        serviceBreakdown,
        recentActivity,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          onClick={fetchAnalytics} 
          variant="outline" 
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-200">Total Tickets</p>
                <p className="text-3xl font-bold text-white">{analytics.totalTickets}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200">Active Tickets</p>
                <p className="text-3xl font-bold text-white">{analytics.activeTickets}</p>
              </div>
              <Users className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-200">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-200">Used Tickets</p>
                <p className="text-3xl font-bold text-white">{analytics.usedTickets}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Tickets Chart */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5" />
              Monthly Tickets & Revenue
            </CardTitle>
            <CardDescription className="text-gray-300">Tickets and revenue trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyTickets}>
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis yAxisId="left" stroke="#fff" />
                  <YAxis yAxisId="right" orientation="right" stroke="#fff" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="count" fill="var(--color-tickets)" name="Tickets" />
                  <Bar yAxisId="right" dataKey="revenue" fill="var(--color-revenue)" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Service Breakdown */}
        <Card className="bg-white/5 backdrop-blur-md border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChartIcon className="w-5 h-5" />
              Service Distribution
            </CardTitle>
            <CardDescription className="text-gray-300">Breakdown of tickets by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {analytics.serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" />
            Recent Activity (Last 7 Days)
          </CardTitle>
          <CardDescription className="text-gray-300">Daily ticket creation trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.recentActivity}>
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="var(--color-tickets)" 
                  fill="var(--color-tickets)" 
                  fillOpacity={0.3}
                  name="Tickets"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{analytics.activeTickets}</div>
            <div className="text-sm text-green-200 font-medium">Active Tickets</div>
            <div className="text-xs text-gray-300 mt-1">
              {analytics.totalTickets > 0 ? Math.round((analytics.activeTickets / analytics.totalTickets) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">{analytics.usedTickets}</div>
            <div className="text-sm text-red-200 font-medium">Used Tickets</div>
            <div className="text-xs text-gray-300 mt-1">
              {analytics.totalTickets > 0 ? Math.round((analytics.usedTickets / analytics.totalTickets) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30 backdrop-blur-md">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-400 mb-2">{analytics.expiredTickets}</div>
            <div className="text-sm text-gray-200 font-medium">Expired Tickets</div>
            <div className="text-xs text-gray-300 mt-1">
              {analytics.totalTickets > 0 ? Math.round((analytics.expiredTickets / analytics.totalTickets) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
