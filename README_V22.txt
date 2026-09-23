FOLLOW UP V22 - MAJOR UPGRADE

WAJIB sebelum publish:
1. Replace index.html.
2. Firestore > Rules: replace dengan firestore.rules V22 lalu Publish.
3. Pastikan Firebase Authentication > Email/Password = Enabled.
4. Pertahankan asset lama di root website: absen-icon.png, absen-reminder.png, icon.png.
5. Upload/replace juga absen-masuk.m4a, alarm-pulang.mp3, attendance-reminder-sw.js, manifest.json dari paket ini.
6. Setelah Vercel deploy selesai lakukan Ctrl+F5.

AKUN SISTEM:
- Super Admin tunggal: empiredesign1510@gmail.com
- Legacy Cipta Digital: ciptadigi@gmail.com

FITUR V22:
- Login baru profesional + mobile responsive.
- Self registration Member; status menunggu ACC Super Admin.
- Request Admin wajib via Telegram @xdaniel04.
- Super Admin Control Center: monitor akun, buat/kelola akun, ACC akses, feedback, hapus akses.
- Tool Hitung Nota/Compro/Garis Cetak/Ruang Pola/Jadwal + Titipan Weekend hanya ciptadigi@gmail.com.
- Feedback developer dengan akun, pesan, dan foto/screenshot.
- Footer Crafted by xdaniel04 ke Instagram @xdaniel04.
- Data lama folders/workspace_data tidak dipindahkan atau dihapus.

CATATAN HAPUS AKUN:
Tombol hapus mencabut akses aplikasi (soft delete) agar histori tetap aman. Firebase Authentication record tidak dihapus dari browser karena membutuhkan Admin SDK/backend.
