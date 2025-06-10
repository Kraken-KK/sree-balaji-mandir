
import React from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, Hash } from 'lucide-react';

interface TicketGeneratorProps {
  ticket: {
    id: string;
    ticket_number: string;
    customer_name: string;
    customer_email: string;
    service_name: string;
    booking_date: string;
    service_date?: string;
    status: string;
    qr_code: string;
  };
}

const TicketGenerator: React.FC<TicketGeneratorProps> = ({ ticket }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ticket.qr_code, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [ticket.qr_code]);

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl">
      {/* Header with temple logo area */}
      <CardHeader className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <span className="text-orange-500 font-bold text-lg">🕉</span>
          </div>
        </div>
        <CardTitle className="text-lg font-bold">Sree Balaji Mandir</CardTitle>
        <p className="text-sm opacity-90">Service Ticket</p>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Ticket Number */}
        <div className="text-center">
          <Badge variant="secondary" className="text-lg px-4 py-2 font-mono">
            <Hash className="w-4 h-4 mr-1" />
            {ticket.ticket_number}
          </Badge>
        </div>

        <Separator />

        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            <span className="font-medium">{ticket.customer_name}</span>
          </div>
          <div className="text-xs text-gray-600">{ticket.customer_email}</div>
        </div>

        {/* Service Info */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-800">{ticket.service_name}</div>
          {ticket.service_date && (
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="w-3 h-3 mr-1" />
              Service Date: {new Date(ticket.service_date).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="w-3 h-3 mr-1" />
            Booked: {new Date(ticket.booking_date).toLocaleDateString()}
          </div>
        </div>

        <Separator />

        {/* QR Code */}
        <div className="text-center">
          {qrCodeUrl && (
            <img 
              src={qrCodeUrl} 
              alt="Ticket QR Code" 
              className="mx-auto rounded-lg shadow-sm"
              style={{ width: '120px', height: '120px' }}
            />
          )}
          <p className="text-xs text-gray-500 mt-2">Scan to verify ticket</p>
        </div>

        {/* Status */}
        <div className="text-center">
          <Badge 
            variant={ticket.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {ticket.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketGenerator;
