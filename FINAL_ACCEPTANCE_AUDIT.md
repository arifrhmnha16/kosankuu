# Final Acceptance Audit — Manzsa Residence

Tanggal verifikasi: 5 Agustus 2026. Dokumen ini bersifat evidence-based: status **Lengkap** hanya diberikan bila UI, backend, persistence, authorization, validation, feedback, dan test yang relevan tersedia. Integrasi live yang membutuhkan akun vendor tidak dinyatakan lulus tanpa kredensial.

## Matriks penerimaan

| Feature | Route | UI | Server/API | Collection | Authorization | Validation | Test | Status | Limitation |
|---|---|---|---|---|---|---|---|---|---|
| Landing dan katalog publik | `/`, `/kamar`, `/kamar/[slug]` | public pages, `room-catalog.tsx` | `public-data.ts` | rooms, propertySettings, facilities | public read aktif/publik | filter client + DAL public-only | Playwright visitor, rules public room | Lengkap | fallback terisolasi hanya saat Firebase Admin belum dikonfigurasi |
| Contact | `/kontak` | `contact-form.tsx` | `/api/contact` | activities/emailEvents | rate/origin server | Zod + sanitasi | build/E2E page | Lengkap | pengiriman live perlu Resend |
| Authentication/session | `/login`, `/daftar`, reset | auth components | `/api/auth/*` | users, emailEvents | cookie session + claims | client/server | rules + unit/build | Lengkap secara kode | verifikasi live Auth/Resend perlu kredensial Firebase/Resend |
| Tenant dashboard | `/tenant` | tenant dashboard | `tenantDashboard` | bookings, invoices, payments, complaints, announcements, activities | UID session | query server | build/typecheck | Lengkap | integration live perlu seeded account |
| Tenant booking | `/tenant/booking` | `booking-wizard.tsx` | preview, create, cancel | bookings, bookingLocks, invoices, counters, activities | tenant UID; owner dapat memilih tenant via API | Zod + server price/availability | pricing/locks + 2-way emulator concurrency | Lengkap untuk tenant | layar khusus booking manual owner masih menggunakan API umum dan belum memiliki pemilih tenant tersendiri |
| Tenant payment | `/tenant/tagihan`, `/tenant/pembayaran` | `payment-panel.tsx`, detail | manual, Midtrans create/status, invoice PDF | payments, invoices, bookings, activities | UID ownership, status final server-only | proof purpose/status/amount | unit mapping + rules | Lengkap secara kode | Snap, webhook, proof delivery live perlu vendor credentials |
| Tenant complaint | `/tenant/keluhan` | form/list/detail/reply | complaint APIs | complaints, activities, notifications | UID ownership | Zod/client/server | rules ownership + build | Lengkap secara kode | email live perlu Resend |
| Tenant announcement | `/tenant/pengumuman` | tenant list/detail | targeted server query | announcements, users | all/room/UID + publish/expiry | server visibility predicate | rules target-room | Lengkap | — |
| Tenant profile | `/tenant/profil` | `profile-form.tsx` | `/api/profile` | users | allowlisted UID update | Zod/client/server | rules deny client mutation | Lengkap secara kode | reset delivery live perlu Firebase/Resend |
| Owner rooms | `/owner/kamar` | table/form/modal/uploader | room CRUD/restore/cloudinary delete | rooms, activities | owner session | client/server Zod, MIME/size/purpose | build/typecheck/rules | Lengkap secara kode | upload/destroy live perlu Cloudinary |
| Owner bookings | `/owner/booking`, detail | list/detail/transitions | create + transition APIs | bookings, locks, invoices, activities | owner; state machine | server price/conflict/transition | concurrency + unit workflow | Sebagian lengkap | pemilih tenant untuk create manual belum berupa form khusus |
| Owner tenants | `/owner/tenant`, detail | list/detail/history/status | tenant status API | users + related collections | owner, Admin Auth disable/revoke | server role/ID | build/rules | Lengkap secara kode | Auth disable live perlu Firebase Admin |
| Owner payments | `/owner/pembayaran`, detail | list/detail/decision | verification API | payments, bookings, invoices, activities | owner-only, frontend tidak dapat paid | state/reason/notes | rules payment finalization | Lengkap secara kode | email/vendor reconciliation live perlu credentials |
| Owner invoices | `/owner/invoice`, detail | list/filter/detail/PDF | snapshot PDF | invoices | owner / tenant ownership | ID/status rendering | PDF build + rules | Lengkap | — |
| Owner complaints | `/owner/keluhan`, detail | filters/detail/action | transition API | complaints, activities, notifications | owner state machine | reason/transition | unit/build | Lengkap secara kode | email live perlu Resend |
| Announcements | `/owner/pengumuman` | CRUD form/list | announcement APIs | announcements, notifications, emailEvents | owner-only | target/status/date schema | visibility rules | Lengkap secara kode | email fan-out live perlu Resend |
| Reports | `/owner/laporan` | filters/metrics/table/export | JSON/PDF/XLSX server aggregation | bookings, payments, invoices, rooms, users | owner-only | normalized date/filter | report unit tests | Lengkap | skala besar memerlukan aggregate counters/warehouse |
| Settings | `/owner/pengaturan` | settings form/uploads | settings API | propertySettings, activities | owner-only | client/server | build/typecheck | Lengkap secara kode | media live perlu Cloudinary |
| Cron expiry | `/api/cron/expire-bookings` | n/a | protected idempotent handler | bookings, invoices, locks, activities | `CRON_SECRET` | status/time/ownership | build | Lengkap secara kode | jadwal live perlu Vercel + secret |
| Firestore Rules | n/a | n/a | `firestore.rules` | seluruh private collections | default deny | rule predicates | 15/15 emulator | Lengkap | — |
| Security baseline | seluruh app | safe feedback | CSP, headers, same-origin, limiter, safe errors | audit/email/webhook events | cookie/role/ownership | sanitasi/file policy | lint/typecheck/build/rules | Sebagian lengkap | limiter saat ini per-instance; produksi multi-instance wajib Redis/Upstash. App Check perlu provisioning console |
| E2E | public workflows | Playwright | managed Next dev server | fallback/public data | n/a | assertions | 4/4, shutdown normal | Sebagian lengkap | authenticated vendor E2E membutuhkan project Firebase/Auth emulator fixture yang belum tersedia |

## Quality gates terakhir

| Gate | Hasil |
|---|---|
| Lint | Lulus, 0 error (3 warning non-blocking) |
| Typecheck | Lulus |
| Unit/domain | 13/13 lulus, tidak ada skip |
| Firestore Rules | 15/15 lulus, tidak ada skip |
| Booking concurrency | Lulus: tepat 1 fulfilled dan 1 rejected |
| Playwright | 4/4 lulus pada desktop dan mobile; proses terminasi normal |
| Production build | Lulus, 37 halaman dihasilkan |

## Batasan yang tidak boleh disalahartikan sebagai lulus live

- Cloudinary, Resend, Midtrans, Firebase Auth/Admin production, Vercel Cron, domain verification, dan App Check belum dapat diuji end-to-end tanpa kredensial/infrastruktur eksternal.
- Distributed rate limiting didokumentasikan sebagai production requirement; implementasi lokal in-memory tidak menjamin limit lintas instance.
- E2E terautentikasi lengkap belum tersedia karena tidak ada fixture Auth emulator terpadu. Unit, Rules, build, dan public E2E tetap dijalankan tanpa skip.
- Form khusus booking manual owner dengan pemilih tenant masih menjadi gap UI; trusted endpoint sudah mendukung `tenantId` owner dan memvalidasi tenant aktif.
