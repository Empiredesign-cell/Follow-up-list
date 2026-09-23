FOLLOW UP V28 — STRICT DIVISION PRIVACY

Perubahan utama:
1. Room divisi hanya bisa dibaca Admin Divisi/Member dengan divisionId yang sama.
2. Super Admin empiredesign1510@gmail.com tetap bisa melihat semua room untuk monitoring.
3. ciptadigi@gmail.com tidak lagi membaca room semua divisi. Akun legacy hanya melihat room yang belum masuk divisi.
4. Room lama tanpa field divisionId otomatis dinormalisasi oleh Super Admin menjadi divisionId: "".
5. Live View Super Admin mengikuti scope akun: akun divisi hanya menampilkan room divisinya; legacy owner hanya unassigned; super admin semua.
6. Cache workspace dipisah per scope dan versi baru V28 untuk mencegah room lama muncul silang divisi.

SETUP:
- Upload index.html V28.
- Publish firestore.rules V28.
- Login sekali sebagai Super Admin agar room lama tanpa divisionId dinormalisasi.
- Setelah itu tes akun tiap divisi dan Ctrl+F5.
