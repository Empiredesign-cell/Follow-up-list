FOLLOW UP V40.2 — RUNTIME / WHITE SCREEN FIX

Temuan aktual:
- V40.1 ternyata masih membawa string JavaScript rusak pada AI Daily Summary.
- Baris:
  setAiSummary(lines.join(' ')+'

  Recommended actions: ' ...)
  masih invalid dan membuat Babel gagal menjalankan aplikasi.
- Ini penyebab white screen tetap muncul.

Perbaikan V40.2:
1. String AI Daily Summary diubah menjadi escaped newline: \n\n.
2. Ditambahkan Boot Guard.
   Jika di masa depan React/Babel crash sebelum render, halaman tidak lagi hanya putih.
   Error terakhir akan ditampilkan sebagai panel diagnostik.
3. Firestore Rules tidak berubah dari V40.

Update:
- Replace index.html dengan V40.2.
- Deploy Vercel.
- Lakukan Ctrl+F5.
- Tidak perlu publish ulang Firestore Rules bila V40 rules sudah aktif.
