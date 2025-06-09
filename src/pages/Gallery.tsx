
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Heart, Calendar, Users, Building, Sparkles } from 'lucide-react';

const Gallery = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter((item: any) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'featured') return item.is_featured;
    return item.category === selectedFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'festivals': return <Calendar className="w-4 h-4" />;
      case 'rituals': return <Heart className="w-4 h-4" />;
      case 'architecture': return <Building className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse-soft text-lg">Loading gallery...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block p-4 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 rounded-full mb-6 temple-glow">
            <Sparkles className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Sacred Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the divine beauty and spiritual moments captured within our temple walls. 
            Each image tells a story of faith, tradition, and community.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-12 animate-slide-up">
          <Card className="p-2 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-64 border-0 bg-transparent">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Images</SelectItem>
                <SelectItem value="featured">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Featured
                  </div>
                </SelectItem>
                <SelectItem value="festivals">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Festivals
                  </div>
                </SelectItem>
                <SelectItem value="rituals">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Rituals
                  </div>
                </SelectItem>
                <SelectItem value="architecture">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Architecture
                  </div>
                </SelectItem>
                <SelectItem value="community">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Community
                  </div>
                </SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item: any, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card className={`group cursor-pointer overflow-hidden border-0 shadow-lg hover-lift animate-stagger-in bg-white dark:bg-gray-900 ${index < 6 ? 'card-entrance' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {item.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-yellow-500 text-white border-0 shadow-md">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-300">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden animate-scale-in">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-200 mb-3">{item.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </Badge>
                          <span className="text-sm text-gray-300">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {item.is_featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-4 bg-muted rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">
              {selectedFilter === 'all' 
                ? "The gallery is being updated with new images." 
                : "No images found for the selected filter."}
            </p>
          </div>
        )}

        {/* Featured Section */}
        {selectedFilter === 'all' && galleryItems.some((item: any) => item.is_featured) && (
          <div className="mt-16 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Featured Highlights</h2>
              <p className="text-muted-foreground">
                Special moments and divine experiences from our temple
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems
                .filter((item: any) => item.is_featured)
                .slice(0, 6)
                .map((item: any) => (
                  <Card key={`featured-${item.id}`} className="overflow-hidden hover-lift temple-glow">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{item.title}</h4>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
