/*
 * Follow Up List - Attendance Reminder Service Worker v4.1
 * File ini HARUS bernama firebase-messaging-sw.js dan berada di root domain.
 */

const ATTENDANCE_SW_VERSION = 'v4.1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const rootUrl = () => new URL('./', self.registration.scope).href;
const assetUrl = (name) => new URL(name, self.registration.scope).href;

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  const baseUrl = rootUrl();
  const targetUrl = action === 'done'
    ? new URL('?attendance=done', baseUrl).href
    : baseUrl;

  event.waitUntil((async () => {
    const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientList) {
      if ('navigate' in client) await client.navigate(targetUrl);
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(targetUrl);
  })());
});

// Compat SDK dipakai karena project ini single-file HTML tanpa bundler.
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

async function notifyOpenFollowUpTabs(data) {
  const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
  await Promise.all(clientList.map((client) => client.postMessage({
    type: 'ATTENDANCE_PUSH',
    version: ATTENDANCE_SW_VERSION,
    scheduledAt: data.scheduledAt || '',
    tag: data.tag || ''
  })));
}

messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const notification = payload.notification || {};
  const title = notification.title || data.title || '⏰ Waktunya Absen Pulang!';

  // Gunakan artwork 512x512 juga sebagai icon. Pada desktop, icon biasanya lebih
  // konsisten ditampilkan daripada hero image; `image` tetap dikirim untuk platform
  // yang mendukung gambar besar.
  const reminderVisual = assetUrl('absen-reminder.png');
  const badgeVisual = assetUrl('absen-icon.png');
  const tag = data.tag || `absen-pulang-${data.date || 'today'}-${data.time || ''}`;

  const options = {
    body: notification.body || data.body || 'Sebelum pulang, jangan lupa absen dulu ya!',
    icon: reminderVisual,
    badge: badgeVisual,
    image: reminderVisual,
    tag,
    renotify: true,
    requireInteraction: true,
    silent: false,
    timestamp: Date.now(),
    vibrate: [250, 100, 250, 100, 450],
    data: { url: './?attendance=done', scheduledAt: data.scheduledAt || '' },
    actions: [
      { action: 'done', title: '✓ Sudah Absen' },
      { action: 'open', title: 'Buka Follow Up' }
    ]
  };

  return Promise.all([
    self.registration.showNotification(title, options),
    notifyOpenFollowUpTabs(data)
  ]);
});
