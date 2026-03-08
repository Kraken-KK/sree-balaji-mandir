import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Image } from 'lucide-react';

interface GalleryItem {
  id: string; title: string; description: string | null; image_url: string;
  category: string | null; is_featured: boolean | null; created_at: string;
}

const Gallery = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setGalleryItems(data || []);
      } catch { toast({ title: "Error", description: "Failed to load gallery.", variant: "destructive" }); }
      finally { setLoading(false); }
    })();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'featured') return item.is_featured;
    return item.category === selectedFilter;
  });

  const categories = Array.from(new Set(galleryItems.map(i => i.category).filter(Boolean)));

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-devotional">
            {t('gallery_title') || 'Sacred Gallery'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the sacred beauty and divine moments captured in our temple
          </p>
        </div>

        <div className="flex justify-center mb-10 animate-slide-up">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48 glass-button border-0 rounded-xl"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c || 'general'}>{c?.charAt(0).toUpperCase()! + c?.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <div key={i} className="glass-card h-72 loading-shimmer rounded-2xl" />)}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, i) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  <div className="glass-card overflow-hidden cursor-pointer group animate-scale-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="relative">
                      <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700" />
                      {item.is_featured && (
                        <Badge className="absolute top-3 left-3 gradient-saffron text-white border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <h3 className="font-display font-semibold text-lg">{item.title}</h3>
                        {item.description && <p className="text-sm text-white/80 mt-1 line-clamp-1">{item.description}</p>}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl glass rounded-3xl border-0 p-2">
                  <img src={item.image_url} alt={item.title} className="w-full max-h-[70vh] object-contain rounded-2xl" />
                  <div className="px-4 pb-4 pt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-display font-semibold">{item.title}</h3>
                      {item.is_featured && <Badge className="gradient-saffron text-white border-0"><Star className="w-3 h-3 mr-1 fill-current" /> Featured</Badge>}
                    </div>
                    {item.description && <p className="text-muted-foreground text-sm">{item.description}</p>}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <Badge variant="outline" className="rounded-lg">{item.category || 'General'}</Badge>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-muted flex items-center justify-center"><Image className="w-10 h-10 text-muted-foreground" /></div>
            <h3 className="text-xl font-display font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">{selectedFilter === 'all' ? "No images uploaded yet." : `No "${selectedFilter}" images found.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
