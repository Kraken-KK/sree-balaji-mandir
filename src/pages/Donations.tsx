import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, LogIn, Heart } from 'lucide-react';

const Donations = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [donationData, setDonationData] = useState({ amount: '', customAmount: '', purpose: 'general' });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const predefinedAmounts = ['100', '500', '1000', '2500', '5000', 'Other'];
  const donationPurposes = [
    { value: 'general', label: 'General Temple Fund' },
    { value: 'annadanam', label: 'Annadanam (Food Service)' },
    { value: 'maintenance', label: 'Temple Maintenance' },
    { value: 'festivals', label: 'Festival Celebrations' },
    { value: 'charity', label: 'Charity & Welfare' },
  ];

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    const finalAmount = donationData.amount === 'Other' ? donationData.customAmount : donationData.amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
      toast({ title: 'Invalid Amount', variant: 'destructive' });
      return;
    }

    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: Number(finalAmount),
          currency: 'inr',
          description: donationPurposes.find((p) => p.value === donationData.purpose)?.label || 'Donation',
          customerEmail: user.email,
          customerName: user.user_metadata?.full_name || user.email?.split('@')[0],
          type: 'donation',
        },
      });
      if (error) throw error;
      window.open(data.url, '_blank');
      toast({ title: 'Redirecting to Payment' });
      setDonationData({ amount: '', customAmount: '', purpose: 'general' });
    } catch {
      toast({ title: 'Payment Error', description: 'Failed to initiate payment. Please try again.', variant: 'destructive' });
    } finally {
      setPaymentLoading(false);
    }
  };

  const impactItems = [
    { amount: '₹100', desc: 'Feeds 5 devotees', color: 'bg-primary/10' },
    { amount: '₹500', desc: 'Temple oil for 1 week', color: 'bg-accent/10' },
    { amount: '₹1,000', desc: 'Special puja materials', color: 'bg-primary/5' },
    { amount: '₹5,000', desc: 'Festival celebration', color: 'bg-accent/5' },
  ];

  return (
    <div className="min-h-screen gradient-warm-bg">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-5">
            <Heart className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gradient-devotional">{t('donation_title') || 'Make a Donation'}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('donation_subtitle') || 'Support our temple activities and community welfare'}</p>
          {!user && (
            <div className="glass-card max-w-sm mx-auto mt-8 p-6 text-center">
              <LogIn className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-display font-semibold mb-2">Sign In Required</h3>
              <p className="text-sm text-muted-foreground mb-4">Sign in to make donations and receive receipts</p>
              <Button onClick={() => navigate('/auth')} className="gradient-devotional text-white border-0 rounded-xl">Sign In</Button>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className={`glass-card p-6 md:p-8 ${!user ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="text-xl font-display font-semibold mb-6">Donation Details</h2>
            <form onSubmit={handleDonation} className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Select Amount (₹)</Label>
                <RadioGroup value={donationData.amount} onValueChange={(v) => setDonationData({ ...donationData, amount: v })} className="grid grid-cols-3 gap-2">
                  {predefinedAmounts.map((a) => (
                    <div key={a} className="relative">
                      <RadioGroupItem value={a} id={`amt-${a}`} className="peer sr-only" />
                      <Label htmlFor={`amt-${a}`} className="flex items-center justify-center p-3 glass rounded-xl cursor-pointer text-sm font-medium peer-data-[state=checked]:gradient-devotional peer-data-[state=checked]:text-white transition-all duration-300">
                        {a === 'Other' ? 'Other' : `₹${a}`}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {donationData.amount === 'Other' && (
                <div><Label>Custom Amount (₹)</Label><Input type="number" min="1" placeholder="Amount" value={donationData.customAmount} onChange={(e) => setDonationData({ ...donationData, customAmount: e.target.value })} className="rounded-xl" /></div>
              )}
              <div>
                <Label className="text-sm font-medium mb-3 block">Purpose</Label>
                <RadioGroup value={donationData.purpose} onValueChange={(v) => setDonationData({ ...donationData, purpose: v })} className="space-y-2">
                  {donationPurposes.map((p) => (
                    <div key={p.value} className="flex items-center space-x-3 glass rounded-xl p-3">
                      <RadioGroupItem value={p.value} id={`purpose-${p.value}`} />
                      <Label htmlFor={`purpose-${p.value}`} className="text-sm cursor-pointer">{p.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button type="submit" disabled={!user || !donationData.amount || paymentLoading} className="w-full gradient-devotional text-white border-0 rounded-xl py-5 text-lg shadow-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                {paymentLoading ? 'Processing...' : `Donate ₹${donationData.amount === 'Other' ? donationData.customAmount || '0' : donationData.amount || '0'}`}
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-5">Your Impact</h3>
              <div className="space-y-3">
                {impactItems.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3.5 ${item.color} rounded-xl`}>
                    <span className="font-semibold text-sm">{item.amount}</span>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-4">Payment Security</h3>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {['Powered by Stripe – secure payment gateway', '256-bit SSL encryption', 'Tax-exempt donation receipt', '80G tax benefit available', 'Transparent fund utilization'].map((text, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> {text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
