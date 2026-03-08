import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, MapPin, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { sendNotificationEmail } from '@/lib/email-service';

interface EventType {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string | null;
  image: string | null;
  participants: number | null;
  created_at: string;
  updated_at: string;
}

const Events = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState({ fullName: '', email: '', phone: '', members: 1 });
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
      if (error) toast({ title: 'Error', description: 'Failed to fetch events.' });
      else setEvents(data || []);
      setLoading(false);
    };
    fetchEvents();
  }, [toast]);

  const handleRegistration = async (e: React.FormEvent, event: EventType) => {
    e.preventDefault();
    await sendNotificationEmail(registrationData.email, registrationData.fullName, 'event_registration', {
      eventName: event.name, eventDate: event.date, registrationMembers: registrationData.members
    });
    toast({ title: t('registrationSuccess'), description: 'Check your email for confirmation.' });
    setRegistrationData({ fullName: '', email: '', phone: '', members: 1 });
    setOpenDialogId(null);
  };

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-devotional">
            {t('eventsTitle')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in our spiritual journey through festivals, rituals, and sacred celebrations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card h-[420px] loading-shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-muted flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No Events Yet</h3>
            <p className="text-muted-foreground">Check back soon for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={event.id} className="glass-card overflow-hidden group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-52 overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full gradient-devotional" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-display font-semibold mb-2">{event.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.location}</div>
                    {event.participants && <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {event.participants} expected</div>}
                  </div>
                  {event.description && <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{event.description}</p>}
                  
                  <Dialog open={openDialogId === event.id} onOpenChange={(open) => setOpenDialogId(open ? event.id : null)}>
                    <DialogTrigger asChild>
                      <Button className="w-full gradient-devotional text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        {t('register')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass rounded-3xl border-0">
                      <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" /> Register for {event.name}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => handleRegistration(e, event)} className="space-y-4">
                        {[
                          { id: 'fullName', label: t('fullName'), type: 'text', key: 'fullName' as const },
                          { id: 'email', label: t('email'), type: 'email', key: 'email' as const },
                          { id: 'phone', label: t('phone'), type: 'tel', key: 'phone' as const },
                        ].map((field) => (
                          <div key={field.id}>
                            <Label htmlFor={field.id}>{field.label}</Label>
                            <Input id={field.id} type={field.type} value={registrationData[field.key]} onChange={(e) => setRegistrationData({ ...registrationData, [field.key]: e.target.value })} required className="rounded-xl" />
                          </div>
                        ))}
                        <div>
                          <Label htmlFor="members">{t('members')}</Label>
                          <Input id="members" type="number" min="1" value={registrationData.members} onChange={(e) => setRegistrationData({ ...registrationData, members: parseInt(e.target.value) })} required className="rounded-xl" />
                        </div>
                        <Button type="submit" className="w-full gradient-devotional text-white border-0 rounded-xl">{t('submit')}</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
