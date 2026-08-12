/*
 * Follow Up List - Background notification worker
 * File ini HARUS berada di root domain yang sama dengan index.html.
 */

// Handle click before importing FCM so custom click behavior is preserved.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  const baseUrl = new URL('./', self.location.origin).href;
  const targetUrl = action === 'done'
    ? new URL('?attendance=done', baseUrl).href
    : baseUrl;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if ('focus' in client) {
        if ('navigate' in client) await client.navigate(targetUrl);
        return client.focus();
      }
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Firebase compat packages are intentionally used because this project is a single-file app
// without a bundler, which matches Firebase's documented service-worker approach.
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAS_LhW8Kgxb9amoDMsHkta-rnKu5RnYZI',
  authDomain: 'follow-up-list.firebaseapp.com',
  projectId: 'follow-up-list',
  storageBucket: 'follow-up-list.firebasestorage.app',
  messagingSenderId: '1042244485783',
  appId: '1:1042244485783:web:a75b4e272133965de05fd2'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = notification.title || data.title || '⏰ Waktunya Absen Pulang!';
  const options = {
    body: notification.body || data.body || 'Sebelum pulang, jangan lupa absen dulu ya!',
    icon: './absen-icon.png',
    badge: './absen-icon.png',
    image: './absen-reminder.png',
    tag: 'absen-pulang',
    renotify: true,
    requireInteraction: true,
    data: { url: './?attendance=done' },
    actions: [
      { action: 'done', title: '✓ Sudah Absen' },
      { action: 'open', title: 'Buka Follow Up' }
    ]
  };
  return self.registration.showNotification(title, options);
});
