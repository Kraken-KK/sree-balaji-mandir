
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TicketGenerator from './TicketGenerator';
import QRCode from 'qrcode';
import { Receipt, Ticket, Heart, Download, Calendar, DollarSign, Printer } from 'lucide-react';

const UserHistorySection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  const fetchUserHistory = async () => {
    try {
      const [donationsRes, ticketsRes, paymentsRes] = await Promise.all([
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user?.id)
          .eq('type', 'donation')
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tickets')
          .select(`
            *,
            services (name)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('payments')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
      ]);

      setDonations(donationsRes.data || []);
      setTickets(ticketsRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (error) {
      console.error('Error fetching user history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const TEMPLE = {
    name: 'Sree Balaji Mandir',
    tagline: 'Sacred Space of Devotion & Community',
    address: 'Sri Balaji Temple Road, India',
    phone: '+91 98765 43210',
    email: 'contact@mail.tatthva.tech',
    web: 'sree-balaji-mandir.lovable.app',
    logo: 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png',
  };

  const openPrintWindow = (html: string) => {
    const w = window.open('', '_blank', 'width=900,height=1000');
    if (!w) {
      toast({ title: 'Pop-up blocked', description: 'Please allow pop-ups to print.', variant: 'destructive' });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { try { w.print(); } catch {} }, 600);
  };

  const downloadInvoice = async (payment: any, ticket?: any) => {
    let qrCodeDataUrl = '';
    if (ticket && ticket.qr_code) {
      try {
        qrCodeDataUrl = await QRCode.toDataURL(ticket.qr_code, {
          width: 220, margin: 1, color: { dark: '#1a1a2e', light: '#FFFFFF' },
        });
      } catch (e) { console.error('QR error', e); }
    }

    const isDonation = payment.type === 'donation';
    const invoiceNo = `INV-${new Date(payment.created_at).getFullYear()}-${payment.id.substring(0, 8).toUpperCase()}`;
    const dateStr = new Date(payment.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const amt = Number(payment.amount).toLocaleString('en-IN');

    const invoiceHTML = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${invoiceNo}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Playfair+Display:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#fff7ed;padding:24px;color:#1a1a2e;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .wrap{max-width:820px;margin:0 auto;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 30px 60px -20px rgba(234,88,12,.35);position:relative}
  .wrap::before{content:"";position:absolute;inset:0;background:radial-gradient(1200px 200px at 0 0,rgba(251,191,36,.18),transparent 60%),radial-gradient(800px 200px at 100% 100%,rgba(244,63,94,.15),transparent 60%);pointer-events:none}
  .hero{position:relative;padding:38px 40px 90px;background:linear-gradient(135deg,#7c2d12 0%,#c2410c 35%,#ea580c 65%,#f59e0b 100%);color:#fff;overflow:hidden}
  .hero::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:60px;background:radial-gradient(ellipse at center top,#fff 0,#fff 60%,transparent 61%);transform:scaleX(1.5)}
  .om{position:absolute;right:-40px;top:-40px;font-size:280px;opacity:.08;font-family:serif;line-height:1}
  .brand{display:flex;align-items:center;gap:14px}
  .brand img{width:64px;height:64px;background:rgba(255,255,255,.95);border-radius:50%;padding:6px;box-shadow:0 8px 20px rgba(0,0,0,.25)}
  .brand h1{font-family:'Cinzel Decorative',serif;font-weight:900;font-size:26px;letter-spacing:.04em}
  .brand p{font-size:12px;opacity:.85;margin-top:2px;letter-spacing:.08em;text-transform:uppercase}
  .invMeta{margin-top:24px;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;position:relative;z-index:1}
  .invMeta .lbl{font-size:11px;opacity:.8;text-transform:uppercase;letter-spacing:.15em;margin-bottom:4px}
  .invMeta .val{font-family:'Playfair Display',serif;font-size:18px;font-weight:700}
  .pill{display:inline-block;padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.3)}
  .body{padding:0 40px 40px;position:relative;margin-top:-40px;z-index:2}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
  .panel{background:linear-gradient(180deg,#fffbeb,#fff);border:1px solid #fde68a;border-radius:16px;padding:18px}
  .panel h3{font-family:'Playfair Display',serif;font-size:13px;color:#9a3412;text-transform:uppercase;letter-spacing:.18em;margin-bottom:10px;display:flex;align-items:center;gap:8px}
  .panel h3::before{content:"";width:18px;height:2px;background:linear-gradient(90deg,#ea580c,#f59e0b);border-radius:2px}
  .row{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
  .row span:first-child{color:#78716c}
  .row span:last-child{color:#1c1917;font-weight:600}
  .desc{margin:8px 0 24px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,#fef3c7,#fed7aa);border-left:4px solid #ea580c}
  .desc .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#9a3412;font-weight:600;margin-bottom:4px}
  .desc .val{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#7c2d12}
  .total{margin:28px 0;padding:28px;border-radius:20px;text-align:center;background:linear-gradient(135deg,#7c2d12,#ea580c,#f59e0b);color:#fff;position:relative;overflow:hidden}
  .total::before{content:"";position:absolute;inset:2px;border-radius:18px;border:1px dashed rgba(255,255,255,.4)}
  .total .lbl{font-size:11px;text-transform:uppercase;letter-spacing:.25em;opacity:.9;margin-bottom:6px;position:relative}
  .total .amt{font-family:'Cinzel Decorative',serif;font-size:48px;font-weight:900;position:relative;text-shadow:0 2px 8px rgba(0,0,0,.25)}
  .total .sub{font-size:11px;opacity:.85;margin-top:4px;position:relative}
  ${ticket ? `
  .tic{margin:24px 0;padding:22px;border-radius:16px;background:linear-gradient(135deg,#312e81,#7e22ce,#db2777);color:#fff;display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center}
  .tic h4{font-family:'Cinzel Decorative',serif;font-size:14px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:10px}
  .tic .num{font-family:'Courier New',monospace;font-size:22px;font-weight:700;letter-spacing:.1em;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:8px;display:inline-block;margin-bottom:8px}
  .tic .meta{font-size:13px;opacity:.95;line-height:1.7}
  .qr{background:#fff;padding:8px;border-radius:12px}
  .qr img{display:block;width:120px;height:120px}
  ` : ''}
  .footer{padding:24px 40px;background:linear-gradient(180deg,#fff,#fef3c7);border-top:2px solid #fbbf24;text-align:center}
  .footer .name{font-family:'Cinzel Decorative',serif;font-weight:700;font-size:16px;color:#7c2d12;margin-bottom:6px}
  .footer .meta{font-size:12px;color:#78716c;line-height:1.7}
  .footer .thx{margin-top:14px;font-family:'Playfair Display',serif;font-style:italic;color:#9a3412;font-size:14px}
  @media print{body{background:#fff;padding:0}.wrap{box-shadow:none;border-radius:0}}
</style></head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="om">ॐ</div>
      <div class="brand">
        <img src="${TEMPLE.logo}" alt="logo"/>
        <div>
          <h1>${TEMPLE.name}</h1>
          <p>${TEMPLE.tagline}</p>
        </div>
      </div>
      <div class="invMeta">
        <div>
          <div class="lbl">Invoice No.</div>
          <div class="val">${invoiceNo}</div>
          <div class="lbl" style="margin-top:10px">Issue Date</div>
          <div class="val">${dateStr}</div>
        </div>
        <div style="text-align:right">
          <span class="pill">${isDonation ? 'Donation Receipt' : 'Service Invoice'}</span>
          <div style="margin-top:10px"><span class="pill">${payment.status}</span></div>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="grid2">
        <div class="panel">
          <h3>Billed To</h3>
          <div class="row"><span>Name</span><span>${payment.customer_name || 'Devotee'}</span></div>
          <div class="row"><span>Email</span><span>${payment.customer_email || '—'}</span></div>
          <div class="row"><span>Date</span><span>${dateStr}</span></div>
        </div>
        <div class="panel">
          <h3>Payment</h3>
          <div class="row"><span>Method</span><span>Stripe</span></div>
          <div class="row"><span>Currency</span><span>${(payment.currency || 'INR').toUpperCase()}</span></div>
          <div class="row"><span>Reference</span><span style="font-family:monospace">${(payment.stripe_session_id || payment.id).slice(-12).toUpperCase()}</span></div>
        </div>
      </div>

      <div class="desc">
        <div class="lbl">${isDonation ? 'Donation Purpose' : 'Service'}</div>
        <div class="val">${payment.description || (isDonation ? 'General Temple Donation' : 'Temple Service')}</div>
      </div>

      ${ticket ? `
      <div class="tic">
        <div>
          <h4>🎫 Service Ticket</h4>
          <div class="num">${ticket.ticket_number}</div>
          <div class="meta">
            <strong>Service:</strong> ${ticket.services?.name || 'Service'}<br/>
            <strong>Service Date:</strong> ${ticket.service_date ? new Date(ticket.service_date).toLocaleDateString('en-IN') : 'To be scheduled'}<br/>
            <strong>Status:</strong> ${ticket.status}
          </div>
        </div>
        ${qrCodeDataUrl ? `<div class="qr"><img src="${qrCodeDataUrl}" alt="QR"/></div>` : ''}
      </div>` : ''}

      <div class="total">
        <div class="lbl">Total ${isDonation ? 'Donated' : 'Paid'}</div>
        <div class="amt">₹${amt}</div>
        <div class="sub">${isDonation ? 'Eligible for 80G tax benefits' : 'Inclusive of all temple charges'}</div>
      </div>
    </div>

    <div class="footer">
      <div class="name">${TEMPLE.name} 🪔</div>
      <div class="meta">
        ${TEMPLE.address}<br/>
        ${TEMPLE.phone} • ${TEMPLE.email} • ${TEMPLE.web}
      </div>
      <div class="thx">May Lord Balaji shower His blessings upon you 🙏</div>
    </div>
  </div>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),400))</script>
</body></html>`;

    openPrintWindow(invoiceHTML);
    toast({ title: 'Invoice ready', description: 'Print or save as PDF from the new window.' });
  };

  const printTicket = async (ticket: any, payment?: any) => {
    let qrUrl = '';
    if (ticket?.qr_code) {
      try {
        qrUrl = await QRCode.toDataURL(ticket.qr_code, {
          width: 240, margin: 1, color: { dark: '#1a1a2e', light: '#FFFFFF' },
        });
      } catch (e) { console.error(e); }
    }
    const avatar = (user?.user_metadata as any)?.avatar_url || (user?.user_metadata as any)?.picture || '';
    const initial = (ticket.customer_name || 'D').charAt(0).toUpperCase();
    const amount = payment ? Number(payment.amount).toLocaleString('en-IN') : null;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Ticket ${ticket.ticket_number}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Playfair+Display:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;background:#0f0a1f;padding:24px;min-height:100vh;-webkit-print-color-adjust:exact;print-color-adjust:exact;color:#1a1a2e}
  .ticket{max-width:720px;margin:0 auto;background:#fff;border-radius:28px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.6);position:relative}
  .top{position:relative;padding:32px 36px;background:
     radial-gradient(800px 300px at -10% 0%, rgba(251,191,36,.55), transparent 60%),
     radial-gradient(700px 300px at 110% 100%, rgba(244,63,94,.5), transparent 55%),
     linear-gradient(135deg,#1e1b4b 0%,#581c87 35%,#9d174d 70%,#b45309 100%);
     color:#fff;overflow:hidden}
  .top::before{content:"ॐ";position:absolute;font-family:serif;font-size:380px;right:-60px;top:-110px;opacity:.08;line-height:1}
  .brandRow{display:flex;align-items:center;justify-content:space-between;gap:16px;position:relative;z-index:1}
  .brand{display:flex;align-items:center;gap:12px}
  .brand img{width:54px;height:54px;background:#fff;border-radius:50%;padding:5px;box-shadow:0 6px 18px rgba(0,0,0,.3)}
  .brand h1{font-family:'Cinzel Decorative',serif;font-size:20px;font-weight:900;letter-spacing:.05em}
  .brand p{font-size:11px;opacity:.85;text-transform:uppercase;letter-spacing:.15em;margin-top:2px}
  .num{text-align:right}
  .num .lbl{font-size:10px;opacity:.8;letter-spacing:.2em;text-transform:uppercase}
  .num .val{font-family:'Courier New',monospace;font-size:20px;font-weight:700;background:rgba(255,255,255,.15);padding:6px 14px;border-radius:10px;margin-top:6px;display:inline-block;backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.25)}

  .person{position:relative;z-index:1;margin-top:26px;display:flex;align-items:center;gap:18px}
  .avatar{width:78px;height:78px;border-radius:50%;border:3px solid rgba(255,255,255,.6);box-shadow:0 8px 22px rgba(0,0,0,.35);background:linear-gradient(135deg,#fbbf24,#f43f5e);display:flex;align-items:center;justify-content:center;font-family:'Cinzel Decorative',serif;font-size:34px;font-weight:900;color:#fff;overflow:hidden}
  .avatar img{width:100%;height:100%;object-fit:cover}
  .who h2{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;line-height:1.1}
  .who p{font-size:13px;opacity:.85;margin-top:4px}

  .notch{position:relative;height:24px;background:#fff}
  .notch::before,.notch::after{content:"";position:absolute;width:36px;height:36px;border-radius:50%;background:#0f0a1f;top:50%;transform:translateY(-50%)}
  .notch::before{left:-18px}.notch::after{right:-18px}
  .perf{position:absolute;left:30px;right:30px;top:50%;transform:translateY(-50%);border-top:2px dashed #d6d3d1}

  .body{padding:28px 36px;display:grid;grid-template-columns:1fr 160px;gap:28px;align-items:center}
  .seva h3{font-family:'Cinzel Decorative',serif;font-size:11px;color:#9a3412;letter-spacing:.25em;text-transform:uppercase;margin-bottom:6px}
  .seva .name{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#1c1917;margin-bottom:14px;background:linear-gradient(90deg,#7c2d12,#db2777);-webkit-background-clip:text;background-clip:text;color:transparent}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:10px 18px;font-size:13px}
  .meta div .l{font-size:10px;color:#78716c;text-transform:uppercase;letter-spacing:.15em;margin-bottom:2px}
  .meta div .v{font-weight:600;color:#1c1917}
  .qrBox{text-align:center}
  .qrBox img{width:160px;height:160px;border:6px solid #fef3c7;border-radius:16px}
  .qrBox p{font-size:10px;color:#78716c;margin-top:6px;letter-spacing:.1em;text-transform:uppercase}

  .cost{margin:0 36px;padding:18px 22px;border-radius:16px;background:linear-gradient(135deg,#fef3c7,#fde68a);display:flex;justify-content:space-between;align-items:center;border-left:5px solid #ea580c}
  .cost .lbl{font-size:11px;color:#9a3412;text-transform:uppercase;letter-spacing:.18em}
  .cost .amt{font-family:'Cinzel Decorative',serif;font-size:32px;font-weight:900;color:#7c2d12}

  .footer{padding:22px 36px 28px;text-align:center;background:linear-gradient(180deg,#fff,#fef3c7)}
  .blessing{font-family:'Playfair Display',serif;font-style:italic;color:#9a3412;font-size:14px;margin-bottom:10px}
  .contact{font-size:11px;color:#57534e;line-height:1.7}
  .stamp{position:absolute;right:30px;bottom:90px;width:110px;height:110px;border:3px solid rgba(220,38,38,.55);color:rgba(220,38,38,.75);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cinzel Decorative',serif;font-weight:900;font-size:14px;transform:rotate(-12deg);text-align:center;line-height:1.1;letter-spacing:.05em}
  @media print{body{background:#fff;padding:0}.ticket{box-shadow:none;border-radius:0}.notch::before,.notch::after{background:#fff}}
</style></head>
<body>
  <div class="ticket">
    <div class="top">
      <div class="brandRow">
        <div class="brand">
          <img src="${TEMPLE.logo}" alt="logo"/>
          <div>
            <h1>${TEMPLE.name}</h1>
            <p>Divine Service Ticket</p>
          </div>
        </div>
        <div class="num">
          <div class="lbl">Ticket No.</div>
          <div class="val">${ticket.ticket_number}</div>
        </div>
      </div>
      <div class="person">
        <div class="avatar">${avatar ? `<img src="${avatar}" alt="dp"/>` : initial}</div>
        <div class="who">
          <h2>${ticket.customer_name}</h2>
          <p>${ticket.customer_email}</p>
        </div>
      </div>
    </div>

    <div class="notch"><div class="perf"></div></div>

    <div class="body">
      <div class="seva">
        <h3>✦ Seva Details ✦</h3>
        <div class="name">${ticket.services?.name || 'Temple Service'}</div>
        <div class="meta">
          <div><div class="l">Service Date</div><div class="v">${ticket.service_date ? new Date(ticket.service_date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) : 'To be scheduled'}</div></div>
          <div><div class="l">Booked On</div><div class="v">${new Date(ticket.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div></div>
          <div><div class="l">Status</div><div class="v" style="text-transform:capitalize">${ticket.status}</div></div>
          <div><div class="l">Devotee</div><div class="v">${ticket.customer_name}</div></div>
        </div>
      </div>
      <div class="qrBox">
        ${qrUrl ? `<img src="${qrUrl}" alt="QR"/>` : ''}
        <p>Scan to verify</p>
      </div>
    </div>

    ${amount ? `
    <div class="cost">
      <div>
        <div class="lbl">Seva Contribution</div>
      </div>
      <div class="amt">₹${amount}</div>
    </div>` : ''}

    <div class="footer">
      <div class="blessing">"May Lord Balaji's grace be with you always" 🪔</div>
      <div class="contact">
        ${TEMPLE.address}<br/>
        ${TEMPLE.phone} • ${TEMPLE.email}<br/>
        ${TEMPLE.web}
      </div>
      <div class="stamp">SREE<br/>BALAJI<br/>BLESSED</div>
    </div>
  </div>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),500))</script>
</body></html>`;

    openPrintWindow(html);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
        <p className="mt-2">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in">
        <h3 className="text-2xl font-bold mb-2">Your Activity History</h3>
        <p className="text-muted-foreground">View your donations, tickets, and invoices</p>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Donations ({donations.length})
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Tickets ({tickets.length})
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            All Payments ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <div className="grid gap-4">
            {donations.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No donations yet</p>
                </CardContent>
              </Card>
            ) : (
              donations.map((donation: any) => (
                <Card key={donation.id} className="hover:shadow-md transition-all duration-300 hover-lift animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">₹{Number(donation.amount).toLocaleString()}</h4>
                        <p className="text-sm text-muted-foreground">{donation.description || 'General Donation'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{new Date(donation.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                          {donation.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(donation)}
                          className="mt-2 ml-2 hover-scale"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <div className="grid gap-6">
            {tickets.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No tickets yet</p>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket: any) => {
                const relatedPayment = payments.find(p => p.type === 'service');
                return (
                  <div key={ticket.id} className="space-y-4 animate-fade-in">
                    <TicketGenerator
                      ticket={{
                        ...ticket,
                        service_name: ticket.services?.name || 'Service'
                      }}
                    />
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        onClick={() => printTicket(ticket, relatedPayment)}
                        className="hover-scale bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 text-white border-0"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Divine Ticket
                      </Button>
                      {relatedPayment && (
                        <Button
                          variant="outline"
                          onClick={() => downloadInvoice(relatedPayment, ticket)}
                          className="hover-scale"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="grid gap-4">
            {payments.length === 0 ? (
              <Card className="animate-fade-in">
                <CardContent className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No payments yet</p>
                </CardContent>
              </Card>
            ) : (
              payments.map((payment: any) => {
                const relatedTicket = payment.type === 'service' 
                  ? tickets.find(t => t.customer_email === payment.customer_email)
                  : null;
                
                return (
                  <Card key={payment.id} className="hover:shadow-md transition-all duration-300 hover-lift animate-fade-in">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-lg">₹{Number(payment.amount).toLocaleString()}</h4>
                            <Badge variant="outline" className="capitalize">{payment.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{payment.description || 'Payment'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(payment.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadInvoice(payment, relatedTicket)}
                            className="mt-2 ml-2 hover-scale"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserHistorySection;
