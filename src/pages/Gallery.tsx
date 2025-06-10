
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
import { Star, Play } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
  created_at: string;
}

const Gallery = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'featured') return item.is_featured;
    return item.category === selectedFilter;
  });

  // Get unique categories from items
  const categories = Array.from(new Set(galleryItems.map(item => item.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-lg">Loading gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4">{t('gallery_title') || 'Sacred Gallery'}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the sacred beauty and divine moments captured in our temple
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Gallery" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category || 'general'}>
                  {category?.charAt(0).toUpperCase() + category?.slice(1) || 'General'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Dialog key={item.id}>
              <DialogTrigger asChild>
                <Card 
                  className="group cursor-pointer hover:shadow-xl transition-all duration-500 overflow-hidden hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {item.is_featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white animate-pulse-soft">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-200 mt-1">{item.description}</p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'General'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl animate-scale-in">
                <div className="space-y-4">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      {item.is_featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-muted-foreground">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <Badge variant="outline">
                        {item.category?.charAt(0).toUpperCase() + item.category?.slice(1) || 'General'}
                      </Badge>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">
              {selectedFilter === 'all' 
                ? "No images have been uploaded yet." 
                : `No images found for the "${selectedFilter}" filter.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
