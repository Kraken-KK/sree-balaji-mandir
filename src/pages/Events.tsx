
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { sendNotificationEmail } from '@/lib/email-service';

const Events = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    members: 1,
  });
  const [events, setEvents] = useState<Tables<'events'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) {
        toast({ title: 'Error', description: 'Failed to fetch events.' });
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };
    fetchEvents();
  }, [toast]);

  const handleRegistration = async (e: React.FormEvent, event: any) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    
    // Send event registration email
    await sendNotificationEmail(
      registrationData.email,
      registrationData.fullName,
      'event_registration',
      {
        eventName: event.name,
        eventDate: event.date,
        registrationMembers: registrationData.members
      }
    );
    
    toast({
      title: t('registrationSuccess'),
      description: 'You have been successfully registered for the event. Check your email for confirmation.',
    });
    setRegistrationData({ fullName: '', email: '', phone: '', members: 1 });
    setOpenDialogId(null);
  };

  const EventCard = ({ event, index }: { event: any; index: number }) => (
    <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
          Featured
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">{event.participants} participants expected</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-6 line-clamp-3">
          {event.description}
        </p>
        <Dialog open={openDialogId === event.id} onOpenChange={(open) => setOpenDialogId(open ? event.id : null)}>
          <DialogTrigger asChild>
            <Button className="w-full temple-gradient text-white hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              {t('register')}
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Register for {event.name}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => handleRegistration(e, event)} className="space-y-4">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="fullName">{t('fullName')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                  required
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  required
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  required
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <Label htmlFor="members">{t('members')}</Label>
                <Input
                  id="members"
                  type="number"
                  min="1"
                  value={registrationData.members}
                  onChange={(e) => setRegistrationData({ ...registrationData, members: parseInt(e.target.value) })}
                  required
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>
              <Button type="submit" className="w-full temple-gradient hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                {t('submit')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Animated Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4 animate-bounce">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-slide-up">
            {t('eventsTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Join us in our spiritual journey through various festivals, rituals, and special events
          </p>
        </div>

        {/* Animated Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-8 bg-surface-light dark:bg-surface-dark animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <TabsTrigger value="all" className="transition-all duration-300 hover:scale-105">{t('allEvents') || 'All Events'}</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {loading ? (
              <div className="text-center py-12">Loading events...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
