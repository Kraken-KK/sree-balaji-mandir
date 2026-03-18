import React from 'react';
import QRCode from 'qrcode';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Hash, MapPin, Clock, Ticket } from 'lucide-react';

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
          margin: 1,
          color: { dark: '#1a1a2e', light: '#FFFFFF' },
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQR();
  }, [ticket.qr_code]);

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    used: 'bg-muted text-muted-foreground border-border',
    cancelled: 'bg-destructive/10 text-destructive border-destructive/30',
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Ticket shape with notches */}
      <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl">
        {/* Header band */}
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 text-white relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">🕉</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg leading-tight">Sree Balaji Mandir</h3>
              <p className="text-white/70 text-xs">Service Ticket</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-1.5 w-fit backdrop-blur-sm">
            <Ticket className="w-3.5 h-3.5" />
            <span className="font-mono text-sm font-bold tracking-wider">{ticket.ticket_number}</span>
          </div>
        </div>

        {/* Notch separator */}
        <div className="relative h-4">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r-2 border-border" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l-2 border-border" />
          <div className="mx-8 border-t-2 border-dashed border-border/50 mt-2" />
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Service info */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Service</p>
            <p className="font-display font-semibold text-lg text-foreground">{ticket.service_name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3 h-3" /> Name
              </p>
              <p className="text-sm font-medium text-foreground">{ticket.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm font-medium text-foreground truncate">{ticket.customer_email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ticket.service_date && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Service Date
                </p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(ticket.service_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Booked
              </p>
              <p className="text-sm font-medium text-foreground">
                {new Date(ticket.booking_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* QR and Status */}
          <div className="flex items-end justify-between pt-2">
            <div className="text-center">
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" className="rounded-xl shadow-sm border border-border" style={{ width: '100px', height: '100px' }} />
              )}
              <p className="text-[10px] text-muted-foreground mt-1">Scan to verify</p>
            </div>
            <div className="text-right">
              <Badge className={`${statusColors[ticket.status] || statusColors.active} capitalize font-semibold border px-3 py-1`}>
                {ticket.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 px-6 py-3 text-center">
          <p className="text-[10px] text-muted-foreground">
            Present this ticket at the temple • Valid for the specified service date
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketGenerator;
