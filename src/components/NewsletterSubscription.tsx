import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendNotificationEmail } from '@/lib/email-service';
import { Mail, Sparkles } from 'lucide-react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers' as any)
        .insert([{ email, name: 'Devotee' }] as any);

      if (error) {
        if (error.code === '23505') {
          toast({ title: "Already Subscribed", description: "This email is already subscribed.", variant: "destructive" });
        } else {
          throw error;
        }
        setIsSubscribing(false);
        return;
      }

      await sendNotificationEmail(email, 'Dear Devotee', 'newsletter_signup', {
        subscriberEmail: email,
        subscriptionDate: new Date().toLocaleDateString('en-IN')
      });

      toast({ title: "🙏 Subscribed!", description: "You'll receive divine updates regularly." });
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({ title: "Subscription Failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div>
      <h3 className="text-base font-display font-semibold mb-3 flex items-center gap-2">
        <Mail className="w-4 h-4 text-primary" /> Newsletter
      </h3>
      <p className="text-sm text-muted-foreground mb-3">Get temple updates & spiritual insights</p>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          placeholder="Your email"
          className="flex-1 rounded-xl bg-muted/30 border-border/40 text-sm h-9"
          disabled={isSubscribing}
        />
        <Button
          onClick={handleSubscribe}
          disabled={isSubscribing || !email}
          size="sm"
          className="rounded-xl gradient-devotional text-white border-0 h-9 px-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default NewsletterSubscription;
