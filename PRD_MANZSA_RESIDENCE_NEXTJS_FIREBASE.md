# Product Requirements Document (PRD)

## Manzsa Residence

**Versi:** 1.1  
**Platform:** Web responsif  
**Tipe produk:** Sistem pengelolaan satu properti kos  
**Stack utama:** Next.js + React + TypeScript + Firebase + Firestore  
**Bahasa:** Indonesia  
**Mata uang:** Rupiah (IDR)  
**Zona waktu:** Asia/Jakarta

---

# 1. Ringkasan Produk

Manzsa Residence adalah aplikasi web untuk mengelola satu properti kos secara menyeluruh. Sistem digunakan oleh pemilik kos untuk mengatur kamar, calon penghuni, penghuni aktif, booking, pembayaran, invoice, keluhan, pengumuman, serta laporan operasional.

Website juga menyediakan halaman publik agar calon penghuni dapat melihat kamar, fasilitas, harga, ketersediaan, lokasi, dan melakukan booking.

Manzsa Residence bukan marketplace kos dan tidak menyediakan pendaftaran properti oleh pemilik lain.

## 1.1 Masalah yang Diselesaikan

Pemilik kos sering mengelola operasional melalui chat, catatan manual, spreadsheet, dan bukti transfer yang tersebar. Kondisi tersebut dapat menyebabkan:

- Jadwal booking bentrok.
- Status kamar tidak selalu jelas.
- Pembayaran sulit ditelusuri.
- Bukti transfer tercampur dengan chat lain.
- Invoice dibuat secara manual.
- Data penghuni tidak terpusat.
- Keluhan penghuni sulit dipantau.
- Laporan pendapatan memakan waktu.

Manzsa Residence memusatkan seluruh alur tersebut dalam satu sistem yang lebih tertib dan mudah dipantau.

## 1.2 Nilai Utama

- Status kamar selalu jelas.
- Booking diperiksa sebelum disimpan.
- Pembayaran dan invoice terhubung dengan transaksi.
- Data penghuni tersimpan rapi.
- Keluhan memiliki status dan riwayat.
- Pendapatan dan okupansi dapat dipantau dari dashboard.
- Calon penghuni dapat melihat kamar dan mengajukan booking tanpa bergantung pada chat manual.

---

# 2. Ruang Lingkup Produk

## 2.1 Termasuk dalam Produk

- Landing page publik.
- Katalog dan detail kamar.
- Registrasi dan login tenant.
- Booking per jam, hari, dan bulan.
- Pemeriksaan bentrok jadwal.
- Pembayaran Midtrans.
- Pembayaran transfer manual.
- Upload bukti pembayaran.
- Verifikasi pembayaran oleh owner.
- Invoice digital dan PDF.
- Dashboard owner.
- Dashboard tenant.
- Pengelolaan kamar.
- Pengelolaan booking.
- Pengelolaan penghuni.
- Pengelolaan pembayaran.
- Pengelolaan keluhan.
- Pengumuman penghuni.
- Laporan pendapatan, booking, okupansi, penghuni, dan pembayaran.
- Export PDF dan Excel.
- Pengaturan profil properti.

## 2.2 Tidak Termasuk dalam MVP

- Marketplace banyak kos.
- Pendaftaran pemilik properti secara publik.
- Banyak cabang atau banyak properti.
- Aplikasi Android/iOS native.
- Payroll pegawai.
- Pembukuan akuntansi lengkap.
- Integrasi smart lock.
- Dynamic pricing berbasis AI.
- Program afiliasi.
- Sistem rating publik.
- Chat real-time lengkap.

---

# 3. Sasaran Produk

## 3.1 Sasaran Utama

1. Membantu owner mengetahui kondisi kos dari satu dashboard.
2. Mengurangi bentrok booking.
3. Mempermudah pelacakan pembayaran dan tagihan.
4. Memusatkan data kamar dan penghuni.
5. Mempercepat pembuatan invoice dan laporan.
6. Memberi pengalaman booking yang jelas bagi calon penghuni.

## 3.2 Indikator Keberhasilan

- Tidak ada booking aktif yang saling bertabrakan untuk kamar yang sama.
- Semua pembayaran memiliki status dan riwayat perubahan.
- Semua penghuni aktif terhubung ke kamar atau booking aktif.
- Invoice dapat dibuat dan diunduh tanpa proses manual.
- Laporan bulanan dapat dihasilkan dari data sistem.
- Halaman publik dapat digunakan dengan baik di desktop dan perangkat mobile.

---

# 4. Pengguna dan Hak Akses

## 4.1 Public Visitor

Pengunjung yang belum login.

Dapat:

- Melihat landing page.
- Melihat katalog kamar.
- Mencari dan memfilter kamar.
- Melihat detail kamar.
- Melihat harga dan fasilitas.
- Melihat ketersediaan umum.
- Melihat galeri properti.
- Melihat lokasi dan kontak.
- Membaca FAQ.
- Registrasi dan login.
- Memulai booking lalu diarahkan untuk login bila diperlukan.

## 4.2 Tenant

Calon penghuni atau penghuni terdaftar.

Dapat:

- Login dan logout.
- Melengkapi profil.
- Mengelola foto profil.
- Melihat kamar.
- Membuat booking.
- Memilih durasi sewa.
- Melihat riwayat booking.
- Membatalkan booking sesuai aturan.
- Melihat tagihan.
- Membayar melalui Midtrans.
- Mengunggah bukti transfer manual.
- Melihat status pembayaran.
- Mengunduh invoice PDF.
- Melihat masa sewa aktif.
- Mengajukan keluhan.
- Melihat status keluhan.
- Membaca pengumuman.
- Melihat aktivitas akun.

## 4.3 Owner

Akun pengelola utama dibuat melalui script provisioning server menggunakan Firebase Admin SDK. Registrasi owner tidak tersedia pada halaman publik.

Dapat:

- Mengakses dashboard owner.
- Mengelola kamar.
- Mengelola fasilitas dan foto kamar.
- Mengubah status kamar.
- Mengatur harga sewa.
- Mengatur periode sewa yang tersedia.
- Mengelola booking.
- Menyetujui, menolak, atau membatalkan booking.
- Melihat data tenant.
- Mengelola status penghuni.
- Melihat dan memverifikasi pembayaran.
- Mengelola invoice.
- Menindaklanjuti keluhan.
- Membuat pengumuman.
- Melihat laporan.
- Export PDF dan Excel.
- Mengubah profil dan pengaturan properti.

