
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Camera, CameraOff } from 'lucide-react';

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async (result: string | null) => {
    if (!result || loading) return;

    setLoading(true);
    try {
      // Find ticket by QR code
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          services (name)
        `)
        .eq('qr_code', result)
        .eq('status', 'active')
        .single();

      if (error || !ticket) {
        toast({
          title: "Invalid Ticket",
          description: "This ticket is not valid or has already been used.",
          variant: "destructive",
        });
        setScannedTicket(null);
        return;
      }

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
      const { error } = await supabase
        .from('tickets')
        .update({ 
          status: 'used',
          updated_at: new Date().toISOString()
        })
        .eq('id', scannedTicket.id);

      if (error) throw error;

      toast({
        title: "Ticket Processed",
        description: `Ticket ${scannedTicket.ticket_number} has been marked as used.`,
      });

      setScannedTicket(null);
      setIsScanning(false);

    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Update Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Button
              onClick={() => setIsScanning(!isScanning)}
              variant={isScanning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-4 h-4" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  Start Scanning
                </>
              )}
            </Button>
          </div>

          {isScanning && (
            <div className="w-full max-w-sm mx-auto">
              <QrReader
                onResult={(result, error) => {
                  if (result) {
                    handleScan(result.getText());
                  }
                }}
                constraints={{ facingMode: 'environment' }}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {scannedTicket && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              Valid Ticket Scanned
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Ticket Number:</strong>
                <p className="font-mono">{scannedTicket.ticket_number}</p>
              </div>
              <div>
                <strong>Customer:</strong>
                <p>{scannedTicket.customer_name}</p>
              </div>
              <div>
                <strong>Service:</strong>
                <p>{scannedTicket.services?.name}</p>
              </div>
              <div>
                <strong>Status:</strong>
                <Badge variant="default">{scannedTicket.status}</Badge>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={markTicketAsUsed}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Processing...' : 'Mark as Used'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRScanner;
