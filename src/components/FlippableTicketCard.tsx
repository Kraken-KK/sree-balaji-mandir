
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Hash, Clock, Ticket } from 'lucide-react';
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

  const getStatusColor = (status: string) =>
    status === 'active' ? 'bg-green-500' : status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500';

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto mb-4">
      <div
        className={`relative w-full h-48 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-xl">
          <div className="p-6 h-full flex flex-col justify-between text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Ticket className="w-6 h-6" />
                <span className="font-bold text-lg">Temple Ticket</span>
              </div>
              <Badge className={`${getStatusColor(ticket.status)} text-white border-0 animate-pulse`}>
                {ticket.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium truncate">{ticket.customer_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm truncate">{ticket.service_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {ticket.service_date 
                    ? new Date(ticket.service_date).toLocaleDateString()
                    : 'Date TBD'
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs">
                  Booked: {new Date(ticket.booking_date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="text-xs opacity-80 text-center">
              Tap to view QR code
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl bg-white dark:bg-gray-800 shadow-xl border-2 border-gray-200 dark:border-gray-700">
          <div className="p-6 h-full flex flex-col justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Hash className="w-5 h-5 text-primary" />
                <span className="font-mono text-lg font-bold text-primary">
                  {ticket.ticket_number}
                </span>
              </div>
              
              {qrCodeUrl && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    className="rounded-lg shadow-md animate-scale-in"
                    style={{ width: '120px', height: '120px' }}
                  />
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Present this QR code for verification
              </p>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Tap to view details
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlippableTicketCard;
