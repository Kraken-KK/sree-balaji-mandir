
import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Camera, CameraOff, Scan, RotateCcw } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const { toast } = useToast();

  // Set up real-time subscription to ticket updates
  useEffect(() => {
    const channel = supabase
      .channel('ticket-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tickets'
        },
        (payload) => {
          console.log('Real-time ticket update:', payload);
          if (scannedTicket && payload.new.id === scannedTicket.id) {
            setScannedTicket(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scannedTicket]);

  const handleScan = async (result: string | null) => {
    if (!result || loading || result === lastScannedCode) return;

    console.log('Scanned QR code:', result);
    setLastScannedCode(result);
    setLoading(true);
    
    try {
      // Find ticket by QR code with fresh data
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name, price)
        `)
        .eq('qr_code', result)
        .single();

      console.log('Ticket query result:', { ticket, error });

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Ticket Not Found",
          description: "This QR code doesn't match any ticket in our system.",
          variant: "destructive",
        });
        setScannedTicket(null);
        return;
      }

      if (!ticket) {
        toast({
          title: "Invalid Ticket",
          description: "No ticket found with this QR code.",
          variant: "destructive",
        });
        setScannedTicket(null);
        return;
      }

      // Check if ticket is already used
      if (ticket.status === 'used') {
        toast({
          title: "Ticket Already Used",
          description: `Ticket ${ticket.ticket_number} has already been processed.`,
          variant: "destructive",
        });
        setScannedTicket(ticket);
        return;
      }

      // Valid active ticket found
      setScannedTicket(ticket);
      toast({
        title: "Valid Ticket Found",
        description: `Ticket ${ticket.ticket_number} verified successfully.`,
      });

    } catch (error) {
      console.error('Error scanning ticket:', error);
      toast({
        title: "Scan Error",
        description: "Failed to verify ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markTicketAsUsed = async () => {
    if (!scannedTicket) return;

    setLoading(true);
    try {
      console.log('Marking ticket as used:', scannedTicket.id);
      
      // Use a transaction-like approach with optimistic locking
      const { data: currentTicket, error: fetchError } = await supabase
        .from('tickets')
        .select('status')
        .eq('id', scannedTicket.id)
        .single();

      if (fetchError) {
        throw new Error('Failed to verify current ticket status');
      }

      if (currentTicket.status === 'used') {
        toast({
          title: "Ticket Already Used",
          description: "This ticket has already been processed by another operator.",
          variant: "destructive",
        });
        setScannedTicket({ ...scannedTicket, status: 'used' });
        return;
      }

      const { data, error } = await supabase
        .from('tickets')
        .update({ 
          status: 'used',
          updated_at: new Date().toISOString()
        })
        .eq('id', scannedTicket.id)
        .eq('status', 'active') // Only update if still active
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Ticket status could not be updated - it may have been processed by another operator');
      }

      toast({
        title: "Ticket Processed Successfully",
        description: `Ticket ${scannedTicket.ticket_number} has been marked as used.`,
      });

      // Update the local state to reflect the change
      setScannedTicket({ ...scannedTicket, status: 'used' });
      
      // Reset scanner after successful processing
      setTimeout(() => {
        setScannedTicket(null);
        setIsScanning(false);
        setLastScannedCode('');
      }, 3000);

    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Update Error",
        description: error instanceof Error ? error.message : "Failed to update ticket status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScannedTicket(null);
    setLastScannedCode('');
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => setIsScanning(!isScanning)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isScanning 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
              }`}
              size="lg"
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-5 h-5" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" />
                  Start Scanning
                </>
              )}
            </Button>
            
            {(scannedTicket || lastScannedCode) && (
              <Button
                onClick={resetScanner}
                variant="outline"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
                size="lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset Scanner
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="w-full max-w-md mx-auto">
              <div className="relative rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
                <QrReader
                  onResult={(result, error) => {
                    if (result) {
                      handleScan(result.getText());
                    }
                    if (error) {
                      console.log('QR Reader error:', error);
                    }
                  }}
                  constraints={{
                    facingMode: cameraFacingMode,
                  }}
                  className="w-full"
                />
                <div className="absolute inset-4 border-2 border-white/30 rounded-xl pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-white rounded-br-lg"></div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-300 mt-4">
                Point camera at QR code to scan
              </p>
            </div>
          )}

          {isScanning && (
            <div className="flex justify-center">
              <Button
                onClick={() => setCameraFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Switch Camera
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {scannedTicket && (
        <Card className={`bg-white/5 backdrop-blur-md border transition-all duration-300 ${
          scannedTicket.status === 'used' 
            ? 'border-red-500/50 bg-red-500/10' 
            : 'border-green-500/50 bg-green-500/10'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-3 ${
              scannedTicket.status === 'used' 
                ? 'text-red-400' 
                : 'text-green-400'
            }`}>
              {scannedTicket.status === 'used' ? (
                <XCircle className="w-6 h-6" />
              ) : (
                <CheckCircle className="w-6 h-6" />
              )}
              {scannedTicket.status === 'used' ? 'Ticket Used ✓' : 'Valid Ticket Scanned'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Ticket Number</label>
                  <p className="font-mono text-xl font-bold text-white">{scannedTicket.ticket_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Customer</label>
                  <p className="text-white">{scannedTicket.customer_name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">Service</label>
                  <p className="text-white">{scannedTicket.services?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Status</label>
                  <Badge 
                    variant={scannedTicket.status === 'used' ? 'destructive' : 'default'}
                    className="font-semibold"
                  >
                    {scannedTicket.status === 'used' ? 'USED' : scannedTicket.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            {scannedTicket.status === 'active' && (
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

            {scannedTicket.status === 'used' && (
              <div className="text-center pt-4">
                <p className="text-sm text-gray-300">
                  This ticket has been successfully processed and cannot be used again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
