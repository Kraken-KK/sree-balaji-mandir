
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Send contact form email to admin
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: ['krakenkk54@gmail.com'],
          name: 'Temple Admin',
          type: 'contact_form',
          data: {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            message: formData.message
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275" 
            alt="Sri Balaji Temple" 
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg p-2"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">+91 9876543210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">info@balajitemple.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600">Sri Balaji Temple, Temple Street, City</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold">Temple Hours</p>
                    <p className="text-gray-600">Daily: 6:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Visit Us</h3>
                <p className="mb-4">
                  Come and experience the divine atmosphere of our temple. 
                  We welcome devotees from all walks of life.
                </p>
                <p className="text-sm opacity-90">
                  Aarti timings: Morning 7:00 AM, Evening 7:00 PM
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-orange-600">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
