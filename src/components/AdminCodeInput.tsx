
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield } from 'lucide-react';

interface AdminCodeInputProps {
  onSubmit: (code: string) => void;
  loading?: boolean;
}

export const AdminCodeInput: React.FC<AdminCodeInputProps> = ({ onSubmit, loading }) => {
  const [adminCode, setAdminCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(adminCode);
  };

  return (
    <Card className="max-w-md mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Admin Access Required</CardTitle>
        <CardDescription>
          Enter the 6-digit admin code to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={adminCode}
              onChange={setAdminCode}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || adminCode.length !== 6}
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
