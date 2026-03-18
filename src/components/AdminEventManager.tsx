import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string | null;
  image: string | null;
  participants: number | null;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
}

export const AdminEventManager = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [eventForm, setEventForm] = useState({
    name: '', date: '', time: '', location: '', description: '', image: '',
  });

  useEffect(() => {
    fetchEvents();
    fetchServices();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*');
    if (!error) setEvents(data || []);
  };

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('id, name, price');
    setServices(data || []);
  };

  const fetchLinkedServices = async (eventId: string) => {
    const { data } = await supabase.from('event_services').select('service_id').eq('event_id', eventId);
    return (data || []).map((d: any) => d.service_id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let eventId = editingEvent?.id;

      if (editingEvent) {
        const { error } = await supabase.from('events').update({
          name: eventForm.name, date: eventForm.date, time: eventForm.time,
          location: eventForm.location, description: eventForm.description, image: eventForm.image || null,
        }).eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('events').insert({
          name: eventForm.name, date: eventForm.date, time: eventForm.time,
          location: eventForm.location, description: eventForm.description, image: eventForm.image || null,
        }).select().single();
        if (error) throw error;
        eventId = data.id;
      }

      // Update linked services
      if (eventId) {
        await supabase.from('event_services').delete().eq('event_id', eventId);
        if (selectedServices.length > 0) {
          await supabase.from('event_services').insert(
            selectedServices.map((serviceId) => ({ event_id: eventId!, service_id: serviceId }))
          );
        }
      }

      toast({ title: editingEvent ? 'Event updated' : 'Event created' });
      await fetchEvents();
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to save event.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventForm({ name: '', date: '', time: '', location: '', description: '', image: '' });
    setEditingEvent(null);
    setSelectedServices([]);
    setIsDialogOpen(false);
  };

  const handleEdit = async (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name, date: event.date, time: event.time,
      location: event.location, description: event.description || '', image: event.image || '',
    });
    const linked = await fetchLinkedServices(event.id);
    setSelectedServices(linked);
    setIsDialogOpen(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (!error) {
      toast({ title: 'Event deleted' });
      fetchEvents();
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Event Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}><Plus className="w-4 h-4 mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
              <DialogDescription>Fill in the event details and optionally link services for upsell.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input id="name" value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="date">Date</Label><Input id="date" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required /></div>
                <div><Label htmlFor="time">Time</Label><Input id="time" type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} required /></div>
              </div>
              <div><Label htmlFor="location">Location</Label><Input id="location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required /></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} /></div>
              <div><Label htmlFor="image">Image URL</Label><Input id="image" value={eventForm.image} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} placeholder="https://example.com/image.jpg" /></div>

              {/* Linked Services */}
              {services.length > 0 && (
                <div>
                  <Label className="flex items-center gap-2 mb-3"><Link2 className="w-4 h-4" /> Recommended Services (shown after registration)</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {services.map((service) => (
                      <label key={service.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                        <Checkbox checked={selectedServices.includes(service.id)} onCheckedChange={() => toggleService(service.id)} />
                        <span className="text-sm flex-1">{service.name}</span>
                        <span className="text-xs text-muted-foreground">₹{service.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingEvent ? 'Update' : 'Create'} Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{event.date} at {event.time} • {event.location}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
