
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Hash, Clock } from 'lucide-react';
import QRCode from 'qrcode';

interface FlippableTicketCardProps {
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

const FlippableTicketCard: React.FC<FlippableTicketCardProps> = ({ ticket }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(ticket.qr_code, {
          width: 150,
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'used':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'used':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-4 h-full flex flex-col justify-between">
            {/* Status Bar */}
            <div className="flex justify-between items-start mb-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)} animate-pulse`} />
              <Badge variant="outline" className={`${getStatusTextColor(ticket.status)} text-xs font-semibold px-2 py-1`}>
                {ticket.status.toUpperCase()}
              </Badge>
            </div>

            {/* Service Info */}
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                {ticket.service_name}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="truncate">{ticket.customer_name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Booked: {new Date(ticket.booking_date).toLocaleDateString()}</span>
                </div>
                
                {ticket.service_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Service: {new Date(ticket.service_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-orange-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  🕉 Sree Balaji Temple
                </div>
                <div className="text-xs text-orange-600 font-medium">
                  Tap to view QR
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-orange-500 to-red-500 text-white border-2 border-orange-400">
          <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
            {/* Header */}
            <div className="mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
                <span className="text-orange-500 font-bold">🕉</span>
              </div>
              <h4 className="font-bold text-sm opacity-90">Temple Service Ticket</h4>
            </div>

            {/* Ticket Number */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Hash className="w-4 h-4" />
                <span className="font-mono text-lg font-bold">{ticket.ticket_number}</span>
              </div>
              <div className="text-xs opacity-75">Ticket Number</div>
            </div>

            {/* QR Code */}
            <div className="flex-1 flex items-center justify-center">
              {qrCodeUrl && (
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    className="w-24 h-24 mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs opacity-75">
              Present this QR code for verification
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlippableTicketCard;
