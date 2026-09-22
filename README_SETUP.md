# FL Workspace V2 — Staging Setup

V2 sengaja dibuat TERPISAH dari production lama. Data lama tidak dihapus.

## 1. Firebase Authentication
Firebase Console → Authentication → Sign-in method:
- Enable Email/Password
- Anonymous boleh tetap Enabled selama V1 masih dipakai

## 2. Bootstrap Super Admin pertama
Firebase Console → Authentication → Users → Add user.
Buat email + password untuk akun admin utama.

Copy UID user tersebut.
Firestore → collection `users` → document ID = UID tadi.
Isi field:
- name: nama admin
- email: email admin
- role: `super_admin`
- active: true
- divisionIds: array kosong `[]`

Setelah login, Admin Control Center bisa membuat user lain langsung dari UI.

## 3. Publish Firestore Rules
Copy isi `firestore.rules` ke Firestore → Rules → Publish.
Rules masih mempertahankan akses V1 untuk folders/workspace_data agar website lama tetap jalan selama migrasi.

## 4. Asset alarm
Copy asset existing ke folder `public/`:
- `absen-masuk.m4a`
- `alarm-pulang.mp3`
- opsional `absen-icon.png`

Tanpa file tersebut, reminder tetap punya fallback bunyi sederhana.

## 5. Deploy ke staging
Push folder ini ke branch/repo staging lalu deploy Vercel.
Build command: `npm run build`
Output: `dist`

JANGAN langsung arahkan domain production sebelum migrasi dan testing selesai.

## 6. Migrasi data lama
Login sebagai super_admin → Admin → Migration → Mulai Migrasi Aman.
Migrasi membaca:
- folders
- workspace_data

Lalu membuat:
- divisions
- tasks (1 task = 1 Firestore document)
- stickyNotes

Migration idempotent dan tidak menghapus data lama.

## 7. Test checklist sebelum go-live
- login/logout/reset password
- user hanya melihat divisinya
- super admin melihat semua divisi
- create/move/delete/restore task
- sticky → Trash → Restore
- kirim task antar divisi → accept inbox
- alarm masuk & pulang hanya bunyi satu suara
- activity log tercatat
- data lama muncul setelah migration
