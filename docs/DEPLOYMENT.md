# Deployment Vercel

1. Import repo dan isi environment Development, Preview, dan Production terpisah.
2. Deploy Firestore rules/index dan provision owner.
3. Verifikasi domain Resend dan gunakan callback Midtrans production HTTPS.
4. Set `CRON_SECRET`; `vercel.json` memanggil expiry setiap 10 menit.
5. Tambah custom domain, ubah `NEXT_PUBLIC_APP_URL`, lalu cek canonical, sitemap, robots, dan webhook.
6. Jalankan smoke test login, konflik booking, Sandbox payment, upload, invoice PDF, dan export.
