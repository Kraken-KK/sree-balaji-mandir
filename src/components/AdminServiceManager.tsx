
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  category: string;
}

export const AdminServiceManager = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Special Puja',
      price: 5000,
      duration: '2 hours',
      description: 'Personalized puja service',
      category: 'Puja Services',
    },
    {
      id: '2',
      name: 'Annadanam',
      price: 100,
      duration: '1 hour',
      description: 'Food offering service',
      category: 'Donation Services',
    }
  ]);
  
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    price: 0,
    duration: '',
    description: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...serviceForm }
          : service
      ));
      toast({
        title: "Service updated",
        description: "Service has been updated successfully.",
      });
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        ...serviceForm,
      };
      setServices([...services, newService]);
      toast({
        title: "Service created",
        description: "New service has been created successfully.",
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setServiceForm({
      name: '',
      price: 0,
      duration: '',
      description: '',
      category: '',
    });
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setServiceForm(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: "Service deleted",
      description: "Service has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Service Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Create New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingService ? 'Update' : 'Create'} Service
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ₹{service.price} • {service.duration} • {service.category}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
