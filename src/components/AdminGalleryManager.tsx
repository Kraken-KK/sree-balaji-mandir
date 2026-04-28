
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Plus, Trash2, Star, Image as ImageIcon, Link as LinkIcon, Youtube, FileVideo } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { detectMedia } from '@/lib/media';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  uploaded_by: string | null;
  is_featured: boolean | null;
  created_at: string;
}

export const AdminGalleryManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'general',
    is_featured: false,
    file: null as File | null,
    mediaUrl: '',
  });

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
        description: "Failed to fetch gallery items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10485760) { // 10MB
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      setNewItem(prev => ({ ...prev, file }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('gallery-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) {
      toast({ title: "Missing title", description: "Please provide a title.", variant: "destructive" });
      return;
    }
    if (mode === 'file' && !newItem.file) {
      toast({ title: "Missing file", description: "Please pick an image to upload.", variant: "destructive" });
      return;
    }
    if (mode === 'url' && !newItem.mediaUrl.trim()) {
      toast({ title: "Missing link", description: "Paste a YouTube or Google Drive link.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      let imageUrl: string;
      if (mode === 'file' && newItem.file) {
        imageUrl = await uploadImage(newItem.file);
      } else {
        // Validate the URL is a recognised embed/image
        const detected = detectMedia(newItem.mediaUrl.trim());
        imageUrl = detected.original;
      }

      const { error } = await supabase
        .from('gallery')
        .insert({
          title: newItem.title,
          description: newItem.description || null,
          image_url: imageUrl,
          category: newItem.category,
          uploaded_by: user?.id,
          is_featured: newItem.is_featured
        });

      if (error) throw error;

      toast({ title: "Success", description: "Added to gallery!" });

      setNewItem({
        title: '',
        description: '',
        category: 'general',
        is_featured: false,
        file: null,
        mediaUrl: '',
      });
      setIsDialogOpen(false);
      fetchGalleryItems();
    } catch (error) {
      console.error('Error adding gallery item:', error);
      toast({ title: "Error", description: "Failed to add item. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchGalleryItems();
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  const deleteItem = async (id: string, imageUrl: string) => {
    try {
      // Only attempt storage delete for our own bucket URLs
      if (imageUrl.includes('/storage/v1/object/public/gallery-images/')) {
        try {
          const url = new URL(imageUrl);
          const filePath = url.pathname.split('/storage/v1/object/public/gallery-images/')[1];
          if (filePath) await supabase.storage.from('gallery-images').remove([filePath]);
        } catch (e) {
          console.warn('Storage cleanup skipped:', e);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
      fetchGalleryItems();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading gallery items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gallery Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add to Gallery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={mode} onValueChange={(v) => setMode(v as 'file' | 'url')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file" className="gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload</TabsTrigger>
                  <TabsTrigger value="url" className="gap-1.5"><LinkIcon className="w-3.5 h-3.5" /> Link</TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-2 pt-3">
                  <Label htmlFor="file">Image File</Label>
                  <Input id="file" type="file" accept="image/*" onChange={handleFileChange} />
                </TabsContent>
                <TabsContent value="url" className="space-y-2 pt-3">
                  <Label htmlFor="mediaUrl">YouTube or Google Drive Link</Label>
                  <Input
                    id="mediaUrl"
                    type="url"
                    value={newItem.mediaUrl}
                    onChange={(e) => setNewItem(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/..."
                  />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube</span>
                    <span className="flex items-center gap-1"><FileVideo className="w-3.5 h-3.5 text-blue-500" /> Google Drive</span>
                  </div>
                  <p className="text-xs text-muted-foreground">For Drive links, set sharing to "Anyone with the link".</p>
                </TabsContent>
              </Tabs>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="festivals">Festivals</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="rituals">Rituals</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newItem.is_featured}
                  onChange={(e) => setNewItem(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? (<><Upload className="w-4 h-4 mr-2 animate-spin" /> Saving...</>) : (<><Plus className="w-4 h-4 mr-2" /> Add to Gallery</>)}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              {item.is_featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-1">{item.title}</h4>
              {item.description && (
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
              )}
              <div className="flex items-center justify-between">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                  >
                    <Star className={`w-3 h-3 ${item.is_featured ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(item.id, item.image_url)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No images uploaded yet. Upload your first image!</p>
        </div>
      )}
    </div>
  );
};
