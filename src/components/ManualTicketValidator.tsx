
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, CheckCircle, XCircle, Hash, User, Calendar } from 'lucide-react';

const ManualTicketValidator: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState('');
  const [validatedTicket, setValidatedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchTicket = async () => {
    if (!ticketNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ticket number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, price)
        `)
        .eq('ticket_number', ticketNumber.trim())
        .single();

      if (error || !ticket) {
        toast({
          title: "Ticket Not Found",
          description: "No ticket found with this number.",
          variant: "destructive",
        });
        setValidatedTicket(null);
        return;
      }

      setValidatedTicket(ticket);
      toast({
        title: "Ticket Found",
        description: `Ticket ${ticket.ticket_number} located successfully.`,
      });
    } catch (error) {
      console.error('Error searching ticket:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markTicketAsUsed = async () => {
    if (!validatedTicket) return;

    if (validatedTicket.status === 'used') {
      toast({
        title: "Ticket Already Used",
        description: "This ticket has already been processed.",
        variant: "destructive",
      });
      return;
    }

    if (validatedTicket.status === 'cancelled') {
      toast({
        title: "Cannot Process",
        description: "This ticket has been cancelled and cannot be used.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({ 
          status: 'used',
          updated_at: new Date().toISOString()
        })
        .eq('id', validatedTicket.id)
        .eq('status', 'active')
        .select();

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Ticket status could not be updated - it may have been processed by another operator');
      }

      toast({
        title: "Ticket Processed Successfully",
        description: `Ticket ${validatedTicket.ticket_number} has been marked as used.`,
      });

      setValidatedTicket({ ...validatedTicket, status: 'used' });
      
      // Reset after successful processing
      setTimeout(() => {
        setValidatedTicket(null);
        setTicketNumber('');
      }, 3000);

    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Update Error",
        description: error instanceof Error ? error.message : "Failed to update ticket status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetValidator = () => {
    setValidatedTicket(null);
    setTicketNumber('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            Manual Ticket Validator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="ticket-number" className="text-white">Ticket Number</Label>
              <Input
                id="ticket-number"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Enter ticket number (e.g., TKT2025123456)"
                className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button
                onClick={searchTicket}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 px-6 py-2 rounded-xl font-semibold"
              >
                {loading ? 'Searching...' : 'Search Ticket'}
              </Button>
              {(validatedTicket || ticketNumber) && (
                <Button
                  onClick={resetValidator}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6 py-2 rounded-xl font-semibold"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {validatedTicket && (
        <Card className={`bg-white/5 backdrop-blur-md border transition-all duration-300 ${
          validatedTicket.status === 'used' 
            ? 'border-red-500/50 bg-red-500/10' 
            : validatedTicket.status === 'cancelled'
            ? 'border-yellow-500/50 bg-yellow-500/10'
            : 'border-green-500/50 bg-green-500/10'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${
              validatedTicket.status === 'used' 
                ? 'text-red-400' 
                : validatedTicket.status === 'cancelled'
                ? 'text-yellow-400'
                : 'text-green-400'
            }`}>
              {validatedTicket.status === 'used' ? (
                <XCircle className="w-6 h-6" />
              ) : validatedTicket.status === 'cancelled' ? (
                <XCircle className="w-6 h-6" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
              {validatedTicket.status === 'used' ? 'Ticket Already Used' : 
               validatedTicket.status === 'cancelled' ? 'Ticket Cancelled' : 
               'Valid Ticket Found'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Ticket Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="font-mono text-xl font-bold text-white">{validatedTicket.ticket_number}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Customer</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-white">{validatedTicket.customer_name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Service</label>
                  <p className="text-white">{validatedTicket.services?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Booking Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-white">{new Date(validatedTicket.booking_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <Badge 
                    variant={
                      validatedTicket.status === 'used' ? 'destructive' : 
                      validatedTicket.status === 'cancelled' ? 'secondary' : 'default'
                    }
                    className="font-semibold mt-1"
                  >
                    {validatedTicket.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {validatedTicket.status === 'active' && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={markTicketAsUsed}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8 py-3 rounded-xl font-semibold"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Mark as Used'}
                </Button>
              </div>
            )}

            {(validatedTicket.status === 'used' || validatedTicket.status === 'cancelled') && (
              <div className="text-center pt-4">
                <p className="text-sm text-gray-300">
                  {validatedTicket.status === 'used' 
                    ? 'This ticket has been successfully processed and cannot be used again.'
                    : 'This ticket has been cancelled and cannot be processed.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManualTicketValidator;
