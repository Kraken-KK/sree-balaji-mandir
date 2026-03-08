import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Calendar, Image, Heart, Users, Award, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import NewsletterSubscription from '@/components/NewsletterSubscription';
import { FloatingOrb, SacredGeometry } from '@/components/SVGAnimations';

const Index = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('devotees'), value: '10k+', icon: Users },
    { label: t('eventsCount'), value: '500+', icon: Calendar },
    { label: t('donationsAmount'), value: '₹10L+', icon: Heart },
    { label: t('liveVisitors'), value: '100', icon: Sparkles },
  ];

  const features = [
    { title: t('gallery'), description: 'Explore sacred images and divine moments captured in our temple ceremonies.', link: '/gallery', icon: Image },
    { title: t('events'), description: 'Join us for festivals, daily rituals, and special spiritual events.', link: '/events', icon: Calendar },
    { title: t('services'), description: 'Book temple services, pujas, and make offerings to support sacred activities.', link: '/services', icon: Heart },
  ];

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
        <FloatingOrb className="top-[10%] right-[10%]" color="primary" size={500} />
        <FloatingOrb className="bottom-[10%] left-[10%]" color="accent" size={400} delay={2} />
        <SacredGeometry className="absolute top-[20%] right-[5%] w-[250px] h-[250px] text-primary/3" />

        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/30 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: 'url("https://wallpapers.com/images/featured/lord-venkateswara-ju1irfhiq1xd07jr.jpg")',
            opacity: 0.2,
          }}
        />

        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-[-3rem]"
          >
            <img
              src="https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275"
              alt="Sri Balaji Temple"
              className="w-52 h-52 md:w-64 md:h-64 object-contain mx-auto drop-shadow-2xl"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-5 leading-tight bg-gradient-to-r from-white via-amber-100 to-orange-200 bg-clip-text text-transparent"
          >
            {t('welcomeTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-base md:text-lg mb-8 text-white/75 max-w-2xl mx-auto"
          >
            {t('welcomeSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/events">
              <Button size="lg" className="gradient-devotional text-white border-0 rounded-2xl px-7 py-5 text-base shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
                <Calendar className="mr-2 w-4 h-4" /> {t('viewEvents')}
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" variant="outline" className="border-white/25 text-white hover:bg-white/10 rounded-2xl px-7 py-5 text-base backdrop-blur-sm">
                <Award className="mr-2 w-4 h-4" /> {t('templeHistory')}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-5 h-8 border-2 border-white/25 rounded-full flex justify-center">
            <motion.div
              className="w-0.5 h-2 bg-white/50 rounded-full mt-1.5"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 text-foreground">Our Divine Community</h2>
            <p className="text-sm text-muted-foreground">Numbers that reflect our spiritual impact</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-5 md:p-7 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-0.5">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-gradient-devotional">Explore Our Temple</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Discover divine beauty, participate in sacred events, and be part of our spiritual community.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="glass-card overflow-hidden group"
              >
                <div className="h-40 gradient-devotional relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-display font-semibold">{feature.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{feature.description}</p>
                  <Link to={feature.link}>
                    <Button variant="outline" className="w-full rounded-xl group-hover:gradient-devotional group-hover:text-white group-hover:border-0 transition-all duration-300 text-sm h-9">
                      Explore <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-border/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-xl gradient-devotional flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-display font-semibold text-base">Sri Balaji Temple</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A sacred place of worship and spiritual enlightenment for all devotees.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-display font-semibold mb-3">Quick Links</h3>
              <div className="space-y-2">
                {['Events', 'Services', 'Donations', 'History'].map((link) => (
                  <Link key={link} to={`/${link.toLowerCase()}`} className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-display font-semibold mb-3">Contact</h3>
              <div className="text-xs text-muted-foreground space-y-1.5">
                <p>Temple Address, City</p>
                <p>Phone: +91 98765 43210</p>
                <p>Email: info@sribalajiTemple.org</p>
              </div>
            </div>
            <NewsletterSubscription />
          </div>
          <div className="border-t border-border/30 mt-10 pt-6 text-center text-xs text-muted-foreground">
            <p>© 2026 Sri Balaji Temple. Made with ❤️ for our devotees.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