---

# 5. Matriks Hak Akses

| Fitur | Public | Tenant | Owner |
|---|---:|---:|---:|
| Landing page | Ya | Ya | Ya |
| Katalog kamar | Ya | Ya | Ya |
| Detail kamar | Ya | Ya | Ya |
| Registrasi tenant | Ya | Tidak | Tidak |
| Booking kamar | Login diperlukan | Ya | Ya |
| Riwayat booking | Tidak | Milik sendiri | Semua |
| Pembayaran | Tidak | Milik sendiri | Semua |
| Verifikasi transfer | Tidak | Tidak | Ya |
| Invoice | Tidak | Milik sendiri | Semua |
| Keluhan | Tidak | Milik sendiri | Semua |
| Pengumuman | Tidak | Aktif | Kelola |
| Kelola kamar | Tidak | Tidak | Ya |
| Kelola tenant | Tidak | Profil sendiri | Ya |
| Dashboard bisnis | Tidak | Tidak | Ya |
| Laporan | Tidak | Tidak | Ya |
| Pengaturan properti | Tidak | Tidak | Ya |

---

# 6. Alur Utama Pengguna

## 6.1 Pengunjung Melihat Kamar

1. Pengunjung membuka landing page.
2. Sistem menampilkan kamar unggulan dan ketersediaan.
3. Pengunjung membuka katalog.
4. Pengunjung menggunakan filter harga, durasi, fasilitas, dan status.
5. Pengunjung membuka detail kamar.
6. Sistem menampilkan foto, fasilitas, harga, aturan, dan opsi booking.

## 6.2 Tenant Membuat Booking

1. Tenant memilih kamar.
2. Tenant memilih tipe sewa: jam, hari, atau bulan.
3. Tenant memilih tanggal dan waktu.
4. Sistem menghitung harga.
5. Sistem memeriksa bentrok jadwal.
6. Tenant melihat ringkasan.
7. Tenant mengirim booking.
8. Sistem membuat booking berstatus `pending_payment` atau `pending_approval` sesuai konfigurasi.
9. Sistem membuat invoice.
10. Tenant diarahkan ke pembayaran.

## 6.3 Pembayaran Midtrans

1. Tenant membuka invoice.
2. Tenant memilih pembayaran online.
3. Sistem membuat transaksi Midtrans.
4. Tenant menyelesaikan pembayaran.
5. Midtrans mengirim notification callback.
6. Sistem memverifikasi signature dan status.
7. Status pembayaran diperbarui.
8. Status booking diperbarui sesuai hasil pembayaran.
9. Aktivitas dicatat.

## 6.4 Transfer Manual

1. Tenant memilih transfer manual.
2. Sistem menampilkan rekening tujuan.
3. Tenant mengunggah bukti transfer.
4. Pembayaran berstatus `waiting_verification`.
5. Owner membuka detail pembayaran.
6. Owner menyetujui atau menolak.
7. Sistem memperbarui pembayaran, invoice, dan booking.

## 6.5 Keluhan Tenant

1. Tenant membuka menu Keluhan.
2. Tenant memilih kategori dan prioritas.
3. Tenant menulis deskripsi dan mengunggah gambar bila diperlukan.
4. Sistem membuat tiket berstatus `open`.
5. Owner memberi respons dan mengubah status.
6. Tenant melihat perkembangan.
7. Owner menandai tiket `resolved` atau `closed`.

---

# 7. Fitur Publik

## 7.1 Landing Page

### Tujuan

Mengenalkan properti, menunjukkan kamar, dan mengarahkan pengunjung ke detail kamar atau booking.

### Bagian Halaman

- Header dan navigasi.
- Hero dengan foto properti atau kamar terbaik.
- Ringkasan manfaat utama.
- Kamar tersedia.
- Fasilitas properti.
- Galeri.
- Cara booking.
- Lokasi.
- FAQ.
- Kontak.
- Footer.

### Aturan Desain

- Tidak memakai statistik palsu.
- Tidak memakai testimoni palsu.
- Tidak memakai badge dekoratif berlebihan.
- Tidak membuat banyak kartu tanpa fungsi.
- Fokus pada foto kamar, informasi, dan alur booking.

## 7.2 Katalog Kamar

### Fitur

- Pencarian nama atau nomor kamar.
- Filter status.
- Filter harga.
- Filter tipe sewa.
- Filter fasilitas.
- Sorting harga dan ketersediaan.
- Grid dan list view.
- Pagination atau load more.
- Empty state.
- Loading skeleton.
- Error state.

## 7.3 Detail Kamar

### Informasi

- Galeri foto.
- Nama dan nomor kamar.
- Deskripsi.
- Status.
- Kapasitas.
- Luas kamar bila tersedia.
- Fasilitas.
- Aturan.
- Harga jam, harian, dan bulanan.
- Deposit bila ada.
- Kalender ketersediaan.
- Ringkasan booking.
- Kamar terkait.

---

# 8. Autentikasi dan Akun

## 8.1 Registrasi Tenant

Field minimum:

- Nama lengkap.
- Email.
- Nomor WhatsApp.
- Password.
- Konfirmasi password.
- Persetujuan syarat dan kebijakan privasi.

Validasi:

- Email unik.
- Nomor telepon valid.
- Password minimum 8 karakter.
- Rate limiting.
- Pesan kesalahan tidak membocorkan data sensitif.

## 8.2 Login

- Email dan password melalui Firebase Authentication.
- Verifikasi email sebelum akun dapat melakukan booking atau pembayaran.
- Session cookie Firebase untuk akses server yang aman.
- Lupa password dan reset password menggunakan link yang dibuat Firebase Admin SDK lalu dikirim melalui Resend.
- Redirect berdasarkan custom claim role.
- Logout mencabut session cookie server.

## 8.3 Profil Tenant

- Nama.
- Email.
- Nomor telepon.
- Alamat.
- Kontak darurat.
- Foto profil.
- Nomor identitas opsional.
- Upload dokumen identitas opsional dan hanya dapat dilihat owner.

---

# 9. Dashboard Owner

## 9.1 Ringkasan Utama

- Pendapatan periode aktif.
- Total invoice dibayar.
- Total invoice tertunda.
- Tingkat okupansi.
- Kamar tersedia.
- Kamar terisi.
- Kamar maintenance.
- Booking baru.
- Pembayaran menunggu verifikasi.
- Keluhan terbuka.

## 9.2 Visualisasi

