
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class PushNotificationService {
  private vapidPublicKey = 'your-vapid-public-key'; // This should be set from environment
  
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }
    
    const permission = await Notification.requestPermission();
    return permission;
  }
  
  async isSupported(): Promise<boolean> {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
  
  async subscribe(): Promise<PushSubscription | null> {
    if (!await this.isSupported()) {
      return null;
    }
    
    const registration = await navigator.serviceWorker.ready;
    
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });
      
      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }
  
  async unsubscribe(): Promise<boolean> {
    if (!await this.isSupported()) {
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    
    return false;
  }
  
  async getSubscription(): Promise<PushSubscription | null> {
    if (!await this.isSupported()) {
      return null;
    }
    
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  }
  
  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission();
    
    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275',
          badge: payload.badge || 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275',
          tag: payload.tag || 'temple-notification',
          requireInteraction: true,
          actions: payload.actions || [
            {
              action: 'view',
              title: 'View'
            },
            {
              action: 'close',
              title: 'Close'
            }
          ]
        });
      } else {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275'
        });
      }
    }
  }
  
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();

// Utility functions for common temple notifications
export const templeNotifications = {
  eventReminder: (eventName: string, eventDate: string) => ({
    title: 'Temple Event Reminder',
    body: `Don't forget: ${eventName} is happening on ${eventDate}`,
    tag: 'event-reminder',
    url: '/events'
  }),
  
  serviceBooking: (serviceName: string, serviceDate: string) => ({
    title: 'Service Booking Confirmed',
    body: `Your ${serviceName} booking for ${serviceDate} has been confirmed`,
    tag: 'service-booking',
    url: '/services'
  }),
  
  donationThankYou: (amount: number) => ({
    title: 'Thank You for Your Donation',
    body: `Your generous donation of ₹${amount} has been received`,
    tag: 'donation-thanks',
    url: '/donations'
  }),
  
  dailyBlessings: () => ({
    title: 'Daily Blessings',
    body: 'Start your day with divine blessings from Sri Balaji Temple',
    tag: 'daily-blessings',
    url: '/'
  }),
  
  festivalAlert: (festivalName: string) => ({
    title: 'Festival Alert',
    body: `${festivalName} celebrations are starting soon at the temple`,
    tag: 'festival-alert',
    url: '/events'
  })
};
