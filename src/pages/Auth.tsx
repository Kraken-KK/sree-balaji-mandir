
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, Lock, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { signIn, signInWithGoogle, signInWithPhone, verifyOTP, signUp, signUpWithPhone, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [phoneForOTP, setPhoneForOTP] = useState('');
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [phoneSignInData, setPhoneSignInData] = useState({ phone: '', otp: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [phoneSignUpData, setPhoneSignUpData] = useState({
    phone: '',
    fullName: '',
    otp: '',
  });
  const [showPhoneSignUpOTP, setShowPhoneSignUpOTP] = useState(false);
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Format phone number to international format
  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 91 (India code), add +
    if (digits.startsWith('91') && digits.length === 12) {
      return `+${digits}`;
    }
    
    // If 10 digits, assume Indian number
    if (digits.length === 10) {
      return `+91${digits}`;
    }
    
    // If already has country code
    if (digits.length > 10) {
      return `+${digits}`;
    }
    
    return `+91${digits}`;
  };

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    // Basic validation for Indian numbers
    return formatted.match(/^\+91[6-9]\d{9}$/);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneSignInData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number (10 digits)",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneSignInData.phone);
      await signInWithPhone(formattedPhone);
      setPhoneForOTP(formattedPhone);
      setShowOTPInput(true);
    } catch (error) {
      console.error('Phone sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneSignInData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(phoneForOTP, phoneSignInData.otp);
      setShowOTPInput(false);
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsGoogleLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(signUpData.email, signUpData.password, {
        full_name: signUpData.fullName,
      });
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhoneNumber(phoneSignUpData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Indian phone number (10 digits)",
        variant: "destructive"
      });
      return;
    }

    setIsPhoneLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneSignUpData.phone);
      await signUpWithPhone(formattedPhone, {
        full_name: phoneSignUpData.fullName,
      });
      setShowPhoneSignUpOTP(true);
    } catch (error) {
      console.error('Phone sign up error:', error);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handlePhoneSignUpOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneSignUpData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsPhoneLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneSignUpData.phone);
      await verifyOTP(formattedPhone, phoneSignUpData.otp);
      setShowPhoneSignUpOTP(false);
      setShowPhoneAuth(false);
    } catch (error) {
      console.error('Phone sign up OTP verification error:', error);
    } finally {
      setIsPhoneLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <span className="text-3xl">ॐ</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sri Balaji Temple</h1>
          <p className="text-muted-foreground">Join our spiritual community</p>
        </div>

        <Card className="animate-scale-in shadow-xl">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={signInData.email}
                            onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10"
                            value={signInData.password}
                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full temple-gradient" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Sign In with Email
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="phone" className="space-y-4">
                    {!showOTPInput ? (
                      <form onSubmit={handlePhoneSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="signin-phone"
                              type="tel"
                              placeholder="Enter 10-digit mobile number"
                              className="pl-10"
                              value={phoneSignInData.phone}
                              onChange={(e) => setPhoneSignInData({ ...phoneSignInData, phone: e.target.value })}
                              required
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Enter your 10-digit Indian mobile number
                          </p>
                        </div>
                        <Button type="submit" className="w-full temple-gradient" disabled={isLoading}>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Send OTP
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleOTPVerification} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-otp">Verification Code</Label>
                          <p className="text-sm text-muted-foreground">
                            Enter the 6-digit code sent to {phoneForOTP}
                          </p>
                          <InputOTP 
                            value={phoneSignInData.otp} 
                            onChange={(value) => setPhoneSignInData({ ...phoneSignInData, otp: value })}
                            maxLength={6}
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
                        <Button type="submit" className="w-full temple-gradient" disabled={isLoading || phoneSignInData.otp.length !== 6}>
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Verify & Sign In
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setShowOTPInput(false);
                            setPhoneSignInData({ ...phoneSignInData, otp: '' });
                          }}
                        >
                          Back
                        </Button>
                      </form>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                {!showPhoneAuth && !showPhoneSignUpOTP ? (
                  <>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10"
                            value={signUpData.fullName}
                            onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            value={signUpData.email}
                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            className="pl-10"
                            value={signUpData.password}
                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type="password"
                            placeholder="Confirm your password"
                            className="pl-10"
                            value={signUpData.confirmPassword}
                            onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full temple-gradient" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Account with Email
                      </Button>
                    </form>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => setShowPhoneAuth(true)}
                      disabled={isPhoneLoading}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Continue with Phone
                    </Button>
                  </>
                ) : showPhoneAuth && !showPhoneSignUpOTP ? (
                  <form onSubmit={handlePhoneSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone-name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={phoneSignUpData.fullName}
                          onChange={(e) => setPhoneSignUpData({ ...phoneSignUpData, fullName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone-number">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone-number"
                          type="tel"
                          placeholder="Enter 10-digit mobile number"
                          className="pl-10"
                          value={phoneSignUpData.phone}
                          onChange={(e) => setPhoneSignUpData({ ...phoneSignUpData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter your 10-digit Indian mobile number
                      </p>
                    </div>
                    <Button type="submit" className="w-full temple-gradient" disabled={isPhoneLoading}>
                      {isPhoneLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Send Verification Code
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowPhoneAuth(false)}
                    >
                      Back
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handlePhoneSignUpOTPVerification} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone-otp">Verification Code</Label>
                      <p className="text-sm text-muted-foreground">
                        Enter the 6-digit code sent to {formatPhoneNumber(phoneSignUpData.phone)}
                      </p>
                      <InputOTP 
                        value={phoneSignUpData.otp} 
                        onChange={(value) => setPhoneSignUpData({ ...phoneSignUpData, otp: value })}
                        maxLength={6}
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
                    <Button type="submit" className="w-full temple-gradient" disabled={isPhoneLoading || phoneSignUpData.otp.length !== 6}>
                      {isPhoneLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Verify & Create Account
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setShowPhoneSignUpOTP(false);
                        setPhoneSignUpData({ ...phoneSignUpData, otp: '' });
                      }}
                    >
                      Back
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
