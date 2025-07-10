
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, Calendar, Heart, Camera, Mail, User, Settings, LogOut, CreditCard, History, Shield, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationLinks = [
    { name: t('home'), href: '/', icon: Home },
    { name: t('services'), href: '/services', icon: Calendar },
    { name: t('events'), href: '/events', icon: Calendar },
    { name: t('donations'), href: '/donations', icon: Heart },
    { name: t('gallery'), href: '/gallery', icon: Camera },
    { name: t('contact'), href: '/contact', icon: Mail },
    { name: t('history'), href: '/history', icon: BookOpen },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🕉</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Sree Balaji
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            {user && (
              <Link
                to="/subscriptions"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/subscriptions')
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Subscriptions</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-32 truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/history')}>
                    <History className="w-4 h-4 mr-2" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/subscriptions')}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Subscriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="temple-gradient text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-orange-600 focus:outline-none focus:text-orange-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-orange-100">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              ))}
              
              {user && (
                <Link
                  to="/subscriptions"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/subscriptions')
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Subscriptions</span>
                </Link>
              )}

              {user ? (
                <>
                  <Link
                    to="/history"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <History className="w-5 h-5" />
                    <span>History</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="temple-gradient text-white w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
