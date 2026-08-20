FOLLOW UP LIST V7 - DUAL ABSEN + FIX LIST HILANG
=================================================

UPDATE UTAMA
1. Fix bug task/list tampil saat workspace dibuka lalu hilang beberapa saat kemudian.
   - Sinkronisasi workspace dinaikkan ke workspaceVersion 2.
   - Snapshot Firebase tidak lagi otomatis ditulis balik.
   - Backup lokal per workspace dibuat di browser.
   - Ada recovery data legacy saat cache berisi list tetapi snapshot server lama/kosong.
   - Auto-save dipercepat menjadi debounce 450ms setelah perubahan lokal.

2. Pengingat absensi sekarang ada 2 secara terpisah:
   - Absen Masuk Kerja (default 08:00)
   - Absen Pulang Kerja (default 17:00)

3. Setiap pengingat memiliki:
   - ON/OFF sendiri
   - Jam sendiri
   - Hari aktif sendiri
   - Pesan sendiri
   - Gambar popup sendiri
   - Test Alarm + Notif sendiri
   - Snooze 10 menit

4. Setting alarm tetap PER PC / PER BROWSER.
   PC A boleh jam masuk 07:45 dan pulang 17:00.
   PC B boleh jam masuk 08:00 dan pulang 17:30.
   Tidak saling mengubah.

5. Setting pengingat pulang dari V5/V6 otomatis dimigrasikan ke pengingat Pulang V7.

CARA UPDATE
===========
Upload/replace SEMUA file ini pada root website:
- index.html
- attendance-reminder-sw.js
- manifest.json
- absen-alarm.mp3
- absen-icon.png
- absen-reminder.png

Setelah deploy:
1. Buka website.
2. Tekan Ctrl + F5.
3. Masuk salah satu workspace dan pastikan list tidak hilang setelah 5-10 detik.
4. Kembali ke halaman utama.
5. Klik icon lonceng.
6. Atur tab Masuk Kerja dan Pulang Kerja.
7. Aktifkan masing-masing yang dibutuhkan.
8. Klik Test Alarm + Notif minimal sekali agar browser mengizinkan suara/notifikasi.

CATATAN
=======
- Tidak perlu Node.js.
- Tidak perlu Firebase Functions.
- Agar alarm lokal tetap bekerja saat user membuka website lain, tab Follow Up harus tetap terbuka.
- Native notification tetap mengikuti tampilan Windows/Chrome.
