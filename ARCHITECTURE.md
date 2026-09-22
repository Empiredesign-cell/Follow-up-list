# Architecture

## Identity
Firebase Auth Email/Password.
Firestore `users/{uid}` adalah authorization profile.

Roles:
- super_admin
- division_admin
- member

## Data model
- users/{uid}
- divisions/{divisionId}
- tasks/{taskId}
- stickyNotes/{noteId}
- taskTransfers/{transferId}
- activityLogs/{logId}
- system/migration_v2

Legacy tetap dibaca hanya saat migration:
- folders
- workspace_data
- shared_data
- global_workspace

## Key change
V1 menyimpan banyak state sebagai JSON besar di workspace_data.
V2 menyimpan task/sticky sebagai document terpisah supaya concurrent editing tidak saling overwrite.

## Reminder
Reminder tetap local-browser agar tidak butuh Firebase Functions.
Schedule default berasal dari division.attendance, kemudian disimpan per akun/per perangkat di localStorage.
Native notification dibuat `silent: true`; hanya audio custom yang berbunyi agar tidak double sound.
