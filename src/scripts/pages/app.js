import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
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
  }

  #registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful');

            this.#checkInstallable();
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }

  #checkInstallable() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('Aplikasi bisa diinstall');
      // Anda bisa menyimpan event ini untuk menampilkan button install nanti
      this.deferredPrompt = e;
    });
  }
  async #setupNotificationToggle() {
    const btn = document.getElementById('toggle-notification-btn');
    if (!btn) return;

    const reg = await navigator.serviceWorker.ready;

    const updateButton = async () => {
      const currentSub = await reg.pushManager.getSubscription();
      btn.textContent = currentSub ? '🔔 Notifications On' : '🔕 Notifications Off';
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

      await updateButton(); // update button state after action
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
    this.#setupNotificationToggle();
  }

  async renderPage() {
    if (this.#isTransitioning) return; // Skip if already transitioning
    this.#isTransitioning = true;
    try {
      const url = getActiveRoute();
      const route = routes[url];

      // Get page instance
      const page = route();
      if (!page) console.log('hell null');
      // ✅ Null check: user was redirected, do nothing
      if (!page) return;

      if (!document.startViewTransition) {
        console.log('View Transitions API not supported, using fallback');
        // Directly update DOM without transitions
        this.#content.innerHTML = await page.render();
        page.afterRender();
        scrollTo({ top: 0, behavior: 'instant' });
        this.#setupNavigationList();
        return;
      }

      console.log('starting ....');

      const transition = transitionHelper({
        updateDOM: async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
          //page.afterRender();
        },
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
