// CSS imports

import '/src/public/styles/styles.css';
import '/src/public/styles/responsives.css';
import 'tiny-slider/dist/tiny-slider.css';

// Components
import App from './pages/app';
import Camera from './utils/camera';

function setupOfflineDetection() {
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine;
    const offlineIndicator = document.getElementById('offline-indicator');

    if (!isOnline) {
      if (!offlineIndicator) {
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.style.position = 'fixed';
        indicator.style.bottom = '10px';
        indicator.style.right = '10px';
        indicator.style.padding = '5px 10px';
        indicator.style.backgroundColor = '#ff9800';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '4px';
        indicator.style.zIndex = '1000';
        indicator.textContent = 'Offline Mode';
        document.body.appendChild(indicator);
      }
    } else if (offlineIndicator) {
      offlineIndicator.remove();
    }
  };

  // Initial check
  updateOnlineStatus();

  // Listen for online/offline events
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

document.addEventListener('DOMContentLoaded', async () => {
  setupOfflineDetection();

  const app = new App({
    content: document.getElementById('main-content'),
    drawerButton: document.getElementById('drawer-button'),
    drawerNavigation: document.getElementById('navigation-drawer'),
    skipLinkButton: document.getElementById('skip-link')
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();

    // Stop all active media
    Camera.stopAllStreams();
  });
});
