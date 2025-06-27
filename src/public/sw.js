importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// Only try to precache if __WB_MANIFEST is injected (in production)
if (typeof self.__WB_MANIFEST !== 'undefined' && Array.isArray(self.__WB_MANIFEST)) {
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
} else {
  console.warn('Skipping precache: __WB_MANIFEST is not available (likely in development)');
}

const CACHE_NAME = 'sharestory-v1';
const OFFLINE_URL = '/offline.html';

// Install and cache offline page and fonts
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // For HTML page navigations (like user typing URL), use network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response || caches.match(event.request);
        })
        .catch(() => {
          // Only fallback if the request wasn't precached
          return caches.match(event.request).then((cached) => {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // For CSS, JS, Images: cache first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request)
          .then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
          .catch(() => {
            // You could optionally return placeholder image here
            return caches.match(OFFLINE_URL);
          })
      );
    })
  );
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Network-first for page navigations (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Cache-first for everything else (CSS, JS, images)
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
