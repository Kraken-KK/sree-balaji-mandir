import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FlippableTicketCard from './FlippableTicketCard';
import QRCode from 'qrcode';
import { Receipt, Ticket, Heart, Download, Calendar, DollarSign, Loader2 } from 'lucide-react';

const UserHistorySection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  // Listen for real-time ticket updates
  useEffect(() => {
    const handleTicketCancellation = () => {
      setRefreshing(true);
      fetchUserHistory();
    };

    window.addEventListener('ticketCancelled', handleTicketCancellation);
    
    // Setup real-time subscription for tickets
    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tickets',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchUserHistory();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('ticketCancelled', handleTicketCancellation);
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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
      setRefreshing(false);
    }
  };

  const downloadInvoice = async (payment: any, ticket?: any) => {
    let qrCodeDataUrl = '';
    
    if (ticket && ticket.qr_code) {
      try {
        qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_code, {
          width: 150,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${payment.id}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background: #f8f9fa;
              padding: 20px;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
              color: white;
              padding: 30px;
              text-align: center;
              position: relative;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 15px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 36px;
              position: relative;
              z-index: 1;
            }
            .temple-name {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 5px;
              position: relative;
              z-index: 1;
            }
            .invoice-title {
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .content {
              padding: 40px;
            }
            .amount-section {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 10px;
              padding: 25px;
              margin: 30px 0;
              text-align: center;
              border: 2px solid #f97316;
            }
            .amount {
              font-size: 36px;
              font-weight: bold;
              color: #f97316;
              margin-bottom: 5px;
            }
            .thank-you {
              background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 18px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="logo">🕉</div>
              <div class="temple-name">Sree Balaji Mandir</div>
              <div class="invoice-title">${ticket ? 'Service Ticket & Invoice' : 'Payment Invoice'} #${payment.id.substring(0, 8)}</div>
            </div>
            <div class="content">
              <div class="amount-section">
                <div class="amount">₹${Number(payment.amount).toLocaleString('en-IN')}</div>
              </div>
              ${qrCodeDataUrl ? `<div style="text-align: center; margin: 30px 0;"><img src="${qrCodeDataUrl}" alt="QR Code" style="border-radius: 8px;" /></div>` : ''}
            </div>
            <div class="thank-you">
              Thank you for your contribution to our sacred temple community! 🙏
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticket ? 'ticket-invoice' : 'invoice'}-${payment.id.substring(0, 8)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded",
      description: `Professional ${ticket ? 'ticket and invoice' : 'invoice'} downloaded successfully.`,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="inline-block h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-muted-foreground">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <h3 className="text-2xl font-bold text-foreground dark:text-white">Your Activity History</h3>
          {refreshing && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
        </div>
        <p className="text-muted-foreground dark:text-gray-300">View your donations, tickets, and invoices</p>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted dark:bg-gray-700">
          <TabsTrigger value="tickets" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Ticket className="w-4 h-4" />
            <span className="hidden sm:inline">Tickets</span> ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Donations</span> ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span> ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="animate-fade-in bg-card dark:bg-gray-800">
              <CardContent className="text-center py-8">
                <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground dark:text-gray-300">No tickets yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket: any) => (
                <div key={ticket.id} className="animate-slide-up">
                  <FlippableTicketCard
                    ticket={{
                      ...ticket,
                      service_name: ticket.services?.name || 'Service'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="donations">
          <div className="grid gap-4">
            {donations.length === 0 ? (
              <Card className="animate-fade-in bg-card dark:bg-gray-800">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground dark:text-gray-300">No donations yet</p>
                </CardContent>
              </Card>
            ) : (
              donations.map((donation: any) => (
                <Card key={donation.id} className="hover:shadow-md transition-all duration-300 animate-fade-in bg-card dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg text-foreground dark:text-white">₹{Number(donation.amount).toLocaleString()}</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-300">{donation.description || 'General Donation'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground dark:text-gray-300">{new Date(donation.created_at).toLocaleDateString()}</span>
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
                          className="mt-2 ml-2 hover:scale-105 transition-transform duration-200"
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

        <TabsContent value="invoices">
          <div className="grid gap-4">
            {payments.length === 0 ? (
              <Card className="animate-fade-in bg-card dark:bg-gray-800">
                <CardContent className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground dark:text-gray-300">No payments yet</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment: any) => {
                const relatedTicket = payment.type === 'service' 
                  ? tickets.find(t => t.customer_email === payment.customer_email)
                  : null;
                
                return (
                  <Card key={payment.id} className="hover:shadow-md transition-all duration-300 animate-fade-in bg-card dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-lg text-foreground dark:text-white">₹{Number(payment.amount).toLocaleString()}</h4>
                            <Badge variant="outline" className="capitalize">{payment.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-gray-300">{payment.description || 'Payment'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground dark:text-gray-300">{new Date(payment.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(payment, relatedTicket)}
                            className="mt-2 ml-2 hover:scale-105 transition-transform duration-200"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserHistorySection;
