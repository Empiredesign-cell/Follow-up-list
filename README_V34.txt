V34 - Landing Theme Fix + Custom Icon PNG + Due Date Reminder

UPGRADE:
1. Landing Page Light/Dark diperbaiki.
   - Light mode sekarang benar-benar terang.
   - Dark mode tetap dark cinematic.
   - Theme tersimpan seperti sebelumnya.

2. Pustaka Icon/Karakter PNG khusus Super Admin.
   - Super Admin > Divisi & Fitur > Pustaka Icon / Karakter PNG.
   - Cukup upload PNG.
   - Gambar otomatis diperkecil sekitar 220 px.
   - Otomatis menjadi pilihan karakter saat membuat/edit room.
   - Room menyimpan salinan data icon agar tidak rusak bila icon dihapus dari pustaka.

3. Due Date Reminder global.
   - Setting per akun.
   - Master ON/OFF.
   - Notifikasi browser ON/OFF.
   - Bunyi alarm ON/OFF.
   - Memantau semua room yang memang boleh diakses akun.
   - Tetap bekerja selama Follow Up terbuka meskipun pengguna sedang membuka tab website lain.
   - Task Done tidak memicu notifikasi.
   - Exact timer + heartbeat 15 detik untuk mengurangi keterlambatan akibat throttling browser.
   - Bunyi dibuat via Web Audio, jadi tidak perlu file MP3 tambahan.

PUBLISH:
1. Replace index.html.
2. Replace Firestore Rules dengan firestore.rules V34 lalu Publish.
3. Deploy Vercel.
4. Ctrl+F5.
5. Buka tombol Due Date Reminder, aktifkan, lalu izinkan Notification browser.
