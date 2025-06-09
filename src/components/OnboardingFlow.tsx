
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Calendar, 
  Gift, 
  Settings, 
  Users, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to Sri Balaji Temple",
    description: "Your spiritual journey begins here",
    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
    content: "Welcome to our sacred digital space! Sri Balaji Temple has been serving the community for generations, bringing divine blessings and spiritual peace to devotees worldwide."
  },
  {
    id: 2,
    title: "Temple Services",
    description: "Book pujas and spiritual services",
    icon: <Heart className="w-8 h-8 text-red-500" />,
    content: "Book various spiritual services including special pujas, abhishekams, and blessed ceremonies. Each service comes with a digital ticket for easy verification and spiritual records."
  },
  {
    id: 3,
    title: "Sacred Events",
    description: "Join our spiritual gatherings",
    icon: <Calendar className="w-8 h-8 text-blue-500" />,
    content: "Participate in festivals, spiritual discourses, and community events. Stay connected with our vibrant temple community and never miss important celebrations."
  },
  {
    id: 4,
    title: "Digital Donations",
    description: "Contribute to temple activities",
    icon: <Gift className="w-8 h-8 text-green-500" />,
    content: "Support temple activities and charitable causes through secure online donations. Your contributions help maintain the temple and serve the community."
  },
  {
    id: 5,
    title: "Your Profile",
    description: "Manage your spiritual journey",
    icon: <Settings className="w-8 h-8 text-purple-500" />,
    content: "Track your donations, service bookings, and download receipts from your personal dashboard. Keep a record of your spiritual contributions and activities."
  },
  {
    id: 6,
    title: "Temple Community",
    description: "Connect with fellow devotees",
    icon: <Users className="w-8 h-8 text-indigo-500" />,
    content: "Join our growing community of devotees. Share in the collective spiritual energy and be part of something greater than yourself."
  }
];

export const OnboardingFlow = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
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

      if (!data) {
        // Create new onboarding record
        const { data: newOnboarding, error: createError } = await supabase
          .from('user_onboarding')
          .insert({
            user_id: user?.id,
            current_step: 1,
            completed: false
          })
          .select()
          .single();

        if (createError) throw createError;
        setOnboardingData(newOnboarding);
        setIsOpen(true);
      } else if (!data.completed) {
        setOnboardingData(data);
        setCurrentStep(data.current_step);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const updateOnboardingStep = async (step: number, completed = false) => {
    try {
      const updateData: any = { current_step: step };
      if (completed) {
        updateData.completed = true;
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('user_onboarding')
        .update(updateData)
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating onboarding:', error);
    }
  };

  const nextStep = () => {
    const next = currentStep + 1;
    if (next <= onboardingSteps.length) {
      setCurrentStep(next);
      updateOnboardingStep(next);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    const prev = currentStep - 1;
    if (prev >= 1) {
      setCurrentStep(prev);
      updateOnboardingStep(prev);
    }
  };

  const completeOnboarding = async () => {
    await updateOnboardingStep(currentStep, true);
    setIsOpen(false);
    toast({
      title: "Welcome aboard! 🙏",
      description: "Your spiritual journey with Sri Balaji Temple begins now.",
    });
  };

  const skipOnboarding = async () => {
    await updateOnboardingStep(onboardingSteps.length, true);
    setIsOpen(false);
  };

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  const progress = (currentStep / onboardingSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {onboardingSteps.length}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipOnboarding}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Skip
              </Button>
            </div>
            <Progress value={progress} className="mb-4" />
          </div>

          {/* Content */}
          {currentStepData && (
            <div className="px-6 pb-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg">
                    {currentStepData.icon}
                  </div>
                  <CardTitle className="text-2xl mb-2">{currentStepData.title}</CardTitle>
                  <p className="text-muted-foreground text-lg">{currentStepData.description}</p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="prose prose-sm max-w-none mb-6">
                    <p className="text-base leading-relaxed">{currentStepData.content}</p>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="min-w-[100px]"
                    >
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {onboardingSteps.map((step) => (
                        <div
                          key={step.id}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            step.id === currentStep
                              ? 'bg-primary'
                              : step.id < currentStep
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    {currentStep < onboardingSteps.length ? (
                      <Button onClick={nextStep} className="min-w-[100px]">
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={completeOnboarding} className="min-w-[100px]">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Get Started
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
