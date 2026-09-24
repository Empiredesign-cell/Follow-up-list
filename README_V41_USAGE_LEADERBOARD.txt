FOLLOW UP V41 — KLASemen PENGGUNAAN FOLLUP

Fitur baru:
- Klasemen penggunaan muncul di seluruh Home Workspace semua divisi.
- Super Admin juga melihat klasemen di Overview.
- Tab Global dan Per Divisi.
- Pada Per Divisi, semua divisi yang sudah punya data penggunaan dapat dipilih.
- Periode Minggu Ini, Bulan Ini, dan All Time.
- Top ranking memakai waktu aktif nyata.
- Tab FOLLUP harus visible dan user masih berinteraksi dalam 5 menit terakhir.
- Membuka FOLLUP lalu meninggalkannya idle tidak terus menambah waktu.
- Super Admin dan akun legacy Cipta Digital tidak ikut ranking agar klasemen fokus pada Member/Admin Divisi.
- Posisi akun sendiri ditampilkan walau bukan posisi teratas.

Cara penghitungan:
- Sistem mengecek aktivitas setiap 1 menit.
- Setiap 3 menit aktif dikirim sebagai satu heartbeat ke Firestore.
- Collection baru: usage_stats.
- Statistik yang disimpan: total, minggu berjalan, bulan berjalan.
- Tidak ada poin rahasia: ranking berdasarkan durasi aktif yang transparan.

Catatan:
- Ini leaderboard internal berbasis client telemetry.
- Firestore Rules membatasi kenaikan maksimal 3 menit per request.
- Sistem ini cukup untuk penggunaan internal, tetapi bukan anti-cheat absolut. Anti-cheat kuat membutuhkan backend/server authoritative.

PUBLISH:
1. Replace index.html dengan V41.
2. Replace Firestore Rules dengan firestore.rules V41 lalu Publish.
3. Deploy Vercel.
4. Ctrl + F5.
5. Data leaderboard mulai muncul setelah user aktif sekitar 3 menit.
