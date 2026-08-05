# MASTER PROMPT CODEX — MANZSA RESIDENCE NEXT.JS + FIREBASE

You are a senior full-stack Next.js engineer, software architect, Firebase security engineer, and product-focused UI engineer.

Build the complete production-ready **Manzsa Residence** application directly in this repository.

The root project already contains:

- `PRD_MANZSA_RESIDENCE_NEXTJS_FIREBASE.md`
- `prototype/`

Use `PRD_MANZSA_RESIDENCE_NEXTJS_FIREBASE.md` as the primary source of truth for features, business rules, roles, data, security, and acceptance criteria.

Use `prototype/` as the approved visual reference for layout, typography, color, spacing, components, responsive behavior, and page composition.

Do not create another nested project. Build the actual Next.js application directly in the current root.

Do not delete, overwrite, or restructure `prototype/`. Treat it as read-only.

Do not stop after creating only a plan, skeleton, landing page, mock dashboard, static interface, or placeholder integration. Continue milestone by milestone until the application is functionally complete or a real third-party credential blocks progress.

Do not commit changes unless explicitly instructed.

---

## 1. Repository Audit

Before coding, inspect:

- `PRD_MANZSA_RESIDENCE_NEXTJS_FIREBASE.md`
- every file in `prototype/`
- existing assets, fonts, icons, images, screenshots, HTML, CSS, and JavaScript
- existing package files
- environment files
- Git state
- any existing application code

Determine:

1. Public, tenant, and owner pages
2. Navigation and layout structure
3. Typography and color palette
4. Spacing, border radius, shadows, forms, tables, and cards
5. Mobile behavior
6. Reusable components
7. Assets that can be reused
8. PRD features not represented in the prototype
9. Existing code that should be preserved

Create `IMPLEMENTATION_PLAN.md` containing:

- repository findings
- architecture
- route structure
- component structure
- Firestore design
- auth and authorization flow
- Cloudinary integration
- Resend integration
- Midtrans integration
- booking concurrency strategy
- testing strategy
- milestones
- risks and mitigations

After writing the plan, continue implementation immediately.

---

## 2. Product Boundaries

Manzsa Residence manages **one privately owned boarding-house property**.

It is not:

- a marketplace
- a multi-owner platform
- a multi-property SaaS
- a public property-owner registration platform
- a hotel marketplace

Roles:

- Public visitor
- Tenant
- Owner

Owner registration must not be publicly available.

---

## 3. Required Stack

Use:

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Admin SDK
- Cloudinary
- Resend
- Midtrans Snap
- React Hook Form
- Zod
- Recharts
- ExcelJS
- a server-side PDF solution compatible with Vercel
- Vitest or Jest
- Playwright

Use Server Components by default.

Use Client Components only for browser interaction.

Use Route Handlers or Server Actions for trusted server operations.

Never expose server secrets to the browser.

---

## 4. Recommended Structure

