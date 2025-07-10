import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Menu, 
  Moon, 
  Sun, 
  User, 
  Settings, 
  Home,
  Image,
  Calendar,
  ShoppingBag,
  Heart,
  History,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  // Add error boundary for auth context
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.log('Auth context not available, using defaults');
    authContext = { user: null, signOut: () => {} };
  }
  
  const { user, signOut } = authContext;
  const location = useLocation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: t('home'), href: '/', icon: Home },
    { label: t('gallery'), href: '/gallery', icon: Image },
    { label: t('events'), href: '/events', icon: Calendar },
    { label: t('services'), href: '/services', icon: ShoppingBag },
    { label: t('donations'), href: '/donations', icon: Heart },
    { label: t('history'), href: '/history', icon: History },
  ];

  const quickNavItems = [
    { label: t('home'), href: '/' },
    { label: t('services'), href: '/services' },
    { label: t('donations'), href: '/donations' },
  ];

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleAdminAccess = () => {
    if (adminCode === '551010') {
      setIsAdminDialogOpen(false);
      setAdminCode('');
      navigate('/admin-dashboard');
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin code",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 shadow-elegant">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo with enhanced temple gradient animation */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="h-10 w-10 rounded-full temple-gradient flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-glow animate-pulse-glow">
                <span className="text-white font-bold text-lg">ॐ</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                Sri Balaji Temple
              </span>
            </Link>

            {/* Desktop Quick Navigation - Minimalistic */}
            <div className="hidden lg:flex items-center space-x-8">
              {quickNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-all duration-300 hover:text-primary hover:scale-110 relative group ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-0 -z-10 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
                  {location.pathname === item.href && (
                    <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-bounce-gentle" />
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Controls */}
            <div className="flex items-center space-x-3">
              {/* Language Selector with smooth hover effects */}
              <Select value={language} onValueChange={(value: 'en' | 'hi' | 'te') => setLanguage(value)}>
                <SelectTrigger className="w-16 h-9 hover:scale-105 hover:shadow-lg transition-all duration-300 border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="hi">हि</SelectItem>
                  <SelectItem value="te">తె</SelectItem>
                </SelectContent>
              </Select>

              {/* Theme Toggle with premium animation */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="hover:scale-110 hover:rotate-180 hover:shadow-glow transition-all duration-300 group"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 group-hover:text-primary" />
                ) : (
                  <Sun className="h-4 w-4 group-hover:text-yellow-400" />
                )}
              </Button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <NotificationCenter />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/settings')}
                    className="hover:scale-105 hover:shadow-lg transition-all duration-300 hidden lg:flex"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300 hover:scale-110">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="temple-gradient text-white font-bold">
                      {(user.user_metadata?.full_name || user.email || 'U')[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="hover:scale-105 hover:shadow-lg transition-all duration-300 temple-gradient-hover"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}

              {/* Admin Access */}
              <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:scale-105 transition-all duration-300 hidden lg:flex">
                    {t('admin')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="animate-scale-in">
                  <DialogHeader>
                    <DialogTitle>{t('secretCode')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminCode">{t('secretCode')}</Label>
                      <Input
                        id="adminCode"
                        type="password"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="transition-all duration-300 focus:scale-105 focus:shadow-lg"
                      />
                    </div>
                    <Button onClick={handleAdminAccess} className="w-full hover:scale-105 transition-all duration-300">
                      {t('enter')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Enhanced Mobile Sidebar */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Floating Sidebar */}
          <div className="absolute right-4 top-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] bg-background/95 backdrop-blur-lg rounded-2xl shadow-2xl border animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full temple-gradient flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ॐ</span>
                </div>
                <span className="font-semibold text-lg">Navigation</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="hover:scale-110 transition-all duration-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Items */}
            <div className="p-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group animate-fade-in ${
                    location.pathname === item.href
                      ? 'temple-gradient text-white shadow-lg'
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.label}</span>
                  {location.pathname === item.href && (
                    <div className="ml-auto h-2 w-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="p-6 border-t space-y-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-primary/5">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="temple-gradient text-white font-bold">
                        {(user.user_metadata?.full_name || user.email || 'U')[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {user.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full justify-start hover:scale-105 transition-all duration-300"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      signOut();
                    }}
                    className="w-full justify-start hover:scale-105 transition-all duration-300"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    navigate('/auth');
                  }}
                  className="w-full justify-start hover:scale-105 transition-all duration-300 temple-gradient-hover"
                >
                  <User className="w-4 h-4 mr-3" />
                  Sign In
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAdminDialogOpen(true);
                }}
                className="w-full justify-start hover:scale-105 transition-all duration-300"
              >
                {t('admin')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
