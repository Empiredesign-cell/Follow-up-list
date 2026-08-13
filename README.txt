FOLLOW UP ABSEN V5 - MODE LOKAL TANPA FIREBASE FUNCTIONS

Upload/replace file berikut ke root website Follow Up:
- index.html
- attendance-reminder-sw.js
- absen-alarm.mp3
- absen-icon.png
- absen-reminder.png
- manifest.json (jika website memakai PWA)

Cara pakai per PC/browser:
1. Buka website Follow Up.
2. Klik ikon lonceng Pengingat Absen Pulang.
3. Set jam dan hari masing-masing pengguna.
4. Klik AKTIFKAN lalu izinkan Notifications.
5. Klik Test Alarm + Notif sekali agar browser mengizinkan suara.
6. Biarkan tab Follow Up tetap terbuka. Pengguna boleh pindah ke website lain/tab lain.

Catatan:
- Setting tersimpan di localStorage, jadi tiap PC/browser bisa punya jam berbeda.
- Jika tab Follow Up ditutup atau browser ditutup, reminder lokal tidak dapat berjalan.
- Browser dapat men-throttle timer tab background, jadi timing absolut sampai detik tidak dapat dijamin tanpa backend/extension/native app.
