
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Home, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');
  const amount = searchParams.get('amount');
  const description = searchParams.get('description');

  const generateInvoice = () => {
    const invoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN'),
      sessionId: sessionId?.slice(-12) || 'N/A',
      type: type || 'payment',
      amount: amount || '0',
      description: description || 'Temple Service/Donation',
      customerName: user?.user_metadata?.full_name || 'Devotee',
      customerEmail: user?.email || 'N/A'
    };

    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Invoice - Sri Balaji Temple</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid #ff6b35; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 2em; color: #ff6b35; margin-bottom: 10px; }
          .temple-name { font-size: 1.8em; font-weight: bold; color: #333; margin-bottom: 5px; }
          .subtitle { color: #666; }
          .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .detail-group h3 { color: #ff6b35; margin-bottom: 10px; font-size: 1.1em; }
          .detail-item { margin-bottom: 8px; }
          .label { font-weight: bold; color: #333; }
          .payment-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .amount { font-size: 1.5em; font-weight: bold; color: #ff6b35; text-align: center; }
          .footer { text-align: center; color: #666; font-size: 0.9em; border-top: 1px solid #ddd; padding-top: 20px; }
          .thank-you { color: #28a745; font-weight: bold; font-size: 1.2em; text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="logo">ॐ</div>
            <div class="temple-name">Sri Balaji Temple</div>
            <div class="subtitle">Payment Receipt & Invoice</div>
          </div>
          
          <div class="thank-you">
            Thank you for your ${type === 'donation' ? 'generous donation' : 'service booking'}!
          </div>
          
          <div class="invoice-details">
            <div class="detail-group">
              <h3>Payment Details</h3>
              <div class="detail-item">
                <span class="label">Invoice Number:</span> ${invoiceData.invoiceNumber}
              </div>
              <div class="detail-item">
                <span class="label">Date:</span> ${invoiceData.date}
              </div>
              <div class="detail-item">
                <span class="label">Transaction ID:</span> ${invoiceData.sessionId}
              </div>
              <div class="detail-item">
                <span class="label">Type:</span> ${type === 'donation' ? 'Donation' : 'Service Booking'}
              </div>
            </div>
            
            <div class="detail-group">
              <h3>Customer Information</h3>
              <div class="detail-item">
                <span class="label">Name:</span> ${invoiceData.customerName}
              </div>
              <div class="detail-item">
                <span class="label">Email:</span> ${invoiceData.customerEmail}
              </div>
              <div class="detail-item">
                <span class="label">Payment Method:</span> Stripe (Card Payment)
              </div>
            </div>
          </div>
          
          <div class="payment-summary">
            <h3 style="text-align: center; margin-bottom: 15px; color: #333;">Payment Summary</h3>
            <div class="detail-item">
              <span class="label">Description:</span> ${invoiceData.description}
            </div>
            <div class="amount">
              Total Paid: ₹${Number(invoiceData.amount).toFixed(2)}
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Sri Balaji Temple</strong></p>
            <p>Temple Address | Phone: +91-XXXX-XXXXXX | Email: info@sribalajitemple.org</p>
            <p>This is a computer-generated receipt. Thank you for your contribution to our temple community.</p>
            ${type === 'donation' ? '<p style="color: #28a745;"><strong>This donation is eligible for 80G tax benefits under Indian Income Tax Act.</strong></p>' : ''}
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Sri_Balaji_Temple_Invoice_${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold text-green-600">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Thank you for your {type === 'donation' ? 'generous donation' : 'service booking'}! 
                Your transaction has been completed successfully.
              </p>
            </div>
            
            {sessionId && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Transaction Details:</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Transaction ID:</span> {sessionId.slice(-12)}</p>
                  {amount && <p><span className="font-medium">Amount Paid:</span> ₹{Number(amount).toFixed(2)}</p>}
                  {description && <p><span className="font-medium">Description:</span> {decodeURIComponent(description)}</p>}
                  <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={generateInvoice}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              
              <Button 
                onClick={() => navigate('/')} 
                className="w-full temple-gradient text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
              
              <Button 
                onClick={() => navigate(type === 'donation' ? '/donations' : '/services')} 
                variant="outline" 
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {type === 'donation' ? 'Make Another Donation' : 'Book Another Service'}
              </Button>
            </div>

            {type === 'donation' && (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                <p className="text-orange-800 dark:text-orange-200 text-sm">
                  <strong>Tax Benefit:</strong> This donation is eligible for 80G tax benefits under Indian Income Tax Act. 
                  Please save your invoice for tax filing purposes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
