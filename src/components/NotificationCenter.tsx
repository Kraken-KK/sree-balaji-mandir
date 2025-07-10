import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  Check, 
  X, 
  CreditCard, 
  Ticket, 
  Calendar,
  Heart,
  Settings,
  AlertCircle
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'payment' | 'ticket' | 'event' | 'donation' | 'system';
  title: string;
  message: string;
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  actionUrl?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Simulate real-time notifications
      const generateNotifications = () => {
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'payment',
            title: 'Payment Successful',
            message: 'Your payment of ₹500 has been processed successfully.',
            status: 'unread',
            priority: 'high',
            timestamp: new Date().toISOString(),
            actionUrl: '/history'
          },
          {
            id: '2',
            type: 'ticket',
            title: 'Ticket Generated',
            message: 'Your service ticket has been generated and is ready for use.',
            status: 'unread',
            priority: 'medium',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            actionUrl: '/history'
          }
        ];
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => n.status === 'unread').length);
      };

      generateNotifications();

      // Listen for real-time updates
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'payments'
        }, (payload) => {
          console.log('Payment update received:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new.status === 'completed') {
            const notification: Notification = {
              id: Date.now().toString(),
              type: 'payment',
              title: 'Payment Completed',
              message: `Payment of ₹${payload.new.amount} completed successfully!`,
              status: 'unread',
              priority: 'high',
              timestamp: new Date().toISOString(),
              actionUrl: '/history'
            };
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: notification.title,
              description: notification.message,
              className: "temple-gradient text-white border-0",
            });
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-5 w-5" />;
      case 'ticket': return <Ticket className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'donation': return <Heart className="h-5 w-5" />;
      case 'system': return <Settings className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification?.status === 'unread') {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:scale-110 hover:shadow-glow transition-all duration-300"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse-glow"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] z-50">
          <Card className="animate-scale-in shadow-elegant border-2">
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs hover:scale-105 transition-all duration-300"
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 hover:scale-110 transition-all duration-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b last:border-b-0 transition-all duration-300 hover:bg-muted/50 animate-fade-in ${
                        notification.status === 'unread' ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                          notification.type === 'ticket' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'event' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'donation' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                            <Badge 
                              variant={getPriorityColor(notification.priority)}
                              className="text-xs"
                            >
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.timestamp).toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1">
                              {notification.status === 'unread' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 px-2 text-xs hover:scale-105 transition-all duration-300"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeNotification(notification.id)}
                                className="h-6 px-2 text-xs hover:scale-105 transition-all duration-300 text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationCenter;