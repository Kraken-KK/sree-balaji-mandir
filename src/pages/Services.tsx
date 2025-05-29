
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState({
    name: '',
    mobile: '',
    quantity: 1,
    service: '',
  });

  const services = [
    {
      id: 1,
      serviceName: 'Special Puja Booking',
      description: 'Book special pujas for various occasions including Satyanarayana Puja, Ganesh Puja, and other religious ceremonies. Our experienced priests will conduct the rituals according to traditional practices.',
      price: '₹500 - ₹5000',
      duration: '1-3 hours',
    },
    {
      id: 2,
      serviceName: 'Annadanam (Food Service)',
      description: 'Participate in our daily food service program. Sponsor meals for devotees and contribute to this noble cause of feeding the community.',
      price: '₹100 per person',
      duration: 'Daily at 12:00 PM',
    },
    {
      id: 3,
      serviceName: 'Archana Service',
      description: 'Special archana service with name chanting and offering of flowers to the deity. Available for personal prayers and special occasions.',
      price: '₹50 - ₹200',
      duration: '15-30 minutes',
    },
    {
      id: 4,
      serviceName: 'Wedding Ceremonies',
      description: 'Complete wedding ceremony arrangements in the temple premises with all traditional rituals and customs.',
      price: '₹10,000 - ₹50,000',
      duration: '3-6 hours',
    },
    {
      id: 5,
      serviceName: 'Hawan/Homa Service',
      description: 'Sacred fire ceremonies for purification, prosperity, and spiritual upliftment. Various types of homas available.',
      price: '₹1000 - ₹10,000',
      duration: '1-2 hours',
    },
  ];

  const handleBooking = (service: string) => {
    console.log('Booking for service:', service, bookingData);
    toast({
      title: t('msg_booking_success'),
      description: `Your booking for ${service} has been confirmed.`,
    });
    setBookingData({ name: '', mobile: '', quantity: 1, service: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('services_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our various spiritual services and book them for your special occasions
          </p>
        </div>

        {/* Services Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {services.map((service) => (
              <AccordionItem key={service.id} value={`service-${service.id}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex justify-between items-center w-full mr-4">
                    <h3 className="text-lg font-semibold">{service.serviceName}</h3>
                    <span className="text-primary font-medium">{service.price}</span>
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
                            onClick={() => setBookingData({ ...bookingData, service: service.serviceName })}
                          >
                            {t('book_ticket')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book {service.serviceName}</DialogTitle>
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
                            
                            <div className="space-y-3">
                              <Label>Payment Method</Label>
                              <RadioGroup defaultValue="upi">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="upi" id="upi" />
                                  <Label htmlFor="upi">UPI Payment</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="qr" id="qr" />
                                  <Label htmlFor="qr">QR Code Payment</Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <Button 
                              onClick={() => handleBooking(service.serviceName)} 
                              className="w-full temple-gradient text-white"
                            >
                              Confirm & Pay
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
