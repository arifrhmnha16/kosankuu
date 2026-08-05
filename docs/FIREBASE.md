# Firebase

Aktifkan Email/Password, buat Firestore, lalu isi kredensial client dan service account Admin. Newline private key di Vercel boleh memakai `\n`.

```bash
firebase deploy --only firestore:rules,firestore:indexes
firebase emulators:start
```

Rules default-deny. Client tidak dapat menulis booking, invoice, payment, lock, counter, email event, atau webhook. Owner dibuat dengan `npm run create-owner`; script mengatur custom claim `owner` dan profil Firestore.
