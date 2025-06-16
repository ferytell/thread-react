const CACHE_NAME = 'sharestory-v1';

const BASE_URL = self.location.pathname.replace(/\/sw\.js$/, '/');

const ASSETS_TO_CACHE = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}offline.html`,
  `${BASE_URL}styles/styles.css`,
  `${BASE_URL}styles/responsives.css`,
  `${BASE_URL}images/sharestory.png`,
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of ASSETS_TO_CACHE) {
        try {
          const response = await fetch(asset);
          if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
          await cache.put(asset, response.clone());
        } catch (err) {
          console.error(`Failed to cache: ${asset}`, err);
        }
      }
    }),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('offline.html')));
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request)),
    );
  }
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
