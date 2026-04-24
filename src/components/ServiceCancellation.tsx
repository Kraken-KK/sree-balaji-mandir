import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ServiceCancellation = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancellation = async () => {
    if (!ticketNumber.trim()) {
      toast({ title: 'Error', description: 'Please enter your ticket number', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-service', {
        body: { ticketNumber: ticketNumber.trim(), reason: reason.trim() || null },
      });
      if (error) throw new Error(error.message || 'Cancellation failed');
      if ((data as any)?.error) throw new Error((data as any).error);

      const { refundAmount, refundStatus } = data as { refundAmount: number; refundStatus: string };
      toast({
        title: '✓ Service Cancelled',
        description: `${refundStatus}${refundAmount > 0 ? ` — ₹${refundAmount.toLocaleString('en-IN')}` : ''}. Confirmation email sent.`,
      });
      setTicketNumber('');
      setReason('');
    } catch (error: any) {
      console.error('Cancellation error:', error);
      toast({ title: 'Cancellation Failed', description: error.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" /> Service Cancellation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Cancellation Policy:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Full refund: cancel 48+ hours before service</li>
              <li>• 50% refund: cancel 24–48 hours before</li>
              <li>• No refund: less than 24 hours before</li>
              <li>• Refunds reach your account in 5–7 business days</li>
            </ul>
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ticket-number">Ticket Number</Label>
            <Input id="ticket-number" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} placeholder="e.g., TKT2025123456" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why are you cancelling?" className="mt-1" rows={3} />
          </div>
          <Button onClick={handleCancellation} disabled={isLoading} className="w-full" variant="destructive">
            {isLoading ? 'Processing...' : 'Cancel Service'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          <p><strong>Need Help?</strong></p>
          <p>Email karthikeya.ramarapu@icloud.com or call +91 7780132988</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCancellation;
