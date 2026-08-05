# Midtrans

Gunakan Sandbox dan isi server/client key. Notification URL HTTPS adalah `/api/payments/midtrans/notification`. Snap dibuat server dari nominal invoice. Callback diverifikasi SHA-512, nominal dicocokkan, dan event diproses idempotent.

Sebelum production, gunakan production keys, ubah `MIDTRANS_IS_PRODUCTION=true`, dan uji settlement, deny, cancel, expire, serta refund.
