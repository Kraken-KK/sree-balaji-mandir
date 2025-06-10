import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar, 
  Heart, 
  Settings, 
  Image as ImageIcon,
  Users,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const OnboardingFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Only show onboarding for users who don't have an onboarding record yet (truly new users)
      if (!data) {
        // Create onboarding record for new user and show onboarding
        await supabase
          .from('user_onboarding')
          .insert({
            user_id: user?.id,
            current_step: 1,
            completed: false
          });
        setIsOpen(true);
      }
      // If data exists (user has seen onboarding before), don't show it again
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOnboardingProgress = async (step: number, completed = false) => {
    try {
      await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user?.id,
          current_step: step,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });
    } catch (error) {
      console.error('Error updating onboarding:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      await updateOnboardingProgress(nextStep);
    } else {
      await completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    await updateOnboardingProgress(currentStep, true);
    setIsOpen(false);
    toast({
      title: "Welcome to our Temple Community!",
      description: "You're all set up. Explore our features and connect with our community.",
    });
  };

  const skipOnboarding = async () => {
    await updateOnboardingProgress(steps.length, true);
    setIsOpen(false);
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Our Sacred Temple",
      description: "Join our spiritual community and discover the divine",
      icon: <Star className="w-8 h-8 text-primary" />,
      content: (
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
            <Star className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Welcome to Our Temple Community</h3>
          <p className="text-muted-foreground">
            Our temple has been a beacon of faith and spirituality for generations. We're dedicated to 
            preserving ancient traditions while embracing modern ways to connect our community.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center hover-scale">
              <Users className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Growing Community</p>
            </div>
            <div className="text-center hover-scale">
              <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium">Sacred Location</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Explore Our Events",
      description: "Join festivals, ceremonies, and community gatherings",
      icon: <Calendar className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center">
            <Calendar className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold">Sacred Events & Festivals</h3>
          </div>
          <p className="text-muted-foreground text-center">
            Stay connected with our spiritual calendar. From daily prayers to grand festivals, 
            never miss an opportunity to be part of our community.
          </p>
          <div className="space-y-3">
            <Card className="border-l-4 border-l-primary hover-lift">
              <CardContent className="p-4">
                <h4 className="font-medium">Daily Prayers</h4>
                <p className="text-sm text-muted-foreground">Morning and evening ceremonies</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-accent hover-lift">
              <CardContent className="p-4">
                <h4 className="font-medium">Festival Celebrations</h4>
                <p className="text-sm text-muted-foreground">Grand celebrations throughout the year</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-secondary hover-lift">
              <CardContent className="p-4">
                <h4 className="font-medium">Community Gatherings</h4>
                <p className="text-sm text-muted-foreground">Educational and social events</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Make Sacred Donations",
      description: "Support temple activities and community services",
      icon: <Heart className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center">
            <Heart className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold">Donate for Sacred Causes</h3>
          </div>
          <p className="text-muted-foreground text-center">
            Your contributions help maintain our sacred space and support community welfare programs.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover-lift">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Temple Maintenance</p>
                <p className="text-sm text-muted-foreground">Keep our sacred space beautiful</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover-lift">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-medium">Community Services</p>
                <p className="text-sm text-muted-foreground">Support local welfare programs</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Book Temple Services",
      description: "Reserve special prayers and ceremonies",
      icon: <Settings className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center">
            <Settings className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold">Temple Services</h3>
          </div>
          <p className="text-muted-foreground text-center">
            Book personalized prayers, ceremonies, and special rituals for your spiritual needs.
          </p>
          <div className="space-y-3">
            <Badge variant="outline" className="w-full justify-start p-3 hover-lift">
              <CheckCircle className="w-4 h-4 mr-2" />
              Special Prayer Services
            </Badge>
            <Badge variant="outline" className="w-full justify-start p-3 hover-lift">
              <CheckCircle className="w-4 h-4 mr-2" />
              Wedding Ceremonies
            </Badge>
            <Badge variant="outline" className="w-full justify-start p-3 hover-lift">
              <CheckCircle className="w-4 h-4 mr-2" />
              Blessing Rituals
            </Badge>
            <Badge variant="outline" className="w-full justify-start p-3 hover-lift">
              <CheckCircle className="w-4 h-4 mr-2" />
              Personal Consultations
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Explore Our Gallery",
      description: "Witness the beauty of our temple and community",
      icon: <ImageIcon className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4 animate-fade-in">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold">Sacred Moments Gallery</h3>
          </div>
          <p className="text-muted-foreground text-center">
            Browse through beautiful moments from our temple - from architectural marvels to 
            joyous celebrations captured over the years.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 text-center hover-lift">
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Temple Architecture</p>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-secondary/20 rounded-lg p-4 text-center hover-lift">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Festival Celebrations</p>
            </div>
            <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-lg p-4 text-center hover-lift">
              <Users className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-medium">Community Events</p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-4 text-center hover-lift">
              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Sacred Rituals</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  if (loading || !user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step.id <= currentStep ? 'bg-primary animate-pulse' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <Badge variant="outline" className="animate-fade-in">
              {currentStep} of {steps.length}
            </Badge>
          </div>

          {/* Current step content */}
          <div className="py-6 min-h-[400px] flex items-center justify-center">
            {steps[currentStep - 1]?.content}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 hover-scale"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              variant="ghost"
              onClick={skipOnboarding}
              className="text-muted-foreground hover-scale"
            >
              Skip Tour
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2 hover-scale temple-gradient text-white"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
              {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
