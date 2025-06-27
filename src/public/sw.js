importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const CACHE_NAME = 'sharestory-v1';
const BASE_PATH = '/share-story';

const INDEX_URL = 'index.html';
const OFFLINE_URL = 'offline.html';

if (workbox) {
  // Precache assets
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  workbox.routing.registerRoute(
    new workbox.routing.NavigationRoute(workbox.precaching.createHandlerBoundToURL(INDEX_URL))
  );

  // Offline fallback for failed HTML fetches
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match(OFFLINE_URL);
    }
    return Response.error();
  });

  // cache-first for CSS, JS, images
  workbox.routing.registerRoute(
    ({ request }) => ['style', 'script', 'image'].includes(request.destination),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
        })
      ]
    })
  );
} else {
  console.warn('Workbox failed to load.');
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

// Clean up
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
});
