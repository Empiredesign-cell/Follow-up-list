FOLLOW UP V41.1 — LEADERBOARD BOTTOM + HISTORICAL BASELINE

Perubahan:
1. Klasemen dipindahkan ke bawah beranda.
   - Room dan Titipan Weekend tetap menjadi fokus utama.
   - Klasemen muncul setelah area utama selesai.

2. Ranking tidak lagi mulai kosong.
   - Super Admin melakukan one-time bootstrap otomatis saat membuka V41.1.
   - Bootstrap membaca hingga 2.000 Activity Log yang sudah ada.
   - Aktivitas historis hanya dihitung jika actorUid/user memang tercatat.
   - Data task/sticky lama yang tidak menyimpan author tidak ditebak.

3. Sistem poin:
   - 1 aktivitas historis yang tercatat di audit = 1 poin.
   - Setiap 3 menit aktif mulai V41/V41.1 = 1 poin live.
   - Ranking memakai total poin.
   - Waktu aktif terukur tetap ditampilkan di bawah skor.

4. Baseline dibekukan sekali per user.
   - Field baselineFrozenV411 mencegah audit baru dihitung ulang sebagai baseline.
   - Setelah bootstrap, pertumbuhan ranking terutama berasal dari UsageTracker live.

Wajib publish:
1. Replace index.html.
2. Replace Firestore Rules V41.1 dan Publish.
3. Deploy Vercel.
4. Login Super Admin sekali agar baseline historis dibuat.
5. Ctrl + F5 pada client.

Catatan kejujuran data:
Task/sticky lama sebelum Activity Log V40 tidak memiliki field pembuat/user yang reliable.
Karena itu V41.1 tidak mengarang pemilik data lama. Baseline hanya memakai histori yang benar-benar punya identitas actor.
