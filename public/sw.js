const CACHE_NAME = 'shenen-kolu-pwa-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_PRECACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install: precache offline fallback and essential icons
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first with offline fallback for navigational routes;
// Stale-while-revalidate for static assets.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Security: NEVER cache admin dashboard, auth endpoints, or meeting room token APIs
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/room') ||
    url.searchParams.has('token')
  ) {
    return;
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for static assets (images, fonts, stylesheets)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
  }
});

// Web Push Event Handler
self.addEventListener('push', (event) => {
  let data = {
    title: 'Shenen Kolu Woreda Prosperity Party',
    body: 'New civic announcement or news has been published.',
    url: '/',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.message,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: {
      url: data.url || '/',
    },
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'open',
        title: 'Open Update',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window if open
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
