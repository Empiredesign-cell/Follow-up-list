# FOLLUP V20 — Ready to Publish

File utama: `index.html` dan `firestore.rules`.

## Deploy
1. Upload isi ZIP ke hosting/static hosting Anda.
2. Firebase Authentication: aktifkan **Email/Password**.
3. Firebase Console → Firestore Database → Rules: ganti dengan isi `firestore.rules`, lalu Publish.
4. Login Super Admin menggunakan `empiredesign1510@gmail.com` (password tetap mengikuti Firebase Authentication Anda).

## Role & akses
- Super Admin: dashboard khusus untuk memilih akun yang dipantau, ACC akun, membuat/mengelola akun/divisi, membuka room, membaca/menghapus feedback.
- Pengguna baru: dapat daftar sendiri, tetapi profil dibuat **pending + nonaktif** sampai di-ACC Super Admin.
- Admin/izin membuat room: request via Telegram `@xdaniel04`, lalu Super Admin mengubah role/divisi.
- Fitur Cipta (Hitung Nota/Compro/Garis Cetak/Ruang Pola/Jadwal/Pengingat/Titipan Weekend) hanya tampil untuk `ciptadigi@gmail.com`.
- Feedback: akun + pesan + foto opsional tersimpan di Firestore `feedback`.

Catatan: penghapusan user dari dashboard adalah soft-delete profil Firestore. Menghapus kredensial Firebase Authentication user lain secara permanen memerlukan backend/Admin SDK (tidak aman dilakukan dari browser).
