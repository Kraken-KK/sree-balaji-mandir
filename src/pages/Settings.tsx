
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Moon, Sun, Globe, Shield, Info, RefreshCw } from 'lucide-react';
import NotificationSettings from '@/components/NotificationSettings';
import UserHistorySection from '@/components/UserHistorySection';
import ServiceCancellation from '@/components/ServiceCancellation';
import FamilyAccessButton from '@/components/FamilyAccessButton';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Please Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You need to be signed in to access settings.
              </p>
              <Button onClick={() => window.location.href = '/auth'} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/7b3b360d-af81-4d6e-a115-8e6e878163a7.png" 
            alt="Sri Balaji Temple" 
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-lg p-2"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your preferences and view your history</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile & Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">User ID</Label>
                  <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded break-all">{user.id}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <p className="text-gray-600 bg-gray-50 p-2 rounded">
                  {user.user_metadata?.full_name || 'Not provided'}
                </p>
              </div>
              <Separator />
              <Button onClick={handleSignOut} variant="outline" className="w-full">
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Family Access */}
          <FamilyAccessButton />

          {/* User History Section */}
          <UserHistorySection />

          {/* Service Cancellation Section */}
          <ServiceCancellation />

          {/* Notification Settings */}
          <NotificationSettings />

          {/* Appearance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-toggle" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-en">English</Label>
                  <Switch
                    id="lang-en"
                    checked={language === 'en'}
                    onCheckedChange={() => setLanguage('en')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-hi">हिन्दी (Hindi)</Label>
                  <Switch
                    id="lang-hi"
                    checked={language === 'hi'}
                    onCheckedChange={() => setLanguage('hi')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lang-te">తెలుగు (Telugu)</Label>
                  <Switch
                    id="lang-te"
                    checked={language === 'te'}
                    onCheckedChange={() => setLanguage('te')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage analytics
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive temple newsletters and updates
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                App Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Version</span>
                <span className="text-sm text-muted-foreground">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Last Updated</span>
                <span className="text-sm text-muted-foreground">January 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Build</span>
                <span className="text-sm text-muted-foreground">PWA-2025.2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
