# Security

- Session Firebase berada dalam cookie HTTP-only, secure di production, same-site lax, dan diverifikasi dengan revocation check.
- Role berasal dari custom claims server. Admin SDK menangani mutasi kritis; Rules default deny dan membatasi ownership tenant.
- Booking memakai transaction dan lock deterministik; invoice menyimpan snapshot dan integer Rupiah.
- Secret Firebase, Cloudinary, Resend, Midtrans, dan cron tidak memakai prefix `NEXT_PUBLIC_`.
- Webhook diverifikasi, idempotent, dan mencocokkan nominal invoice.
- Data utama memakai archive; activity log mencatat aksi penting.

Tambahkan rate limiter terdistribusi dan Firebase App Check sebelum exposure production berskala tinggi.
