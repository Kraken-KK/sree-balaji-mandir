import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Calendar, Image, Heart, Users, Award, Flame, ArrowRight } from 'lucide-react';
import NewsletterSubscription from '@/components/NewsletterSubscription';

const Index = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('devotees'), value: '10k+', icon: Users },
    { label: t('eventsCount'), value: '500+', icon: Calendar },
    { label: t('donationsAmount'), value: '₹10L+', icon: Heart },
    { label: t('liveVisitors'), value: '100', icon: Sparkles },
  ];

  const features = [
    {
      title: t('gallery'),
      description: 'Explore sacred images and divine moments captured in our temple ceremonies and festivals.',
      link: '/gallery',
      icon: Image,
    },
    {
      title: t('events'),
      description: 'Join us for festivals, daily rituals, and special spiritual events throughout the year.',
      link: '/events',
      icon: Calendar,
    },
    {
      title: t('services'),
      description: 'Book temple services, pujas, and make offerings to support our sacred activities.',
      link: '/services',
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-liquid-morph" />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-liquid-morph" style={{ animationDelay: '4s' }} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: 'url("https://wallpapers.com/images/featured/lord-venkateswara-ju1irfhiq1xd07jr.jpg")',
            opacity: 0.2,
          }}
        />

        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-4 animate-fade-in">
          <div className="mb-[-4rem]">
            <img
              src="https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275"
              alt="Sri Balaji Temple"
              className="w-64 h-64 object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight bg-gradient-to-r from-white via-amber-100 to-orange-200 bg-clip-text text-transparent">
            {t('welcomeTitle')}
          </h1>
          <p className="text-lg md:text-xl mb-10 font-light text-white/80 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('welcomeSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/events">
              <Button size="lg" className="gradient-devotional text-white border-0 rounded-2xl px-8 py-5 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
                <Calendar className="mr-2 w-5 h-5" /> {t('viewEvents')}
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-2xl px-8 py-5 text-lg backdrop-blur-sm transition-all duration-300">
                <Award className="mr-2 w-5 h-5" /> {t('templeHistory')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in">
            <h2 className="text-3xl font-display font-bold mb-3 text-foreground">Our Divine Community</h2>
            <p className="text-muted-foreground">Numbers that reflect our spiritual impact</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 md:p-8 text-center group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-4 text-gradient-devotional">Explore Our Temple</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover divine beauty, participate in sacred events, and be part of our spiritual community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="glass-card overflow-hidden group animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="h-48 gradient-devotional relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-display font-semibold">{feature.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-5 text-sm leading-relaxed">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full rounded-xl group-hover:gradient-devotional group-hover:text-white group-hover:border-0 transition-all duration-300">
                      Explore <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl gradient-devotional flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-display font-semibold">Sri Balaji Temple</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A sacred place of worship and spiritual enlightenment for all devotees.
              </p>
            </div>
            <div>
              <h3 className="text-base font-display font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2.5">
                {['Events', 'Services', 'Donations', 'History'].map((link) => (
                  <Link key={link} to={`/${link.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-base font-display font-semibold mb-4">Contact</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Temple Address, City</p>
                <p>Phone: +91 98765 43210</p>
                <p>Email: info@sribalajiTemple.org</p>
              </div>
            </div>
            <NewsletterSubscription />
          </div>
          <div className="border-t border-border/50 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Sri Balaji Temple. Made with ❤️ for our devotees.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
