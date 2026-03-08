import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Calendar, Heart, Globe, Flame } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    localStorage.setItem('temple-has-visited', 'true');
    navigate('/', { replace: true });
  };

  const handleJoin = () => {
    localStorage.setItem('temple-has-visited', 'true');
    navigate('/signup', { replace: true });
  };

  return (
    <div className="min-h-screen gradient-warm-bg relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-liquid-morph" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] animate-liquid-morph" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/3 rounded-full blur-[160px]" />
      </div>

      {/* Top nav */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-devotional rounded-xl flex items-center justify-center shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-xl text-foreground">Sri Balaji Temple</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="glass-button border-0 rounded-xl">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              Divine Technology
            </div>

            <h1 className="text-5xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
              Sacred
              <span className="text-gradient-devotional"> Temple </span>
              Experience
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Experience seamless temple services with our modern platform. Book services, make offerings, and stay connected with your spiritual community.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleExplore} size="lg" className="gradient-devotional text-white border-0 rounded-2xl px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
                Explore Temple <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button onClick={handleJoin} variant="outline" size="lg" className="glass-button border-0 rounded-2xl px-8 py-6 text-lg">
                Join Community
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
              {[
                { icon: Calendar, label: 'Events', color: 'text-primary' },
                { icon: Heart, label: 'Donations', color: 'text-accent' },
                { icon: Star, label: 'Services', color: 'text-gold' },
                { icon: Globe, label: 'Community', color: 'text-lotus' },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 text-center group cursor-pointer">
                  <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative flex justify-center items-center animate-scale-in">
            <div className="relative">
              {/* Glowing backdrop */}
              <div className="absolute inset-0 gradient-devotional rounded-[3rem] blur-3xl opacity-20 scale-110 animate-sacred-pulse" />
              
              {/* Phone mockup */}
              <div className="relative w-72 h-[580px] glass rounded-[3rem] p-1.5 shadow-2xl glow-saffron">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                  {/* Status bar */}
                  <div className="h-10 gradient-saffron flex items-center justify-between px-6">
                    <span className="text-white/90 text-xs font-medium">9:41 AM</span>
                    <div className="flex gap-1.5">
                      <div className="w-1 h-1 bg-white/60 rounded-full" />
                      <div className="w-1 h-1 bg-white/60 rounded-full" />
                      <div className="w-1 h-1 bg-white/60 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="text-center py-2">
                      <div className="w-14 h-14 gradient-devotional rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                        <Flame className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-display font-bold text-foreground text-sm">Sri Balaji Temple</h3>
                      <p className="text-xs text-muted-foreground">Divine Services</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Calendar, label: 'Events', color: 'text-primary' },
                        { icon: Heart, label: 'Donate', color: 'text-accent' },
                        { icon: Star, label: 'Services', color: 'text-gold' },
                        { icon: Globe, label: 'QR Scan', color: 'text-lotus' },
                      ].map((item, i) => (
                        <div key={i} className="glass rounded-xl p-3">
                          <item.icon className={`w-5 h-5 ${item.color} mb-1`} />
                          <p className="text-xs font-medium text-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="glass rounded-xl p-3">
                      <p className="text-xs font-medium text-foreground">Upcoming Event</p>
                      <p className="text-xs text-muted-foreground">Diwali Celebration</p>
                      <p className="text-xs text-primary font-medium mt-1">Nov 1, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accents */}
              <div className="absolute -top-6 -right-6 w-14 h-14 gradient-devotional rounded-2xl flex items-center justify-center shadow-xl animate-liquid-float">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gold rounded-xl animate-liquid-float opacity-80" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer credit */}
      <div className="relative z-10 text-center pb-10">
        <div className="glass-card inline-flex items-center gap-3 px-6 py-4">
          <div className="w-10 h-10 gradient-sacred rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Created with ❤️ by</p>
            <p className="font-display font-semibold text-primary">Karthikeya Ramarapu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
