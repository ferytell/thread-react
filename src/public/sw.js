const CACHE_NAME = 'sharestory-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/styles.css',
  '/styles/responsives.css',
  '/images/sharestory.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)));
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')));
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
