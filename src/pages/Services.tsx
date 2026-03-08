import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Clock, Tag, LogIn, Calendar, Sparkles } from 'lucide-react';
import { sendNotificationEmail } from '@/lib/email-service';

const Services = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceDate, setServiceDate] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setServices(data || []);
      } catch {
        toast({ title: "Error", description: "Failed to fetch services.", variant: "destructive" });
      } finally { setLoading(false); }
    })();
  }, []);

  const handleBookService = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!serviceDate) { toast({ title: 'Date Required', description: 'Please select a date.', variant: 'destructive' }); return; }
    setPaymentLoading(selectedService.id);
    try {
      const qrData = `TICKET:${selectedService.id}:${user.id}:${Date.now()}`;
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: { amount: Number(selectedService.price), currency: 'inr', description: selectedService.name, customerEmail: user.email, customerName: user.user_metadata?.full_name || 'User', type: 'service' }
      });
      if (paymentError) throw paymentError;
      const { data: ticketNumberData, error: ticketNumberError } = await supabase.rpc('generate_ticket_number');
      if (ticketNumberError) throw ticketNumberError;
      await supabase.from('tickets').insert({ user_id: user.id, service_id: selectedService.id, customer_name: user.user_metadata?.full_name || user.email?.split('@')[0], customer_email: user.email!, qr_code: qrData, ticket_number: ticketNumberData, service_date: serviceDate }).select().single();
      await sendNotificationEmail(user.email!, user.user_metadata?.full_name || user.email!.split('@')[0], 'service_booking', { serviceName: selectedService.name, servicePrice: Number(selectedService.price), ticketNumber: ticketNumberData, serviceDate });
      window.open(paymentData.url, '_blank');
      toast({ title: 'Redirecting to Payment', description: 'Check your email for confirmation.' });
      setServiceDate(''); setSelectedService(null);
    } catch { toast({ title: 'Booking Error', description: 'Failed to book. Please try again.', variant: 'destructive' }); }
    finally { setPaymentLoading(null); }
  };

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-devotional">{t('services_title') || 'Temple Services'}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('services_subtitle') || 'Book sacred services and pujas for divine blessings'}</p>
          {!user && (
            <div className="glass-card max-w-sm mx-auto mt-8 p-6 text-center">
              <LogIn className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-display font-semibold mb-2">Sign In Required</h3>
              <p className="text-sm text-muted-foreground mb-4">Sign in to book services and receive confirmations</p>
              <Button onClick={() => navigate('/auth')} className="gradient-devotional text-white border-0 rounded-xl">Sign In</Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <div key={i} className="glass-card h-72 loading-shimmer" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={service.id} className="glass-card p-6 group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-display font-semibold text-foreground">{service.name}</h3>
                  <Badge className="gradient-saffron text-white border-0 text-base font-bold px-3 py-1">₹{Number(service.price).toLocaleString()}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                  {service.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>}
                  {service.category && <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {service.category}</span>}
                </div>
                <Dialog open={selectedService?.id === service.id} onOpenChange={(open) => !open && setSelectedService(null)}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedService(service)} disabled={!user} className="w-full gradient-devotional text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all">
                      <CreditCard className="w-4 h-4 mr-2" /> Book – ₹{Number(service.price).toLocaleString()}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass rounded-3xl border-0">
                    <DialogHeader><DialogTitle className="font-display flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Book {service.name}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label>Select Date</Label><Input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="rounded-xl" /></div>
                      <div className="glass rounded-xl p-4 text-sm space-y-1">
                        <p><strong>Name:</strong> {service.name}</p>
                        <p><strong>Price:</strong> ₹{Number(service.price).toLocaleString()}</p>
                        {service.duration && <p><strong>Duration:</strong> {service.duration}</p>}
                      </div>
                      <Button onClick={handleBookService} disabled={paymentLoading === service.id || !serviceDate} className="w-full gradient-devotional text-white border-0 rounded-xl">
                        {paymentLoading === service.id ? 'Processing...' : 'Confirm & Pay'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-muted flex items-center justify-center"><Sparkles className="w-10 h-10 text-muted-foreground" /></div>
            <h3 className="text-xl font-display font-semibold mb-2">No Services Available</h3>
            <p className="text-muted-foreground">Services are being updated. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
