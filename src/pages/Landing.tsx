import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Calendar, Heart, Globe, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { SacredGeometry, FloatingOrb, LotusPattern } from '@/components/SVGAnimations';

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

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen gradient-warm-bg relative overflow-hidden">
      {/* Animated orbs */}
      <FloatingOrb className="top-[5%] left-[5%]" color="primary" size={500} />
      <FloatingOrb className="bottom-[10%] right-[5%]" color="accent" size={400} delay={2} />
      <FloatingOrb className="top-[40%] left-[50%]" color="gold" size={600} delay={4} />

      {/* Sacred geometry background */}
      <SacredGeometry className="absolute top-[10%] right-[5%] w-[300px] h-[300px] text-primary/5" />
      <LotusPattern className="absolute bottom-[15%] left-[8%] w-[200px] h-[200px] text-accent/5" />

      {/* Top nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-5"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 gradient-devotional rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">ॐ</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">Sri Balaji Temple</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="glass-button border-0 rounded-xl h-9 text-sm">Sign In</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[75vh]">
          <div className="space-y-7">
            <motion.div {...fadeUp} transition={{ delay: 0.2, duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-medium text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Divine Technology
              </div>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight"
            >
              Sacred
              <span className="text-gradient-devotional"> Temple </span>
              <br />Experience
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base text-muted-foreground leading-relaxed max-w-md"
            >
              Experience seamless temple services with our modern platform. Book services, make offerings, and stay connected with your spiritual community.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Button onClick={handleExplore} size="lg" className="gradient-devotional text-white border-0 rounded-2xl px-7 py-5 text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
                Explore Temple <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={handleJoin} variant="outline" size="lg" className="glass-button border-0 rounded-2xl px-7 py-5 text-base">
                Join Community
              </Button>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3"
            >
              {[
                { icon: Calendar, label: 'Events', color: 'text-primary' },
                { icon: Heart, label: 'Donations', color: 'text-accent' },
                { icon: Star, label: 'Services', color: 'text-gold' },
                { icon: Globe, label: 'Community', color: 'text-lotus' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass-card p-3 text-center cursor-pointer"
                >
                  <item.icon className={`w-6 h-6 mx-auto mb-1.5 ${item.color}`} />
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center items-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 gradient-devotional rounded-[3rem] blur-3xl opacity-15 scale-110 animate-sacred-pulse" />

              {/* Phone */}
              <div className="relative w-64 md:w-72 h-[520px] md:h-[560px] glass rounded-[2.5rem] p-1 shadow-2xl glow-saffron">
                <div className="w-full h-full bg-background rounded-[2.2rem] overflow-hidden">
                  <div className="h-9 gradient-saffron flex items-center justify-between px-5">
                    <span className="text-white/80 text-[10px] font-medium">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-0.5 h-0.5 bg-white/50 rounded-full" />
                      <div className="w-0.5 h-0.5 bg-white/50 rounded-full" />
                      <div className="w-0.5 h-0.5 bg-white/50 rounded-full" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="text-center py-2">
                      <div className="w-12 h-12 gradient-devotional rounded-xl mx-auto mb-2 flex items-center justify-center shadow-lg">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display font-bold text-foreground text-xs">Sri Balaji Temple</h3>
                      <p className="text-[10px] text-muted-foreground">Divine Services</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { icon: Calendar, label: 'Events', color: 'text-primary' },
                        { icon: Heart, label: 'Donate', color: 'text-accent' },
                        { icon: Star, label: 'Services', color: 'text-gold' },
                        { icon: Globe, label: 'QR Scan', color: 'text-lotus' },
                      ].map((item, i) => (
                        <div key={i} className="glass rounded-lg p-2.5">
                          <item.icon className={`w-4 h-4 ${item.color} mb-0.5`} />
                          <p className="text-[10px] font-medium text-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="glass rounded-lg p-2.5">
                      <p className="text-[10px] font-medium text-foreground">Upcoming Event</p>
                      <p className="text-[10px] text-muted-foreground">Diwali Celebration</p>
                      <p className="text-[10px] text-primary font-medium mt-0.5">Nov 1, 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accents */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-12 h-12 gradient-devotional rounded-xl flex items-center justify-center shadow-xl"
              >
                <Star className="w-5 h-5 text-white" />
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-3 -left-3 w-9 h-9 bg-gold rounded-lg opacity-80"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer credit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 text-center pb-8"
      >
        <div className="glass-card inline-flex items-center gap-3 px-5 py-3">
          <div className="w-9 h-9 gradient-sacred rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Created with ❤️ by</p>
            <p className="font-display font-semibold text-sm text-primary">Karthikeya Ramarapu</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
