FOLLOW UP V23 — SUPER ADMIN PRO

UPGRADE UTAMA
- Super Admin UI baru: sidebar premium desktop + nav mobile.
- Overview Command Center dengan statistik akun, divisi, room, request, feedback.
- Pantau Akun menampilkan karakter / avatar room sama seperti user biasa.
- ACC Member dipercepat: request divisi auto-detect bila namanya cocok.
- Approve Admin Divisi: pilih akun + pilih divisi + approve setelah request Telegram diverifikasi.
- Divisi & Feature Flags: Super Admin tinggal ceklis fitur tambahan per divisi.
- Feature flags: Hitung Nota, Hitung Compro, Layout Buku/Garis Cetak, Ruang Pola, Jadwal, Titipan Weekend.
- Akun ciptadigi@gmail.com tetap mendapat semua fitur legacy secara otomatis.
- Room management: buat room cepat dan assign room lama ke divisi tanpa memindahkan workspace_data.
- Semua Akun: search, filter role, buka manager akun, cabut akses.
- Feedback dashboard dipertahankan dan dibuat lebih rapi.

CARA UPDATE
1. Firebase Console > Firestore > Rules. Replace dengan firestore.rules V23 lalu Publish.
2. Replace index.html di GitHub/Vercel dengan index.html V23.
3. Pertahankan asset audio/icon yang sudah ada di repository.
4. Tunggu deploy selesai, lalu Ctrl+F5.

FEATURE FLAGS DIVISI
- Fitur inti Follow Up / task / sticky / room tetap ada.
- Fitur tambahan hanya muncul bila dicentang di Super Admin > Divisi & Fitur.
- Titipan Weekend juga diamankan oleh Firestore Rules sesuai flag divisi.
- Cipta Digital selalu mendapat semua fitur legacy.

CATATAN
- Data lama folders/workspace_data tidak dipindahkan atau dihapus.
- Super Admin global tetap hanya empiredesign1510@gmail.com.
- ciptadigi@gmail.com tetap legacy owner data lama.
