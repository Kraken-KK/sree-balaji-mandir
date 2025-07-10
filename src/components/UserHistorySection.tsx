
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TicketGenerator from './TicketGenerator';
import QRCode from 'qrcode';
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

  const downloadInvoice = async (payment: any, ticket?: any) => {
    let qrCodeDataUrl = '';
    
    // Generate QR code if it's a ticket
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

    // Create professional invoice HTML
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
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
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
            .invoice-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
            }
            .detail-section h3 {
              color: #f97316;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 15px;
              border-bottom: 2px solid #f97316;
              padding-bottom: 5px;
            }
            .detail-item {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #f1f1f1;
            }
            .detail-label {
              font-weight: 500;
              color: #666;
            }
            .detail-value {
              font-weight: 600;
              color: #333;
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
            .amount-label {
              color: #666;
              text-transform: uppercase;
              letter-spacing: 1px;
              font-size: 12px;
            }
            .qr-section {
              text-align: center;
              margin: 30px 0;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 10px;
              border: 2px dashed #f97316;
            }
            .qr-code {
              margin: 15px auto;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .footer {
              background: #f8f9fa;
              padding: 25px;
              text-align: center;
              border-top: 3px solid #f97316;
              margin-top: 40px;
            }
            .footer h4 {
              color: #f97316;
              margin-bottom: 10px;
              font-size: 18px;
            }
            .footer p {
              color: #666;
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
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .status-completed {
              background: #d4edda;
              color: #155724;
              border: 1px solid #c3e6cb;
            }
            .status-pending {
              background: #fff3cd;
              color: #856404;
              border: 1px solid #ffeaa7;
            }
            ${ticket ? `
              .ticket-info {
                background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #2196f3;
              }
              .ticket-number {
                font-family: 'Courier New', monospace;
                font-size: 20px;
                font-weight: bold;
                color: #1976d2;
                margin-bottom: 10px;
              }
            ` : ''}
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
              <div class="invoice-details">
                <div class="detail-section">
                  <h3>Customer Information</h3>
                  <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${payment.customer_name || 'N/A'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${payment.customer_email || 'N/A'}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Transaction Date:</span>
                    <span class="detail-value">${new Date(payment.created_at).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>

                <div class="detail-section">
                  <h3>Payment Details</h3>
                  <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge status-${payment.status}">${payment.status}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Currency:</span>
                    <span class="detail-value">${payment.currency.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              ${ticket ? `
                <div class="ticket-info">
                  <h3 style="color: #1976d2; margin-bottom: 15px; font-size: 18px;">🎫 Service Ticket Information</h3>
                  <div class="ticket-number">Ticket: ${ticket.ticket_number}</div>
                  <div style="margin-bottom: 8px;"><strong>Service:</strong> ${ticket.services?.name || 'Service'}</div>
                  <div style="margin-bottom: 8px;"><strong>Service Date:</strong> ${ticket.service_date ? new Date(ticket.service_date).toLocaleDateString('en-IN') : 'To be scheduled'}</div>
                  <div><strong>Status:</strong> <span class="status-badge status-${ticket.status}">${ticket.status}</span></div>
                </div>
              ` : ''}

              <div class="detail-item" style="margin: 20px 0; padding: 15px 0; border-top: 2px solid #f97316; border-bottom: 2px solid #f97316;">
                <span class="detail-label" style="font-size: 16px;">Description:</span>
                <span class="detail-value" style="font-size: 16px;">${payment.description || 'Payment to Sree Balaji Mandir'}</span>
              </div>

              <div class="amount-section">
                <div class="amount">₹${Number(payment.amount).toLocaleString('en-IN')}</div>
                <div class="amount-label">Total Amount</div>
              </div>

              ${qrCodeDataUrl ? `
                <div class="qr-section">
                  <h4 style="color: #f97316; margin-bottom: 10px;">🔍 Scan to Verify Ticket</h4>
                  <img src="${qrCodeDataUrl}" alt="Ticket QR Code" class="qr-code" />
                  <p style="color: #666; font-size: 14px; margin-top: 10px;">Present this QR code for service verification</p>
                </div>
              ` : ''}
            </div>

            <div class="footer">
              <h4>🏛️ Sree Balaji Mandir</h4>
              <p>Sacred Space of Devotion and Community</p>
              <p>Preserving Traditions • Embracing Innovation</p>
              <p style="margin-top: 15px; font-size: 12px; color: #888;">
                This is a computer-generated ${ticket ? 'ticket and invoice' : 'invoice'} and does not require a physical signature.
              </p>
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
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        <p className="mt-2">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
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
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No donations yet</p>
                </CardContent>
              </Card>
            ) : (
              donations.map((donation: any) => (
                <Card key={donation.id} className="hover:shadow-md transition-all duration-300 hover-lift animate-fade-in">
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
                          className="mt-2 ml-2 hover-scale"
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
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tickets yet</p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket: any) => {
                const relatedPayment = payments.find(p => p.type === 'service');
                return (
                  <div key={ticket.id} className="space-y-4 animate-fade-in">
                    <TicketGenerator
                      ticket={{
                        ...ticket,
                        service_name: ticket.services?.name || 'Service'
                      }}
                    />
                    {relatedPayment && (
                      <div className="text-center">
                        <Button
                          variant="outline"
                          onClick={() => downloadInvoice(relatedPayment, ticket)}
                          className="hover-scale"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Ticket Invoice
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="grid gap-4">
            {payments.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No payments yet</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment: any) => {
                const relatedTicket = payment.type === 'service' 
                  ? tickets.find(t => t.customer_email === payment.customer_email)
                  : null;
                
                return (
                  <Card key={payment.id} className="hover:shadow-md transition-all duration-300 hover-lift animate-fade-in">
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
                            onClick={() => downloadInvoice(payment, relatedTicket)}
                            className="mt-2 ml-2 hover-scale"
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
