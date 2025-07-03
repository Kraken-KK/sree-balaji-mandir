
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Bell } from 'lucide-react';
import { pushNotificationService } from '@/lib/push-notifications';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if we should show notification prompt
    checkNotificationPrompt();

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const checkNotificationPrompt = async () => {
    const isSupported = await pushNotificationService.isSupported();
    const subscription = await pushNotificationService.getSubscription();
    const hasShownPrompt = localStorage.getItem('notification-prompt-shown');
    
    if (isSupported && !subscription && !hasShownPrompt && Notification.permission === 'default') {
      setTimeout(() => {
        setShowNotificationPrompt(true);
      }, 3000); // Show after 3 seconds
    }
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // After installation, show notification prompt
        setTimeout(() => {
          setShowNotificationPrompt(true);
        }, 2000);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  const handleEnableNotifications = async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      if (permission === 'granted') {
        await pushNotificationService.subscribe();
        await pushNotificationService.showLocalNotification({
          title: "Welcome to Sri Balaji Temple",
          body: "You'll now receive divine updates and reminders",
          tag: "welcome-notification"
        });
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
    
    localStorage.setItem('notification-prompt-shown', 'true');
    setShowNotificationPrompt(false);
  };

  const handleDismissNotifications = () => {
    localStorage.setItem('notification-prompt-shown', 'true');
    setShowNotificationPrompt(false);
  };

  // Install prompt
  if (showInstallPrompt && deferredPrompt) {
    return (
      <Card className="fixed bottom-20 left-4 right-4 z-40 bg-gradient-to-r from-orange-500 to-red-500 text-white border-none shadow-2xl md:left-auto md:right-6 md:w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Install Temple App</h3>
                <p className="text-xs opacity-90">Add to your home screen for quick access</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Notification prompt
  if (showNotificationPrompt) {
    return (
      <Card className="fixed bottom-20 left-4 right-4 z-40 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none shadow-2xl md:left-auto md:right-6 md:w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Stay Connected</h3>
                <p className="text-xs opacity-90">Get temple updates and event reminders</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEnableNotifications}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1"
              >
                Enable
              </Button>
              <Button
                onClick={handleDismissNotifications}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default PWAInstallPrompt;
