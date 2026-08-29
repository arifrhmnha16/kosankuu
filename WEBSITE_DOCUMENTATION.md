# Dokumentasi Website Manzsa Residence

## 1. Gambaran Umum

Manzsa Residence adalah website pengelolaan kos dan penyewaan kamar berbasis Next.js dan Firebase. Website ini melayani tiga jenis pengguna:

1. Pengunjung umum yang ingin melihat properti dan kamar.
2. Tenant yang melakukan booking, membayar tagihan, mengunduh invoice, dan mengirim keluhan.
3. Owner yang mengelola kamar, booking, tenant, pembayaran, invoice, keluhan, pengumuman, laporan, dan pengaturan properti.

Website production tersedia di:

- <https://kosankuu.vercel.app>
- Repository: <https://github.com/arifrhmnha16/kosankuu>

Desain antarmuka mengikuti file HTML yang terdapat di folder `prototype/`. Folder tersebut merupakan sumber utama tampilan, warna, tipografi, komposisi, hover, dan responsive layout.

> Verifikasi lokal terakhir: 6 Agustus 2026. Lint, typecheck, 22 unit/integration test, 18 Firestore Rules test, 88 Playwright E2E, visual regression lima viewport, dan production build lulus. Integrasi vendor live tetap harus diverifikasi pada environment deployment dengan kredensial production/sandbox yang valid.

## 2. Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | Next.js 16 App Router |
| Bahasa | TypeScript |
| UI | React, CSS, Lucide Icons |
| Animasi scroll | Lenis |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| Server Firebase | Firebase Admin SDK |
| Penyimpanan gambar | Cloudinary |
| Email transaksional | Resend |
| Pembayaran online | Midtrans Snap |
| PDF | React PDF |
| Excel | ExcelJS |
| Unit test | Vitest |
| End-to-end test | Playwright |
| Hosting | Vercel |

## 3. Jenis Pengguna

### 3.1 Pengunjung

Pengunjung tidak perlu login untuk:

- Membuka landing page.
- Melihat profil properti.
- Melihat katalog kamar publik.
- Membuka detail kamar.
- Melihat harga dan tipe penyewaan.
- Melihat fasilitas dan peraturan kamar.
- Memeriksa kalender ketersediaan.
- Melihat galeri, FAQ, fasilitas, dan kontak.

Pengunjung harus login sebelum mengirim booking.

### 3.2 Tenant

Tenant adalah pengguna yang telah melakukan registrasi dan verifikasi email. Tenant dapat:

- Melihat ringkasan akun.
- Melihat tagihan dan riwayat pembayaran.
- Membayar melalui Midtrans.
- Memilih transfer bank manual.
- Mengunggah bukti pembayaran.
- Mengunduh invoice PDF.
- Melihat pengumuman yang ditujukan kepadanya.
- Membuat dan membalas keluhan.
- Memperbarui data diri yang diizinkan.
- Melakukan reset password dan logout.

Booking dilakukan melalui halaman detail kamar, bukan melalui dashboard tenant.

### 3.3 Owner

Owner memiliki akses administratif untuk:

- Mengelola seluruh kamar.
- Memantau dan mengubah status booking.
- Mengelola tenant.
- Memverifikasi transfer manual.
- Memantau invoice dan pembayaran.
- Menindaklanjuti keluhan.
- Membuat pengumuman bertarget.
- Melihat dan mengekspor laporan.
- Mengubah pengaturan properti.

## 4. Fitur Publik

### 4.1 Landing Page

Landing page menggunakan desain biru dengan grid background sesuai prototype. Bagian utamanya meliputi:

- Navbar responsive.
- Tombol login, daftar, atau dashboard jika pengguna sudah login.
- Headline utama.
- Tombol menuju katalog dan booking.
- Komposisi tiga gambar kamar.
- Penjelasan keunggulan properti.
- Daftar kamar unggulan.
- Fasilitas.
- Galeri dengan lightbox.
- FAQ interaktif.
- Informasi kontak.
- Animasi hover dan smooth scrolling.

Jika Firestore belum tersedia, halaman publik dapat memakai data presentasi fallback. Data fallback tidak digunakan pada halaman tenant atau owner.

### 4.2 Katalog Kamar

Katalog kamar mendukung:

- Pencarian kamar.
- Filter fasilitas.
- Filter tipe sewa.
- Filter harga.
- Filter ketersediaan.
- Pengurutan.
- Tampilan gambar kamar.
- Link menuju detail kamar.

Kamar inactive, archived, atau tidak publik tidak ditampilkan.

### 4.3 Detail Kamar dan Kalender

Halaman detail kamar menampilkan:

