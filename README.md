# Manzsa Residence

Foundation aplikasi pengelolaan satu kos berbasis Expo, React Native, TypeScript, Expo Router, dan React Native Web.

## Menjalankan project

```powershell
npm.cmd install
npm.cmd run web
npm.cmd run android
```

## Bootstrap Firebase Authentication

1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Tambahkan aplikasi Web dan salin konfigurasi client yang diberikan Firebase.
3. Salin `.env.example` menjadi `.env.local`, lalu isi seluruh `EXPO_PUBLIC_FIREBASE_*` kecuali Measurement ID yang opsional.
4. Buka **Authentication → Sign-in method**, lalu aktifkan Email/Password.
5. Buat user owner dan tenant dari **Authentication → Users**. Tidak ada registrasi publik di aplikasi.
6. Salin UID masing-masing user, lalu buat dokumen Firestore `users/{uid}` secara manual.

Contoh owner:

```json
{
  "uid": "UID_FIREBASE_AUTH",
  "email": "owner@example.com",
  "displayName": "Owner Manzsa",
  "role": "owner",
  "status": "active",
  "propertyId": "manzsa-residence",
  "createdAt": "Firestore Timestamp",
  "updatedAt": "Firestore Timestamp"
}
```

Contoh tenant menggunakan struktur yang sama dengan `role: "tenant"`. Gunakan nilai `active`, `inactive`, atau `pending` untuk status. Field `createdAt` dan `updatedAt` harus dibuat sebagai Firestore Timestamp, bukan string.

Role, status, dan property ID tidak dapat diubah oleh aplikasi client. Lakukan bootstrap manual melalui Firebase Console pada milestone ini. Jangan pernah menaruh service account JSON di repository atau environment client.

## Firebase Emulator

Firebase Emulator memerlukan Java. Jalankan rules test otomatis:

```powershell
npm.cmd run test:rules
```

Atau jalankan Firestore Emulator interaktif:

```powershell
npm.cmd run firebase:emulators
```

Emulator UI tersedia di `http://127.0.0.1:4000` dan Firestore di port `8085`.

## Validasi

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run test:rules
npm.cmd run export:web
```

Dokumen PRD, `DESIGN.md`, dan `index.html` adalah referensi dan tidak boleh diubah tanpa permintaan eksplisit.
