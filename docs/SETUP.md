# Setup Lokal

1. Gunakan Node.js 22 LTS yang memenuhi engine dependency dan jalankan `npm install`.
2. Salin `.env.example` ke `.env.local`; jangan commit file tersebut.
3. Konfigurasikan Firebase client/Admin, Cloudinary, Resend, Midtrans Sandbox, dan `CRON_SECRET`.
4. Jalankan `npm run seed`, kemudian `npm run create-owner`.
5. Jalankan `npm run dev` dan buka `http://localhost:3000`.

`/api/health` hanya melaporkan boolean kesiapan integrasi dan tidak pernah nilai secret.
