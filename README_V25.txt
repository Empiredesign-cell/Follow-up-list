FOLLOW UP V25 — TRUE LIVE VIEW + DIVISION ISOLATION

Perubahan utama:
1. Pantau Akun Super Admin sekarang menampilkan TRUE LIVE VIEW yang meniru halaman user:
   - background user
   - shortcut fitur sesuai feature flags divisi
   - karakter/avatar room asli
   - gradient room asli
   - badge akun
   - Titipan Weekend bila user memang punya akses
2. Klik karakter room pada Live View tetap membuka room sebagai Super Admin untuk monitoring.
3. Isolasi divisi diperketat:
   - akun member/admin divisi hanya memuat folder dengan divisionId yang sama persis
   - room tanpa divisi tidak tampil ke akun divisi
   - satu room hanya memiliki satu divisionId
   - pindah room ke divisi baru otomatis mengeluarkan room dari divisi lama
4. Cache workspace sekarang di-scope berdasarkan UID + divisi (V25), mencegah room divisi lama sempat muncul setelah perubahan divisi/login.
5. Firestore Rules tetap menjadi lapisan keamanan kedua; UI bukan satu-satunya filter.
6. ciptadigi@gmail.com tetap Legacy Owner dan mempertahankan akses data legacy sesuai requirement sebelumnya.

PUBLISH:
- Replace index.html
- Publish firestore.rules dari paket bila rules production belum memakai V24/V25 rules
- Deploy Vercel
- Ctrl + F5

TEST WAJIB:
A. Login Admin Divisi A: hanya room A.
B. Login Member Divisi A: hanya room A.
C. Pindahkan satu room A -> B dari Super Admin: room langsung hilang dari A dan muncul di B.
D. Super Admin > Pantau Akun > pilih user A: Live View harus identik dengan room/fitur yang user A lihat.

V26 tambahan:
- Menambahkan 2 opsi karakter baru:
  - yellow-beanie (karakter kuning pakai topi rajut)
  - yellow-round (karakter kuning bulat)
- Kedua karakter memakai file PNG transparan dan ditampilkan full body (object-contain) agar tidak kepotong.
