importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

// const CACHE_NAME = 'sharestory-v1';
// const BASE_URL = self.location.pathname.replace(/\/sw\.js$/, '/');
const CACHE_NAME = 'sharestory-v2'; // Incremented version
const BASE_URL = self.location.pathname.replace(/\/sw\.js$/, '/');

// right route
const ASSETS_TO_CACHE = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}offline.html`,
  `${BASE_URL}styles/styles.css`,
  `${BASE_URL}styles/responsives.css`,
  `${BASE_URL}images/ShareStoryIcon.png`,
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then(async (cache) => {
//       for (const asset of ASSETS_TO_CACHE) {
//         try {
//           const response = await fetch(asset);
//           if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
//           await cache.put(asset, response.clone());
//         } catch (err) {
//           console.error(`Failed to cache: ${asset}`, err);
//         }
//       }
//     }),
//   );
// });
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(ASSETS_TO_CACHE);
      } catch (err) {
        console.error('Failed to cache some assets:', err);
      }
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// self.addEventListener('fetch', (event) => {
//   if (event.request.mode === 'navigate') {
//     event.respondWith(fetch(event.request).catch(() => caches.match('offline.html')));
//   } else {
//     event.respondWith(
//       caches.match(event.request).then((response) => response || fetch(event.request)),
//     );
//   }
// });

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || requestUrl.protocol === 'chrome-extension:') {
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If we got a valid response, cache it
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline.html if not available
          return caches
            .match(request)
            .then((response) => response || caches.match(`${BASE_URL}offline.html`));
        }),
    );
    return;
  }

  // Handle map tile requests
  if (event.request.url.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return (
            response ||
            fetch(event.request).then((fetchResponse) => {
              // Don't cache if response is not OK
              if (!fetchResponse.ok) return fetchResponse;

              // Clone the response and cache it
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
              return fetchResponse;
            })
          );
        })
        .catch(() => {
          // Return a placeholder tile if everything fails
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#aaa" font-family="sans-serif">Offline Map</text></svg>',
            {
              headers: { 'Content-Type': 'image/svg+xml' },
            },
          );
        }),
    );
    return;
  }
  // Default behavior for other requests
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise try the network
      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return response;
        })
        .catch(() => {
          // For API requests, return empty response instead of failing
          if (requestUrl.pathname.includes('/stories')) {
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
          // For other requests, return a fallback if available
          return caches.match(request);
        });
    }),
  );
});

self.addEventListener('push', function (event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notification', body: event.data.text() };
  }

  const title = data.title || 'Notification';
  const body = data.options?.body || 'No content available';
  const icon = '/Icon.png';

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body,
      icon,
      ...data.options,
    }),
  );
});