- Grafik pendapatan 6 atau 12 bulan.
- Donut okupansi.
- Tren booking.
- Distribusi status pembayaran.
- Kalender booking.
- Aktivitas terbaru.

## 9.3 Quick Actions

- Tambah kamar.
- Tambah booking manual.
- Verifikasi pembayaran.
- Buat pengumuman.
- Buka laporan.

---

# 10. Manajemen Kamar

## 10.1 Daftar Kamar

- Grid dan tabel.
- Pencarian.
- Filter status.
- Filter harga.
- Filter tipe.
- Sorting.
- Pagination.
- Bulk action terbatas.

## 10.2 Form Kamar

Field:

- Nomor kamar.
- Nama kamar.
- Slug.
- Tipe kamar.
- Deskripsi.
- Kapasitas.
- Luas kamar.
- Harga per jam.
- Harga per hari.
- Harga per bulan.
- Deposit.
- Fasilitas.
- Aturan.
- Status.
- Foto utama.
- Foto tambahan.
- Urutan gambar.
- Alt text.

## 10.3 Status Kamar

- `available`
- `reserved`
- `occupied`
- `maintenance`
- `inactive`

## 10.4 Aturan

- Kamar maintenance tidak dapat dibooking.
- Kamar inactive tidak muncul di katalog publik.
- Kamar occupied tidak dapat menerima booking yang bentrok.
- Penghapusan menggunakan soft delete atau archive.

---

# 11. Booking Engine

## 11.1 Jenis Booking

- Per jam.
- Per hari.
- Per bulan.

Owner dapat mengaktifkan atau menonaktifkan setiap jenis sewa per kamar.

## 11.2 Status Booking

- `draft`
- `pending_approval`
- `pending_payment`
- `confirmed`
- `active`
- `completed`
- `cancelled`
- `rejected`
- `expired`

## 11.3 Pemeriksaan Bentrok

Sistem harus menolak booking bila terdapat booking lain pada kamar yang sama dengan status yang memblokir waktu tersebut.

Status yang memblokir:

- `pending_payment` selama belum kedaluwarsa.
- `confirmed`.
- `active`.

Pemeriksaan dilakukan di server menggunakan transaksi Firestore dan dokumen availability lock deterministik agar dua request bersamaan tidak menghasilkan booking ganda.

## 11.4 Perhitungan Harga

Harga akhir dapat terdiri dari:

- Harga dasar.
- Durasi.
- Deposit.
- Biaya tambahan.
- Diskon manual owner.
- Total akhir.

Snapshot harga harus disimpan pada booking agar perubahan harga kamar tidak mengubah transaksi lama.

## 11.5 Kedaluwarsa Booking

- Booking belum dibayar memiliki batas waktu.
- Sistem memperbarui booking menjadi `expired` setelah batas waktu.
- Jadwal kembali tersedia.
- Proses dijalankan melalui cron atau scheduled job.

---

# 12. Pembayaran

## 12.1 Metode

- Midtrans Sandbox untuk development.
- Midtrans Production saat go-live.
- Transfer bank manual.

## 12.2 Status Pembayaran

- `pending`
- `waiting_verification`
- `paid`
- `failed`
- `expired`
- `cancelled`
- `refunded`
- `rejected`

## 12.3 Data Pembayaran

- Booking.
- Invoice.
- Tenant.
- Metode.
- Nominal.
- Status.
- Reference ID.
- Waktu pembayaran.
- Bukti transfer.
- Catatan verifikasi.
- Snapshot respons gateway yang aman.

## 12.4 Keamanan Midtrans

- Server key hanya berada di server.
- Client key boleh dikirim ke frontend sesuai kebutuhan Snap.
- Notification callback memverifikasi signature.
- Status akhir tidak boleh hanya mengandalkan data frontend.
- Semua callback harus idempotent.
- Endpoint notification harus menggunakan HTTPS di production.

---

# 13. Invoice

## 13.1 Isi Invoice

- Nomor invoice.
- Nama properti.
- Nama tenant.
- Detail kamar.
- Jenis sewa.
- Periode.
- Rincian biaya.
- Total.
- Metode pembayaran.
- Status.
- Tanggal dibuat.
- Tanggal dibayar.
- Informasi kontak.

## 13.2 Nomor Invoice

Format contoh:

`MR-202608-0001`

Nomor harus unik dan dibuat oleh server melalui transaksi Firestore pada dokumen counter.

## 13.3 PDF

- Dapat diunduh tenant.
- Dapat diunduh owner.
- Menggunakan data snapshot.
- Tidak bergantung pada data kamar terbaru.

---

# 14. Dashboard Tenant

## 14.1 Ringkasan

- Booking aktif.
- Masa sewa aktif.
- Tagihan belum dibayar.
- Pembayaran terakhir.
- Keluhan aktif.
- Pengumuman terbaru.

## 14.2 Modul

- Booking saya.
- Tagihan dan pembayaran.
- Invoice.
- Keluhan.
- Pengumuman.
- Aktivitas.
- Profil.

---

# 15. Manajemen Tenant

Owner dapat:

- Melihat daftar tenant.
- Mencari tenant.
- Melihat booking aktif.
- Melihat kamar dan periode sewa.
- Melihat pembayaran.
- Melihat keluhan.
- Menonaktifkan akun bila diperlukan.
- Menambahkan catatan internal.

Data sensitif tidak boleh tampil di halaman publik.

---

# 16. Keluhan

## 16.1 Field

- Judul.
- Kategori.
- Deskripsi.
- Prioritas.
- Foto lampiran.
- Kamar terkait.
- Status.
- Respons owner.
- Riwayat perubahan.

## 16.2 Kategori

- Fasilitas kamar.
- Air.
- Listrik.
- Kebersihan.
- Keamanan.
- Internet.
- Pembayaran.
- Lainnya.

## 16.3 Status

- `open`
- `in_progress`
- `waiting_tenant`
- `resolved`
- `closed`
- `rejected`

---

# 17. Pengumuman

Owner dapat membuat pengumuman untuk:

- Semua tenant.
- Kamar tertentu.
- Tenant tertentu.

Field:

- Judul.
- Isi.
- Target.
- Prioritas.
- Tanggal publikasi.
- Tanggal kedaluwarsa opsional.
- Status draft atau published.

---

# 18. Laporan

## 18.1 Jenis Laporan

- Pendapatan.
- Booking.
- Okupansi.
- Pembayaran.
- Penghuni.
- Kamar.

## 18.2 Filter