- Foto dan galeri kamar.
- Nama dan nomor kamar.
- Deskripsi.
- Kapasitas dan luas.
- Fasilitas.
- Peraturan.
- Harga berdasarkan tipe sewa.
- Deposit jika berlaku.
- Kalender ketersediaan.
- Pemilihan tanggal dan jam.
- Ringkasan harga.
- Tombol pengiriman booking.

Tipe sewa yang didukung:

- Per jam.
- Per hari atau 24 jam.
- Per bulan.
- Per tahun.

Untuk sewa per jam, tenant memilih tanggal terlebih dahulu, kemudian memilih jam tersedia dalam format 24 jam. Jam yang bertabrakan dengan booking lain dikunci.

## 5. Authentication

### 5.1 Registrasi Tenant

Alur registrasi:

1. Pengguna mengisi nama, nomor WhatsApp, email, dan password.
2. Firebase Authentication membuat akun.
3. Server membuat profil tenant di Firestore.
4. Resend mengirim email verifikasi dengan tampilan Manzsa Residence.
5. Pengguna diarahkan ke halaman verifikasi email.
6. Pengguna dapat meminta pengiriman ulang email.
7. Setelah email terverifikasi, pengguna dapat login.
8. Email selamat datang dikirim setelah verifikasi pertama berhasil.

Tenant yang belum melakukan verifikasi tidak dapat membuat session aplikasi.

### 5.2 Login

Setelah login:

- Owner diarahkan ke dashboard owner.
- Tenant diarahkan ke landing page atau return URL sebelumnya.
- Tombol Login dan Daftar berubah menjadi Dashboard Saya.

Session menggunakan Firebase session cookie yang bersifat `HttpOnly`, `SameSite=Lax`, dan `Secure` pada production.

### 5.3 Reset Password

Pengguna dapat meminta reset password melalui email. Link reset dibuat oleh Firebase Admin dan dikirim melalui Resend.

## 6. Alur Booking

Alur booking utama:

1. Pengguna membuka detail kamar.
2. Memilih tipe sewa.
3. Memilih tanggal dan/atau jam.
4. Browser meminta preview harga dari server.
5. Server memeriksa ketersediaan dan menghitung harga.
6. Pengguna memeriksa ringkasan.
7. Jika belum login, pengguna diarahkan ke login dengan return URL.
8. Saat booking dikirim, server menghitung ulang seluruh harga.
9. Firestore transaction membuat booking lock deterministik.
10. Booking, invoice, activity, dan lock dibuat secara atomik.
11. Tenant diarahkan ke tagihan.

### 6.1 Pencegahan Booking Bentrok

Server tidak mempercayai kalender frontend. Validasi dilakukan kembali di Firestore transaction.

- Sewa per jam memakai bucket jam.
- Sewa harian memakai rentang 24 jam.
- Sewa bulanan dan tahunan memakai rentang waktu.
- Dua booking bersamaan untuk kamar dan periode yang sama tidak dapat berhasil keduanya.

### 6.2 Status Booking

Status booking yang digunakan:

- `draft`
- `pending_approval`
- `pending_payment`
- `confirmed`
- `active`
- `completed`
- `cancelled`
- `rejected`
- `expired`

Perubahan status divalidasi server sehingga transisi yang tidak sah ditolak.

## 7. Pembayaran dan Invoice

### 7.1 Halaman Pembayaran

Tenant tidak langsung dilempar ke Midtrans. Alurnya:

1. Tenant membuka detail tagihan.
2. Menekan tombol pilih metode pembayaran.
3. Membuka `/tenant/tagihan/[id]/bayar`.
4. Memeriksa rincian tagihan dan booking.
5. Memilih Midtrans atau transfer manual.
6. Mengonfirmasi metode yang dipilih.

### 7.2 Midtrans

Pembayaran online menggunakan Midtrans Snap.

- Snap token dibuat server-side.
- Nominal diambil dari invoice Firestore.
- Callback selesai memakai domain request production.
- Status frontend tidak dipercaya sebagai status akhir.
- Server melakukan Get Status ke Midtrans.
- Webhook diverifikasi menggunakan signature Midtrans.
- Webhook diproses secara idempotent.
- Transaksi pending hanya digunakan kembali jika berasal dari origin yang sama.

Callback production:

```text
https://kosankuu.vercel.app/tenant/pembayaran-selesai
```

### 7.3 Transfer Manual

Alur transfer manual:

1. Tenant melihat rekening properti.
2. Tenant melakukan transfer sesuai total invoice.
3. Tenant mengunggah bukti melalui Cloudinary.
4. Status menjadi `waiting_verification`.
5. Owner menyetujui atau menolak pembayaran.
6. Jika disetujui, invoice menjadi paid dan booking menjadi confirmed.
7. Jika ditolak, alasan ditampilkan kepada tenant.

Frontend tidak dapat menandai pembayaran sebagai paid secara langsung.

