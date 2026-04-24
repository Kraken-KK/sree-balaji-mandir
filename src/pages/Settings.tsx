import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Moon, Sun, Globe, Shield, Info, Settings as SettingsIcon, LogOut } from 'lucide-react';
import NotificationSettings from '@/components/NotificationSettings';
import UserHistorySection from '@/components/UserHistorySection';
import ServiceCancellation from '@/components/ServiceCancellation';
import FamilyAccessButton from '@/components/FamilyAccessButton';

const Section: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div
    className="animate-fade-in"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
  >
    {children}
  </div>
);

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const handleSignOut = async () => {
    try { await signOut(); } catch (error) { console.error('Error signing out:', error); }
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-warm-bg flex items-center justify-center px-4">
        <Card className="max-w-md w-full glass-card border-0 animate-scale-in">
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
    );
  }

  return (
    <div className="min-h-screen gradient-warm-bg py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 backdrop-blur-sm mb-5 animate-scale-in">
            <SettingsIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-gradient-devotional">
            Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your preferences and explore your sacred journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile */}
          <Section delay={50}>
            <Card className="glass-card border-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  Profile & Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                    <p className="text-foreground bg-muted/50 px-3 py-2 rounded-lg text-sm">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">User ID</Label>
                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded-lg break-all">{user.id}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <p className="text-foreground bg-muted/50 px-3 py-2 rounded-lg text-sm">
                    {user.user_metadata?.full_name || 'Not provided'}
                  </p>
                </div>
                <Separator />
                <Button onClick={handleSignOut} variant="outline" className="w-full hover-scale">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </CardContent>
            </Card>
          </Section>

          <Section delay={100}><FamilyAccessButton /></Section>
          <Section delay={150}><UserHistorySection /></Section>
          <Section delay={200}><ServiceCancellation /></Section>
          <Section delay={250}><NotificationSettings /></Section>

          {/* Appearance */}
          <Section delay={300}>
            <Card className="glass-card border-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </div>
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <Label htmlFor="theme-toggle" className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                  <Switch id="theme-toggle" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* Language */}
          <Section delay={350}>
            <Card className="glass-card border-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिन्दी (Hindi)' },
                  { id: 'te', label: 'తెలుగు (Telugu)' },
                ].map((lang) => (
                  <div
                    key={lang.id}
                    onClick={() => setLanguage(lang.id as any)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      language === lang.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
                    }`}
                  >
                    <Label className="cursor-pointer">{lang.label}</Label>
                    <Switch checked={language === lang.id} onCheckedChange={() => setLanguage(lang.id as any)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>

          {/* Privacy */}
          <Section delay={400}>
            <Card className="glass-card border-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <Label>Data Collection</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage analytics</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <Label>Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive temple newsletters and updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </Section>

          {/* App Info */}
          <Section delay={450}>
            <Card className="glass-card border-0 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-display">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  App Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  ['Version', '2.0.0'],
                  ['Last Updated', 'April 2026'],
                  ['Build', 'PWA-2026.1'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 rounded hover:bg-muted/30 transition-colors">
                    <span className="text-sm">{k}</span>
                    <span className="text-sm text-muted-foreground font-mono">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
