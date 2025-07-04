import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Bell, Gift, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubscriberDialogProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

const SubscriberDialog = ({ open, onClose, userEmail, userName }: SubscriberDialogProps) => {
  const [email, setEmail] = useState(userEmail);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      // Simulate API call to subscribe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscribed Successfully!",
        description: "You'll receive updates about temple events and spiritual insights.",
      });
      
      // Store subscription preference
      localStorage.setItem('newsletter_subscribed', 'true');
      localStorage.setItem('newsletter_email', email);
      
      onClose();
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDecline = () => {
    localStorage.setItem('newsletter_subscribed', 'false');
    toast({
      title: "No worries!",
      description: "You can always subscribe later from your settings.",
    });
    onClose();
  };

  const benefits = [
    {
      icon: Bell,
      title: "Event Notifications",
      description: "Get notified about upcoming festivals and special events"
    },
    {
      icon: Star,
      title: "Spiritual Insights",
      description: "Receive daily spiritual thoughts and teachings"
    },
    {
      icon: Gift,
      title: "Exclusive Content",
      description: "Access to special prayers and temple announcements"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Join Our Spiritual Newsletter
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Stay connected with Sri Balaji Temple community and receive divine blessings directly in your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits */}
          <div className="grid gap-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              We'll send updates to this email address
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleSubscribe}
              disabled={isSubscribing || !email}
              className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
            >
              {isSubscribing ? 'Subscribing...' : 'Yes, Subscribe Me!'}
            </Button>
            
            <Button 
              onClick={handleDecline}
              variant="outline"
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can unsubscribe at any time. We respect your privacy and will never spam you.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriberDialog;