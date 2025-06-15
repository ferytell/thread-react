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
