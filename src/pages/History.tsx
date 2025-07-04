import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, Crown, Heart, Users, Award, Star, MapPin, Clock } from 'lucide-react';

const History = () => {
  const { t } = useLanguage();

  const timelineEvents = [
    {
      year: '1875',
      title: 'Foundation of the Temple',
      description: 'The sacred ground was blessed and construction began under the guidance of Sri Venkateshwara Swami.',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
      icon: MapPin,
    },
    {
      year: '1890',
      title: 'First Consecration',
      description: 'The main deity was installed with grand celebrations attended by thousands of devotees.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      icon: Crown,
    },
    {
      year: '1925',
      title: 'Expansion Phase',
      description: 'Additional halls and facilities were added to accommodate the growing community of devotees.',
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80',
      icon: Users,
    },
    {
      year: '1975',
      title: 'Centenary Celebrations',
      description: 'Grand centenary celebrations marked 100 years of divine blessings and community service.',
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80',
      icon: Award,
    },
    {
      year: '2000',
      title: 'Modern Renovation',
      description: 'Complete renovation with modern amenities while preserving the traditional architecture.',
      image: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?auto=format&fit=crop&w=800&q=80',
      icon: Star,
    },
  ];

  const managementFamily = [
    {
      name: 'Ramarapu Charan',
      position: 'Chief Organiser',
      since: '2000',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      description: 'Leading daily rituals and spiritual guidance for over 25 years.',
    },
    {
      name: 'Smt. Lakshmi Devi',
      position: 'Temple Administrator',
      since: '2000',
      image: 'https://images.unsplash.com/photo-1494790108755-2616c6c4d1b5?auto=format&fit=crop&w=300&q=80',
      description: 'Managing temple operations and community outreach programs.',
    },
    {
      name: 'Sri Mohan Rao',
      position: 'Cultural Director',
      since: '2005',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      description: 'Organizing festivals and preserving traditional arts.',
    },
    {
      name: 'Dr. Priya Sharma',
      position: 'Education Coordinator',
      since: '2010',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
      description: 'Leading spiritual education and youth programs.',
    },
  ];

  const achievements = [
    { icon: Users, title: '1.2M+ Devotees', description: 'Active community members' },
    { icon: Calendar, title: '350+ Events', description: 'Annual celebrations' },
    { icon: Heart, title: '₹5Cr+ Donations', description: 'Community contributions' },
    { icon: Award, title: '25+ Awards', description: 'Recognition for service' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-6 animate-bounce">
            <Clock className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('templeHistory')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the rich heritage and spiritual journey of Sri Balaji Temple spanning over 150 years of divine blessings and community service.
          </p>
        </div>

        {/* Timeline Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 animate-slide-up">Historical Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent rounded-full" />
            
            {timelineEvents.map((event, index) => (
              <div key={index} className={`flex items-center mb-16 animate-slide-up ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                          <event.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-primary border-primary">
                          {event.year}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg animate-pulse" />
                
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg group">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Management Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">{t('managementFamily')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the dedicated team that serves our temple community with devotion and commitment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managementFamily.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-3 group animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                        Since {member.since}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="mb-20 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="text-center mb-12 animate-fade-in relative z-10">
            <h2 className="text-3xl font-bold mb-4">Our Divine Achievements</h2>
            <p className="text-muted-foreground">
              Milestones that reflect our commitment to spiritual service and community welfare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-slide-up border-none bg-background/50 backdrop-blur-sm" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                    <achievement.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center animate-fade-in">
          <Card className="p-12 bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-20" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Be Part of Our Legacy</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join our spiritual family and contribute to the next chapter of our temple's glorious history.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors hover:scale-105 transform duration-300">
                  Join Our Community
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors hover:scale-105 transform duration-300">
                  Make a Donation
                </button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default History;