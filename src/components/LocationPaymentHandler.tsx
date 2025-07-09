
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { requestLocationPermission, LocationData } from '@/lib/location-service';
import { MapPin, CreditCard, Smartphone, Globe } from 'lucide-react';

interface LocationPaymentHandlerProps {
  amount: number;
  currency?: string;
  description: string;
  customerEmail?: string;
  customerName?: string;
  type: 'service' | 'donation';
  onSuccess?: () => void;
  children: React.ReactNode;
}

const LocationPaymentHandler: React.FC<LocationPaymentHandlerProps> = ({
  amount,
  currency = 'INR',
  description,
  customerEmail,
  customerName,
  type,
  onSuccess,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const { toast } = useToast();

  const handlePaymentClick = async () => {
    setShowLocationDialog(true);
  };

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const location = await requestLocationPermission();
      setLocationData(location);
      
      if (location.isInIndia) {
        await processPhonePePayment();
      } else {
        await processStripePayment();
      }
    } catch (error) {
      console.error('Location error:', error);
      toast({
        title: 'Location Access Required',
        description: 'Please allow location access to proceed with payment. We\'ll use Stripe for international payments.',
        variant: 'destructive'
      });
      // Fallback to Stripe for international users
      await processStripePayment();
    } finally {
      setLoading(false);
      setShowLocationDialog(false);
    }
  };

  const processPhonePePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-phonepe-payment', {
        body: {
          amount,
          currency,
          description,
          customerEmail,
          customerName,
          type
        }
      });

      if (error) throw error;

      // Open PhonePe payment page
      window.open(data.url, '_blank');
      
      toast({
        title: 'Redirecting to PhonePe',
        description: 'Complete your payment using PhonePe (UPI, QR, Cards available)',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('PhonePe payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to create PhonePe payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const processStripePayment = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount,
          currency: 'usd', // Use USD for international payments
          description,
          customerEmail,
          customerName,
          type
        }
      });

      if (error) throw error;

      window.open(data.url, '_blank');
      
      toast({
        title: 'Redirecting to Stripe',
        description: 'Complete your payment using Stripe (International)',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to create Stripe payment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div onClick={handlePaymentClick}>
        {children}
      </div>

      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Location Permission Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                We need your location to provide the best payment experience:
              </p>
              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span><strong>India:</strong> PhonePe (UPI, QR, Cards)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span><strong>International:</strong> Stripe (Cards)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Your location data is only used for payment routing and is not stored.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleLocationPermission}
                disabled={loading}
                className="flex-1 temple-gradient text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Allow Location & Pay'}
              </Button>
              <Button
                onClick={() => setShowLocationDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationPaymentHandler;
