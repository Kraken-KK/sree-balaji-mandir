
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ServiceCancellation = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [ticketFound, setTicketFound] = useState<any>(null);
  const { toast } = useToast();

  const validateTicket = async (ticketNum: string) => {
    if (!ticketNum.trim()) {
      setTicketFound(null);
      return;
    }

    setIsValidating(true);
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select('*, services(name)')
        .eq('ticket_number', ticketNum.trim())
        .single();

      if (error || !ticket) {
        setTicketFound(null);
        return;
      }

      setTicketFound(ticket);
    } catch (error) {
      console.error('Validation error:', error);
      setTicketFound(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleTicketNumberChange = (value: string) => {
    setTicketNumber(value);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateTicket(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleCancellation = async () => {
    if (!ticketNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your ticket number",
        variant: "destructive"
      });
      return;
    }

    if (!ticketFound) {
      toast({
        title: "Error",
        description: "Please enter a valid ticket number",
        variant: "destructive"
      });
      return;
    }

    if (ticketFound.status === 'cancelled') {
      toast({
        title: "Error",
        description: "This ticket is already cancelled",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
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

      // Reset form
      setTicketNumber('');
      setReason('');
      setTicketFound(null);
      
      // Trigger a real-time update for other components
      window.dispatchEvent(new CustomEvent('ticketCancelled', { 
        detail: { ticketNumber: ticketNumber.trim() } 
      }));
      
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
    <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
          <RefreshCw className="w-5 h-5" />
          Service Cancellation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
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
            <Label htmlFor="ticket-number" className="text-foreground dark:text-white">
              Ticket Number
            </Label>
            <div className="relative mt-1">
              <Input
                id="ticket-number"
                value={ticketNumber}
                onChange={(e) => handleTicketNumberChange(e.target.value)}
                placeholder="Enter your ticket number (e.g., TKT2025123456)"
                className="pr-10 bg-background dark:bg-gray-700 border-border dark:border-gray-600 text-foreground dark:text-white"
              />
              {isValidating && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {ticketFound && !isValidating && (
                <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
              )}
            </div>
            
            {ticketFound && (
              <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md animate-fade-in">
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p className="font-medium">✓ Ticket Found</p>
                  <p>Service: {ticketFound.services?.name}</p>
                  <p>Status: <span className="capitalize">{ticketFound.status}</span></p>
                  <p>Customer: {ticketFound.customer_name}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="reason" className="text-foreground dark:text-white">
              Reason for Cancellation (Optional)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please let us know why you're cancelling..."
              className="mt-1 bg-background dark:bg-gray-700 border-border dark:border-gray-600 text-foreground dark:text-white"
              rows={3}
            />
          </div>

          <Button 
            onClick={handleCancellation}
            disabled={isLoading || !ticketFound || ticketFound?.status === 'cancelled'}
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Cancel Service'
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground dark:text-gray-300 bg-muted dark:bg-gray-700 p-3 rounded-md">
          <p><strong>Need Help?</strong></p>
          <p>Contact our support team at support@sribalajitemple.com or call +91-XXX-XXX-XXXX</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCancellation;
