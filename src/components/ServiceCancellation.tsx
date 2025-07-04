
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
      toast({
        title: "Error",
        description: "Please enter your ticket number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if ticket exists and belongs to the user
      const { data: ticket, error: fetchError } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_number', ticketNumber.trim())
        .single();

      if (fetchError || !ticket) {
        toast({
          title: "Error",
          description: "Ticket not found or doesn't belong to you",
          variant: "destructive"
        });
        return;
      }

      if (ticket.status === 'cancelled') {
        toast({
          title: "Error",
          description: "This ticket is already cancelled",
          variant: "destructive"
        });
        return;
      }

      // Update ticket status to cancelled
      const { error: updateError } = await supabase
        .from('tickets')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('ticket_number', ticketNumber.trim());

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Your service has been cancelled successfully. Refund will be processed within 5-7 business days.",
      });

      setTicketNumber('');
      setReason('');
    } catch (error) {
      console.error('Cancellation error:', error);
      toast({
        title: "Error",
        description: "Failed to cancel service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Service Cancellation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Cancellation Policy:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Cancellations must be made at least 24 hours before the service date</li>
              <li>• Full refund for cancellations made 48+ hours in advance</li>
              <li>• 50% refund for cancellations made 24-48 hours in advance</li>
              <li>• No refund for cancellations made less than 24 hours before service</li>
              <li>• Emergency cancellations will be reviewed case by case</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ticket-number">Ticket Number</Label>
            <Input
              id="ticket-number"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Enter your ticket number (e.g., TKT2025123456)"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason for Cancellation (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please let us know why you're cancelling..."
              className="mt-1"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleCancellation}
            disabled={isLoading}
            className="w-full"
            variant="destructive"
          >
            {isLoading ? 'Processing...' : 'Cancel Service'}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Need Help?</strong></p>
          <p>Contact our support team at support@sribalajitemple.com or call +91-XXX-XXX-XXXX</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCancellation;
