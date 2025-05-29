
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('stat_devotees'), value: '1.2M' },
    { label: t('stat_events'), value: '350+' },
    { label: t('stat_donations'), value: '₹5Cr+' },
    { label: t('stat_live_visitors'), value: '4,200' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1509002464246-2fa0b23bb7f1?auto=format&fit=crop&w=2000&q=80")',
          }}
        />
        
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
          <h1 className="text-hero font-bold mb-6 leading-tight">
            {t('welcome_title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
            {t('welcome_subtitle')}
          </p>
          <Link to="/events">
            <Button size="lg" className="temple-gradient hover:scale-105 transition-transform text-white px-8 py-4 text-lg">
              {t('view_events')}
            </Button>
          </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:scale-105 transition-transform duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Our Temple</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the divine beauty, participate in sacred events, and be part of our spiritual community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{t('gallery')}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Explore beautiful images and videos of our temple ceremonies and festivals
                </p>
                <Link to="/gallery">
                  <Button variant="outline" className="w-full">
                    View Gallery
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{t('events')}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Join us for festivals, daily rituals, and special spiritual events
                </p>
                <Link to="/events">
                  <Button variant="outline" className="w-full">
                    View Events
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-48 temple-gradient relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{t('services')}</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Book various temple services and make donations to support our activities
                </p>
                <Link to="/services">
                  <Button variant="outline" className="w-full">
                    View Services
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Sri Balaji Temple</h3>
              <p className="text-gray-300">
                A sacred place of worship and spiritual enlightenment for all devotees.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/events" className="block text-gray-300 hover:text-white transition-colors">
                  Events
                </Link>
                <Link to="/services" className="block text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
                <Link to="/donations" className="block text-gray-300 hover:text-white transition-colors">
                  Donations
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <div className="text-gray-300">
                <p>Temple Address, City</p>
                <p>Phone: +91 98765 43210</p>
                <p>Email: info@sribalajiTemple.org</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Sri Balaji Temple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