- Hari ini.
- Minggu ini.
- Bulan ini.
- Tahun ini.
- Rentang tanggal.
- Kamar.
- Status.
- Metode pembayaran.

## 18.3 Export

- PDF.
- Excel.

File export harus menggunakan filter yang sedang aktif.

---

# 19. Pengaturan Properti

Owner dapat mengatur:

- Nama properti.
- Logo.
- Deskripsi.
- Alamat.
- Koordinat peta.
- Nomor WhatsApp.
- Email.
- Jam operasional.
- Aturan kos.
- Rekening transfer manual.
- Durasi kedaluwarsa booking.
- Kebijakan pembatalan.
- Informasi invoice.
- SEO dasar.

---

# 20. Struktur Halaman

## 20.1 Public

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

## 20.2 Tenant

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

## 20.3 Owner

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

---

# 21. Stack Teknis

## 21.1 Frontend

- Next.js App Router.
- React.
- TypeScript strict mode.
- Server Components untuk halaman publik dan data yang aman dirender di server.
- Client Components hanya untuk interaksi browser, form interaktif, kalender, dan komponen real-time.
- Tailwind CSS dan CSS variables untuk design token.
- Komponen custom; tampilan default library tidak digunakan secara mentah.
- React Hook Form dan Zod untuk form serta validasi.
- Recharts untuk grafik.
- Mobile-first dan responsif.

## 21.2 Backend dan Autentikasi

- Firebase Authentication untuk registrasi, login, verifikasi email, dan identitas pengguna.
- Firebase Admin SDK hanya berjalan di server.
- Next.js Route Handlers dan Server Actions menjadi lapisan backend untuk operasi sensitif.
- Firebase session cookie digunakan untuk autentikasi request server.
- Role `owner` dan `tenant` disimpan sebagai Firebase custom claims; dokumen profil Firestore bukan satu-satunya sumber otorisasi.
- Owner dibuat melalui script provisioning internal menggunakan Firebase Admin SDK.
- Tidak ada credential service account di client bundle.

## 21.3 Database

- Cloud Firestore sebagai database utama.
- Semua timestamp menggunakan Firestore server timestamp.
- Relasi disimpan sebagai ID dan snapshot terdenormalisasi bila diperlukan.
- Data historis seperti booking, pembayaran, dan invoice menyimpan snapshot agar tidak berubah ketika data kamar atau profil diperbarui.
- Query yang membutuhkan kombinasi filter wajib memiliki composite index di `firestore.indexes.json`.
- Pagination menggunakan document cursor, bukan offset.
- Operasi kritis memakai transaksi Firestore.

### Pencegahan Double Booking

Firestore tidak menggunakan constraint relasional. Karena itu, pencegahan bentrok tidak hanya mengandalkan query daftar booking.

Sistem menggunakan dokumen availability lock deterministik per kamar dan tanggal, misalnya:

`roomAvailabilityLocks/{roomId_YYYY-MM-DD}`

Setiap dokumen menyimpan interval yang telah dipesan pada tanggal tersebut. Pembuatan booking harus:

1. Menormalisasi rentang booking menjadi daftar tanggal dan interval.
2. Membaca seluruh lock terkait di dalam transaksi Firestore.
3. Menolak transaksi bila ada interval bertabrakan.
4. Menulis atau memperbarui lock dan booking dalam transaksi yang sama.
5. Menghapus interval lock ketika booking dibatalkan, ditolak, atau kedaluwarsa.

Booking per bulan dibatasi sesuai aturan produk agar jumlah dokumen dalam satu transaksi tetap aman.

## 21.4 Penyimpanan Media

- Cloudinary menjadi satu-satunya media storage aplikasi.
- Firebase Storage tidak digunakan.
- Upload kamar, avatar, identitas opsional, bukti transfer, dan lampiran keluhan menggunakan signed upload.
- Signature dibuat oleh Route Handler server setelah autentikasi dan pemeriksaan role.
- Metadata aset disimpan di Firestore: `publicId`, `secureUrl`, `resourceType`, `width`, `height`, `bytes`, `format`, `altText`, dan `sortOrder`.
- Penghapusan atau penggantian aset dilakukan melalui server menggunakan Cloudinary API secret.
- Folder direkomendasikan:
  - `manzsa-residence/rooms/{roomId}`
  - `manzsa-residence/users/{uid}/avatar`
  - `manzsa-residence/users/{uid}/identity`
  - `manzsa-residence/payments/{paymentId}`
  - `manzsa-residence/complaints/{complaintId}`

## 21.5 Email Transaksional

- Resend digunakan untuk seluruh email aplikasi.
- Email dikirim melalui fungsi server; API key tidak pernah berada di client.
- Template email menggunakan React Email atau HTML server-side yang konsisten dengan identitas Manzsa Residence.
- Email utama:
  - Verifikasi akun.
  - Reset password.
  - Konfirmasi booking.
  - Booking disetujui, ditolak, dibatalkan, atau kedaluwarsa.
  - Pembayaran diterima, gagal, atau menunggu verifikasi.
  - Invoice diterbitkan.
  - Keluhan diperbarui.
  - Pengumuman penting.
- Keberhasilan pengiriman email tidak menjadi sumber kebenaran status booking atau pembayaran.
- Status transaksi hanya berubah berdasarkan proses server dan webhook Midtrans yang valid.
- Pengiriman email dicatat untuk idempotensi dan audit.

## 21.6 Integrasi

- Midtrans Snap untuk pembayaran online.
- Resend untuk email transaksional.
- Cloudinary untuk semua media.
- Peta melalui embed atau provider yang disetujui.
- PDF melalui library server-side.
- Excel melalui ExcelJS.

## 21.7 Deployment

- Next.js dan Route Handlers: Vercel.
- Firebase Authentication dan Cloud Firestore: Firebase.
- Media: Cloudinary.
- Email: Resend.
- Scheduled job: Vercel Cron menuju Route Handler yang dilindungi `CRON_SECRET`.
- Domain custom menggunakan DNS production.
- Firebase Emulator Suite digunakan untuk development dan testing lokal bila memungkinkan.
- Firestore Rules dan indexes harus dideploy bersama release production.

---

# 22. Model Data Firestore

## 22.1 Prinsip Umum

- Semua nama collection menggunakan bentuk jamak.
- ID dokumen memakai auto-ID kecuali dokumen singleton dan lock deterministik.
- Semua field waktu memakai Firestore `Timestamp`.
- Semua nominal disimpan sebagai integer Rupiah, bukan floating point.
- Dokumen finansial menyimpan snapshot nama tenant, kamar, periode, dan rincian harga.
- Field sensitif tidak boleh disalin ke dokumen publik.
- Collection public dan private dipisahkan melalui Security Rules dan struktur data.

