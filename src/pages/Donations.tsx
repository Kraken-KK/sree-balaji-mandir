
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Donations = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [donationData, setDonationData] = useState({
    amount: '',
    customAmount: '',
    donorName: '',
    email: '',
    phone: '',
    purpose: 'general',
  });

  const predefinedAmounts = ['100', '500', '1000', '2500', '5000', 'Other'];

  const donationPurposes = [
    { value: 'general', label: 'General Temple Fund' },
    { value: 'annadanam', label: 'Annadanam (Food Service)' },
    { value: 'maintenance', label: 'Temple Maintenance' },
    { value: 'festivals', label: 'Festival Celebrations' },
    { value: 'charity', label: 'Charity & Welfare' },
  ];

  const handleDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = donationData.amount === 'Other' ? donationData.customAmount : donationData.amount;
    console.log('Donation submitted:', { ...donationData, finalAmount });
    toast({
      title: t('msg_donation_thanks'),
      description: `Thank you for your generous donation of ₹${finalAmount}`,
    });
    setDonationData({
      amount: '',
      customAmount: '',
      donorName: '',
      email: '',
      phone: '',
      purpose: 'general',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('donation_title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('donation_subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Your contribution helps us maintain the temple and serve the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonation} className="space-y-6">
                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Select Amount</Label>
                  <RadioGroup
                    value={donationData.amount}
                    onValueChange={(value) => setDonationData({ ...donationData, amount: value })}
                    className="grid grid-cols-3 gap-3"
                  >
                    {predefinedAmounts.map((amount) => (
                      <div key={amount} className="relative">
                        <RadioGroupItem
                          value={amount}
                          id={amount}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={amount}
                          className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-accent peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-colors"
                        >
                          {amount === 'Other' ? 'Other' : `₹${amount}`}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Custom Amount */}
                {donationData.amount === 'Other' && (
                  <div>
                    <Label htmlFor="customAmount">Custom Amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={donationData.customAmount}
                      onChange={(e) => setDonationData({ ...donationData, customAmount: e.target.value })}
                      required
                    />
                  </div>
                )}

                {/* Purpose */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Donation Purpose</Label>
                  <RadioGroup
                    value={donationData.purpose}
                    onValueChange={(value) => setDonationData({ ...donationData, purpose: value })}
                    className="space-y-2"
                  >
                    {donationPurposes.map((purpose) => (
                      <div key={purpose.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={purpose.value} id={purpose.value} />
                        <Label htmlFor={purpose.value}>{purpose.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Donor Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Donor Information</h3>
                  <div>
                    <Label htmlFor="donorName">Full Name</Label>
                    <Input
                      id="donorName"
                      type="text"
                      value={donationData.donorName}
                      onChange={(e) => setDonationData({ ...donationData, donorName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={donationData.email}
                      onChange={(e) => setDonationData({ ...donationData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={donationData.phone}
                      onChange={(e) => setDonationData({ ...donationData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full temple-gradient text-white text-lg py-6"
                  disabled={!donationData.amount || (donationData.amount === 'Other' && !donationData.customAmount)}
                >
                  {t('donate_now')} - ₹{donationData.amount === 'Other' ? donationData.customAmount || '0' : donationData.amount || '0'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Impact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
                <CardDescription>
                  See how your donations make a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <span>₹100</span>
                  <span className="text-sm text-muted-foreground">Feeds 5 devotees</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <span>₹500</span>
                  <span className="text-sm text-muted-foreground">Temple oil for 1 week</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <span>₹1000</span>
                  <span className="text-sm text-muted-foreground">Special puja materials</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <span>₹5000</span>
                  <span className="text-sm text-muted-foreground">Festival celebration</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Secure payment gateway</li>
                  <li>✓ 256-bit SSL encryption</li>
                  <li>✓ Tax-exempt donation receipt</li>
                  <li>✓ 80G tax benefit available</li>
                  <li>✓ Transparent fund utilization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anonymous</span>
                    <span className="text-sm font-medium">₹2,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Devotee Family</span>
                    <span className="text-sm font-medium">₹5,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Local Community</span>
                    <span className="text-sm font-medium">₹1,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
