import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const SignUp = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    fullName: '',
    newsletter: false,
    terms: false,
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      return;
    }

    if (!signupData.terms) {
      return;
    }

    try {
      setLoading(true);
      await signUp(signupData.email, signupData.password, {
        username: signupData.username,
        fullName: signupData.fullName,
        phone: signupData.phone,
        newsletter: signupData.newsletter,
      });
      
      // Reset form
      setSignupData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        fullName: '',
        newsletter: false,
        terms: false,
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">{t('signup_title')}</h1>
            <p className="text-muted-foreground">
              Join our temple community and stay connected with all events and services
            </p>
          </div>

          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>
                Get notified about events, book services, and be part of our spiritual community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="username">{t('label_username')}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('label_email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('label_password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{t('label_confirm_password')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={signupData.newsletter}
                      onCheckedChange={(checked) => 
                        setSignupData({ ...signupData, newsletter: checked as boolean })
                      }
                    />
                    <Label htmlFor="newsletter" className="text-sm">
                      Subscribe to newsletter for event updates
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupData.terms}
                      onCheckedChange={(checked) => 
                        setSignupData({ ...signupData, terms: checked as boolean })
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{' '}
                      <Link to="#" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full temple-gradient text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    t('signup_submit')
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/auth" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Benefits of Joining</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Get notified about upcoming events and festivals</li>
                  <li>• Easy booking of temple services and pujas</li>
                  <li>• Access to exclusive spiritual content</li>
                  <li>• Priority registration for special events</li>
                  <li>• Digital donation receipts for tax benefits</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
