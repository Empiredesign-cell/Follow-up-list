FOLLOW UP LIST V8 - DUAL ALARM SOUND + FIX LIST
===============================================

SIAP PUBLISH - TANPA NODE.JS / FIREBASE FUNCTIONS

UPDATE V8
1. Bug list/task sempat muncul lalu hilang tetap menggunakan fix sinkronisasi V7.
2. Pengingat Masuk Kerja dan Pulang Kerja punya SOUND BERBEDA.
3. Sound sudah disertakan dan sudah terhubung otomatis ke kode:
   - alarm-masuk.mp3  = nada naik / energik untuk absen masuk.
   - alarm-pulang.mp3 = nada turun / berbeda jelas untuk absen pulang.
4. Tombol Test Alarm + Notif mengikuti tab yang sedang dipilih:
   - Tab Masuk -> memainkan alarm-masuk.mp3
   - Tab Pulang -> memainkan alarm-pulang.mp3
5. Setting jam/hari/status tetap per PC / per browser.

FILE YANG WAJIB DIPUBLISH KE ROOT WEBSITE
=========================================
- index.html
- attendance-reminder-sw.js
- manifest.json
- alarm-masuk.mp3
- alarm-pulang.mp3
- absen-icon.png
- absen-reminder.png

CARA PUBLISH
============
1. Backup website lama.
2. Upload/replace SEMUA file di atas ke ROOT website yang sama.
3. Pastikan file MP3 berada sejajar dengan index.html, jangan dimasukkan ke subfolder lain.
4. Publish/deploy.
5. Buka website lalu tekan Ctrl + F5.
6. Klik icon lonceng Pengingat Absensi.
7. Pilih tab Masuk Kerja -> klik Test Alarm + Notif. Harus terdengar sound masuk.
8. Pilih tab Pulang Kerja -> klik Test Alarm + Notif. Harus terdengar sound pulang yang berbeda.
9. Atur jam masing-masing lalu aktifkan.

CONTOH STRUKTUR HOSTING
=======================
/root-website/
  index.html
  attendance-reminder-sw.js
  manifest.json
  alarm-masuk.mp3
  alarm-pulang.mp3
  absen-icon.png
  absen-reminder.png

CATATAN
=======
- Tidak perlu Node.js.
- Tidak perlu Firebase Functions.
- Tidak perlu VAPID Key.
- Alarm lokal tetap membutuhkan tab Follow Up terbuka ketika pengguna sedang membuka website lain.
- Browser harus pernah mengizinkan suara/notifikasi melalui interaksi pengguna (gunakan tombol Test Alarm + Notif).
- Jika ingin mengganti suara sendiri nanti, cukup replace file alarm-masuk.mp3 atau alarm-pulang.mp3 dengan nama file yang sama.
