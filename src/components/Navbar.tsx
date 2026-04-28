import React, { useState, useEffect } from 'react';
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
import { Menu, Moon, Sun, User, Settings, Shield, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  let authContext;
  try {
    authContext = useAuth();
  } catch {
    authContext = { user: null, signOut: () => {} };
  }

  const { user, signOut, isFamily } = authContext as any;
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('gallery'), href: '/gallery' },
    { label: t('events'), href: '/events' },
    { label: t('services'), href: '/services' },
    { label: t('donations'), href: '/donations' },
    { label: t('history'), href: '/history' },
  ];

  const handleAdminAccess = () => {
    if (adminCode === '552010') {
      setIsAdminDialogOpen(false);
      setAdminCode('');
      navigate('/admin');
      toast({ title: "Admin Access Granted", description: "Welcome to the admin dashboard" });
    } else {
      toast({ title: "Access Denied", description: "Invalid admin code", variant: "destructive" });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'top-3 left-4 right-4 mx-auto max-w-5xl rounded-2xl glass shadow-xl border border-border/30'
          : 'glass-nav'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`${scrolled ? 'px-4' : 'container mx-auto px-4'}`}>
        <div className={`flex items-center justify-between ${scrolled ? 'h-14' : 'h-16'} transition-all duration-500`}>
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span
              className={`bg-clip-text text-transparent bg-gradient-to-r from-saffron via-vermillion to-gold group-hover:from-vermillion group-hover:to-saffron transition-all duration-500 ${
                scrolled ? 'text-base lg:text-xl' : 'text-lg lg:text-2xl'
              }`}
              style={{ fontFamily: "'Cinzel Decorative', 'Playfair Display', serif", fontWeight: 700, letterSpacing: '0.06em' }}
            >
              Sree Balaji Mandir
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
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
          <div className="flex items-center space-x-1.5">
            <Select value={language} onValueChange={(v: 'en' | 'hi' | 'te') => setLanguage(v)}>
              <SelectTrigger className="w-14 h-8 glass-button border-0 text-xs font-medium rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="hi">हि</SelectItem>
                <SelectItem value="te">తె</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8 rounded-lg hover:bg-muted/50 transition-all duration-300">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Desktop auth + admin */}
            <div className="hidden lg:flex items-center space-x-1.5">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="rounded-lg hover:bg-muted/50 h-8 text-xs">
                    <Settings className="w-3.5 h-3.5 mr-1" /> Settings
                  </Button>
                  <Button variant="ghost" size="sm" onClick={signOut} className="rounded-lg hover:bg-muted/50 h-8 text-xs">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={() => navigate('/auth')} className="rounded-xl gradient-devotional text-white border-0 shadow-md hover:shadow-lg transition-shadow h-8 text-xs">
                  <User className="w-3.5 h-3.5 mr-1" /> Sign In
                </Button>
              )}

              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted/50">
                    <Shield className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass rounded-3xl border-0 max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-display">{t('secretCode')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminCode" className="text-xs">{t('secretCode')}</Label>
                      <Input id="adminCode" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="Enter 6-digit code" className="rounded-xl" />
                    </div>
                    <Button onClick={handleAdminAccess} className="w-full rounded-xl gradient-devotional text-white border-0">{t('enter')}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {user && (
              <div className={isFamily ? 'rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-orange-500 to-red-500' : ''}>
                <Avatar className={`h-8 w-8 ${isFamily ? 'ring-2 ring-background' : 'ring-2 ring-primary/20'}`}>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] glass border-0 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-5 border-b border-border/20">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl gradient-devotional flex items-center justify-center">
                          <span className="text-white font-bold text-sm">ॐ</span>
                        </div>
                        <span className="font-display font-semibold text-foreground">Sri Balaji Temple</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              location.pathname === item.href ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-border/20 space-y-2">
                      {user ? (
                        <>
                          <Button variant="ghost" onClick={() => { setIsOpen(false); navigate('/settings'); }} className="w-full justify-start rounded-xl text-sm">
                            <Settings className="w-4 h-4 mr-2" /> Settings
                          </Button>
                          <Button variant="ghost" onClick={() => { setIsOpen(false); signOut(); }} className="w-full justify-start rounded-xl text-sm">
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => { setIsOpen(false); navigate('/auth'); }} className="w-full rounded-xl gradient-devotional text-white border-0">
                          <User className="w-4 h-4 mr-2" /> Sign In
                        </Button>
                      )}
                      <Button variant="ghost" onClick={() => { setIsOpen(false); setIsAdminDialogOpen(true); }} className="w-full justify-start rounded-xl text-sm">
                        <Shield className="w-4 h-4 mr-2" /> {t('admin')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