### 7.4 Email Pembayaran

Setelah pembayaran benar-benar terverifikasi, tenant menerima email Resend yang berisi:

- Informasi pembayaran berhasil.
- Nomor invoice.
- Tombol menuju detail pembayaran.
- Lampiran invoice PDF.
- Lampiran struk pembayaran PDF.

Email menggunakan idempotency key agar webhook berulang tidak mengirim email duplikat.

## 8. Dashboard Tenant

Menu dashboard tenant:

- Ringkasan.
- Tagihan dan pembayaran.
- Invoice.
- Keluhan.
- Pengumuman.
- Aktivitas.
- Data diri.

Dashboard hanya menampilkan data tenant yang sedang login dan tidak menggunakan data tenant palsu.

## 9. Dashboard Owner

### 9.1 Kamar

Owner dapat:

- Membuat dan mengedit kamar.
- Mengatur nomor, nama, slug, tipe, dan deskripsi.
- Mengatur kapasitas dan luas.
- Mengatur harga per jam, hari, bulan, dan tahun.
- Mengaktifkan tipe sewa tertentu.
- Mengatur fasilitas dan peraturan.
- Mengunggah beberapa gambar.
- Memilih gambar cover dan urutan gambar.
- Mengatur status dan visibilitas.
- Mengarsipkan dan memulihkan kamar.

Status kamar:

- `available`
- `reserved`
- `occupied`
- `maintenance`
- `inactive`

### 9.2 Booking

Owner dapat mencari, memfilter, melihat detail, menyetujui, menolak, mengaktifkan, membatalkan, dan menyelesaikan booking sesuai aturan transisi status.

### 9.3 Tenant

Owner dapat melihat profil dan riwayat tenant, menambah catatan internal, menonaktifkan akun, mengaktifkan kembali akun, atau menghapus akun sesuai endpoint yang dilindungi role owner.

### 9.4 Pembayaran dan Invoice

Owner dapat:

- Melihat seluruh pembayaran.
- Memfilter status dan metode.
- Melihat bukti transfer.
- Menyetujui atau menolak transfer manual.
- Melihat invoice dan koneksi booking/tenant.
- Mengunduh PDF invoice.

### 9.5 Keluhan

Owner dapat melihat attachment, memberikan respons, mengubah status, menyelesaikan, menutup, atau menolak keluhan.

### 9.6 Pengumuman

Pengumuman dapat ditargetkan kepada:

- Semua tenant.
- Tenant pada satu kamar.
- Satu tenant tertentu.

Pengumuman mendukung draft, publish, prioritas, tanggal publikasi, dan tanggal kedaluwarsa.

### 9.7 Laporan

Laporan tersedia untuk:

- Pendapatan.
- Booking.
- Okupansi.
- Pembayaran.
- Tenant.
- Kamar.

Laporan dapat difilter dan diekspor menjadi PDF atau Excel. Perhitungan data tepercaya dilakukan di server.

## 10. Cloudinary

Cloudinary dipakai untuk:

- Foto kamar.
- Logo dan Open Graph image.
- Avatar tenant.
- Attachment keluhan.
- Bukti pembayaran.

Upload memerlukan signed upload endpoint. Server memeriksa session, role, purpose, folder, MIME type, dan ukuran file.

## 11. Resend

Jenis email yang tersedia antara lain:

- Verifikasi email.
- Selamat datang.
- Booking dibuat, disetujui, ditolak, dan expired.
- Invoice diterbitkan.
- Bukti transfer diterima.
- Pembayaran berhasil atau ditolak.
- Keluhan diterima dan diperbarui.
- Pengumuman penting.
- Reset password.

Kegagalan email tidak membatalkan transaksi bisnis yang sudah berhasil.

## 12. Firestore

Koleksi utama:

- `users`
- `rooms`
- `bookings`
- `bookingLocks`
- `invoices`
- `payments`
- `complaints`
- `announcements`
- `activities`
- `notifications`
- `propertySettings`
- `emailEvents`
- `webhookEvents`
- `counters`

Firestore Rules menggunakan pendekatan default-deny. Operasi sensitif seperti booking, booking lock, invoice, finalisasi pembayaran, webhook event, email event, dan counter dilakukan melalui server, bukan langsung oleh browser.

## 13. Route Utama

### Public dan Authentication

| Route | Fungsi |
|---|---|
| `/` | Landing page |
| `/kamar` | Katalog kamar |
| `/kamar/[slug]` | Detail dan kalender kamar |
| `/fasilitas` | Informasi fasilitas |
| `/galeri` | Galeri properti |
| `/faq` | FAQ |
| `/kontak` | Kontak |
| `/login` | Login |
| `/daftar` | Registrasi tenant |
| `/verifikasi-email` | Status dan kirim ulang verifikasi |
| `/lupa-password` | Permintaan reset password |
| `/reset-password` | Pengaturan password baru |

