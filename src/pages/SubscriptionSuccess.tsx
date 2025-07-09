
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan');

  useEffect(() => {
    if (sessionId) {
      toast({
        title: 'Subscription Activated!',
        description: `Your ${plan} subscription is now active. Welcome to premium features!`,
      });
    }
  }, [sessionId, plan, toast]);

  const planFeatures = {
    basic: [
      'Basic temple services',
      'Event notifications',
      'Prayer reminders',
      'Monthly newsletter'
    ],
    premium: [
      'All basic features',
      'Priority booking',
      'Personalized prayers',
      'Monthly spiritual guidance',
      'Premium support'
    ],
    devotee: [
      'All premium features',
      'VIP temple access',
      'Personal priest consultation',
      'Special ceremony bookings',
      'Exclusive spiritual content'
    ]
  };

  const currentPlanFeatures = planFeatures[plan as keyof typeof planFeatures] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-4" />
            <h1 className="text-4xl font-bold mb-4">Subscription Activated!</h1>
            <p className="text-xl text-muted-foreground">
              Welcome to your enhanced spiritual journey
            </p>
          </div>

          {/* Plan Details */}
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl capitalize">{plan} Plan</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Your subscription is now active and ready to use
              </p>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-4">Your Premium Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                {currentPlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-6">What's Next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/services')}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Book Premium Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access priority booking for temple services
                  </p>
                  <ArrowRight className="w-5 h-5 mx-auto text-primary" />
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/subscriptions')}>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Manage Subscription</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and manage your subscription details
                  </p>
                  <ArrowRight className="w-5 h-5 mx-auto text-primary" />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 space-x-4">
              <Button 
                onClick={() => navigate('/')}
                className="temple-gradient text-white"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/services')}
                variant="outline"
              >
                Browse Services
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <Card className="mt-12 bg-muted/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Our support team is here to help you make the most of your subscription. 
                Contact us anytime for assistance with your premium features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
