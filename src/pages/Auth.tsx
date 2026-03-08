import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Phone, Flame } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Auth = () => {
  const { signUp, signIn, signInWithGoogle, signInWithOtp, verifyOtp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('email');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailForm, setEmailForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' });
  const from = location.state?.from?.pathname || '/';

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (emailForm.password !== emailForm.confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
        if (emailForm.password.length < 6) { toast({ title: "Password too short", variant: "destructive" }); return; }
        await signUp(emailForm.email, emailForm.password, { fullName: emailForm.fullName });
      } else {
        await signIn(emailForm.email, emailForm.password);
        navigate(from, { replace: true });
      }
    } catch {} finally { setLoading(false); }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!otpSent) {
        const clean = phoneForm.phone.replace(/\D/g, '');
        if (clean.length < 10) { toast({ title: "Invalid phone number", variant: "destructive" }); return; }
        const formatted = clean.startsWith('91') ? `+${clean}` : `+91${clean}`;
        setPhoneNumber(formatted);
        await signInWithOtp(formatted);
        setOtpSent(true);
      } else {
        if (phoneForm.otp.length !== 6) { toast({ title: "Enter 6-digit OTP", variant: "destructive" }); return; }
        await verifyOtp(phoneNumber, phoneForm.otp);
        navigate(from, { replace: true });
      }
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen gradient-warm-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] animate-liquid-morph" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] animate-liquid-morph" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 gradient-devotional rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-muted-foreground mt-2">{isSignUp ? 'Join Sri Balaji Temple community' : 'Sign in to access temple services'}</p>
        </div>

        <div className="glass-card p-6 md:p-8 animate-scale-in">
          {/* Google */}
          <Button onClick={async () => { setLoading(true); try { await signInWithGoogle(); } catch {} finally { setLoading(false); } }} variant="outline" className="w-full glass-button border-0 rounded-xl mb-4" disabled={loading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><Separator /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-3 text-muted-foreground">Or continue with</span></div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 glass rounded-xl mb-4">
              <TabsTrigger value="email" className="rounded-lg flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> Email</TabsTrigger>
              <TabsTrigger value="phone" className="rounded-lg flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && <div><Label>Full Name</Label><Input value={emailForm.fullName} onChange={(e) => setEmailForm({ ...emailForm, fullName: e.target.value })} className="rounded-xl" required /></div>}
                <div><Label>Email</Label><Input type="email" value={emailForm.email} onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} className="rounded-xl" required /></div>
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} value={emailForm.password} onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} className="rounded-xl pr-10" required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {isSignUp && <div><Label>Confirm Password</Label><Input type="password" value={emailForm.confirmPassword} onChange={(e) => setEmailForm({ ...emailForm, confirmPassword: e.target.value })} className="rounded-xl" required /></div>}
                <Button type="submit" className="w-full gradient-devotional text-white border-0 rounded-xl py-5" disabled={loading}>
                  {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              <form onSubmit={handlePhoneAuth} className="space-y-4">
                {!otpSent ? (
                  <div><Label>Phone Number</Label><Input type="tel" placeholder="10-digit number" value={phoneForm.phone} onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })} className="rounded-xl" required /></div>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">OTP sent to {phoneNumber}</p>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={phoneForm.otp} onChange={(v) => setPhoneForm({ ...phoneForm, otp: v })}>
                        <InputOTPGroup>{[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
                      </InputOTP>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setOtpSent(false); setPhoneForm({ phone: '', otp: '' }); }} className="text-xs">Change Number</Button>
                  </div>
                )}
                <Button type="submit" className="w-full gradient-devotional text-white border-0 rounded-xl py-5" disabled={loading}>
                  {loading ? 'Processing...' : otpSent ? 'Verify OTP' : 'Send OTP'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-5">
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
