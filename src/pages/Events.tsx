
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    members: 1,
  });

  const eventsData = {
    festivals: [
      {
        id: 1,
        name: 'Diwali Celebration',
        date: '2024-11-01',
        time: '6:00 PM',
        description: 'Grand celebration of the festival of lights with special puja and cultural programs.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        name: 'Holi Festival',
        date: '2024-03-13',
        time: '10:00 AM',
        description: 'Colorful celebration of spring with traditional rituals and community gathering.',
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      },
    ],
    daily: [
      {
        id: 3,
        name: 'Morning Aarti',
        date: 'Daily',
        time: '6:00 AM',
        description: 'Daily morning prayers and devotional songs to start the day with divine blessings.',
        image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        name: 'Evening Aarti',
        date: 'Daily',
        time: '7:00 PM',
        description: 'Evening prayers and aarti ceremony with lamp lighting and devotional music.',
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80',
      },
    ],
    special: [
      {
        id: 5,
        name: 'Spiritual Discourse',
        date: '2024-12-15',
        time: '4:00 PM',
        description: 'Special spiritual discourse by renowned saints and scholars.',
        image: 'https://images.unsplash.com/photo-1596740284477-64d3ce18308c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 6,
        name: 'Charity Drive',
        date: '2024-01-26',
        time: '10:00 AM',
        description: 'Community service and charity distribution to help the needy.',
        image: 'https://images.unsplash.com/photo-1548624313-24daa93c3be3?auto=format&fit=crop&w=800&q=80',
      },
    ],
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    toast({
      title: t('msg_registration_success'),
      description: 'You have been successfully registered for the event.',
    });
    setRegistrationData({ fullName: '', email: '', phone: '', members: 1 });
  };

  const EventCard = ({ event }: { event: any }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative h-48">
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-semibold">{event.name}</h3>
          <p className="text-sm opacity-90">{event.date} | {event.time}</p>
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full temple-gradient text-white hover:opacity-90">
              {t('register')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register for {event.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <Label htmlFor="fullName">{t('label_full_name')}</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{t('label_email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('label_phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="members">{t('label_members')}</Label>
                <Input
                  id="members"
                  type="number"
                  min="1"
                  value={registrationData.members}
                  onChange={(e) => setRegistrationData({ ...registrationData, members: parseInt(e.target.value) })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('events_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us in our spiritual journey through various festivals, rituals, and special events
          </p>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="festivals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="festivals">{t('cat_festivals')}</TabsTrigger>
            <TabsTrigger value="daily">{t('cat_daily')}</TabsTrigger>
            <TabsTrigger value="special">{t('cat_special')}</TabsTrigger>
          </TabsList>

          <TabsContent value="festivals">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsData.festivals.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventsData.daily.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="special">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsData.special.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
