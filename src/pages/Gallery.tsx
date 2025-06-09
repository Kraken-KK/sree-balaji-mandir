
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

const Gallery = () => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mediaItems = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1548624313-24daa93c3be3?auto=format&fit=crop&w=800&q=80',
      title: 'Temple Architecture',
      category: 'images',
      year: '2024',
    },
    {
      id: 2,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?auto=format&fit=crop&w=800&q=80',
      title: 'Evening Aarti',
      category: 'images',
      year: '2024',
    },
    {
      id: 3,
      type: 'video',
      src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
      title: 'Festival Celebration',
      category: 'videos',
      year: '2023',
    },
    {
      id: 4,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80',
      title: 'Sacred Rituals',
      category: 'images',
      year: '2024',
    },
    {
      id: 5,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1596740284477-64d3ce18308c?auto=format&fit=crop&w=800&q=80',
      title: 'Temple Interior',
      category: 'images',
      year: '2023',
    },
    {
      id: 6,
      type: 'video',
      src: 'https://images.unsplash.com/photo-1591123451139-5f8e93ab94e7?auto=format&fit=crop&w=800&q=80',
      title: 'Morning Prayers',
      category: 'videos',
      year: '2024',
    },
  ];

  const filteredItems = mediaItems.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'images' || selectedFilter === 'videos') {
      return item.category === selectedFilter;
    }
    return item.year === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('gallery_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the sacred beauty and divine moments captured in our temple
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-8">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('filter_media')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all')}</SelectItem>
              <SelectItem value="images">{t('images')}</SelectItem>
              <SelectItem value="videos">{t('videos')}</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-300">{item.year}</p>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.year}</p>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No media found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
