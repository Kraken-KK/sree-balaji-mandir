
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Clock, Tag, LogIn, Calendar } from 'lucide-react';
import { sendNotificationEmail } from '@/lib/email-service';

const Services = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceDate, setServiceDate] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to book services.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!serviceDate) {
      toast({
        title: 'Date Required',
        description: 'Please select a service date.',
        variant: 'destructive'
      });
      return;
    }

    setPaymentLoading(selectedService.id);
    try {
      // Generate QR code data
      const qrData = `TICKET:${selectedService.id}:${user.id}:${Date.now()}`;
      
      // Create payment first
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: Number(selectedService.price),
          currency: 'inr',
          description: selectedService.name,
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || 'User',
          type: 'service'
        }
      });

      if (paymentError) throw paymentError;

      // Generate ticket number using the database function
      const { data: ticketNumberData, error: ticketNumberError } = await supabase
        .rpc('generate_ticket_number');

      if (ticketNumberError) throw ticketNumberError;

      // Create ticket after successful payment creation
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          service_id: selectedService.id,
          customer_name: user.user_metadata?.full_name || user.email.split('@')[0],
          customer_email: user.email,
          qr_code: qrData,
          ticket_number: ticketNumberData,
          service_date: serviceDate
        })
        .select()
        .single();

      if (ticketError) {
        console.error('Ticket creation error:', ticketError);
        // Continue with payment even if ticket creation fails
      }

      // Send booking confirmation email
      await sendNotificationEmail(
        user.email,
        user.user_metadata?.full_name || user.email.split('@')[0],
        'service_booking',
        {
          serviceName: selectedService.name,
          servicePrice: Number(selectedService.price),
          ticketNumber: ticketNumberData,
          serviceDate: serviceDate
        }
      );

      // Open Stripe checkout in a new tab
      window.open(paymentData.url, '_blank');
      
      toast({
        title: 'Redirecting to Payment',
        description: 'Your ticket will be generated after successful payment. Check your email for confirmation.',
      });

      // Reset and close dialog
      setServiceDate('');
      setSelectedService(null);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking Error',
        description: 'Failed to book service. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setPaymentLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading services...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('services_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('services_subtitle')}
          </p>
          {!user && (
            <Card className="mt-6 max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Sign In Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to book services and receive confirmations
                </p>
                <Button onClick={() => navigate('/auth')} className="temple-gradient text-white">
                  Sign In Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow hover-lift">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <Badge variant="secondary" className="text-lg font-bold">
                    ₹{Number(service.price).toLocaleString()}
                  </Badge>
                </div>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                  {service.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span>{service.category}</span>
                    </div>
                  )}
                </div>
                
                <Dialog open={selectedService?.id === service.id} onOpenChange={(open) => !open && setSelectedService(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setSelectedService(service)}
                      className="w-full temple-gradient text-white text-lg py-6"
                      disabled={!user}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Book Service - ₹{Number(service.price).toLocaleString()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Book {service.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="serviceDate">Select Service Date</Label>
                        <Input
                          id="serviceDate"
                          type="date"
                          value={serviceDate}
                          onChange={(e) => setServiceDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Service Details:</h4>
                        <p><strong>Name:</strong> {service.name}</p>
                        <p><strong>Price:</strong> ₹{Number(service.price).toLocaleString()}</p>
                        {service.duration && <p><strong>Duration:</strong> {service.duration}</p>}
                        <p><strong>Description:</strong> {service.description}</p>
                      </div>
                      <Button 
                        onClick={handleBookService}
                        disabled={paymentLoading === service.id || !serviceDate}
                        className="w-full temple-gradient text-white"
                      >
                        {paymentLoading === service.id ? 'Processing...' : 'Confirm Booking & Pay'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No Services Available</h3>
            <p className="text-muted-foreground">
              Services are being updated. Please check back later.
            </p>
          </div>
        )}

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Select your preferred service date</p>
              <p>✓ Secure online payment</p>
              <p>✓ Instant booking confirmation</p>
              <p>✓ Email and SMS notifications</p>
              <p>✓ Digital receipt generation</p>
              <p>✓ Customer support available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Stripe secure payment gateway</p>
              <p>✓ 256-bit SSL encryption</p>
              <p>✓ PCI DSS compliant</p>
              <p>✓ Multiple payment methods</p>
              <p>✓ Refund protection policy</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
