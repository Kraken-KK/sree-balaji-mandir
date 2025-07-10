import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Ticket, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface TicketInfo {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  booking_date: string;
  service_date: string | null;
  services: {
    name: string;
    description: string | null;
    price: number | null;
  } | null;
}

const EnhancedManualTicketValidator = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateTicket = async () => {
    if (!ticketNumber.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a ticket number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Validating ticket:', ticketNumber);
      
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          id,
          ticket_number,
          customer_name,
          customer_email,
          status,
          booking_date,
          service_date,
          services (
            name,
            description,
            price
          )
        `)
        .eq('ticket_number', ticketNumber.toUpperCase())
        .single();

      if (error) {
        console.error('Ticket validation error:', error);
        if (error.code === 'PGRST116') {
          toast({
            title: "Ticket Not Found",
            description: "No ticket found with this number. Please check and try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setTicketInfo(null);
        return;
      }

      setTicketInfo(data);
      console.log('Ticket validated successfully:', data);
      
      toast({
        title: "Ticket Found",
        description: `Ticket validated successfully for ${data.customer_name}`,
        className: "temple-gradient text-white border-0",
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate ticket. Please try again.",
        variant: "destructive",
      });
      setTicketInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const validateTicketStatus = async () => {
    if (!ticketInfo) return;

    setIsValidating(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'used',
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketInfo.id);

      if (error) throw error;

      setTicketInfo({ ...ticketInfo, status: 'used' });
      
      toast({
        title: "Ticket Validated",
        description: "Ticket has been marked as used successfully",
        className: "temple-gradient text-white border-0",
      });

      // Auto-clear after successful validation
      setTimeout(() => {
        setTicketNumber('');
        setTicketInfo(null);
      }, 3000);

    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'used':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'used':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Used</Badge>;
      case 'cancelled':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const resetValidation = () => {
    setTicketNumber('');
    setTicketInfo(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Manual Ticket Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter ticket number (e.g., TKT2024123456)"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && validateTicket()}
                className="transition-all duration-300 focus:scale-105 focus:shadow-lg"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={validateTicket}
              disabled={isLoading || !ticketNumber.trim()}
              className="hover:scale-105 transition-all duration-300 temple-gradient"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Validate
            </Button>
            {ticketInfo && (
              <Button
                variant="outline"
                onClick={resetValidation}
                className="hover:scale-105 transition-all duration-300"
              >
                Clear
              </Button>
            )}
          </div>

          {/* Ticket Information */}
          {ticketInfo && (
            <Card className="animate-scale-in border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{ticketInfo.ticket_number}</h3>
                        <p className="text-sm text-muted-foreground">Ticket Information</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(ticketInfo.status)}
                      {getStatusBadge(ticketInfo.status)}
                    </div>
                  </div>

                  <Separator />

                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Customer Details</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <p className="font-medium">{ticketInfo.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{ticketInfo.customer_email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Booking Details</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Booked:</span>{' '}
                          {new Date(ticketInfo.booking_date).toLocaleDateString()}
                        </p>
                        {ticketInfo.service_date && (
                          <p className="text-sm">
                            <span className="font-medium">Service Date:</span>{' '}
                            {new Date(ticketInfo.service_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  {ticketInfo.services && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-medium">Service Details</h4>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="font-medium">{ticketInfo.services.name}</p>
                          {ticketInfo.services.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {ticketInfo.services.description}
                            </p>
                          )}
                          {ticketInfo.services.price && (
                            <p className="text-sm font-medium mt-2">
                              Price: ₹{ticketInfo.services.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Validation Actions */}
                  {ticketInfo.status === 'active' && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            Ticket is valid and ready for use
                          </span>
                        </div>
                        <Button
                          onClick={validateTicketStatus}
                          disabled={isValidating}
                          className="temple-gradient hover:scale-105 transition-all duration-300"
                        >
                          {isValidating ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Mark as Used
                        </Button>
                      </div>
                    </>
                  )}

                  {ticketInfo.status === 'used' && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-200">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">
                        This ticket has already been used
                      </span>
                    </div>
                  )}

                  {ticketInfo.status === 'cancelled' && (
                    <div className="flex items-center gap-2 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <XCircle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        This ticket has been cancelled
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedManualTicketValidator;