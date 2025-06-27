// importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
// import { precacheAndRoute } from 'workbox-precaching';

// const manifest = self.__WB_MANIFEST;

// const CACHE_NAME = 'sharestory-v1';
// const OFFLINE_URL = '/offline.html';
// const BASE_URL = '/share-story/';

// workbox.precaching.precacheAndRoute(manifest);

// if (Array.isArray(self.__WB_MANIFEST)) {
//   precacheAndRoute(self.__WB_MANIFEST);
// } else {
//   console.warn('No precache manifest found. Skipping precache in development.');
// }

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches
//       .open(CACHE_NAME)
//       .then((cache) =>
//         cache.addAll([
//           OFFLINE_URL,
//           'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
//         ])
//       )
//       .then(() => self.skipWaiting())
//   );
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheName !== CACHE_NAME) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', (event) => {
//   // Skip non-GET requests
//   if (event.request.method !== 'GET') return;

//   // Network-first strategy for HTML
//   if (event.request.mode === 'navigate') {
//     event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
//     return;
//   }

//   // Cache-first strategy for assets
//   event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
// });

// self.addEventListener('install', () => self.skipWaiting());
// if (typeof workbox !== 'undefined') {
//   workbox.precaching.precacheAndRoute([]);
// }

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
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([
          OFFLINE_URL,
          'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ])
      )
  );
  self.skipWaiting();
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
