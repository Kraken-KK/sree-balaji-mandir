
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminCodeInputProps {
  onSuccess: () => void;
  loading?: boolean;
}

export const AdminCodeInput: React.FC<AdminCodeInputProps> = ({ onSuccess, loading }) => {
  const [adminCode, setAdminCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode.length !== 6) return;

    setIsLoading(true);
    
    // Simple admin code validation (you can replace this with your actual logic)
    if (adminCode === '123456') {
      toast({
        title: "Access Granted",
        description: "Welcome to the admin dashboard",
      });
      onSuccess();
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin code",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
            disabled={loading || isLoading || adminCode.length !== 6}
          >
            {loading || isLoading ? 'Verifying...' : 'Access Dashboard'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
