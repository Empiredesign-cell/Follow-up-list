FOLLOW UP LIST V9 - GLOBAL ALARM ENGINE + DUAL SOUND

PERBAIKAN UTAMA:
1. Alarm tidak lagi mati ketika masuk ke dalam workspace/folder Follow Up.
2. Engine alarm sekarang dipasang satu kali di level App, jadi tetap hidup saat berpindah Beranda <-> Workspace.
3. Tombol Absen tersedia juga di halaman workspace untuk membuka pengaturan tanpa kembali ke Beranda.
4. Alarm Masuk memakai alarm-masuk.mp3.
5. Alarm Pulang memakai alarm-pulang.mp3.
6. Setting tetap per PC/browser menggunakan localStorage.
7. Tidak memerlukan Node.js atau Firebase Functions.

CARA PUBLISH:
- Upload/replace seluruh file dalam folder ini ke root website.
- Pastikan alarm-masuk.mp3 dan alarm-pulang.mp3 ikut ter-upload.
- Setelah publish tekan Ctrl+F5.
- Buka menu Absen, klik Test Alarm + Notif sekali agar browser mengizinkan audio/notifikasi.
- Setelah itu masuk ke workspace. Alarm tetap aktif selama tab Follow Up masih terbuka.

CATATAN:
Tab Follow Up boleh berada di background saat membuka website lain, tetapi jangan ditutup.
