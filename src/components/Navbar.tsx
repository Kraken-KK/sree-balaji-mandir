import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Menu, Moon, Sun, User, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  let authContext;
  try {
    authContext = useAuth();
  } catch {
    authContext = { user: null, signOut: () => {} };
  }

  const { user, signOut } = authContext;
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('gallery'), href: '/gallery' },
    { label: t('events'), href: '/events' },
    { label: t('services'), href: '/services' },
    { label: t('donations'), href: '/donations' },
    { label: t('history'), href: '/history' },
  ];

  const handleAdminAccess = () => {
    if (adminCode === '551010') {
      setIsAdminDialogOpen(false);
      setAdminCode('');
      navigate('/admin');
      toast({ title: "Admin Access Granted", description: "Welcome to the admin dashboard" });
    } else {
      toast({ title: "Access Denied", description: "Invalid admin code", variant: "destructive" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 rounded-xl gradient-devotional flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">ॐ</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              Sri Balaji Temple
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={(v: 'en' | 'hi' | 'te') => setLanguage(v)}>
              <SelectTrigger className="w-16 h-9 glass-button border-0 text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">हि</SelectItem>
                <SelectItem value="te">తె</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-all duration-300">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Desktop auth + admin */}
            <div className="hidden lg:flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="rounded-xl hover:bg-muted/50">
                    <Settings className="w-4 h-4 mr-1.5" /> Settings
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut} className="rounded-xl hover:bg-muted/50">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => navigate('/auth')} className="rounded-xl gradient-devotional text-white border-0 shadow-md hover:shadow-lg transition-shadow">
                  <User className="w-4 h-4 mr-1.5" /> Sign In
                </Button>
              )}

              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
                    <Shield className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass rounded-3xl border-0">
                  <DialogHeader>
                    <DialogTitle className="font-display">{t('secretCode')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminCode">{t('secretCode')}</Label>
                      <Input id="adminCode" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter 6-digit code" className="rounded-xl" />
                    </div>
                    <Button onClick={handleAdminAccess} className="w-full rounded-xl gradient-devotional text-white border-0">{t('enter')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {user && (
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] glass border-0">
                  <div className="flex flex-col space-y-2 mt-8">
                    {navItems.map((item, index) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 animate-fade-in ${
                          location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-border/50 my-2" />
                    {user ? (
                      <>
                        <Button variant="ghost" onClick={() => { setIsOpen(false); navigate('/settings'); }} className="justify-start rounded-xl">
                          <Settings className="w-4 h-4 mr-2" /> Settings
                        </Button>
                        <Button variant="ghost" onClick={() => { setIsOpen(false); signOut(); }} className="justify-start rounded-xl">
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => { setIsOpen(false); navigate('/auth'); }} className="rounded-xl gradient-devotional text-white border-0">
                        <User className="w-4 h-4 mr-2" /> Sign In
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => { setIsOpen(false); setIsAdminDialogOpen(true); }} className="justify-start rounded-xl">
                      <Shield className="w-4 h-4 mr-2" /> {t('admin')}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