## 22.2 `users/{uid}`

- `email`
- `role`: `owner | tenant`
- `isActive`
- `emailVerified`
- `fullName`
- `phone`
- `address`
- `emergencyContactName`
- `emergencyContactPhone`
- `identityNumberMasked`
- `identityDocument`: object Cloudinary opsional
- `avatar`: object Cloudinary opsional
- `internalNotes`: owner-only
- `createdAt`
- `updatedAt`

Firebase Authentication tetap menjadi sumber identitas. Field role harus cocok dengan custom claims.

## 22.3 `propertySettings/main`

- `name`
- `slug`
- `description`
- `address`
- `latitude`
- `longitude`
- `phone`
- `email`
- `logo`: object Cloudinary
- `bookingExpiryMinutes`
- `cancellationPolicy`
- `houseRules`
- `manualTransferAccounts`
- `invoiceSettings`
- `seo`
- `createdAt`
- `updatedAt`

Karena hanya satu properti, dokumen menggunakan ID tetap `main`.

## 22.4 `rooms/{roomId}`

- `roomNumber`
- `name`
- `slug`
- `type`
- `description`
- `capacity`
- `sizeM2`
- `hourlyPrice`
- `dailyPrice`
- `monthlyPrice`
- `depositAmount`
- `allowHourly`
- `allowDaily`
- `allowMonthly`
- `status`: `available | reserved | occupied | maintenance | inactive`
- `facilityIds`
- `coverImage`: object Cloudinary
- `imageCount`
- `isFeatured`
- `isPublic`
- `createdAt`
- `updatedAt`
- `archivedAt`

## 22.5 `rooms/{roomId}/images/{imageId}`

- `publicId`
- `secureUrl`
- `format`
- `width`
- `height`
- `bytes`
- `altText`
- `sortOrder`
- `isCover`
- `createdAt`

## 22.6 `facilities/{facilityId}`

- `name`
- `icon`
- `category`
- `isActive`
- `sortOrder`
- `createdAt`
- `updatedAt`

## 22.7 `bookings/{bookingId}`

- `bookingCode`
- `roomId`
- `tenantId`
- `rentalType`: `hourly | daily | monthly`
- `startAt`
- `endAt`
- `quantity`
- `baseAmount`
- `depositAmount`
- `additionalAmount`
- `discountAmount`
- `totalAmount`
- `status`
- `expiresAt`
- `approvedAt`
- `rejectedAt`
- `cancelledAt`
- `notes`
- `roomSnapshot`
- `tenantSnapshot`
- `pricingSnapshot`
- `lockDocumentIds`
- `createdAt`
- `updatedAt`

## 22.8 `roomAvailabilityLocks/{lockId}`

ID format:

`{roomId}_{YYYY-MM-DD}`

Field:

- `roomId`
- `dateKey`
- `intervals`: array object berisi `bookingId`, `startAt`, `endAt`, dan `status`
- `updatedAt`

Dokumen ini hanya boleh ditulis oleh backend melalui Firebase Admin SDK.

## 22.9 `invoices/{invoiceId}`

- `invoiceNumber`
- `bookingId`
- `tenantId`
- `subtotal`
- `depositAmount`
- `additionalAmount`
- `discountAmount`
- `totalAmount`
- `status`
- `issuedAt`
- `dueAt`
- `paidAt`
- `snapshot`
- `pdfSnapshotVersion`
- `createdAt`
- `updatedAt`

## 22.10 `payments/{paymentId}`

- `bookingId`
- `invoiceId`
- `tenantId`
- `method`
- `provider`
- `providerOrderId`
- `providerTransactionId`
- `amount`
- `status`
- `proof`: object Cloudinary opsional
- `paidAt`
- `verifiedAt`
- `verifiedBy`
- `rejectionReason`
- `safeProviderSnapshot`
- `createdAt`
- `updatedAt`

## 22.11 `webhookEvents/{eventId}`

- `provider`
- `eventKey`
- `orderId`
- `signatureValid`
- `processingStatus`
- `receivedAt`
- `processedAt`
- `errorMessage`

Collection ini mencegah callback Midtrans diproses berulang.

## 22.12 `complaints/{complaintId}`

- `tenantId`
- `roomId`
- `title`
- `category`
- `description`
- `priority`
- `status`
- `ownerResponse`
- `attachments`: array metadata Cloudinary terbatas
- `resolvedAt`
- `closedAt`
- `createdAt`
- `updatedAt`

## 22.13 `complaints/{complaintId}/histories/{historyId}`

- `actorId`
- `previousStatus`
- `newStatus`
- `message`
- `createdAt`

## 22.14 `announcements/{announcementId}`

- `title`
- `content`
- `audienceType`
- `targetRoomId`
- `targetUserId`
- `priority`
- `status`
- `publishedAt`
- `expiresAt`
- `createdBy`
- `createdAt`
- `updatedAt`

## 22.15 `activities/{activityId}`

- `actorId`
- `subjectType`
- `subjectId`
- `action`
- `description`
- `metadata`
- `createdAt`

## 22.16 `notifications/{notificationId}`

- `userId`
- `type`
- `title`
- `message`
- `link`
- `readAt`
- `createdAt`

## 22.17 `emailLogs/{emailLogId}`

- `idempotencyKey`
- `resendEmailId`
- `template`
- `recipientMasked`
- `subject`
- `status`
- `relatedType`
- `relatedId`
- `sentAt`
- `failedAt`
- `errorMessage`
- `createdAt`

## 22.18 `counters/{counterId}`

Digunakan untuk nomor invoice, booking code, atau nomor urut lain.

- `currentValue`
- `prefix`
- `periodKey`
- `updatedAt`

Perubahan nilai dilakukan melalui transaksi Firestore.

## 22.19 Composite Index Minimum

Indeks minimum yang diperkirakan:

- `rooms`: `isPublic + status + isFeatured`
- `rooms`: `isPublic + allowMonthly + monthlyPrice`
- `bookings`: `roomId + status + startAt`
- `bookings`: `tenantId + createdAt desc`
- `bookings`: `status + expiresAt`
- `payments`: `tenantId + createdAt desc`
- `payments`: `status + createdAt desc`
- `invoices`: `tenantId + issuedAt desc`
- `complaints`: `tenantId + createdAt desc`
- `complaints`: `status + priority + createdAt desc`
- `announcements`: `status + publishedAt desc`
- `notifications`: `userId + createdAt desc`

