
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { CreditCard } from 'lucide-react';

const Services = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState({
    name: '',
    mobile: '',
    quantity: 1,
    service: '',
  });
  const [services, setServices] = useState<Tables<'services'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').order('name', { ascending: true });
      if (error) {
        toast({ title: 'Error', description: 'Failed to fetch services.' });
      } else {
        setServices(data || []);
      }
      setLoading(false);
    };
    fetchServices();
  }, [toast]);

  const handlePayment = async (service: Tables<'services'>) => {
    if (!bookingData.name || !bookingData.mobile) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setPaymentLoading(true);
    try {
      const totalAmount = (service.price || 0) * bookingData.quantity;
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: totalAmount,
          currency: 'usd',
          description: service.name,
          customerEmail: `${bookingData.name.replace(/\s+/g, '').toLowerCase()}@temp.com`,
          customerName: bookingData.name,
          type: 'service'
        }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: 'Redirecting to Payment',
        description: 'Please complete your payment in the new window.',
      });
      
      setBookingData({ name: '', mobile: '', quantity: 1, service: '' });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to create payment session. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our various spiritual services and book them for your special occasions
          </p>
        </div>

        {/* Services Accordion */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">Loading services...</div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {services.map((service) => (
                <AccordionItem key={service.id} value={`service-${service.id}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex justify-between items-center w-full mr-4">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <span className="text-primary font-medium">₹{service.price}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Duration: {service.duration}
                        </span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="temple-gradient text-white hover:opacity-90"
                              onClick={() => setBookingData({ ...bookingData, service: service.name })}
                            >
                              {t('book_ticket')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white">
                            <DialogHeader>
                              <DialogTitle>Book {service.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="name">{t('label_name')}</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  value={bookingData.name}
                                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="mobile">{t('label_mobile')}</Label>
                                <Input
                                  id="mobile"
                                  type="tel"
                                  value={bookingData.mobile}
                                  onChange={(e) => setBookingData({ ...bookingData, mobile: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="quantity">{t('label_tickets')}</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  min="1"
                                  value={bookingData.quantity}
                                  onChange={(e) => setBookingData({ ...bookingData, quantity: parseInt(e.target.value) })}
                                  required
                                />
                              </div>
                              
                              <div className="pt-4 border-t">
                                <div className="flex justify-between items-center mb-4">
                                  <span className="text-lg font-medium">Total Amount:</span>
                                  <span className="text-xl font-bold text-primary">
                                    ₹{((service.price || 0) * bookingData.quantity).toFixed(2)}
                                  </span>
                                </div>
                                
                                <Button 
                                  onClick={() => handlePayment(service)} 
                                  className="w-full temple-gradient text-white"
                                  disabled={paymentLoading}
                                >
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  {paymentLoading ? 'Processing...' : 'Pay with Stripe'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
              <CardDescription>
                Please read the following guidelines before booking our services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• All bookings must be made at least 24 hours in advance</li>
                <li>• Please arrive 15 minutes before your scheduled time</li>
                <li>• Dress code: Traditional or modest clothing required</li>
                <li>• For cancellations, please contact us at least 12 hours before</li>
                <li>• Photography and videography require special permission</li>
                <li>• Mobile phones should be kept in silent mode during ceremonies</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
