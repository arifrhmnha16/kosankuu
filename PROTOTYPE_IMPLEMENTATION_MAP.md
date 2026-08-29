# Prototype Implementation Map

Sumber visual: seluruh HTML/CSS/JS di `prototype/`. Status dicatat setelah correction pass awal; **Close** berarti struktur, palet, font, spacing, shell, dan komponen utama mengikuti prototype tetapi konten dinamis dapat menyebabkan variasi tinggi/isi.

| Prototype | Next.js route | React implementation | Tokens/assets reused | Status | Missing visual detail |
|---|---|---|---|---|---|
| `aeline_landing_page.html` | `/` | public page + `PublicHeader`/`PublicFooter` | Montserrat, Cormorant, blue grid/gradient, lime, three Unsplash fallbacks | Close | minor rendering differences from Tailwind CDN prototype and dynamic room cards |
| `katalog_kamar.html` | `/kamar` | `RoomCatalog`, `RoomCard` | public shell, surface/cards/filter controls | Close | filter copy follows functional PRD fields |
| `detail_kamar.html` | `/kamar/[slug]` | dynamic room page | gallery/card/button tokens | Close | image count depends on Firestore |
| `tentang.html` | `/tentang` | public about page | heading/body typography and section scale | Close | dynamic settings not present in prototype copy |
| `fasilitas.html` | `/fasilitas` | facilities page | facility cards, lime/blue/dark palette | Close | icon set differs where database has no icon |
| `galeri.html` | `/galeri` | gallery page | responsive image grid and radii | Close | number of media items is dynamic |
| `faq.html` | `/faq` | FAQ page | accordion typography/borders | Close | — |
| `kontak.html` | `/kontak` | contact page + `ContactForm` | two-column layout, form tokens | Close | map is data-dependent |
| `login.html` | `/login` | `AuthPage`, `AuthForm` | blue gradient split auth shell | Close | live Firebase messages replace demo text |
| `registrasi.html` | `/daftar` | `AuthPage`, `AuthForm` | auth shell/form/button tokens | Close | — |
| `lupa-password.html` | `/lupa-password` | `AuthPage`, `AuthForm` | auth shell/form tokens | Close | — |
| `reset-password.html` | `/reset-password` | `AuthPage`, `AuthForm` | auth shell/form tokens | Close | — |
| `tenant/index.html` | `/tenant` | tenant dashboard + `DashboardShell` | 250px dark shell, widgets, prototype typography | Close | real data replaces demo metrics |
| `tenant/booking.html` | `/tenant/booking`, detail | `BookingWizard`, tenant detail | toolbar/cards/forms/status tokens | Close | functional wizard fields supersede simulated modal |
| `tenant/tagihan.html` | `/tenant/tagihan` | tenant section/payment panel | table/card/button tokens | Close | Midtrans UI appears only when applicable |
| `tenant/invoice.html` | `/tenant/invoice/[id]` or tagihan detail/PDF | `TenantDetail` | invoice/card/detail tokens | Close | route topology follows PRD implementation |
| `tenant/keluhan.html` | `/tenant/keluhan` | `ComplaintForm`, section/detail | modal/form/timeline tokens | Close | uploader adds progress controls |
| `tenant/pengumuman.html` | `/tenant/pengumuman` | tenant section/detail | announcement cards | Close | — |
| `tenant/aktivitas.html` | `/tenant/aktivitas` | tenant section | activity cards | Close | — |
| `tenant/profil.html` | `/tenant/profil` | `ProfileForm` | profile form/avatar/card tokens | Close | controlled uploader UI differs slightly |
| `owner/index.html` | `/owner` | owner dashboard + `DashboardShell` | blue owner hero, metrics, dark sidebar | Close | charts depend on real aggregate availability |
| `owner/kamar.html` | `/owner/kamar` | `OwnerSection`, `RoomForm` | table/modal/toolbar/photo tokens | Close | real columns differ from demo dataset |
| `owner/booking.html` | `/owner/booking` | owner list/detail/actions + `OwnerBookingForm` | table/status/action/form tokens | Close | data dinamis dapat mengubah tinggi tabel |
| `owner/tenant.html` | `/owner/tenant` | owner list/detail | table/detail/tabs tokens | Close | — |
| `owner/pembayaran.html` | `/owner/pembayaran` | owner list/detail | table/modal/status tokens | Close | secure proof rendering depends on credentials |
| `owner/invoice.html` | `/owner/invoice` | owner list/detail | invoice/table tokens | Close | — |
| `owner/keluhan.html` | `/owner/keluhan` | owner list/detail | timeline/status/action tokens | Close | — |
| `owner/pengumuman.html` | `/owner/pengumuman` | `AnnouncementForm`, list | form/card/button tokens | Close | target controls use IDs because no lookup widget in prototype implementation |
| `owner/laporan.html` | `/owner/laporan` | `ReportPanel` | blue/lime metrics, filters, charts | Close | chart shape follows real values |
| `owner/pengaturan.html` | `/owner/pengaturan` | `SettingsForm` | card/form/uploader tokens | Close | extra PRD fields extend prototype form |

## Shared source mapping

- `prototype/compact-tailwind.css`: desktop 80% type scale, 68px header, tablet 90%/76px, mobile 64px, landing image dimensions.
- `prototype/prototype-common.css`: Montserrat body, Cormorant headings, `#1DA1F2`, `#1269A4`, `#C6F564`, `#F3F4F6`, `#111827`, max-width 1280px, pill buttons, auth layouts.
- `prototype/tenant/tenant.css`: dashboard shell, tables, cards, fields, dialogs, timeline, invoice, responsive 760/1050 breakpoints.
- `prototype/owner/owner.css`: owner blue hero, metric variants, charts, tabs, photo lists.
- The prototype contains no local raster/vector/font files. Its photographic assets are external Unsplash URLs; the landing composition keeps these as presentation fallbacks and uses Firestore/Cloudinary images when present.

## Interaction mapping

| Prototype behavior | React/CSS implementation | Verification |
|---|---|---|
| Header transparan lalu biru blur saat scroll | `PublicHeader` scroll listener + `.prototype-header.is-scrolled` | Playwright |
| Mobile navigation buka/tutup | React state, `aria-expanded`, responsive menu | Playwright desktop/mobile |
| Foto hero rotate/scale/z-index saat hover | `.prototype-room-left/center/right:hover` | Playwright computed transform |
| Button hover/active | prototype lime/outline/dark transitions dan active scale | CSS |
| Room/gallery image zoom | image transform 500ms dalam overflow container | CSS + Playwright lightbox |
| Gallery modal | `PrototypeGallery`, overlay, caption, close, Escape, arrow keys | Playwright |
| FAQ plus rotation/open content | native `details`, rotated plus, slide animation | Playwright |
| Dashboard widget hover | translateY/shadow seperti `tenant.css` | CSS |
| Sidebar active/hover/mobile overlay | React pathname state, blue active, backdrop close | CSS/React |
| Dialog/modal appearance | fade backdrop dan translate/scale dialog | CSS |
| Loading skeleton | shimmer 1.2 detik | CSS |
| Disabled/active controls | opacity, cursor, active scale | CSS |