Daftar final mengikuti query nyata dan disimpan di `firestore.indexes.json`.

---

# 23. API, Server Actions, dan Firebase Services

Semua operasi sensitif dilakukan melalui Next.js Route Handlers atau Server Actions menggunakan Firebase Admin SDK.

## 23.1 Public

- Ambil pengaturan publik.
- Ambil katalog kamar publik.
- Ambil detail kamar.
- Ambil fasilitas.
- Ambil ringkasan ketersediaan kamar.

Public read dapat menggunakan Firebase server SDK dan caching Next.js yang aman.

## 23.2 Auth

- Registrasi tenant melalui Firebase Authentication.
- Buat atau refresh Firebase session cookie.
- Logout dan pencabutan session.
- Kirim link verifikasi email melalui Firebase Admin SDK + Resend.
- Kirim link reset password melalui Firebase Admin SDK + Resend.
- Ambil sesi dan role.
- Provision owner melalui script server internal.

## 23.3 Tenant

- Ambil dashboard tenant.
- Buat booking melalui transaksi Firestore dan availability lock.
- Batalkan booking sesuai aturan.
- Ambil invoice.
- Buat transaksi Midtrans.
- Meminta signature upload Cloudinary untuk bukti transfer atau lampiran.
- Simpan metadata hasil upload setelah verifikasi.
- Buat keluhan.
- Ambil pengumuman.
- Update profil.

## 23.4 Owner

- Ambil dashboard owner.
- CRUD kamar dan fasilitas.
- Membuat signature Cloudinary untuk media kamar.
- Menghapus aset Cloudinary secara aman.
- Kelola booking.
- Kelola tenant.
- Verifikasi pembayaran transfer manual.
- Kelola keluhan.
- CRUD pengumuman.
- Ambil laporan.
- Export PDF dan Excel.
- Update pengaturan properti.

## 23.5 Integrasi Server

- `/api/midtrans/create-transaction`
- `/api/midtrans/notification`
- `/api/cloudinary/sign`
- `/api/cloudinary/delete`
- `/api/email/send` hanya untuk pemanggilan internal terotorisasi bila diperlukan
- `/api/cron/expire-bookings`
- `/api/health`

## 23.6 Aturan Implementasi

- Semua payload divalidasi dengan Zod.
- Semua request server memverifikasi Firebase session cookie.
- Semua endpoint owner memverifikasi custom claim `owner`.
- Tenant hanya dapat mengakses resource miliknya.
- Pembayaran, invoice, booking, availability lock, webhook event, dan counter tidak boleh ditulis langsung oleh client.
- Cloudinary signature dibatasi folder, jenis resource, ukuran, dan konteks pengguna.
- Email dikirim setelah transaksi utama berhasil; kegagalan email tidak boleh membatalkan transaksi bisnis.
- Endpoint Midtrans harus idempotent.
- Error response konsisten dan tidak membocorkan credential atau detail internal.

---

# 24. Aturan Bisnis Penting

1. Owner tidak dapat didaftarkan dari halaman publik.
2. Tenant hanya dapat melihat datanya sendiri.
3. Booking tidak dapat dibuat pada kamar maintenance atau inactive.
4. Booking yang bentrok harus ditolak oleh server.
5. Nominal booking lama tidak berubah ketika harga kamar diubah.
6. Status pembayaran final hanya ditetapkan oleh server.
7. Callback Midtrans harus idempotent.
8. Transfer manual baru dianggap lunas setelah diverifikasi owner.
9. Invoice yang sudah diterbitkan memakai snapshot.
10. Penghapusan data utama menggunakan archive atau soft delete.
11. File upload harus divalidasi tipe dan ukurannya.
12. Semua perubahan penting dicatat pada activity log.

---

# 25. Desain UI/UX

## 25.1 Arah Visual

Gaya utama:

- Premium.
- Hangat.
- Editorial.
- Terpercaya.
- Tidak terasa seperti template SaaS generik.

Palet:

- Forest green sebagai warna utama.
- Warm off-white sebagai latar.
- Putih untuk permukaan utama.
- Beige lembut untuk pemisah.
- Aksen emas tipis bila diperlukan.

Tipografi:

- Cormorant Garamond untuk heading editorial.
- Inter untuk body, form, tabel, dan navigasi.

## 25.2 Aturan Anti-AI-Slop

Hindari:

- Badge dekoratif berlebihan.
- Pill kecil di setiap bagian.
- Gradient blob.
- Glow neon.
- Kumpulan kartu mengambang tanpa tujuan.
- Statistik palsu.
- Testimoni palsu.
- Ikon generik berlebihan.
- Glassmorphism berlebihan.
- Layout landing page template yang terlalu simetris.
- Radius yang terlalu besar pada semua elemen.

Prioritaskan:

- Foto kamar asli.
- Hierarki tipografi kuat.
- Ruang kosong yang terkontrol.
- Komponen yang fungsional.
- Informasi jelas.
- Interaksi yang terasa natural.

## 25.3 Responsif

- Mobile-first.
- Bottom navigation untuk area tenant bila sesuai.
- Sidebar collapsible untuk owner.
- Tabel berubah menjadi cards pada layar kecil.
- Form panjang dibagi menjadi section.
- Kalender tetap dapat digunakan pada mobile.

---

# 26. State UI Wajib

Setiap halaman data harus memiliki:

- Loading state.
- Empty state.
- Error state.
- Success feedback.
- Disabled state.
- Validation feedback.
- Confirmation dialog untuk aksi berisiko.

Tidak boleh ada halaman kosong tanpa penjelasan.

---

# 27. Keamanan

## 27.1 Firebase Authentication

- Email/password melalui Firebase Authentication.
- Verifikasi email diwajibkan untuk aksi sensitif.
- Server menggunakan Firebase session cookie dengan atribut `httpOnly`, `secure` di production, dan `sameSite` yang sesuai.
- Role owner/tenant berasal dari Firebase custom claims.
- Perubahan custom claims hanya melalui Firebase Admin SDK.
- Owner tidak dapat dibuat dari registrasi publik.
- Session dapat dicabut saat akun dinonaktifkan.

## 27.2 Firestore Security Rules