Use a clean structure similar to:

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── tenant/
│   ├── owner/
│   ├── api/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── public/
│   ├── tenant/
│   ├── owner/
│   ├── forms/
│   ├── charts/
│   └── shared/
├── features/
│   ├── auth/
│   ├── rooms/
│   ├── bookings/
│   ├── payments/
│   ├── invoices/
│   ├── tenants/
│   ├── complaints/
│   ├── announcements/
│   ├── reports/
│   └── settings/
├── lib/
│   ├── firebase/
│   ├── cloudinary/
│   ├── midtrans/
│   ├── resend/
│   ├── auth/
│   ├── validation/
│   ├── permissions/
│   ├── errors/
│   └── utils/
├── hooks/
├── types/
└── styles/
```

You may improve this when justified, but keep feature boundaries clear.

---

## 5. Design Direction

Reproduce the approved prototype faithfully.

Do not redesign it into a generic SaaS dashboard.

Preserve:

- forest green
- warm off-white
- soft beige
- white functional surfaces
- restrained gold accents
- Cormorant Garamond for editorial headings
- Inter for interface text
- premium, warm, editorial, trustworthy tone
- mobile-first responsiveness

Avoid AI-slop patterns:

- decorative badges
- random pills
- gradient blobs
- glowing orbs
- neon glassmorphism
- fake testimonials
- fake reviews
- fake statistics
- floating-card clutter
- excessive icons
- excessive border radius
- generic SaaS hero layouts
- decorative elements without function
- placeholder marketing copy
- emoji as production icons

Every UI element must serve a real product purpose.

---

## 6. Public Routes

Implement:

- `/`
- `/kamar`
- `/kamar/[slug]`
- `/tentang`
- `/fasilitas`
- `/galeri`
- `/faq`
- `/kontak`
- `/login`
- `/daftar`
- `/lupa-password`
- `/reset-password`

Public features:

- landing page
- room catalogue
- room search, filters, sorting, and pagination
- room detail
- gallery
- facilities
- availability display
- contact and FAQ
- responsive layout
- SEO metadata
- Open Graph
- canonical URL
- sitemap
- robots
- loading, empty, and error states

---

## 7. Tenant Routes

Implement:

- `/tenant`
- `/tenant/booking`
- `/tenant/booking/[id]`
- `/tenant/tagihan`
- `/tenant/tagihan/[id]`
- `/tenant/invoice/[id]`
- `/tenant/keluhan`
- `/tenant/keluhan/[id]`
- `/tenant/pengumuman`
- `/tenant/aktivitas`
- `/tenant/profil`

Tenant functionality:

- dashboard summary
- browse rooms
- create booking
- booking history
- active rental
- invoice list
- invoice PDF
- Midtrans payment
- manual transfer
- payment-proof upload
- payment status
- complaint creation and attachments
- complaint timeline
- announcements
- activity history
- profile and avatar
- reset password
- logout

Tenant must only access their own private data.

---

## 8. Owner Routes

Implement:

- `/owner`
- `/owner/kamar`
- `/owner/kamar/[id]`
- `/owner/booking`
- `/owner/booking/[id]`
- `/owner/tenant`
- `/owner/tenant/[id]`
- `/owner/pembayaran`
- `/owner/pembayaran/[id]`
- `/owner/invoice`
- `/owner/keluhan`
- `/owner/keluhan/[id]`
- `/owner/pengumuman`
- `/owner/laporan`
- `/owner/pengaturan`

Owner functionality:

- business dashboard
- revenue and occupancy charts
- booking trends
- room status
- booking calendar
- activities
- quick actions
- room CRUD
- Cloudinary room-image management
- pricing and rental types
- archive and restore
- booking management
- manual booking creation
- approval and rejection
- tenant management
- payment management
- manual-payment verification
- invoice management
- complaint management
- announcements
- reports
- PDF and Excel export
- property, payment, and SEO settings

---

## 9. Firebase Authentication

Use Firebase Authentication for:

- email/password registration
- login
- email verification
- forgot password
- reset password
- logout

Use secure server-side sessions:

1. Client signs in with Firebase Auth.
2. Client sends the Firebase ID token to a trusted Next.js endpoint.
3. Server verifies it with Firebase Admin SDK.
4. Server creates a secure HTTP-only session cookie.
5. Protected server routes verify the session cookie.
6. Logout clears and revokes the session.

Do not rely only on client-side route guards.

Use server-controlled roles:

- `owner`
- `tenant`

Create `scripts/create-owner.ts`.

The script must:

- create or update the Firebase Auth account
- assign the owner custom claim
- create the owner Firestore profile
- never expose Firebase Admin credentials

---

## 10. Firestore Architecture

Create a typed Firestore data model aligned with the PRD.

Expected collections:

- `users`
- `rooms`
- `bookings`
- `bookingLocks`
- `invoices`
- `payments`
- `complaints`
- `announcements`
- `activities`
- `propertySettings`
- `facilities`
- `counters`
- `emailEvents`
- `webhookEvents`
- `gallery`
- `notifications`

Use:

- Firestore timestamps
- TypeScript types
- Zod schemas
- integer Rupiah amounts
- snapshot data for historical accuracy

Historical snapshots should include:

- room
- tenant
- property
- booking price
- invoice details

Create:

- `firestore.rules`
- `firestore.indexes.json`

---

## 11. Firestore Security

Rules must ensure:

- public users only read public property and room data
- tenants only access their own private records
- tenants cannot change roles
- tenants cannot mark payments as paid
- owner claims cannot be assigned from the frontend
- server-only collections cannot be written by clients
- counters and webhook records are server-only
- identity documents are private
- owners can access management data

Never use:

```text
allow read, write: if true;
```

Add Firebase Emulator tests for critical rules.

---

## 12. Booking Engine

Support:

- hourly rental
- daily rental
- monthly rental

Each room can enable or disable each rental type.

Statuses:

- `draft`
- `pending_approval`
- `pending_payment`
- `confirmed`
- `active`
- `completed`
- `cancelled`
- `rejected`
- `expired`

Booking creation must run on the server and use Firestore transactions.

The transaction must:

1. validate session and role
2. validate room status
3. validate rental type
4. calculate price on the server
5. check overlap
6. create deterministic lock records
7. create booking
8. create invoice
9. create activity record
10. complete atomically or fail cleanly

Do not rely only on client-side availability.

Prevent concurrent double booking.

Store pricing snapshots.

Document the lock strategy.

---

## 13. Booking Expiration

Pending bookings must expire automatically.

Use Vercel Cron or a protected scheduled endpoint.

Create:

- protected cron route
- `vercel.json` when needed
- `CRON_SECRET` validation
- idempotent expiration logic

Expiration must:

- update booking status
- update invoice status when needed
- release locks
- record activity
- avoid duplicate side effects

---

## 14. Cloudinary

Use Cloudinary for:

- room images
- property gallery
- tenant avatars
- complaint attachments
- manual-payment proof
- property logo

Use signed uploads generated by the server.

Never expose `CLOUDINARY_API_SECRET`.

Recommended folders:

```text
manzsa-residence/rooms/{roomId}
manzsa-residence/gallery
manzsa-residence/users/{uid}/avatar
manzsa-residence/complaints/{complaintId}
manzsa-residence/payments/{paymentId}
manzsa-residence/property
```

Store:

- `publicId`
- `secureUrl`
- `width`
- `height`
- `format`
- `bytes`
- `resourceType`
- `altText`
- `sortOrder`

Validate MIME type, size, purpose, and ownership.

Configure Next.js Image for Cloudinary.

---

## 15. Resend

Use Resend for transactional email.

Create branded email templates for:

- welcome
- booking created
- booking approved
- booking rejected
- booking expired
- payment received
- manual payment submitted
- manual payment approved
- manual payment rejected
- invoice issued
- complaint received
- complaint status updated
- important announcement
- rental reminder when required

Use React Email when useful.

All email must be sent server-side.

Do not expose `RESEND_API_KEY`.

Email failure must not corrupt completed booking or payment state.

Record safe delivery events and support idempotency.

---

## 16. Midtrans

Use Midtrans Sandbox during development.

Support:

- Snap transaction creation
- QRIS and enabled Sandbox methods
- notification callback
- signature verification
- Get Status reconciliation
- settlement
- pending
- deny
- cancel
- expiration
- refund mapping when relevant

Rules:

- server key stays server-side
- never trust frontend payment success
- final payment state comes from verified server data
- webhook processing is idempotent
- amount is validated against invoice data
- processed webhook identifiers are stored

Implement endpoints similar to:

- `/api/payments/midtrans/create`
- `/api/payments/midtrans/notification`
- `/api/payments/midtrans/status/[orderId]`

---

## 17. Manual Transfer

Flow:

1. Tenant selects manual transfer
2. System displays bank information
3. Tenant uploads proof
4. Payment becomes `waiting_verification`
5. Owner reviews it
6. Owner approves or rejects
7. Payment, invoice, booking, locks, and activity update consistently

The client must never mark a payment as paid.

---

## 18. Invoice

Invoice must include:

- invoice number
- property snapshot
- tenant snapshot
- room snapshot
- rental type
- rental period
- pricing details
- deposit
- additional charges
- discount
- total
- method
- payment status
- issue date
- due date
- paid date

Generate invoice numbers on the server using a transaction-safe counter.

Example:

`MR-202608-0001`

Generate downloadable PDF invoices using snapshot data.

---

## 19. Complaints and Announcements

Complaint statuses:

- `open`
- `in_progress`
- `waiting_tenant`
- `resolved`
- `closed`
- `rejected`

Support:

- complaint attachments
- status history
- owner response
- tenant timeline

Announcements can target:

- all tenants
- a room
- a tenant

Support draft, published, optional expiration, in-app notification, and optional Resend delivery for important announcements.

---

## 20. Reports

Implement reports for:

- revenue
- booking
- occupancy
- payments
- tenants
- rooms

Filters:

- today
- this week
- this month
- this year
- custom range
- room
- booking status
- payment status
- payment method

Exports:

- PDF
- Excel

Exports must respect active filters and use trusted server-side data.

---

## 21. UI and Form States

Every data page must include:

- loading
- skeleton where appropriate
- empty state
- error state
- retry
- success feedback
- disabled state
- validation state
- confirmation dialog for destructive actions

Use React Hook Form and Zod.

Validate every mutation on the server.

Use clear Indonesian messages.

Prevent duplicate submission.

---

## 22. Responsive and Accessibility

Test at least:

- 390×844
- 768×1024
- 1366×768
- 1920×1080

Implement:

- mobile-first public pages
- tenant bottom navigation when suitable
- owner desktop sidebar
- collapsible mobile owner navigation
- mobile-friendly tables
- usable calendar and filters

Accessibility:

- semantic HTML
- keyboard navigation
- focus states
- accessible labels
- associated error messages
- dialog focus management
- sufficient contrast
- alt text
- reduced-motion support

---

## 23. SEO

Implement:

- metadata per public page
- canonical URL
- Open Graph
- Twitter cards
- sitemap
- robots
- structured data where appropriate
- room-specific metadata
- clean slugs
- alt text

Do not index private owner or tenant pages.

---

## 24. Environment Variables

Create `.env.example`:

```env
NEXT_PUBLIC_APP_NAME="Manzsa Residence"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_TIMEZONE="Asia/Jakarta"

NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

FIREBASE_ADMIN_PROJECT_ID=""
FIREBASE_ADMIN_CLIENT_EMAIL=""
FIREBASE_ADMIN_PRIVATE_KEY=""

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

RESEND_API_KEY=""
RESEND_FROM_EMAIL=""
RESEND_FROM_NAME="Manzsa Residence"

MIDTRANS_IS_PRODUCTION="false"
MIDTRANS_SERVER_KEY=""
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=""
MIDTRANS_MERCHANT_ID=""

CRON_SECRET=""
SESSION_COOKIE_NAME="manzsa_session"
SESSION_EXPIRES_DAYS="7"

OWNER_EMAIL=""
OWNER_PASSWORD=""
OWNER_FULL_NAME="Owner Manzsa Residence"

NEXT_PUBLIC_CONTACT_WHATSAPP=""
NEXT_PUBLIC_CONTACT_EMAIL=""
NEXT_PUBLIC_PROPERTY_ADDRESS=""
```

Do not commit `.env.local`.

Validate required variables.

Never use `NEXT_PUBLIC_` for secrets.

---

## 25. Seed and Scripts

Create scripts for:

- owner account
- property settings
- facilities
- sample rooms
- optional development tenant
- optional demo bookings and payments

Development data must be clearly marked as seed data.

Add useful commands such as:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "...",
    "typecheck": "...",
    "test": "...",
    "test:e2e": "...",
    "seed": "...",
    "create-owner": "..."
  }
}
```