### Tenant

| Route | Fungsi |
|---|---|
| `/tenant` | Ringkasan tenant |
| `/tenant/tagihan` | Daftar tagihan |
| `/tenant/tagihan/[id]` | Detail tagihan |
| `/tenant/tagihan/[id]/bayar` | Pemilihan metode pembayaran |
| `/tenant/pembayaran-selesai` | Rekonsiliasi hasil Midtrans |
| `/tenant/invoice` | Invoice tenant |
| `/tenant/keluhan` | Keluhan tenant |
| `/tenant/pengumuman` | Pengumuman tenant |
| `/tenant/profil` | Data diri tenant |

### Owner

| Route | Fungsi |
|---|---|
| `/owner` | Ringkasan owner |
| `/owner/kamar` | Manajemen kamar |
| `/owner/booking` | Manajemen booking |
| `/owner/tenant` | Manajemen tenant |
| `/owner/pembayaran` | Manajemen pembayaran |
| `/owner/invoice` | Invoice |
| `/owner/keluhan` | Keluhan |
| `/owner/pengumuman` | Pengumuman |
| `/owner/laporan` | Laporan dan export |
| `/owner/pengaturan` | Pengaturan properti |

## 14. Keamanan

Perlindungan yang diterapkan:

- Session cookie diverifikasi server-side.
- Role owner dan tenant diverifikasi pada server.
- Ownership data tenant diperiksa sebelum data diberikan.
- Mutation penting memerlukan same-origin request.
- Rate limiting tersedia pada endpoint sensitif.
- CSP dan security headers dikirim melalui Next.js.
- Input divalidasi menggunakan Zod.
- File upload menggunakan purpose dan folder restriction.
- Midtrans webhook memakai signature verification.
- Webhook dan email memakai idempotency.
- Error internal tidak menampilkan stack trace kepada pengguna.
- Secret tidak memakai prefix `NEXT_PUBLIC_`, kecuali nilai yang memang aman untuk browser.

## 15. Menjalankan Secara Lokal

```bash
npm install
npm run dev
```

Website lokal dapat dibuka melalui:

```text
http://localhost:3000
```

Salin `.env.example` menjadi `.env.local`, kemudian isi Firebase, Cloudinary, Resend, Midtrans, dan secret server.

### Perintah validasi

```bash
npm run lint
npm run typecheck
npm run test
npm run test:rules
npm run test:e2e
npm run build
```

### Seed data

```bash
npm run seed
```

### Membuat owner

Isi `OWNER_EMAIL`, `OWNER_PASSWORD`, dan `OWNER_FULL_NAME` pada environment lokal, kemudian jalankan:

```bash
npm run create-owner
```

Jangan menyimpan password owner atau service-account JSON ke Git.

## 16. Deployment

Project terhubung ke Vercel:

- Scope: `arifs-projects-226c3757`
- Project: `kosankuu`
- Domain: `https://kosankuu.vercel.app`

Environment variable production harus diatur melalui Vercel. Nilai berikut sangat penting:

- `NEXT_PUBLIC_APP_URL=https://kosankuu.vercel.app`
- Firebase client dan Firebase Admin.
- Cloudinary.
- Resend.
- Midtrans.
- `CRON_SECRET`.
- Session cookie configuration.

Setelah mengubah environment variable, lakukan redeploy agar nilai baru digunakan.

Firebase Authentication juga harus memasukkan `kosankuu.vercel.app` sebagai authorized domain.

Webhook Midtrans production diarahkan ke:

```text
https://kosankuu.vercel.app/api/payments/midtrans/notification
```

## 17. Batasan Saat Ini

- Vercel Hobby hanya mengizinkan cron sekali sehari. Endpoint expiry tetap tersedia, tetapi expiry lebih sering membutuhkan Vercel Pro atau scheduler eksternal.
- Transaksi Midtrans yang dibuat ketika callback masih memakai localhost tidak dapat diubah. Tenant harus membuat transaksi baru.
- Kecepatan email dan webhook bergantung pada layanan eksternal.
- Tampilan dan ketersediaan data production bergantung pada isi Firestore serta media Cloudinary.

## 18. Alur Singkat Sistem

```text
Pengunjung
   ↓
Pilih kamar dan jadwal
   ↓
Login / registrasi / verifikasi email
   ↓
Server menghitung harga dan mengunci jadwal
   ↓
Booking + invoice dibuat
   ↓
Tenant memilih metode pembayaran
   ├── Midtrans → webhook/Get Status → paid
   └── Transfer manual → verifikasi owner → paid
   ↓
Booking confirmed
   ↓
Invoice dan struk dikirim melalui email
```
