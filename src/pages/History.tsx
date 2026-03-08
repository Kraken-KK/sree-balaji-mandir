import React from 'react';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Crown, Heart, Users, Award, Star, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
    { icon: Users, title: '1.2M+ Devotees', desc: 'Active community members' },
    { icon: Calendar, title: '350+ Events', desc: 'Annual celebrations' },
    { icon: Heart, title: '₹5Cr+ Donations', desc: 'Community contributions' },
    { icon: Award, title: '25+ Awards', desc: 'Recognition for service' },
  ];

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-5 text-gradient-devotional">{t('templeHistory')}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the rich heritage spanning over 150 years of divine blessings and community service.
          </p>
        </div>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-3xl font-display font-bold text-center mb-14 animate-slide-up">Historical Timeline</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {timelineEvents.map((event, i) => (
              <div key={i} className="glass-card p-6 flex gap-5 items-start animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <event.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Badge variant="outline" className="text-primary border-primary/30 mb-2">{event.year}</Badge>
                  <h3 className="text-lg font-display font-semibold mb-2 text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Management */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-display font-bold mb-3">{t('managementFamily')}</h2>
            <p className="text-muted-foreground">Meet the dedicated team serving our temple community.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementFamily.map((member, i) => (
              <div key={i} className="glass-card p-6 text-center group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-devotional flex items-center justify-center text-white text-2xl font-display font-bold shadow-lg">
                  {member.name.charAt(0)}
                </div>
                <Badge className="gradient-saffron text-white border-0 mb-3">Since {member.since}</Badge>
                <h3 className="font-display font-semibold mb-1 text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.position}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-20">
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-bold mb-3">Our Divine Achievements</h2>
              <p className="text-muted-foreground">Milestones reflecting our commitment to spiritual service.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((a, i) => (
                <div key={i} className="glass rounded-2xl p-6 text-center group animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <a.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-primary mb-1">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center animate-fade-in">
          <div className="glass-card p-10 md:p-14 gradient-devotional text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-bold mb-4">Be Part of Our Legacy</h2>
              <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">Join our spiritual family and contribute to the next chapter.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup"><Button className="bg-white text-primary hover:bg-white/90 rounded-xl px-8 py-5 font-semibold shadow-lg">Join Community</Button></Link>
                <Link to="/donations"><Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl px-8 py-5">Make a Donation</Button></Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default History;