---

## 26. Testing

Unit tests:

- price calculation
- overlap detection
- lock generation
- invoice numbering
- Midtrans status mapping
- permissions
- report calculations

Integration tests:

- registration
- login and session
- protected routes
- booking creation
- conflict rejection
- payment creation
- Midtrans notification
- manual verification
- invoice creation
- complaint flow
- report export

Firestore rules tests:

- public reads
- tenant ownership
- owner access
- forbidden role update
- forbidden payment finalization
- forbidden server-only writes

End-to-end tests:

- visitor browses rooms
- tenant registers and logs in
- tenant books
- tenant starts payment
- tenant uploads transfer proof
- owner verifies payment
- tenant downloads invoice
- tenant submits complaint
- owner resolves complaint
- owner exports report

---

## 27. Quality Gates

Use:

- TypeScript strict
- no uncontrolled `any`
- consistent error handling
- shared validation
- no secret leakage
- no dead code
- no duplicated business logic
- Indonesian user-facing copy

Run and fix:

- lint
- typecheck
- tests
- production build

Do not report completion while these fail.

---

## 28. Milestones

### Milestone 1 — Foundation

- Next.js setup
- TypeScript
- Tailwind
- fonts and design tokens
- Firebase client/admin
- environment validation
- layouts
- health check
- base UI and errors

