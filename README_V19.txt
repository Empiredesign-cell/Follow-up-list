FOLLOW UP V19 — SINGLE SUPER ADMIN + LEGACY OWNER

AKUN SISTEM
1. Super Admin tunggal:
   empiredesign1510@gmail.com
   - bisa buat divisi
   - bisa buat Admin Divisi / Member
   - bisa buat/edit/hapus workspace
   - bisa melihat semua data

2. Akun legacy khusus:
   ciptadigi@gmail.com
   - data lama tetap terlihat dan bisa dipakai
   - task, sticky, arsip, titipan weekend tetap ada
   - TIDAK bisa membuka Manajemen Pengguna
   - TIDAK bisa membuat user/member
   - TIDAK bisa membuat/edit/hapus room/workspace
   - tetap bisa bekerja di dalam workspace lama

3. Admin Divisi
   - hanya melihat divisinya
   - bisa membuat member di divisinya
   - bisa membuat/edit workspace divisinya
   - tidak bisa melihat divisi lain

4. Member
   - hanya melihat workspace divisinya

CARA UPDATE
1. Replace index.html di repository/hosting.
2. Copy firestore.rules ke Firebase Console > Firestore Database > Rules lalu Publish.
3. Pastikan Firebase Authentication punya:
   - empiredesign1510@gmail.com
   - ciptadigi@gmail.com
4. Login sekali dengan masing-masing akun. V19 akan menormalkan profil users/{uid} otomatis.
5. Jangan hapus collection lama folders, workspace_data, shared_data, global_workspace.

CATATAN
Akun ciptadigi adalah "Legacy Owner", bukan Super Admin.
Data lama tidak dimigrasikan atau dihapus; sistem hanya mengganti lapisan hak akses.
