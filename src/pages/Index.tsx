
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Image, Heart, Users, Award } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('devotees'), value: '1.2M', icon: Users },
    { label: t('eventsCount'), value: '350+', icon: Calendar },
    { label: t('donationsAmount'), value: '₹5Cr+', icon: Heart },
    { label: t('liveVisitors'), value: '4,200', icon: Sparkles },
  ];

  const features = [
    {
      title: t('gallery'),
      description: 'Explore beautiful images and videos of our temple ceremonies and festivals',
      link: '/gallery',
      gradient: 'from-orange-400 to-red-500',
      icon: Image,
    },
    {
      title: t('events'),
      description: 'Join us for festivals, daily rituals, and special spiritual events',
      link: '/events',
      gradient: 'from-blue-400 to-purple-500',
      icon: Calendar,
    },
    {
      title: t('services'),
      description: 'Book various temple services and make donations to support our activities',
      link: '/services',
      gradient: 'from-green-400 to-blue-500',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Animated Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-ken-burns"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1509002464246-2fa0b23bb7f1?auto=format&fit=crop&w=2000&q=80")',
          }}
        />
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-4 animate-fade-in">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-6 animate-pulse">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
            {t('welcomeTitle')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 font-light opacity-90 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {t('welcomeSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link to="/events">
              <Button size="lg" className="temple-gradient hover:scale-110 transition-all duration-300 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-3xl group">
                <Calendar className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                {t('viewEvents')}
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg hover:scale-110 group">
                <Award className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                {t('templeHistory')}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center group hover:border-primary transition-colors cursor-pointer">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse group-hover:bg-primary transition-colors" />
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-accent rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Our Divine Community</h2>
            <p className="text-muted-foreground">Numbers that reflect our spiritual impact</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:scale-110 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl animate-slide-up group" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Preview */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Explore Our Temple</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the divine beauty, participate in sacred events, and be part of our spiritual community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-3 animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`h-48 bg-gradient-to-br ${feature.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M0 0h100v100H0z" fill="none"/%3E%3Cpath d="M20 20h60v60H20z" fill="rgba(255,255,255,0.1)"/%3E%3C/svg%3E')] opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:scale-105 transition-transform">{feature.title}</h3>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {feature.description}
                  </p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300 hover:scale-105">
                      Explore Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-secondary text-white py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cpath d="M10 10h80v80H10z" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/%3E%3C/svg%3E')] bg-repeat" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full temple-gradient flex items-center justify-center">
                  <span className="text-white font-bold">ॐ</span>
                </div>
                <h3 className="text-xl font-semibold">Sri Balaji Temple</h3>
              </div>
              <p className="text-gray-300 mb-4">
                A sacred place of worship and spiritual enlightenment for all devotees.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 bg-white/10 rounded-full hover:bg-primary transition-colors cursor-pointer" />
                ))}
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                {['Events', 'Services', 'Donations', 'History'].map((link) => (
                  <Link key={link} to={`/${link.toLowerCase()}`} className="block text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <div className="text-gray-300 space-y-2">
                <p className="hover:text-white transition-colors">Temple Address, City</p>
                <p className="hover:text-white transition-colors">Phone: +91 98765 43210</p>
                <p className="hover:text-white transition-colors">Email: info@sribalajiTemple.org</p>
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-300 mb-4">Subscribe for temple updates</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
                />
                <Button className="temple-gradient hover:scale-105 transition-transform">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <p>&copy; 2024 Sri Balaji Temple. All rights reserved. Made with ❤️ for our devotees.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
