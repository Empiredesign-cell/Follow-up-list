FOLLOW UP V18 — DIVISION GROUPS
================================

KONSEP
------
1. ciptadigi@gmail.com = SUPER ADMIN, melihat semua workspace/data lama.
2. Setiap pengguna biasa hanya berada di SATU divisi/grup.
3. Semua Member dan Admin Divisi dalam grup yang sama melihat workspace grup yang sama.
4. Admin Divisi hanya bisa melihat/mengelola MEMBER dalam divisinya sendiri.
5. Admin Divisi tidak bisa melihat user/workspace divisi lain.
6. Workspace lama tetap menggunakan collection `folders` + `workspace_data`. Data lama tidak dipindah.

URUTAN SETUP PERTAMA
--------------------
A. Publish `firestore.rules` V18 di Firebase Console > Firestore > Rules.
B. Replace `index.html` di GitHub / hosting lalu deploy.
C. Login memakai ciptadigi@gmail.com.
D. Klik icon Kelola Pengguna.
E. Buat Divisi/Grup, misalnya: Design, Marketing, Produksi, Admin.
F. Kembali ke Beranda. Pada setiap workspace lama klik Edit dan pilih Divisi/Grup.
G. Di Kelola Pengguna, edit user lama dan pilih divisinya.
H. Buat satu user dengan role `Admin Divisi` untuk masing-masing grup.
I. Login memakai akun Admin Divisi untuk test: ia hanya boleh melihat grupnya sendiri.

HAPUS PENGGUNA
--------------
Tombol Hapus menggunakan SOFT DELETE:
- active = false
- deleted = true
- akses Firestore langsung terputus
- histori user tidak hilang
- dapat dipulihkan dari "Tampilkan terhapus"

PENTING: browser Firebase SDK tidak dapat menghapus akun Authentication milik user lain secara aman.
Jadi tombol Hapus V18 menghapus AKSES ke sistem, bukan record Firebase Authentication.
Kalau email harus benar-benar dibuang agar bisa didaftarkan ulang dari nol, hapus juga user tersebut dari Firebase Console > Authentication > Users, atau nanti tambahkan backend Admin SDK.

STRUKTUR DATA BARU
------------------
divisions/{divisionId}
  name
  active
  createdAt
  createdBy

users/{uid}
  name
  email
  role: super_admin | division_admin | member
  divisionId
  divisionName
  active
  deleted

folders/{folderId}
  ...data lama...
  divisionId
  divisionName

workspace_data/{folderId}
  tetap data lama, TIDAK dipindahkan

ALUR AKSES
----------
SUPER ADMIN
  -> semua divisi
  -> semua workspace
  -> semua user

ADMIN DIVISI
  -> divisinya sendiri
  -> semua workspace divisinya
  -> hanya Member di divisinya
  -> bisa membuat Member
  -> tidak bisa membuat Super Admin/Admin Divisi

MEMBER
  -> divisinya sendiri
  -> semua workspace divisinya
  -> tidak bisa membuka Manajemen Pengguna

CATATAN DATA LEGACY
-------------------
Workspace lama yang belum punya `divisionId` hanya bisa dilihat Super Admin.
Ini disengaja agar data tidak bocor ke grup yang salah.
Assign satu per satu lewat Edit Workspace.