- Default deny untuk seluruh collection.
- Public hanya dapat membaca field kamar dan pengaturan yang memang ditujukan untuk publik.
- Tenant hanya dapat membaca profil, booking, invoice, pembayaran, keluhan, dan notifikasinya sendiri.
- Owner dapat membaca data operasional melalui custom claim `owner`.
- Operasi finansial dan booking kritis hanya melalui backend Admin SDK.
- Client tidak boleh menulis langsung ke:
  - `payments`
  - `invoices`
  - `roomAvailabilityLocks`
  - `webhookEvents`
  - `counters`
  - `emailLogs`
- Rules diuji memakai Firebase Emulator Suite.

## 27.3 Validasi dan Proteksi Server

- TypeScript strict.
- Validasi Zod di semua batas server.
- Sanitasi input rich text.
- Server-side ownership checks.
- Rate limiting untuk login, registrasi, reset, booking, upload signature, dan endpoint publik sensitif.
- CSRF protection sesuai pola session cookie Next.js.
- Secret hanya berada di environment server.
- Tidak ada service-account credential di client bundle.
- Firebase App Check dapat diaktifkan sebagai lapisan tambahan sebelum production.

## 27.4 Cloudinary

- Signed upload; unsigned preset publik tidak digunakan untuk aset sensitif.
- Signature hanya dibuat setelah autentikasi dan authorization.
- MIME type, ekstensi, ukuran, dimensi, dan resource type divalidasi.
- Folder upload dibatasi per resource dan user.
- Penghapusan aset hanya melalui server.
- Dokumen identitas dan bukti transfer tidak ditampilkan melalui transformasi publik yang mudah ditebak.
- Metadata sensitif tidak dimasukkan ke filename atau public ID.

## 27.5 Midtrans dan Resend

- Midtrans server key hanya di server.
- Webhook memverifikasi signature dan diproses secara idempotent.
- Status pembayaran final tidak pernah ditentukan oleh frontend atau email.
- Resend API key hanya di server.
- Alamat pengirim menggunakan domain yang telah diverifikasi.
- Data penerima pada log dimasking.
- Link email sensitif memiliki masa berlaku dari Firebase.

## 27.6 Audit

- Perubahan penting dicatat pada activity log.
- Event webhook dicatat tanpa menyimpan data rahasia berlebihan.
- Upload, penghapusan aset, perubahan role, verifikasi pembayaran, dan pembatalan booking diaudit.

---

# 28. SEO dan Performa

## 28.1 SEO

- Metadata per halaman.
- Open Graph.
- Twitter Card.
- Canonical URL.
- Sitemap.
- Robots.txt.
- Structured data properti atau lodging bila sesuai.
- Alt text gambar.
- Slug kamar yang bersih.

## 28.2 Performa

- Next Image.
- AVIF dan WebP.
- Responsive image sizes.
- Lazy load untuk gambar non-prioritas.
- Optimasi font.
- Server rendering untuk halaman publik.
- Pagination pada data besar.
- Query Firestore menggunakan composite index yang terdokumentasi.
- Cache data publik yang aman.
- Hindari bundle JavaScript berlebihan.

---

# 29. Notifikasi dan Email

## 29.1 Notifikasi Dalam Aplikasi

MVP minimum:

- Booking dibuat.
- Booking disetujui, ditolak, dibatalkan, atau kedaluwarsa.
- Pembayaran berhasil, gagal, atau menunggu verifikasi.
- Invoice diterbitkan.
- Keluhan diperbarui.
- Pengumuman baru.

Notifikasi disimpan di collection `notifications` dan hanya dapat dibaca pemiliknya.

## 29.2 Email melalui Resend

Resend digunakan untuk:

- Verifikasi email.
- Reset password.
- Konfirmasi booking.
- Perubahan status booking.
- Konfirmasi pembayaran.
- Bukti transfer diterima atau ditolak.
- Invoice diterbitkan.
- Keluhan diperbarui.
- Pengumuman prioritas tinggi.

Aturan:

- Email dikirim oleh server setelah perubahan data utama berhasil.
- Setiap email penting menggunakan idempotency key.
- Hasil pengiriman disimpan di `emailLogs`.
- Email gagal dapat dicoba ulang tanpa mengubah status transaksi bisnis.
- Template email responsif, berbahasa Indonesia, dan konsisten dengan brand.
- Domain pengirim harus diverifikasi di Resend sebelum production.

## 29.3 Setelah MVP

- WhatsApp notification melalui provider resmi.
- Reminder tagihan otomatis.
- Reminder masa sewa.
- Digest pengumuman.

---

# 30. Pengujian

## 30.1 Unit Test

- Kalkulasi harga.
- Pemeriksaan bentrok.
- Mapping status pembayaran.
- Generator nomor invoice.
- Permission checks.

## 30.2 Integration Test

- Registrasi dan login.
- Booking berhasil.
- Booking bentrok ditolak.
- Midtrans notification.
- Verifikasi transfer manual.
- Invoice dibuat.
- Keluhan dibuat dan diselesaikan.

## 30.3 End-to-End Test

- Pengunjung melihat dan booking kamar.
- Tenant membayar.
- Owner memverifikasi.
- Tenant mengunduh invoice.
- Owner mengekspor laporan.

## 30.4 Browser

- Chrome.
- Edge.
- Firefox.
- Safari mobile bila tersedia.

---

# 31. Acceptance Criteria MVP

MVP dianggap selesai ketika:

1. Halaman publik responsif dan dapat diakses.
2. Pengunjung dapat melihat kamar dan detailnya.
3. Tenant dapat registrasi dan login.
4. Tenant dapat membuat booking.
5. Sistem menolak booking bentrok.
6. Owner dapat mengelola kamar.
7. Owner dapat melihat dan mengubah status booking.
8. Midtrans Sandbox dapat digunakan.
9. Transfer manual dapat diunggah dan diverifikasi.
10. Invoice dapat diunduh sebagai PDF.
11. Tenant dapat membuat keluhan.
12. Owner dapat menindaklanjuti keluhan.
13. Owner dapat membuat pengumuman.
14. Dashboard owner menampilkan data nyata.
15. Laporan dapat difilter dan diekspor.
16. Role dan ownership terlindungi.
17. Tidak ada secret di frontend.
18. Tidak ada error kritis di console atau server log.
19. Tampilan mobile dapat digunakan dengan baik.
20. Production build berhasil.
21. Firestore Security Rules dan composite indexes tervalidasi.
22. Media kamar, avatar, bukti transfer, dan lampiran tersimpan melalui signed upload Cloudinary.
23. Email transaksi utama berhasil dikirim melalui Resend tanpa menjadi sumber kebenaran status bisnis.
24. Tidak ada Firebase Admin, Cloudinary secret, Midtrans server key, atau Resend API key di client bundle.

