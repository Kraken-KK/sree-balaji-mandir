import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Camera, CameraOff, Scan } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  useEffect(() => {
    console.log('Available video devices:', devices);
    console.log('Selected device ID:', selectedDeviceId);
  }, [devices, selectedDeviceId]);

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
          services (name)
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
      <Card className="animate-fade-in hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Scan className="w-5 h-5 text-primary" />
            </div>
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => setIsScanning(!isScanning)}
              variant={isScanning ? "destructive" : "default"}
              className="flex items-center gap-2 hover-scale transition-all duration-300"
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
                className="flex items-center gap-2"
                size="lg"
              >
                Reset Scanner
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="w-full max-w-sm mx-auto animate-scale-in">
              <div className="relative">
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
                    video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined },
                  }}
                  className="w-full rounded-lg overflow-hidden"
                />
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-primary rounded-br-lg"></div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Point camera at QR code to scan
              </p>
            </div>
          )}

          {isScanning && (
            <div className="flex justify-center">
              <Button
                onClick={() => setCameraFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Switch Camera
              </Button>
            </div>
          )}

          {devices.length > 0 && (
            <div className="flex justify-center gap-2">
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${device.deviceId}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {scannedTicket && (
        <Card className={`animate-scale-in hover-lift ${
          scannedTicket.status === 'used' 
            ? 'border-red-200 bg-red-50' 
            : 'border-green-200 bg-green-50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${
              scannedTicket.status === 'used' 
                ? 'text-red-700' 
                : 'text-green-700'
            }`}>
              {scannedTicket.status === 'used' ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {scannedTicket.status === 'used' ? 'Ticket Used ✓' : 'Valid Ticket Scanned'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div>
                  <strong>Ticket Number:</strong>
                  <p className="font-mono text-lg">{scannedTicket.ticket_number}</p>
                </div>
                <div>
                  <strong>Customer:</strong>
                  <p>{scannedTicket.customer_name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <strong>Service:</strong>
                  <p>{scannedTicket.services?.name}</p>
                </div>
                <div>
                  <strong>Status:</strong>
                  <Badge variant={scannedTicket.status === 'used' ? 'destructive' : 'default'}>
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
                  className="bg-green-600 hover:bg-green-700 hover-scale"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Mark as Used'}
                </Button>
              </div>
            )}

            {scannedTicket.status === 'used' && (
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
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
