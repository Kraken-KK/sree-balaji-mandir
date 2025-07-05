import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendNotificationEmail } from '@/lib/email-service';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    try {
      // For now, store in localStorage until database types are updated
      const existingSubscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      
      if (existingSubscribers.includes(email)) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter.",
          variant: "destructive"
        });
        setIsSubscribing(false);
        return;
      }

      // Add to localStorage
      existingSubscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(existingSubscribers));

      // Send welcome email
      await sendNotificationEmail(
        email, 
        'Dear Devotee', 
        'newsletter_signup',
        {
          subscriberEmail: email,
          subscriptionDate: new Date().toLocaleDateString('en-IN')
        }
      );

      toast({
        title: "🙏 Subscribed Successfully!",
        description: "You'll receive divine updates and temple news regularly.",
      });

      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <h3 className="text-xl font-semibold mb-4">📧 Divine Newsletter</h3>
      <p className="text-gray-300 mb-4">Get weekly temple updates, event notifications, and spiritual insights</p>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your email for blessings"
          className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-primary"
          disabled={isSubscribing}
        />
        <Button 
          onClick={handleSubscribe}
          disabled={isSubscribing || !email}
          className="temple-gradient hover:scale-105 transition-transform px-6"
        >
          {isSubscribing ? '🙏' : '✨ Subscribe'}
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        🔒 We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default NewsletterSubscription;