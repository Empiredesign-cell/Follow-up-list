FOLLOW UP V17 - ACCOUNT ACCESS / LEGACY DATA SAFE
=================================================

KONSEP
- Data lama folders, workspace_data, shared_data, global_workspace TIDAK dipindahkan.
- ciptadigi@gmail.com menjadi Super Admin dan otomatis melihat semua data lama.
- Super Admin dapat membuat akun baru langsung dari website.
- Akun baru hanya melihat workspace yang dicentang oleh Super Admin.
- Reminder masuk/pulang disimpan per akun + per browser.

SEBELUM PUBLISH
1. Firebase Console -> Authentication -> Sign-in method -> aktifkan Email/Password.
2. Pastikan akun ciptadigi@gmail.com sudah ada di Firebase Authentication.
3. Firestore -> Rules -> replace dengan isi firestore.rules -> Publish.
4. Replace index.html di website/GitHub dengan index.html V17 ini.
5. Tunggu Vercel deploy, lalu Ctrl+F5.

LOGIN PERTAMA
- Login dengan ciptadigi@gmail.com.
- Bila users/{uid} belum ada, V17 akan mencoba membuat profil Super Admin otomatis.
- Data workspace lama langsung tetap terlihat karena Super Admin punya akses penuh ke folders/workspace_data.

MEMBUAT PENGGUNA
- Di Beranda klik icon Users (dua orang) di kanan atas.
- Isi nama, email, password sementara, nama divisi, role.
- Centang workspace yang boleh diakses akun tersebut.
- Klik Buat Akun.
- Pembuatan akun memakai Firebase Auth kedua sehingga sesi Super Admin tidak logout.

CATATAN KEAMANAN
- Jangan kembali ke rules lama "allow read, write: if true" setelah V17 aktif.
- User biasa tidak dapat list seluruh folders; aplikasi mengambil workspace yang ditugaskan satu per satu.
- Untuk menonaktifkan user: Admin -> Users -> Edit -> matikan Akun aktif.

ROLLBACK
- Data lama tidak dimigrasikan/dihapus, jadi rollback kode tidak mengubah isi folders/workspace_data.
- Namun rules V17 memakai akun, jadi bila rollback ke aplikasi anonymous lama, rules juga harus disesuaikan kembali.
