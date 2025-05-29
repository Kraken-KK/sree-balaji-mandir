
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
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

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
        location: 'Main Temple Hall',
        participants: 500,
        description: 'Grand celebration of the festival of lights with special puja and cultural programs.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 2,
        name: 'Holi Festival',
        date: '2024-03-13',
        time: '10:00 AM',
        location: 'Temple Courtyard',
        participants: 800,
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
        location: 'Sanctum Sanctorum',
        participants: 150,
        description: 'Daily morning prayers and devotional songs to start the day with divine blessings.',
        image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 4,
        name: 'Evening Aarti',
        date: 'Daily',
        time: '7:00 PM',
        location: 'Sanctum Sanctorum',
        participants: 200,
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
        location: 'Conference Hall',
        participants: 300,
        description: 'Special spiritual discourse by renowned saints and scholars.',
        image: 'https://images.unsplash.com/photo-1596740284477-64d3ce18308c?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 6,
        name: 'Charity Drive',
        date: '2024-01-26',
        time: '10:00 AM',
        location: 'Temple Premises',
        participants: 400,
        description: 'Community service and charity distribution to help the needy.',
        image: 'https://images.unsplash.com/photo-1548624313-24daa93c3be3?auto=format&fit=crop&w=800&q=80',
      },
    ],
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registration submitted:', registrationData);
    toast({
      title: t('registrationSuccess'),
      description: 'You have been successfully registered for the event.',
    });
    setRegistrationData({ fullName: '', email: '', phone: '', members: 1 });
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
        <Dialog>
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
            <form onSubmit={handleRegistration} className="space-y-4">
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
        <Tabs defaultValue="festivals" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-surface-light dark:bg-surface-dark animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <TabsTrigger value="festivals" className="transition-all duration-300 hover:scale-105">{t('festivals')}</TabsTrigger>
            <TabsTrigger value="daily" className="transition-all duration-300 hover:scale-105">{t('daily')}</TabsTrigger>
            <TabsTrigger value="special" className="transition-all duration-300 hover:scale-105">{t('special')}</TabsTrigger>
          </TabsList>

          <TabsContent value="festivals">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsData.festivals.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {eventsData.daily.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="special">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsData.special.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