---

# 32. Tahapan Implementasi

## Milestone 1 — Foundation

- Inisialisasi Next.js App Router dan TypeScript strict.
- Setup Tailwind dan design token.
- Setup Firebase client SDK dan Firebase Admin SDK.
- Setup Firestore Emulator, Security Rules, dan indexes.
- Setup Cloudinary signed upload.
- Setup Resend dan template email dasar.
- Environment validation.
- Layout publik, owner, dan tenant.
- Health check.

## Milestone 2 — Authentication

- Registrasi tenant dengan Firebase Authentication.
- Login, logout, dan Firebase session cookie.
- Verifikasi email melalui link Firebase yang dikirim Resend.
- Reset password melalui link Firebase yang dikirim Resend.
- Custom claims dan role guard.
- Profil tenant di Firestore.
- Script provisioning owner melalui Firebase Admin SDK.
- Test Security Rules untuk profil dan sesi.

## Milestone 3 — Landing dan Katalog

- Landing page.
- Katalog kamar dari Firestore.
- Filter, sorting, pagination cursor, dan composite indexes.
- Detail kamar.
- Galeri dari Cloudinary.
- FAQ dan kontak.
- SEO dan caching public read.

## Milestone 4 — Owner Dashboard

- Ringkasan bisnis dari agregasi Firestore.
- Grafik.
- Kalender.
- Aktivitas.
- Quick actions.
- Query/index review.

## Milestone 5 — Manajemen Kamar

- CRUD kamar.
- Signed multi-image upload ke Cloudinary.
- Reorder, cover image, alt text, dan delete asset.
- Fasilitas.
- Harga.
- Status.
- Archive.

## Milestone 6 — Booking Engine

- Booking jam, hari, dan bulan.
- Firestore transaction.
- Availability lock per kamar dan tanggal.
- Pemeriksaan bentrok yang aman terhadap request bersamaan.
- Kalkulasi dan pricing snapshot.
- Status booking.
- Kedaluwarsa booking melalui Vercel Cron.
- Email perubahan status melalui Resend.

## Milestone 7 — Tenant Dashboard

- Ringkasan tenant.
- Booking saya.
- Masa sewa.
- Aktivitas dan notifikasi.
- Profil dan avatar Cloudinary.

## Milestone 8 — Pembayaran dan Invoice

- Midtrans Sandbox.
- Webhook signature dan idempotency.
- Transfer manual.
- Bukti transfer di Cloudinary.
- Verifikasi owner.
- Invoice PDF dari snapshot Firestore.
- Email pembayaran dan invoice melalui Resend.

## Milestone 9 — Keluhan dan Pengumuman

- Tiket keluhan.
- Status dan riwayat.
- Lampiran Cloudinary.
- Pengumuman bertarget.
- Notifikasi dalam aplikasi.
- Email Resend untuk perubahan penting.

## Milestone 10 — Laporan dan Production Readiness

- Laporan dari Firestore.
- Export PDF dan Excel.
- SEO.
- Security review.
- Firestore Rules test dan index audit.
- Cloudinary upload/delete security review.
- Resend domain dan deliverability checklist.
- Midtrans production checklist.
- Performance review.
- Production build.
- Vercel deployment guide.
- Firebase production checklist.

---

# 33. Environment Variables

Contoh kategori environment:

```env
NEXT_PUBLIC_APP_NAME="Manzsa Residence"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_TIMEZONE="Asia/Jakarta"

# Firebase Client — identifier publik, tetap lindungi data dengan Security Rules
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""
NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY=""

# Firebase Admin — server only
FIREBASE_PROJECT_ID=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_ROOT_FOLDER="manzsa-residence"

# Midtrans
MIDTRANS_IS_PRODUCTION="false"
MIDTRANS_SERVER_KEY=""
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=""
MIDTRANS_MERCHANT_ID=""
MIDTRANS_NOTIFICATION_URL=""
MIDTRANS_FINISH_URL=""
MIDTRANS_UNFINISH_URL=""
MIDTRANS_ERROR_URL=""

# Resend
RESEND_API_KEY=""
RESEND_FROM_EMAIL="Manzsa Residence <noreply@domainanda.com>"
RESEND_REPLY_TO=""

# Internal jobs and security
CRON_SECRET=""
SESSION_COOKIE_NAME="manzsa_session"
```

Aturan:

- `FIREBASE_PRIVATE_KEY`, Cloudinary secret, Midtrans server key, Resend key, dan `CRON_SECRET` tidak boleh memakai prefix `NEXT_PUBLIC_`.
- Nilai `FIREBASE_PRIVATE_KEY` pada Vercel harus menangani escaped newline dengan benar.
- Firebase client config bukan pengganti Security Rules.
- File `.env.local` tidak boleh di-commit.
- Gunakan environment terpisah untuk development, preview, dan production.

---

# 34. Definition of Done

Sebuah fitur dianggap selesai bila:

- Sesuai kebutuhan PRD.
- Memiliki validasi client dan server.
- Memiliki authorization.
- Memiliki loading, empty, dan error state.
- Responsif.
- Tidak menghasilkan console error.
- Memiliki test sesuai tingkat risiko.
- Tidak membocorkan data sensitif.
- Dokumentasi diperbarui.
- Production build lulus.

---

# 35. Asumsi yang Digunakan

PRD ini menggunakan asumsi berikut:

- Nama produk tetap Manzsa Residence.
- Hanya satu properti kos dan bukan marketplace.
- Role utama owner dan tenant.
- Sewa dapat dilakukan per jam, hari, dan bulan.
- Pembayaran melalui Midtrans dan transfer manual.
- Frontend dan server orchestration menggunakan Next.js App Router.
- Autentikasi menggunakan Firebase Authentication.
- Database menggunakan Cloud Firestore.
- Operasi sensitif menggunakan Firebase Admin SDK di server.
- Seluruh media disimpan di Cloudinary; Firebase Storage tidak digunakan.
- Seluruh email transaksional dikirim melalui Resend.
- Deployment aplikasi menggunakan Vercel.
- Scheduled expiry menggunakan Vercel Cron yang memanggil endpoint server terlindungi.
- Desain memakai forest green, warm off-white, Cormorant Garamond, dan Inter.
- Bahasa Indonesia, mata uang Rupiah, dan zona waktu Asia/Jakarta.

Asumsi dapat diubah sebelum implementasi tanpa mengubah tujuan utama produk.
