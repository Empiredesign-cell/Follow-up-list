FOLLOW UP V40 — SUPER ADMIN ULTRA COMMAND CENTER
=================================================

WAJIB UPDATE
------------
1. Replace index.html dengan index.html V40.
2. Replace seluruh Firestore Rules dengan firestore.rules V40 lalu Publish.
3. Deploy Vercel.
4. Ctrl + F5.
5. Jangan hapus collection lama: folders, workspace_data, shared_data, users, divisions.

FITUR V40
---------
1. View As User
   - Super Admin memilih akun dan melihat simulasi workspace sesuai permission user.
   - FULL VIEW AS tersedia dengan banner khusus Super Admin.
   - Tidak login sebagai user dan tidak membutuhkan password user.

2. Activity Log Global
   - Audit create/edit/delete/move task.
   - Audit create/edit/delete/archive sticky.
   - Audit create/edit/delete/move room.
   - Audit user, divisi, feature flags, approval, admin grant, bulk action, session revoke, broadcast.
   - Before/after dapat diperiksa dari panel Audit.

3. Restore Center
   - Snapshot task/sticky sebelum dihapus atau diedit.
   - Snapshot room sebelum delete.
   - Snapshot user sebelum akses dicabut.
   - Restore task/sticky dapat mengganti versi yang sedang ada dengan snapshot lama.
   - Delete Snapshot hanya menghapus snapshot Restore Center, bukan workspace_data orphan.

4. Room Version History
   - Edit room Super Admin, edit room Admin Divisi, perpindahan divisi, dan Bulk Action membuat snapshot versi.
   - Super Admin dapat memilih room dan restore versi sebelumnya.
   - Restore version juga menyimpan kondisi room sekarang terlebih dahulu.

5. Bulk Action
   - Pilih banyak room.
   - Pindah divisi sekaligus.
   - Opsional ubah warna sekaligus.
   - Delete massal masuk Restore Center.
   - Snapshot/version dibuat sebelum perubahan.

6. Feature Matrix
   - Tabel Divisi × Fitur.
   - Checklist langsung tanpa membuka setting divisi satu per satu.

7. System Health
   - Network.
   - Firebase Auth.
   - Firestore latency.
   - Service Worker.
   - Notification permission.
   - Audio Engine.
   - Local Storage.
   - Jumlah user / room realtime yang terbaca.

8. Session & Device Control
   - Device V40 otomatis tercatat saat user login.
   - Menampilkan browser, OS/platform, dan last seen.
   - Super Admin dapat revoke session device.
   - Revoke adalah client-side session revoke: device logout saat online / reconnect.
   - Hard Firebase refresh-token revoke tetap membutuhkan backend Firebase Admin SDK.

9. Broadcast Announcement
   - Target semua akun atau satu divisi.
   - Priority Normal / Important / Critical.
   - Optional jadwal mulai dan berakhir.
   - User mendapatkan banner pengumuman.
   - Query announcement user tetap mengikuti privacy divisi.

10. Notification Center
    - Due date overdue.
    - Access request.
    - Feedback baru.
    - Broadcast.
    - Warning System Health.
    - Unread counter lokal untuk Super Admin.

11. Operational Analytics
    - Total task.
    - Active.
    - Done.
    - Overdue.
    - Completion rate.
    - Breakdown per divisi.
    - Workload dan overdue per divisi.

12. AI Daily Summary
    - V40 memakai Smart Local Analysis berdasarkan metrics realtime.
    - Tidak mengirim data operasional ke API AI eksternal.
    - Ini sengaja agar API key tidak pernah ditaruh di index.html.
    - Integrasi GPT/OpenAI asli sebaiknya dibuat via backend/serverless secure pada versi berikutnya.

COLLECTION BARU OTOMATIS
------------------------
audit_logs
restore_bin
device_sessions
announcements

Collection akan dibuat otomatis ketika fitur pertama kali digunakan.

CATATAN SECURITY
----------------
- Super Admin tetap hanya empiredesign1510@gmail.com.
- Privacy room antar divisi tetap memakai rules sebelumnya.
- Broadcast divisi tidak dapat di-list oleh divisi lain.
- audit_logs dan restore_bin hanya dapat dibaca Super Admin.
- device_sessions hanya dapat dibaca global oleh Super Admin; user hanya mengakses session miliknya sendiri.
- Announcement dapat dikelola hanya oleh Super Admin.

CATATAN SKALABILITAS
--------------------
- Audit Log dan Restore Center menggunakan query maksimum 300 record terbaru di UI.
- workspace_data legacy masih berupa 1 document besar per room. Sistem V40 tetap kompatibel.
- Jika pemakaian meningkat signifikan, roadmap berikut yang benar adalah migrasi task/sticky menjadi document individual dan memecah index.html menjadi React/Vite modules.
