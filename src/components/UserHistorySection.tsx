
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TicketGenerator from './TicketGenerator';
import { Receipt, Ticket, Heart, Download, Calendar, DollarSign } from 'lucide-react';

const UserHistorySection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  const fetchUserHistory = async () => {
    try {
      const [donationsRes, ticketsRes, paymentsRes] = await Promise.all([
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user?.id)
          .eq('type', 'donation')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tickets')
          .select(`
            *,
            services (name)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      setDonations(donationsRes.data || []);
      setTickets(ticketsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Error fetching user history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (payment: any) => {
    // Create a simple invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${payment.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
            .logo { width: 60px; height: 60px; margin: 0 auto 10px; background: #f97316; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
            .invoice-details { margin: 20px 0; }
            .amount { font-size: 24px; font-weight: bold; color: #f97316; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🕉</div>
            <h1>Sree Balaji Mandir</h1>
            <p>Invoice #${payment.id}</p>
          </div>
          <div class="invoice-details">
            <p><strong>Customer:</strong> ${payment.customer_name || 'N/A'}</p>
            <p><strong>Email:</strong> ${payment.customer_email || 'N/A'}</p>
            <p><strong>Type:</strong> ${payment.type}</p>
            <p><strong>Description:</strong> ${payment.description || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date(payment.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${payment.status}</p>
            <p class="amount"><strong>Amount:</strong> ₹${Number(payment.amount).toLocaleString()}</p>
          </div>
          <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for your contribution to Sree Balaji Mandir</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${payment.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        <p className="mt-2">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Your Activity History</h3>
        <p className="text-muted-foreground">View your donations, tickets, and invoices</p>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Donations ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Tickets ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            All Payments ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <div className="grid gap-4">
            {donations.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No donations yet</p>
                </CardContent>
              </Card>
            ) : (
              donations.map((donation: any) => (
                <Card key={donation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">₹{Number(donation.amount).toLocaleString()}</h4>
                        <p className="text-sm text-muted-foreground">{donation.description || 'General Donation'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(donation.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                          {donation.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(donation)}
                          className="mt-2 ml-2"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="grid gap-6">
            {tickets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tickets yet</p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket: any) => (
                <div key={ticket.id} className="space-y-4">
                  <TicketGenerator
                    ticket={{
                      ...ticket,
                      service_name: ticket.services?.name || 'Service'
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="grid gap-4">
            {payments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No payments yet</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment: any) => (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-lg">₹{Number(payment.amount).toLocaleString()}</h4>
                          <Badge variant="outline" className="capitalize">{payment.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.description || 'Payment'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(payment)}
                          className="mt-2 ml-2"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserHistorySection;
