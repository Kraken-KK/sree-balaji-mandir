import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Smartphone, 
  Calendar, 
  Heart, 
  Settings,
  Star,
  Sparkles,
  Globe
} from 'lucide-react';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure this page is marked as visited when component mounts
    localStorage.setItem('temple-has-visited', 'true');
  }, []);

  const handleExploreTemple = () => {
    // Mark as visited and navigate
    localStorage.setItem('temple-has-visited', 'true');
    navigate('/', { replace: true });
  };

  const handleJoinCommunity = () => {
    // Mark as visited and navigate
    localStorage.setItem('temple-has-visited', 'true');
    navigate('/signup', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Sri Balaji Temple</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 animate-pulse">
                <Sparkles className="w-4 h-4 mr-1" />
                Divine Technology
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Modern
                <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> Temple </span>
                Management
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Experience seamless temple services with our cutting-edge platform. 
                Book services, make donations, and stay connected with your spiritual community.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleExploreTemple}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 text-lg hover-scale"
              >
                Explore Temple
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={handleJoinCommunity}
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg hover-scale"
              >
                Join Community
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Events</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Donations</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <Settings className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Services</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover-lift">
                <CardContent className="p-4 text-center">
                  <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white text-sm font-medium">Community</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Content - 3D Device Mockup */}
          <div className="relative flex justify-center items-center animate-scale-in">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-72 h-[600px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl relative">
                {/* Screen */}
                <div className="w-full h-full bg-gradient-to-b from-orange-50 to-red-50 rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="h-8 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-between px-4">
                    <span className="text-white text-xs font-medium">9:41 AM</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800">Sri Balaji Temple</h3>
                      <p className="text-xs text-gray-600">Divine Services</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Calendar className="w-6 h-6 text-orange-500 mb-1" />
                        <p className="text-xs font-medium">Events</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Heart className="w-6 h-6 text-red-500 mb-1" />
                        <p className="text-xs font-medium">Donate</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Settings className="w-6 h-6 text-blue-500 mb-1" />
                        <p className="text-xs font-medium">Services</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <Smartphone className="w-6 h-6 text-green-500 mb-1" />
                        <p className="text-xs font-medium">QR Scan</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-800">Upcoming Event</p>
                      <p className="text-xs text-gray-600">Diwali Celebration</p>
                      <p className="text-xs text-orange-600">Oct 24, 2024</p>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              <div className="absolute top-1/3 -left-8 w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-full animate-ping"></div>
              <div className="absolute bottom-1/3 -right-8 w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-50 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Attribution - Prominent */}
      <div className="relative z-10 text-center pb-8">
        <Card className="inline-block bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">Created with ❤️ by</p>
                <p className="text-purple-200 font-bold text-xl">Karthikeya Ramarapu</p>
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              Bridging tradition with modern technology
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Creator Tag */}
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm rounded-lg px-4 py-2 text-white border border-white/20 z-50 shadow-lg">
        <p className="text-xs font-medium">Crafted by <strong>Karthikeya Ramarapu</strong></p>
      </div>
    </div>
  );
};

export default Landing;
