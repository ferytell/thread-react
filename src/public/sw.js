importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

const CACHE_NAME = 'sharestory-v1';
const BASE_PATH = '/share-story';
const OFFLINE_URL = `${BASE_PATH}/offline.html`;
const INDEX_URL = `${BASE_PATH}/index.html`;

if (workbox) {
  // Precache assets
  if (Array.isArray(self.__WB_MANIFEST)) {
    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
  } else {
    console.warn('__WB_MANIFEST is not an array — skipping precache');
  }

  // Route fallback
  workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL(INDEX_URL));

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
  console.warn('⚠️ Workbox failed to load.');
}

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
