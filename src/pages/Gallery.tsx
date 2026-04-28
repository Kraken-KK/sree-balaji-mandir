import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Image as ImageIcon, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Play } from 'lucide-react';
import { detectMedia, isEmbedMedia } from '@/lib/media';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

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

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    setZoom(1);
    setOpenIndex((i) => (i === null ? 0 : (i - 1 + filteredItems.length) % filteredItems.length));
  }, [openIndex, filteredItems.length]);

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    setZoom(1);
    setOpenIndex((i) => (i === null ? 0 : (i + 1) % filteredItems.length));
  }, [openIndex, filteredItems.length]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') setOpenIndex(null);
      else if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.25, 3));
      else if (e.key === '-') setZoom((z) => Math.max(z - 0.25, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, goPrev, goNext]);

  const activeItem = openIndex !== null ? filteredItems[openIndex] : null;

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5 animate-scale-in">
            <ImageIcon className="w-8 h-8 text-primary" />
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
              <div
                key={item.id}
                onClick={() => { setOpenIndex(i); setZoom(1); }}
                className="glass-card overflow-hidden cursor-pointer group animate-scale-in hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {item.is_featured && (
                    <Badge className="absolute top-3 left-3 gradient-saffron text-white border-0 shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-3 group-hover:translate-y-0">
                    <h3 className="font-display font-semibold text-lg drop-shadow-lg">{item.title}</h3>
                    {item.description && <p className="text-sm text-white/90 mt-1 line-clamp-2 drop-shadow">{item.description}</p>}
                  </div>
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern lightbox */}
        <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
          <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 border-0 bg-background/95 backdrop-blur-xl rounded-3xl overflow-hidden">
            {activeItem && (
              <div className="relative w-full h-full flex flex-col animate-fade-in">
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-background/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-lg backdrop-blur-md">{activeItem.category || 'General'}</Badge>
                    {activeItem.is_featured && (
                      <Badge className="gradient-saffron text-white border-0">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Featured
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground ml-2">
                      {(openIndex ?? 0) + 1} / {filteredItems.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setZoom((z) => Math.max(z - 0.25, 1))}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setOpenIndex(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="flex-1 flex items-center justify-center overflow-auto p-4">
                  <img
                    key={activeItem.id}
                    src={activeItem.image_url}
                    alt={activeItem.title}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 animate-scale-in"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>

                {/* Prev / Next */}
                {filteredItems.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={goPrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12 bg-background/60 backdrop-blur-md hover:bg-background/90 hover-scale"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={goNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full w-12 h-12 bg-background/60 backdrop-blur-md hover:bg-background/90 hover-scale"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-background/95 via-background/70 to-transparent">
                  <h3 className="text-xl font-display font-semibold mb-1">{activeItem.title}</h3>
                  {activeItem.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{activeItem.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(activeItem.created_at).toLocaleDateString()} · Use ← → keys to navigate
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-muted flex items-center justify-center"><ImageIcon className="w-10 h-10 text-muted-foreground" /></div>
            <h3 className="text-xl font-display font-semibold mb-2">No images found</h3>
            <p className="text-muted-foreground">{selectedFilter === 'all' ? "No images uploaded yet." : `No "${selectedFilter}" images found.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