### Milestone 2 — Authentication

- registration
- login
- secure session
- logout
- verification
- reset password
- roles
- profile
- owner script
- protected routes

### Milestone 3 — Public Website

- landing
- catalogue
- filters
- sorting
- room detail
- gallery
- facilities
- FAQ
- contact
- SEO

### Milestone 4 — Owner Dashboard

- metrics
- charts
- calendar
- room status
- activities
- quick actions

### Milestone 5 — Room Management

- CRUD
- facilities
- pricing
- rental types
- status
- Cloudinary images
- archive and restore

### Milestone 6 — Booking Engine

- hourly, daily, monthly
- pricing
- overlap prevention
- transactions
- locks
- invoice
- expiry
- activity

### Milestone 7 — Tenant Dashboard

- overview
- rental
- bookings
- invoices
- payments
- announcements
- profile
- activity

### Milestone 8 — Payments and Invoice

- Midtrans
- webhook
- Get Status
- manual transfer
- verification
- PDF invoice
- Resend

### Milestone 9 — Complaints and Announcements

- complaints
- attachments
- timeline
- owner response
- targeting
- notifications

### Milestone 10 — Reports and Production

- reports
- PDF and Excel
- Firestore indexes
- Firestore rules
- emulator tests
- accessibility
- SEO
- performance
- production build
- deployment docs

After each milestone:

1. run relevant tests
2. run lint
3. run typecheck
4. fix failures
5. update `IMPLEMENTATION_PLAN.md`
6. continue automatically

---

## 29. Documentation

Create:

- `README.md`
- `docs/SETUP.md`
- `docs/FIREBASE.md`
- `docs/CLOUDINARY.md`
- `docs/RESEND.md`
- `docs/MIDTRANS.md`
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`

Document:

- local setup
- Firebase setup
- Firebase Auth
- Firestore rules
- Firestore indexes
- owner creation
- Cloudinary
- Resend domain verification
- Midtrans Sandbox
- production migration
- Vercel environment variables
- Vercel Cron
- custom domain

---

## 30. Definition of Done

The application is complete only when:

1. public website is responsive
2. room browsing works
3. tenant registration and login work
4. secure server sessions work
5. authorization works
6. booking works
7. double booking is prevented server-side
8. room management works
9. Cloudinary uploads work
10. Midtrans Sandbox works
11. manual transfer works
12. owner verification works
13. invoice PDF works
14. tenant dashboard works
15. owner dashboard uses real Firestore data
16. complaints work
17. announcements work
18. reports work
19. PDF and Excel export work
20. Resend integration works or is honestly documented when credentials are absent
21. Firestore rules are restrictive
22. critical rules have tests
23. secrets are protected
24. no critical console error remains
25. lint passes
26. typecheck passes
27. tests pass
28. production build passes
29. mobile layouts are usable
30. deployment docs are complete
31. `prototype/` remains unchanged
32. no nested Next.js project was created

---

## 31. Final Report

After implementation, report:

1. repository findings
2. architecture
3. routes implemented
4. features implemented
5. Firestore collections
6. security approach
7. Cloudinary integration
8. Resend integration
9. Midtrans integration
10. booking-lock strategy
11. files created and changed
12. tests run
13. lint result
14. typecheck result
15. build result
16. setup commands
17. owner creation command
18. seed command
19. local development command
20. deployment steps
21. credentials still required
22. known limitations
23. confirmation that `prototype/` was not modified
24. confirmation that no nested project was created

Do not claim that something works unless it was actually tested.

Do not commit changes unless explicitly instructed.
