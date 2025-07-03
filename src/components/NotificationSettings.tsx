
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Bell, BellOff, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pushNotificationService } from '@/lib/push-notifications';

const NotificationSettings = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState({
    eventReminders: true,
    serviceBookings: true,
    donations: true,
    dailyBlessings: false,
    festivalAlerts: true
  });
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationSupport();
    checkSubscriptionStatus();
  }, []);

  const checkNotificationSupport = async () => {
    const supported = await pushNotificationService.isSupported();
    setIsSupported(supported);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const checkSubscriptionStatus = async () => {
    const subscription = await pushNotificationService.getSubscription();
    setIsSubscribed(!!subscription);
  };

  const handleEnableNotifications = async () => {
    try {
      const newPermission = await pushNotificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission === 'granted') {
        const subscription = await pushNotificationService.subscribe();
        if (subscription) {
          setIsSubscribed(true);
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive temple notifications",
          });
          
          // Test notification
          await pushNotificationService.showLocalNotification({
            title: "Notifications Enabled",
            body: "You'll now receive updates from Sri Balaji Temple",
            tag: "welcome-notification"
          });
        }
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to enable notifications",
        variant: "destructive",
      });
    }
  };

  const handleDisableNotifications = async () => {
    try {
      const success = await pushNotificationService.unsubscribe();
      if (success) {
        setIsSubscribed(false);
        toast({
          title: "Notifications Disabled",
          description: "You won't receive temple notifications anymore",
        });
      }
    } catch (error) {
      console.error('Error disabling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to disable notifications",
        variant: "destructive",
      });
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Save preferences to localStorage or send to backend
    localStorage.setItem('notificationPreferences', JSON.stringify({
      ...preferences,
      [key]: value
    }));
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Notifications Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your browser doesn't support push notifications.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notifications-toggle" className="text-base font-medium">
              Push Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications from the temple
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isSubscribed ? (
              <Button onClick={handleEnableNotifications} size="sm">
                Enable
              </Button>
            ) : (
              <Button onClick={handleDisableNotifications} variant="outline" size="sm">
                Disable
              </Button>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        {isSubscribed && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <Label className="text-base font-medium">Notification Types</Label>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="event-reminders">Event Reminders</Label>
                <Switch
                  id="event-reminders"
                  checked={preferences.eventReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('eventReminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="service-bookings">Service Bookings</Label>
                <Switch
                  id="service-bookings"
                  checked={preferences.serviceBookings}
                  onCheckedChange={(checked) => handlePreferenceChange('serviceBookings', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="donations">Donation Confirmations</Label>
                <Switch
                  id="donations"
                  checked={preferences.donations}
                  onCheckedChange={(checked) => handlePreferenceChange('donations', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="daily-blessings">Daily Blessings</Label>
                <Switch
                  id="daily-blessings"
                  checked={preferences.dailyBlessings}
                  onCheckedChange={(checked) => handlePreferenceChange('dailyBlessings', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="festival-alerts">Festival Alerts</Label>
                <Switch
                  id="festival-alerts"
                  checked={preferences.festivalAlerts}
                  onCheckedChange={(checked) => handlePreferenceChange('festivalAlerts', checked)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Permission Status */}
        <div className="text-sm text-muted-foreground">
          <p>Permission Status: <span className="capitalize">{permission}</span></p>
          <p>Subscription Status: {isSubscribed ? 'Active' : 'Inactive'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
