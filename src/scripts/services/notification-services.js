import { convertBase64ToUint8Array } from '../utils';
import { VAPID_PUBLIC_KEY } from '../config';
import { requesNotification, unsubcribeNotification } from '../data/api';

class NotificationService {
  async subscribe() {
    if (!('serviceWorker' in navigator && 'PushManager' in window)) {
      console.warn('Push notifications are not supported in this browser.');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const convertedKey = convertBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      const res = await requesNotification(subscription);
      if (res.error) throw new Error(res.message);
      console.log('Push received at:', new Date().toISOString());
    } catch (err) {
      console.error('Detailed subscription error:', err);
      throw new Error('Registration failed - push service error');
    }
  }

  async unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      await unsubcribeNotification(subscription);
    } catch (error) {
      console.warn('❌ Failed to unsubscribe from push notifications', error);
    }
  }
}

export default new NotificationService();
