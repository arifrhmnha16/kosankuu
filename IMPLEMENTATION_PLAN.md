# Implementation Plan — Manzsa Residence

## Status

Audit selesai pada 5 Agustus 2026. Implementasi dilakukan langsung di root. `prototype/` tidak diubah. Checklist milestone di bagian akhir diperbarui selama pengerjaan.

## Temuan Repository

- Root berisi PRD baru dan 37 file prototype HTML/CSS/JS; aplikasi React Native lama tercatat sudah dihapus pada worktree sebelum pengerjaan ini dimulai.
- Prototype publik menyediakan landing, katalog/detail kamar, tentang, fasilitas, galeri, FAQ, kontak, dan autentikasi. Prototype tenant dan owner memakai shell sidebar, kartu metrik, tabel, modal, state loading/empty/error, serta layout mobile.
- Referensi visual: heading editorial, UI padat namun lapang, surface putih, latar lembut, kartu 16–24px, tombol bundar, sidebar gelap. Implementasi memakai forest `#173f35`, off-white `#f7f3ea`, beige `#e9e0cf`, gold `#b89452`, Cormorant Garamond, dan Inter sesuai arahan final.
- Tidak ada package/config/aplikasi aktif yang perlu dipertahankan selain dokumen dan prototype. Perubahan Git lama tidak disentuh.
- Fitur PRD yang belum nyata di prototype: transaksi booking atomik, session server, custom claims, rules, upload bertanda tangan, webhook, email, invoice PDF, export, cron, dan test.

## Arsitektur

- Next.js App Router + React + TypeScript strict; Server Components sebagai default.
- Route Handler untuk semua mutasi tepercaya. Firebase client hanya untuk Firebase Auth; Firebase Admin untuk sesi dan data operasional.
- Lapisan `lib`: environment, auth/session, Firebase, domain booking, Cloudinary, Midtrans, Resend, reports; model dan Zod schema dipakai bersama.
- Halaman publik dapat memakai fallback konten properti ketika Firebase belum dikonfigurasi agar setup lokal tetap dapat dilihat. Data privat tidak memiliki fallback sensitif.

## Route Structure

- Public: `/`, `/kamar`, `/kamar/[slug]`, `/tentang`, `/fasilitas`, `/galeri`, `/faq`, `/kontak`.
- Auth: `/login`, `/daftar`, `/lupa-password`, `/reset-password`.
- Tenant: `/tenant`, `/tenant/booking`, `/tenant/booking/[id]`, `/tenant/tagihan`, `/tenant/tagihan/[id]`, `/tenant/invoice/[id]`, `/tenant/keluhan`, `/tenant/keluhan/[id]`, `/tenant/pengumuman`, `/tenant/aktivitas`, `/tenant/profil`.
- Owner: `/owner` serta kamar, booking, tenant, pembayaran, invoice, keluhan, pengumuman, laporan, dan pengaturan beserta detail yang diminta.
- API: health, auth session/logout/register/reset, booking, uploads, Midtrans, manual payments, complaints, owner CRUD/verification, report exports, invoice PDF, dan protected cron.

## Component Structure

- `components/ui`: button, field, card, data/feedback state, status, dialog.
- `components/public`: header/footer, room cards, filters, booking summary.
- `components/dashboard`: role-aware shell, navigation, metric cards, data tables, charts.
- `components/forms`: RHF + Zod forms untuk auth, booking, room, payment, complaint, announcement, and settings.

## Firestore Design

Koleksi: `users`, `rooms`, `bookings`, `bookingLocks`, `invoices`, `payments`, `complaints` (+ `histories`), `announcements`, `activities`, `propertySettings`, `facilities`, `counters`, `emailEvents`, `webhookEvents`, `gallery`, dan `notifications`. Nilai uang berupa integer Rupiah, waktu berupa Timestamp, dan transaksi historis menyimpan snapshot property/tenant/room/pricing.

## Authentication & Authorization

Firebase client memperoleh ID token; endpoint session memverifikasi token lalu membuat Firebase session cookie `httpOnly`, `secure` di production, `sameSite=lax`. Server layout dan handler memverifikasi cookie serta custom claim. Tenant wajib cocok `uid`; owner wajib claim `owner`. Provisioning owner hanya melalui `scripts/create-owner.ts`.

## Integrations

- Cloudinary: server menghasilkan signature terikat purpose/folder/owner; metadata upload divalidasi sebelum disimpan. Secret tidak dikirim.
- Resend: template email Indonesia, server-side, idempotency key dan safe event log; kegagalan email tidak me-rollback transaksi bisnis.
- Midtrans: Snap dibuat server-side, notification diverifikasi SHA-512, jumlah dicocokkan, status direkonsiliasi via Get Status, event idempotent.

## Booking Concurrency Strategy

Rentang dinormalisasi ke bucket UTC deterministik: per jam untuk hourly dan per hari untuk daily/monthly. ID lock `${roomId}_${bucket}`. Satu Firestore transaction membaca room dan seluruh lock, menolak lock aktif, lalu menulis booking, locks, invoice/counter, dan activity atomik. Lock menyimpan `bookingId`, periode, dan `expiresAt`; confirmed/active tidak kedaluwarsa. Cron idempotent mengubah pending yang lewat batas waktu, invoice terkait, melepas hanya lock milik booking tersebut, dan mencatat activity sekali.

## Testing Strategy

- Vitest unit: harga, overlap, lock, invoice number, Midtrans mapping, permission, laporan.
- Integration handler/domain dengan Admin dependency terisolasi.
- Firebase Emulator rules tests untuk public/tenant/owner dan write terlarang.
- Playwright untuk alur publik, auth, tenant, owner (credential-driven).
- Gates: lint, typecheck, Vitest, build; E2E/emulator dilaporkan terpisah jika service/credential tidak tersedia.

## Risiko dan Mitigasi

- Kredensial eksternal kosong: fail-fast untuk operasi terkait, health readiness menjelaskan konfigurasi; adapter tetap diuji lokal.
- Batas transaksi Firestore: durasi booking dibatasi dan lock dipecah per bucket; periode bulanan panjang divalidasi.
- Webhook berulang/out-of-order: event key deterministik, transaction, dan monotonic status mapping.
- Data privat media: delivery type/authenticated asset dianjurkan dan signature dibatasi purpose.
- Query/index drift: indeks disimpan bersama kode dan emulator test digunakan.

## Milestones

- [x] 1. Foundation
- [x] 2. Authentication
- [x] 3. Public website
- [x] 4. Owner dashboard foundation
- [x] 5. Room management API and archive
- [x] 6. Booking engine
- [x] 7. Tenant dashboard foundation
- [x] 8. Payments and invoice services
- [x] 9. Complaints and announcements services
- [x] 10. Reports, security configuration, docs, and production build

Quality gates: `lint` pass (0 errors), `typecheck` pass, 10 unit tests pass, production build pass. Rules tests require a running Firestore emulator; live Firebase/Cloudinary/Resend/Midtrans flows require credentials.
