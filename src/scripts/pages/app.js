import { getActivePathname } from '../routes/url-parser';

import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate
} from '../templates';
import { setupSkipToContent, transitionHelper } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
import { routes } from '../routes/routes';
import NotificationService from '../services/notification-services';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;
  #isTransitioning = false;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
    this.#registerServiceWorker();
    this.#setupServiceWorkerUpdates();
  }

  #registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          // const registration = await navigator.serviceWorker.register('sw.js', {
          //   updateViaCache: 'none', // Always check for updates
          //   scope: '/', // Ensure proper scope
          // });
          const registration = await navigator.serviceWorker.register('/share-story/sw.js', {
            scope: '/share-story/'
          });

          // Add this to prevent immediate takeover
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content available - will reload on next navigation');
                  // Optionally show "Update available" UI instead of auto-reloading
                }
              }
            });
          });

          await this.#setupNotificationToggle();
          this.#checkInstallable();
        } catch (err) {
          console.error('ServiceWorker registration failed:', err);
        }
      });
    }
  }
  #setupServiceWorkerUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Only reload if user confirms or implement custom UI
        if (confirm('New version available. Reload now?')) {
          window.location.reload();
        }
      });
    }
  }

  #checkInstallable() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Aplikasi bisa diinstall');
      this.deferredPrompt = e;
    });
  }
  async #setupNotificationToggle() {
    const btn = document.getElementById('toggle-notification-btn');
    if (!btn) return;

    const reg = await navigator.serviceWorker.ready;

    const updateButton = async () => {
      const currentSub = await reg.pushManager.getSubscription();
      if (currentSub) {
        btn.textContent = '🔔';
        btn.title = 'Notifikasi aktif. Klik untuk menonaktifkan.';
      } else {
        btn.textContent = '🔕';
        btn.title = 'Notifikasi nonaktif. Klik untuk mengaktifkan.';
      }
    };

    await updateButton();

    btn.addEventListener('click', async () => {
      const currentSub = await reg.pushManager.getSubscription();
      if (currentSub) {
        const result = await NotificationService.unsubscribe();
        console.log('Unsubscribed:', result);
      } else {
        try {
          await NotificationService.subscribe();
        } catch (err) {
          console.warn(' Failed to subscribe:', err);
          alert('Gagal mengaktifkan notifikasi. Periksa izin browser.');
        }
      }

      await updateButton();
    });
  }

  #buttonDarkModeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    if (!toggleBtn) return;

    const isDark = localStorage.getItem('theme') === 'dark';

    if (isDark) {
      htmlEl.classList.add('dark');
      toggleBtn.textContent = '⏾';
    } else {
      htmlEl.classList.remove('dark');
      toggleBtn.textContent = '☼';
    }

    toggleBtn.addEventListener('click', () => {
      const isNowDark = htmlEl.classList.toggle('dark');
      toggleBtn.textContent = isNowDark ? '⏾' : '☼';
      localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    });
  }

  async #initPushNotifications() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    try {
      await NotificationService.subscribe();
    } catch (err) {
      console.warn('Failed to subscribe to push notifications:', err);
    }
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.children.namedItem('navlist-main');
    const navList = this.#drawerNavigation.children.namedItem('navlist');

    // User not log in
    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (confirm('Apakah Anda yakin ingin keluar?')) {
        getLogout();

        // Redirect
        location.hash = '/login';
      }
    });
    //this.#setupNotificationToggle();
    this.#buttonDarkModeToggle();
  }

  async renderPage() {
    if (this.#isTransitioning) return; // Skip if already transitioning
    this.#isTransitioning = true;
    try {
      const pathname = getActivePathname();
      const page = routes.getPage(pathname);

      if (!document.startViewTransition) {
        console.log('View Transitions API not supported, using fallback');
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        scrollTo({ top: 0, behavior: 'instant' });
        this.#setupNavigationList();
        return;
      }

      const transition = transitionHelper({
        updateDOM: async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
          //page.afterRender();
        }
      });

      transition.ready.catch(console.error);
      transition.updateCallbackDone.then(() => {
        scrollTo({ top: 0, behavior: 'instant' });
        this.#setupNavigationList();
      });
    } finally {
      this.#isTransitioning = false;
    }
  }
}
