import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Crown, Heart, Users, Award, Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';

const AnimateOnScroll = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const History = () => {
  const { t } = useLanguage();

  const timelineEvents = [
    { year: '1875', title: 'Foundation of the Temple', description: 'The sacred ground was blessed and construction began under the guidance of Sri Venkateshwara Swami.', icon: MapPin },
    { year: '1890', title: 'First Consecration', description: 'The main deity was installed with grand celebrations attended by thousands of devotees.', icon: Crown },
    { year: '1925', title: 'Expansion Phase', description: 'Additional halls and facilities were added to accommodate the growing community.', icon: Users },
    { year: '1975', title: 'Centenary Celebrations', description: 'Grand centenary celebrations marked 100 years of divine blessings and community service.', icon: Award },
    { year: '2000', title: 'Modern Renovation', description: 'Complete renovation with modern amenities while preserving traditional architecture.', icon: Star },
  ];

  const managementFamily = [
    { name: 'Ramarapu Charan', position: 'Chief Organiser', since: '2000', description: 'Leading daily rituals and spiritual guidance for over 25 years.' },
    { name: 'Smt. Lakshmi Devi', position: 'Temple Administrator', since: '2000', description: 'Managing temple operations and community outreach programs.' },
    { name: 'Sri Mohan Rao', position: 'Cultural Director', since: '2005', description: 'Organizing festivals and preserving traditional arts.' },
    { name: 'Dr. Priya Sharma', position: 'Education Coordinator', since: '2010', description: 'Leading spiritual education and youth programs.' },
  ];

  const achievements = [
    { icon: Users, title: '1.2M+', subtitle: 'Devotees', desc: 'Active community members' },
    { icon: Calendar, title: '350+', subtitle: 'Events', desc: 'Annual celebrations' },
    { icon: Heart, title: '₹5Cr+', subtitle: 'Donations', desc: 'Community contributions' },
    { icon: Award, title: '25+', subtitle: 'Awards', desc: 'Recognition for service' },
  ];

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 text-gradient-devotional">{t('templeHistory')}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the rich heritage spanning over 150 years of divine blessings and community service.
          </p>
        </motion.div>

        {/* Timeline */}
        <section className="mb-24">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">Historical Timeline</h2>
          </AnimateOnScroll>
          <div className="max-w-3xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />
            {timelineEvents.map((event, i) => (
              <AnimateOnScroll key={i} delay={i * 0.12}>
                <div className={`relative flex items-start gap-6 mb-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg z-10" />
                  {/* Card */}
                  <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-500 group">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <event.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-primary border-primary/30 mb-2 font-mono">{event.year}</Badge>
                          <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* Achievements Counter */}
        <section className="mb-24">
          <AnimateOnScroll>
            <div className="glass-card p-8 md:p-14 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">Our Divine Achievements</h2>
                  <p className="text-muted-foreground">Milestones reflecting our commitment to spiritual service.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {achievements.map((a, i) => (
                    <AnimateOnScroll key={i} delay={i * 0.1}>
                      <div className="text-center group">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <a.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-bold text-primary mb-0.5">{a.title}</h3>
                        <p className="text-sm font-semibold text-foreground mb-1">{a.subtitle}</p>
                        <p className="text-xs text-muted-foreground">{a.desc}</p>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Management */}
        <section className="mb-24">
          <AnimateOnScroll>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">{t('managementFamily')}</h2>
              <p className="text-muted-foreground">Meet the dedicated team serving our temple community.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementFamily.map((member, i) => (
              <AnimateOnScroll key={i} delay={i * 0.1}>
                <div className="glass-card p-6 text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-devotional flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg group-hover:scale-105 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <Badge className="gradient-saffron text-white border-0 mb-3">Since {member.since}</Badge>
                  <h3 className="font-display font-semibold mb-1 text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.position}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{member.description}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </section>

        {/* CTA */}
        <AnimateOnScroll>
          <section className="text-center">
            <div className="glass-card p-10 md:p-16 gradient-devotional text-white relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-white/5" />
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-display font-bold mb-4"
                >
                  Be Part of Our Legacy
                </motion.h2>
                <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">Join our spiritual family and contribute to the next chapter.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup"><Button className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 py-5 font-semibold shadow-lg">Join Community</Button></Link>
                  <Link to="/donations"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-5">Make a Donation</Button></Link>
                </div>
              </div>
            </div>
          </section>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default History;
