# Functional Gap Audit — Manzsa Residence

Audit dilakukan terhadap PRD, seluruh `src/`, prototype, konfigurasi Firebase, environment, dokumentasi, scripts, dan tests pada 5 Agustus 2026. Status di bawah merekam kondisi **sebelum** putaran penyelesaian ini; kolom perbaikan menjadi checklist implementasi.

## Ringkasan Temuan

| Area | Kondisi awal | Gap utama | Perbaikan / acceptance test |
|---|---|---|---|
| Public website | Fallback data / partially functional | Landing, katalog, detail, sitemap selalu `sampleRooms`; contact form tanpa submit; filter/pagination terbatas | DAL publik Firestore dengan fallback hanya jika Admin tidak dikonfigurasi; public room harus mengecualikan inactive/archive; filter lengkap dan contact handler; test public query |
| Authentication | Partially functional | Register/login/session ada; reset memakai Firebase client default; belum ada CSRF/origin helper, rate-limit, email welcome | Konsisten result/error, origin check, limiter, session revocation; integration tests |
| Tenant dashboard | UI only | Angka nol hardcoded dan selalu empty | Query booking/invoice/payment/complaint/announcement/activity milik UID; render data nyata; empty hanya jika query kosong |
| Tenant booking | API only | Create atomik ada; tidak ada price preview, wizard, list/detail/cancel | API preview/list/detail/cancel + client wizard; duplicate guard; conflict feedback; test pricing/conflict |
| Tenant invoices/payments | API only / UI only | Midtrans/manual APIs ada, UI tidak terhubung; bank settings tidak dibaca | List/detail, Snap launch/redirect, refresh status, signed proof upload, submit metadata, PDF link |
| Tenant complaints | API only | Create endpoint ada; tidak ada form/list/detail/timeline/reply/upload | Query ownership, create form, attachment persistence, detail/history, tenant reply |
| Tenant announcements | Missing query | Generic empty page | Target all/room/UID + published/date/expiry filtering |
| Tenant profile | UI only | Tidak membaca/menulis profil | Allowlisted PATCH, avatar signature/upload metadata, reset link, validation |
| Owner dashboard | Hardcoded data | Selalu Rp0/0% dan chart kosong | Server aggregate Firestore; metrics/activity/booking schedule dari data nyata |
| Owner room management | API only | Create dan limited PATCH/archive; tidak ada list/form/image/reorder/restore | Full schema CRUD/list/detail, signed upload, metadata, order/cover/delete, logs, client form/filter/pagination |
| Owner booking management | Partially functional API | Tidak ada list/detail/manual owner flow/transitions | Owner list/detail; transition state machine; reason; lock release; connections/history; test invalid transition |
| Owner tenant management | Missing | Generic empty page | List/detail related history, notes, Auth disable/enable + session revoke |
| Owner payments | Partially functional API | Verify API ada; UI/list/detail/email belum ada | List/detail/proof; decision form; transaction update, audit, non-rollback Resend |
| Owner invoices | PDF API only | Tidak ada list/detail/filter | Real list/detail/snapshot/pricing/status/PDF |
| Owner complaints | Partially functional API | Update endpoint ada; UI/list/detail/email/activity transition validation kurang | Query/filter, detail/timeline, state machine, notification/email/activity |
| Owner announcements | Create API only | Edit/archive/list/notifications/email tidak ada | CRUD, publish targeting, notification fan-out, important email, list UI |
| Reports | Excel API only | Tidak ada aggregate/filter/PDF; UI buttons tidak beraksi | Trusted server query + identical filter DTO for JSON/Excel/PDF; summary/table/charts UI |
| Property settings | Missing | Generic empty page | GET/PATCH schema, Cloudinary logo/OG, real public settings and SEO |
| Cloudinary | Partially functional | Signature ada; tidak ada destroy, controlled delivery, upload UI/metadata verification | Purpose policy, authenticated sensitive uploads, delete endpoint, reusable uploader, metadata persistence |
| Resend | API utility only | Satu generic template; tidak dipanggil workflow | Template registry 13 event types, idempotent safe logs, best-effort queue calls |
| Midtrans | Partially functional | Snap/webhook/status ada; status refresh tidak persist; webhook tidak activity/email; order may duplicate | Ownership/status checks, reconciliation transaction, monotonic transitions, activity/email, idempotency tests |
| Cron | Partially functional | Protected/idempotent dasar; transaction melakukan query lock setelah write dan belum email | Read-before-write transaction, exact lock ownership, event marker/activity once; double-run test |
| Firestore rules | Partially functional | Default deny baik; profile create client contradicts server-only flow; announcement target room rule incomplete | Full rules matrix and automated emulator execution |
| Indexes | Partially functional | Core indexes ada; query baru belum dicakup | Tambah indexes sesuai query nyata |
| Security | Partially functional | Cookie secure/revocation ada; CSP/rate limit/origin/sanitization belum lengkap | Security headers, mutation origin validation, limiter abstraction, sanitization, safe errors, docs |
| Tests | Partially functional | 10 unit; rules conditional skip; 2 public E2E; no integration/concurrency | Automatic emulator script, expanded rule matrix, domain integration/concurrency, workflow E2E |
| Playwright teardown | Failing lifecycle | Assertions pass tetapi process Windows menggantung | Dedicated server lifecycle script/global teardown, detect/close child process; no force-exit as primary fix |

## Route dan UI Audit

| Feature | Route | Expected behavior | Current implementation | Missing / files | Required fix | Acceptance test | Initial status |
|---|---|---|---|---|---|---|---|
| Landing | `/` | Property/featured rooms/facilities real | `sampleRooms`, static copy | `src/app/(public)/page.tsx` | Public DAL + credential-aware fallback | Seeded Firestore values render | Fallback data |
| Catalogue | `/kamar` | Full filters/sort/pagination/public-only | Search/type/sort client over samples | page + `room-catalog.tsx` | Server public query, facility/price/status/load more | inactive/archive absent | Partially functional |
| Room detail | `/kamar/[slug]` | Real media/rules/prices/availability | Static params from samples | route page | Dynamic Firestore lookup + images | seeded room opens | Fallback data |
| Content pages | `/tentang`, `/fasilitas`, `/galeri`, `/faq`, `/kontak` | Public settings/collections | Mostly static; contact form inert | public pages | DAL and contact mutation | form persists activity/email | UI only |
| Auth | `/login`, `/daftar`, reset routes | Firebase Auth + server session | Core flow works | auth form/routes | rate/origin/result/email | authenticated role redirect | Partially functional |
| Tenant overview | `/tenant` | Real private summary | hardcoded zeros | tenant page | dashboard DAL | own data only | Mock data |
| Tenant sections | `/tenant/[section]` | Functional lists/forms | generic toolbar/empty | dynamic pages | dedicated data + console per section | CRUD persists | UI only |
| Tenant details | `/tenant/[section]/[id]` | Ownership-checked detail | always “not found” | detail page | typed detail queries and workflow actions | other UID denied | UI only |
| Owner overview | `/owner` | Real metrics/charts/actions | hardcoded zeros | owner page | aggregate DAL | metrics match seeded data | Mock data |
| Owner sections | `/owner/[section]` | Real management UI | inert search/select/buttons | generic page | section data/form/action wiring | persistence visible after refresh | UI only |
| Owner details | `/owner/[section]/[id]` | Related real data/actions | always not found | detail page | detail DAL and forms | connection records render | UI only |

## API / Persistence Audit

| API | Initial status | Missing acceptance criteria |
|---|---|---|
| `/api/bookings` | Partially functional | GET, owner/manual actor, email, verification, transaction read ordering, typed errors |
| `/api/cron/expire-bookings` | Partially functional | repeat-run integration test, read-before-write lock query |
| `/api/cloudinary/sign` | Partially functional | sensitive authenticated delivery, upload ownership beyond role, delete |
| Midtrans create/notification/status | Partially functional | reconciliation persistence, activity/email, duplicate transaction prevention |
| `/api/payments/manual` | Partially functional | proof public-id/folder verification, email |
| Owner payment verify | Partially functional | transition guard/email, rejection note required, lock consequences |
| Complaints | Partially functional | GET, attachments, reply, transition state machine/email/activity |
| Announcements | API only | GET/PATCH/DELETE, target notifications and email |
| Rooms | API only | GET/full PATCH/restore/media operations/activity |
| Reports export | Partially functional | filter validation, aggregation, PDF, UI parity |
| Invoice PDF | Fully functional core | add rendered dates/method/property details test |
| Health | Fully functional | preserve secret-free output |
| Missing APIs | Missing | owner bookings/tenants/settings; tenant dashboard/profile/data; public data/contact |

## Buttons, Forms, Modals, Tables, Filters

- `owner/[section]/page.tsx`: search, select, Tambah Baru, Export PDF, Export Excel have no event/action — **UI only**.
- `tenant/[section]/page.tsx`: Buat Keluhan has no event/action; all sections force empty state — **UI only**.
- `kontak/page.tsx`: form has no submit target — **UI only**.
- No production modal/confirmation implementation for archive/reject/cancel — **missing**.
- No authenticated data tables, pagination, upload progress, retry, or success feedback — **missing**.
- Auth form is the only fully wired client form; it prevents duplicate submission but uses inconsistent error result — **partially functional**.

## Test Audit

| Suite | Current | Required completion |
|---|---|---|
| Unit | 10 pass | Add date normalization, transitions, public visibility, report filters, sanitizer |
| Integration | Missing | Domain services with emulator for booking/payment/complaint/announcement/report |
| Concurrency | Missing | Two simultaneous transactions, exactly one success |
| Rules | 3 tests conditional skip | Auto-start emulator and full deny/ownership matrix, zero skipped |
| E2E | 4 assertions pass but runner hangs | Fix server teardown; credential/emulator-backed tenant/owner workflows |

## Credential Boundaries

- Live Firebase Auth, production Firestore, Cloudinary delivery, Resend delivery, and Midtrans Sandbox are **blocked by credentials** in this workspace.
- Emulator-backed Firebase persistence, authorization rules, concurrency, and UI workflow tests are not credential-dependent and must be completed locally.
- Public fallback is permitted only when Firebase Admin is absent; authenticated routes must fail securely and never fabricate data.

## Completion Rule

A row moves to complete only when UI, server persistence, authorization, validation, loading/empty/error/success states, and an applicable test exist. `FINAL_ACCEPTANCE_AUDIT.md` records the post-fix state and any genuine credential-only blockers.
