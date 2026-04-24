
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Heart, Camera, Phone, Mail } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275" 
            alt="Sri Balaji Temple" 
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/20 p-4"
          />
          <h1 className="text-5xl font-bold mb-4">Welcome to Sri Balaji Temple</h1>
          <p className="text-xl mb-8">Experience divine bliss and spiritual enlightenment</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button 
              onClick={() => navigate('/services')}
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              Book Services
            </Button>
            <Button 
              onClick={() => navigate('/events')}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600"
            >
              View Events
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Join our spiritual events and festivals</p>
              <Button onClick={() => navigate('/events')} variant="outline" className="w-full">
                View Events
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Book temple services and pujas</p>
              <Button onClick={() => navigate('/services')} variant="outline" className="w-full">
                Book Services
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Support our temple activities</p>
              <Button onClick={() => navigate('/donations')} variant="outline" className="w-full">
                Donate Now
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Camera className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View our temple moments</p>
              <Button onClick={() => navigate('/gallery')} variant="outline" className="w-full">
                View Gallery
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+91 7780132988</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>karthikeya.ramarapu@icloud.com</span>
            </div>
          </div>
          <p className="mt-4 text-white/90 text-sm">📍 Behind Kavadiguda petrol pump</p>
          <Button 
            onClick={() => navigate('/contact')}
            className="mt-8 bg-white text-orange-600 hover:bg-orange-50"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
