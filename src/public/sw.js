importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const CACHE_NAME = 'sharestory-v1';
const BASE_PATH = '/share-story';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/images/ShareStoryIcon192.png',
  '/images/ShareStoryIcon384.png',
  '/images/ShareStoryIcon512.png',
  '/screenshots/Screenshot-p.png',
  '/screenshots/Screenshot-d.png',
  '/styles/styles.css',
  '/styles/responsives.css'
];

console.log('[Service Worker] Initializing...');

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching essential assets:', PRECACHE_URLS);
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
  );
});

if (workbox) {
  console.log('[Service Worker] Workbox loaded successfully');

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  console.log('[Service Worker] Precaching completed');

  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'image', 'font'].includes(request.destination),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        })
      ]
    })
  );
  console.log('[Service Worker] Cache-first route registered for static assets');

  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME,
      plugins: [
        {
          handlerDidError: async ({ request }) => {
            console.log(
              '[Service Worker] Network error, serving cached homepage for:',
              request.url
            );
            return caches.match('/index.html');
          }
        }
      ]
    })
  );
  console.log('[Service Worker] Stale-while-revalidate route registered for navigation');

  workbox.routing.setCatchHandler(async ({ request }) => {
    console.log('[Service Worker] Catch handler triggered for:', request.url);

    if (request.mode === 'navigate') {
      console.log('[Service Worker] Serving cached homepage for navigation request');
      return caches.match('/index.html');
    }

    console.log('[Service Worker] No fallback available for non-navigation request');
    return Response.error();
  });
} else {
  console.error('[Service Worker] Workbox failed to load');
}

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push received:', event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      console.warn('Push event data is not valid JSON:', e);
    }
  }

  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message.',
    icon: 'icon.png',
    badge: 'icon.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const targetUrl = event.notification.data?.url || '/';
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        console.log('[Service Worker] Checking existing caches:', keys);
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

console.log('[Service Worker] Setup complete');
