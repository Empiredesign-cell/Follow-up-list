FOLLOW UP ABSEN V6 - CROSS TAB IMAGE

UPDATE:
- absen-reminder.png sekarang dipakai sebagai `icon` DAN `image` pada native notification.
- Tujuannya: di Windows/Chrome yang tidak menampilkan gambar besar dari `image`, artwork tetap muncul sebagai thumbnail/icon notifikasi.
- Tidak memakai Firebase Functions / Node.js. Tab Follow Up harus tetap terbuka.

UPLOAD/REPLACE DI ROOT WEBSITE:
1. index.html
2. attendance-reminder-sw.js
3. absen-alarm.mp3
4. absen-icon.png
5. absen-reminder.png
6. manifest.json

SETELAH DEPLOY:
- buka website Follow Up
- tekan Ctrl+F5
- buka menu Pengingat Absen
- pastikan Notification = Allow
- klik Test Alarm + Notif
- pindah ke tab website lain dan tes lagi pada jam +1/+2 menit

CATATAN:
Browser biasa tidak dapat menampilkan modal HTML/gambar besar di atas tab situs lain. Lintas-tab hanya bisa memakai native system notification. Besar/layout gambar native notification ditentukan Chrome/Edge dan Windows.
