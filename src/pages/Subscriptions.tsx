
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Check, Star, Crown, Settings, LogIn } from 'lucide-react';

interface Subscription {
  id: string;
  plan_type: string;
  interval: string;
  amount: number;
  status: string;
  created_at: string;
}

const Subscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setCurrentSubscription(data[0]);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async (planType: string, interval: string = 'month') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe to a plan.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    setLoading(planType);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { planType, interval }
      });

      if (error) throw error;

      window.open(data.url, '_blank');
      toast({
        title: 'Redirecting to Payment',
        description: `Setting up your ${planType} subscription...`,
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Error',
        description: 'Failed to create subscription. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading('');
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;

      window.open(data.url, '_blank');
      toast({
        title: 'Opening Customer Portal',
        description: 'Manage your subscription and billing information.',
      });
    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: 'Portal Error',
        description: 'Failed to open customer portal. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9.99',
      interval: 'month',
      description: 'Perfect for regular devotees',
      features: [
        'Basic temple services',
        'Event notifications',
        'Prayer reminders',
        'Monthly newsletter',
        'Basic support'
      ],
      icon: <Check className="w-5 h-5" />,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$19.99',
      interval: 'month',
      description: 'Enhanced spiritual experience',
      features: [
        'All basic features',
        'Priority booking',
        'Personalized prayers',
        'Monthly spiritual guidance',
        'Premium support',
        'Special event access'
      ],
      icon: <Star className="w-5 h-5" />,
      popular: true
    },
    {
      id: 'devotee',
      name: 'Devotee Plan',
      price: '$49.99',
      interval: 'month',
      description: 'Ultimate spiritual journey',
      features: [
        'All premium features',
        'VIP temple access',
        'Personal priest consultation',
        'Special ceremony bookings',
        'Priority support',
        'Exclusive spiritual content',
        'Monthly one-on-one sessions'
      ],
      icon: <Crown className="w-5 h-5" />,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your spiritual journey and temple experience
          </p>
          {!user && (
            <Card className="mt-6 max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <LogIn className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Sign In Required</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to subscribe to our premium plans
                </p>
                <Button onClick={() => navigate('/auth')} className="temple-gradient text-white">
                  Sign In Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Current Subscription */}
        {currentSubscription && (
          <Card className="mb-8 border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-primary">Your Current Plan</CardTitle>
                  <CardDescription>
                    {currentSubscription.plan_type} subscription
                  </CardDescription>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">
                    ${(currentSubscription.amount / 100).toFixed(2)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{currentSubscription.interval}
                    </span>
                  </p>
                </div>
                <Button onClick={handleManageSubscription} variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.popular ? 'border-primary shadow-lg' : ''
              } ${currentSubscription?.plan_type === plan.id ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={!user || loading === plan.id || currentSubscription?.plan_type === plan.id}
                  className={`w-full ${plan.popular ? 'temple-gradient text-white' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {currentSubscription?.plan_type === plan.id 
                    ? 'Current Plan' 
                    : loading === plan.id 
                    ? 'Processing...' 
                    : `Subscribe to ${plan.name}`
                  }
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Subscribe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Skip the queue with priority booking for temple services and special events.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spiritual Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive personalized spiritual guidance and prayer recommendations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exclusive Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access exclusive spiritual content, teachings, and monthly sessions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">VIP Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Enjoy VIP temple access and personal priest consultations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
