
const CACHE_NAME = 'sri-balaji-temple-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/landing',
  '/services',
  '/events',
  '/donations',
  '/gallery',
  '/contact',
  'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275'
];

// Install event
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event with network-first strategy for API calls
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Handle API requests with network-first strategy
  if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          });
      })
  );
});

// Push notification event
self.addEventListener('push', function(event) {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'Sri Balaji Temple',
    body: 'You have a new notification from the temple',
    icon: 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275',
    badge: 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275',
    tag: 'temple-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: 'https://ik.imagekit.io/balaji2025/tirumeni-removebg-preview.png?updatedAt=1748613989275'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action !== 'close') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', function(event) {
  console.log('Background sync:', event.tag);
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when back online
      fetch('/api/sync-offline-actions', {
        method: 'POST',
        body: JSON.stringify({ action: 'sync' })
      }).catch(err => console.log('Sync failed:', err))
    );
  }
});
