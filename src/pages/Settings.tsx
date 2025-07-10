
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Moon, Sun, Globe, Shield, Info, RefreshCw, CreditCard, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationSettings from '@/components/NotificationSettings';
import UserHistorySection from '@/components/UserHistorySection';
import ServiceCancellation from '@/components/ServiceCancellation';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto bg-card dark:bg-gray-800 border-border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">Please Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground dark:text-gray-300 mb-4">
                You need to be signed in to access settings.
              </p>
              <Button onClick={() => window.location.href = '/auth'} className="w-full bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-all duration-500">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <img 
            src="/lovable-uploads/7b3b360d-af81-4d6e-a115-8e6e878163a7.png" 
            alt="Sri Balaji Temple" 
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-white dark:bg-gray-800 shadow-lg p-2 transition-all duration-300 hover:scale-105"
          />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 transition-colors duration-300">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Manage your preferences and view your history</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Section */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <User className="w-5 h-5" />
                Profile & Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground dark:text-gray-200">Email</Label>
                  <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded transition-colors duration-300">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground dark:text-gray-200">User ID</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded break-all transition-colors duration-300">{user.id}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">Full Name</Label>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded transition-colors duration-300">
                  {user.user_metadata?.full_name || 'Not provided'}
                </p>
              </div>
              <Separator className="dark:bg-gray-600" />
              <Button onClick={handleSignOut} variant="outline" className="w-full border-border dark:border-gray-600 hover:bg-muted dark:hover:bg-gray-700">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Crown className="w-5 h-5 text-primary" />
                Subscription Plans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground dark:text-gray-300">
                Upgrade to premium plans for enhanced temple experiences and exclusive benefits.
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/subscriptions')} 
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Plans
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/subscriptions')}
                  className="border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300"
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User History Section */}
          <div className="animate-slide-up">
            <UserHistorySection />
          </div>

          {/* Service Cancellation Section */}
          <div className="animate-slide-up">
            <ServiceCancellation />
          </div>

          {/* Notification Settings */}
          <div className="animate-slide-up">
            <NotificationSettings />
          </div>

          {/* Appearance Section */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-toggle" className="text-base font-medium text-foreground dark:text-white">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Globe className="w-5 h-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-en" className="text-foreground dark:text-white">English</Label>
                  <Switch
                    id="lang-en"
                    checked={language === 'en'}
                    onCheckedChange={() => setLanguage('en')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-hi" className="text-foreground dark:text-white">हिन्दी (Hindi)</Label>
                  <Switch
                    id="lang-hi"
                    checked={language === 'hi'}
                    onCheckedChange={() => setLanguage('hi')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-te" className="text-foreground dark:text-white">తెలుగు (Telugu)</Label>
                  <Switch
                    id="lang-te"
                    checked={language === 'te'}
                    onCheckedChange={() => setLanguage('te')}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground dark:text-white">Data Collection</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Allow anonymous usage analytics
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground dark:text-white">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground dark:text-gray-300">
                    Receive temple newsletters and updates
                  </p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700 transition-all duration-300 hover:shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
                <Info className="w-5 h-5" />
                App Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-foreground dark:text-white">Version</span>
                <span className="text-sm text-muted-foreground dark:text-gray-300">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground dark:text-white">Last Updated</span>
                <span className="text-sm text-muted-foreground dark:text-gray-300">January 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-foreground dark:text-white">Build</span>
                <span className="text-sm text-muted-foreground dark:text-gray-300">PWA-2025.2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
