# Manzsa Residence

Aplikasi pengelolaan satu properti kos dengan Next.js, Firebase, Cloudinary, Resend, dan Midtrans.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Halaman publik memiliki fallback contoh agar setup lokal dapat dilihat; operasi privat memerlukan Firebase. Panduan lengkap ada di `docs/SETUP.md`.

Perintah utama: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run seed`, dan `npm run create-owner`.

Tidak ada registrasi owner publik. Operasi finansial, booking, role, counter, dan webhook dilakukan server-side.
