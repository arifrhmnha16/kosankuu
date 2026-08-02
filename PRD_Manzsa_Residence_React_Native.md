# Product Requirements Document (PRD)

## Manzsa Residence

**Versi:** 1.0  
**Jenis produk:** Aplikasi manajemen satu kos milik sendiri  
**Platform:** Android, iOS-ready, dan Web/PWA  
**Status:** Siap dijadikan acuan desain dan pengembangan  

---

## 1. Ringkasan Produk

Manzsa Residence adalah aplikasi untuk membantu pemilik mengelola **satu usaha kos milik sendiri**, bukan marketplace yang mempertemukan banyak pemilik kos dengan pencari kos.

Aplikasi menghubungkan dua pengguna utama:

1. **Owner**, yang mengelola kamar, penghuni, booking, tagihan, pembayaran, keluhan, pengumuman, dan laporan.
2. **Tenant**, yang melihat status sewa, tagihan, jatuh tempo, riwayat pembayaran, pengumuman, dan mengirim keluhan.

Aplikasi juga memiliki halaman publik sederhana agar calon penghuni dapat melihat informasi kos dan kamar yang tersedia tanpa menjadikannya marketplace multi-mitra.

---

## 2. Masalah yang Diselesaikan

Pengelolaan kos sering tersebar di banyak tempat:

- Data kamar dicatat di buku atau spreadsheet.
- Status kamar tidak selalu diperbarui.
- Pembayaran dikonfirmasi melalui chat pribadi.
- Bukti transfer mudah tenggelam di WhatsApp.
- Pemilik sulit mengetahui siapa yang belum membayar.
- Penghuni harus bertanya untuk mengetahui tagihan dan jatuh tempo.
- Keluhan kamar tidak memiliki riwayat penyelesaian yang jelas.
- Laporan pendapatan harus dihitung ulang secara manual.

Manzsa Residence menyatukan proses tersebut dalam satu sistem.

---

## 3. Visi Produk

Menjadi pusat operasional digital untuk satu usaha kos, sehingga pemilik dapat mengetahui kondisi bisnisnya dalam hitungan detik dan penghuni dapat mengurus kebutuhan sewanya tanpa percakapan berulang.

---

## 4. Tujuan Produk

### 4.1 Tujuan Utama

- Memusatkan seluruh data kos dalam satu aplikasi.
- Mempermudah pemilik memantau kamar, penghuni, tagihan, dan pembayaran.
- Mempermudah penghuni mengetahui kewajiban pembayaran.
- Mengurangi pencatatan manual dan kesalahan administrasi.
- Menyediakan laporan pendapatan dan okupansi yang mudah dipahami.

### 4.2 Sasaran Keberhasilan

- Seluruh kamar dan penghuni aktif tercatat di sistem.
- Pemilik dapat menemukan pembayaran tertunggak kurang dari 10 detik.
- Penghuni dapat melihat tagihan dan status pembayaran tanpa menghubungi pemilik.
- Setiap transaksi memiliki bukti dan riwayat perubahan status.
- Laporan bulanan dapat dibuat otomatis.

---

## 5. Batasan Produk

### 5.1 Termasuk dalam Produk

- Pengelolaan satu kos atau satu bisnis kos milik owner.
- Beberapa tipe kamar di lokasi yang sama.
- Penyewaan bulanan sebagai mode utama.
- Penyewaan harian dan per jam sebagai mode opsional.
- Pembayaran manual, tunai, dan transfer.
- Integrasi payment gateway sebagai pengembangan lanjutan.
- Dashboard owner dan tenant.
- Web publik untuk informasi kos dan ketersediaan kamar.

### 5.2 Tidak Termasuk

- Marketplace banyak pemilik kos.
- Pendaftaran mitra atau vendor kos.
- Pencarian kos berdasarkan kota atau lokasi nasional.
- Komisi platform dari transaksi pemilik lain.
- Sistem rating dan ulasan antar-kos.
- Moderasi listing milik pihak ketiga.
- Chat marketplace antara pencari dan banyak pemilik.

---

## 6. Target Pengguna

### 6.1 Owner

Pemilik atau pengelola satu kos yang ingin mengganti pencatatan manual dengan sistem terpusat.

**Kebutuhan utama:**

- Mengetahui kamar kosong, terisi, dipesan, atau dalam perbaikan.
- Mengetahui penghuni aktif dan masa sewanya.
- Mengetahui tagihan yang belum dibayar.
- Memverifikasi pembayaran manual.
- Melihat laporan pendapatan.
- Menangani keluhan penghuni.

### 6.2 Tenant

Penghuni aktif yang menyewa kamar.

**Kebutuhan utama:**

- Melihat informasi kamar dan masa sewa.
- Melihat tagihan dan jatuh tempo.
- Mengunggah bukti pembayaran.
- Melihat riwayat pembayaran dan invoice.
- Mengirim dan memantau keluhan.
- Membaca pengumuman dari owner.

### 6.3 Guest

Calon penghuni yang belum memiliki akun.

**Kebutuhan utama:**

- Melihat profil kos.
- Melihat fasilitas dan foto kamar.
- Melihat kamar yang tersedia.
- Mengirim permintaan booking atau menghubungi owner.

---

## 7. Peran dan Hak Akses

| Modul | Guest | Tenant | Owner |
|---|---:|---:|---:|
| Melihat landing page | Ya | Ya | Ya |
| Melihat kamar publik | Ya | Ya | Ya |
| Membuat permintaan booking | Ya | Ya | Ya |
| Melihat dashboard tenant | Tidak | Ya | Tidak |
| Melihat tagihan sendiri | Tidak | Ya | Tidak |
| Mengunggah bukti pembayaran | Tidak | Ya | Tidak |
| Membuat keluhan | Tidak | Ya | Tidak |
| Kelola kamar | Tidak | Tidak | Ya |
| Kelola penghuni | Tidak | Tidak | Ya |
| Membuat tagihan | Tidak | Tidak | Ya |
| Verifikasi pembayaran | Tidak | Tidak | Ya |
| Melihat laporan seluruh kos | Tidak | Tidak | Ya |
| Kelola pengumuman | Tidak | Tidak | Ya |
| Kelola pengaturan kos | Tidak | Tidak | Ya |

---

## 8. Platform dan Arsitektur

### 8.1 Frontend

- React Native dengan Expo.
- TypeScript.
- Expo Router untuk navigasi berbasis file.
- React Native Web untuk versi browser.
- TanStack Query atau layer service internal untuk sinkronisasi data.
- Zustand atau Context API untuk state lokal sederhana.
- React Hook Form dan Zod untuk formulir serta validasi.

### 8.2 Backend Firebase

- Firebase Authentication untuk login dan identitas pengguna.
- Cloud Firestore sebagai database utama.
- Firebase Storage untuk foto kamar, avatar, dan bukti pembayaran.
- Firebase Cloud Messaging untuk push notification.
- Firebase App Check untuk mengurangi penyalahgunaan API.
- Cloud Functions for Firebase untuk pekerjaan server-side yang membutuhkan hak istimewa atau secret.

### 8.3 Deployment

- Versi Web/PWA diekspor dari Expo dan di-host di Vercel.
- APK testing Android dibuat melalui Expo EAS Build.
- File AAB produksi dibuat melalui Expo EAS Build untuk Google Play.
- Firebase tetap menjadi backend untuk aplikasi Android dan web.

### 8.4 Diagram Arsitektur

```text
Android / iOS-ready / Web PWA
          |
React Native + Expo Router
          |
Firebase SDK
          |
+-------------------------------+
| Firebase Authentication       |
| Cloud Firestore               |
| Firebase Storage              |
| Firebase Cloud Messaging      |
| Cloud Functions               |
| Firebase App Check            |
+-------------------------------+

Web build  -> Vercel
APK / AAB  -> Expo EAS Build
```

---

## 9. Modul dan Fitur

## 9.1 Autentikasi

### Fitur

- Login email dan password.
- Lupa password.
- Logout.
- Penyimpanan sesi login.
- Owner dibuat melalui seed/admin setup, bukan registrasi publik.
- Tenant dapat:
  - Diundang oleh owner.
  - Mengaktifkan akun melalui email.
  - Atau dibuatkan akun sementara oleh owner.
- Proteksi halaman berdasarkan role.
- Nonaktifkan akun tenant tanpa menghapus histori transaksi.

### Aturan

- Hanya owner yang dapat mengubah role.
- Email harus unik.
- Akun tenant harus terhubung dengan data sewa aktif untuk mengakses dashboard tenant.
- Akun nonaktif tidak boleh melakukan login.

### Acceptance Criteria

- Pengguna dengan kredensial benar masuk ke dashboard sesuai role.
- Tenant tidak dapat membuka route owner.
- Owner tidak dapat melihat aplikasi sebagai tenant kecuali menggunakan mode preview.
- Sesi tetap aktif setelah aplikasi ditutup dan dibuka kembali.

---

## 9.2 Landing Page Publik

### Konten

- Hero kos.
- Nama dan deskripsi singkat.
- Foto lingkungan kos.
- Keunggulan utama.
- Fasilitas umum.
- Kamar unggulan.
- Status ketersediaan kamar.
- Lokasi dan petunjuk.
- FAQ.
- Kontak owner.
- CTA “Lihat Kamar Tersedia”.

### Catatan

Landing page hanya menampilkan satu properti. Tidak ada fitur pencarian kos lain.

---

## 9.3 Katalog dan Detail Kamar

### Data Kamar

- Kode atau nomor kamar.
- Nama tipe kamar.
- Lantai.
- Harga sewa bulanan.
- Harga harian opsional.
- Harga per jam opsional.
- Deposit.
- Luas kamar.
- Kapasitas penghuni.
- Fasilitas.
- Deskripsi.
- Foto utama dan galeri.
- Status kamar.
- Catatan internal owner.

### Status Kamar

- `available`
- `reserved`
- `occupied`
- `maintenance`
- `inactive`

### Fitur Owner

- Tambah kamar.
- Edit kamar.
- Unggah beberapa foto.
- Ubah status.
- Arsipkan kamar.
- Cari dan filter kamar.
- Tampilan grid dan list.
- Lihat histori penyewa kamar.

### Fitur Guest/Tenant

- Melihat kamar yang dipublikasikan.
- Melihat harga dan fasilitas.
- Melihat status tersedia.
- Mengirim permintaan booking.

### Aturan

- Kamar `occupied`, `maintenance`, dan `inactive` tidak bisa dipesan.
- Kamar yang memiliki sewa aktif otomatis berstatus `occupied`.
- Kamar yang memiliki booking terkonfirmasi tetapi belum check-in berstatus `reserved`.
- Menghapus kamar menggunakan soft delete agar histori sewa tetap aman.

---

## 9.4 Pengelolaan Penghuni

### Data Penghuni

- Nama lengkap.
- Email.
- Nomor WhatsApp.
- Jenis identitas.
- Nomor identitas.
- Foto identitas opsional.
- Kontak darurat.
- Alamat asal.
- Status akun.
- Kamar aktif.
- Tanggal masuk.
- Tanggal akhir sewa.
- Catatan owner.

### Fitur Owner

- Tambah penghuni.
- Hubungkan penghuni dengan akun Firebase Auth.
- Pindahkan kamar.
- Perpanjang sewa.
- Akhiri sewa.
- Nonaktifkan akun.
- Melihat histori kamar dan pembayaran.
- Filter penghuni aktif, akan berakhir, dan sudah keluar.

### Aturan

- Satu kamar tidak boleh memiliki sewa aktif melebihi kapasitas kamar.
- Satu tenant hanya dapat memiliki satu sewa utama aktif pada MVP.
- Data transaksi tenant tidak ikut terhapus saat akun dinonaktifkan.

---

## 9.5 Booking dan Sewa

### Jenis Sewa

- Bulanan.
- Harian opsional.
- Per jam opsional.

### Status Booking

- `draft`
- `pending`
- `awaiting_payment`
- `confirmed`
- `checked_in`
- `completed`
- `cancelled`
- `expired`
- `rejected`

### Alur Booking Publik

1. Guest membuka detail kamar.
2. Guest memilih jenis sewa dan periode.
3. Sistem memeriksa ketersediaan.
4. Guest mengisi data dasar.
5. Booking dibuat dengan status `pending`.
6. Owner memeriksa permintaan.
7. Owner menerima atau menolak.
8. Jika diterima, sistem membuat tagihan awal.
9. Setelah pembayaran diverifikasi, booking menjadi `confirmed`.
10. Saat penghuni masuk, owner mengubah menjadi `checked_in` dan membuat lease aktif.

### Fitur Owner

- Kalender booking.
- Filter berdasarkan status dan jenis sewa.
- Konfirmasi atau tolak booking.
- Ubah periode sebelum konfirmasi.
- Buat booking manual.
- Check-in dan check-out.
- Batalkan booking dengan alasan.

### Aturan Bentrok

- Periode tidak boleh tumpang tindih dengan booking `confirmed` atau lease aktif.
- Pemeriksaan ketersediaan harus dilakukan kembali saat owner mengonfirmasi.
- Booking pending memiliki masa berlaku yang dapat diatur.

---

## 9.6 Lease atau Kontrak Sewa

### Data Lease

- Tenant.
- Kamar.
- Jenis sewa.
- Tanggal mulai.
- Tanggal selesai.
- Harga saat kontrak dibuat.
- Deposit.
- Siklus tagihan.
- Hari jatuh tempo.
- Status.
- Catatan dan aturan tambahan.

### Status Lease

- `scheduled`
- `active`
- `ending_soon`
- `ended`
- `terminated`

### Fitur

- Membuat lease dari booking.
- Membuat lease manual.
- Memperpanjang masa sewa.
- Memindahkan kamar.
- Mengakhiri kontrak.
- Menampilkan riwayat perubahan.
- Menghasilkan dokumen ringkasan sewa.

---

## 9.7 Tagihan

### Jenis Tagihan

- Sewa kamar.
- Deposit.
- Listrik.
- Air.
- Denda.
- Kerusakan.
- Layanan tambahan.
- Tagihan custom.

### Data Tagihan

- Nomor invoice.
- Tenant.
- Lease.
- Periode.
- Daftar item.
- Subtotal.
- Potongan.
- Denda.
- Total.
- Jatuh tempo.
- Status pembayaran.
- Catatan.

### Status Tagihan

- `draft`
- `unpaid`
- `partially_paid`
- `pending_verification`
- `paid`
- `overdue`
- `cancelled`

### Fitur Owner

- Membuat tagihan manual.
- Membuat tagihan bulanan otomatis.
- Menambahkan item listrik atau biaya lain.
- Mengubah jatuh tempo sebelum pembayaran.
- Membatalkan tagihan dengan alasan.
- Melihat tagihan terlambat.
- Mengirim pengingat.

### Fitur Tenant

- Melihat tagihan aktif.
- Melihat rincian biaya.
- Melihat jatuh tempo.
- Membayar atau mengunggah bukti pembayaran.
- Mengunduh invoice atau kuitansi.

### Aturan

- Tagihan yang sudah lunas tidak dapat diedit langsung.
- Koreksi tagihan lunas dilakukan melalui transaksi penyesuaian.
- Invoice menyimpan snapshot nama kamar, tenant, dan harga agar histori tidak berubah ketika data master diedit.

---

## 9.8 Pembayaran

### Metode Pembayaran MVP

- Transfer bank manual.
- Tunai kepada owner.
- Metode custom lain yang dibuat owner.

### Metode Pembayaran Tahap Lanjut

- QRIS.
- Virtual account.
- E-wallet melalui payment gateway.

### Status Pembayaran

- `pending`
- `submitted`
- `verified`
- `rejected`
- `refunded`
- `cancelled`

### Alur Transfer Manual

1. Tenant membuka tagihan.
2. Tenant memilih transfer manual.
3. Aplikasi menampilkan rekening owner.
4. Tenant mengunggah bukti pembayaran.
5. Status pembayaran menjadi `submitted`.
6. Owner memeriksa bukti.
7. Owner memilih verifikasi atau tolak.
8. Jika diverifikasi, saldo tagihan diperbarui.
9. Jika total telah terpenuhi, tagihan menjadi `paid`.

### Alur Tunai

1. Owner membuka tagihan tenant.
2. Owner mencatat pembayaran tunai.
3. Owner memasukkan jumlah dan tanggal.
4. Sistem membuat pembayaran terverifikasi.
5. Tagihan diperbarui.

### Validasi

- Jumlah pembayaran harus lebih dari nol.
- Pembayaran tidak boleh melebihi sisa tagihan, kecuali fitur saldo kredit diaktifkan pada versi lanjutan.
- Bukti pembayaran hanya dapat dibuka owner dan tenant terkait.
- Penolakan pembayaran wajib memiliki alasan.

---

## 9.9 Dashboard Owner

### Ringkasan

- Pendapatan bulan berjalan.
- Tagihan belum lunas.
- Tagihan terlambat.
- Jumlah kamar tersedia.
- Jumlah kamar terisi.
- Tingkat okupansi.
- Penghuni aktif.
- Booking menunggu persetujuan.
- Keluhan aktif.

### Widget

- Grafik pendapatan enam bulan.
- Distribusi status kamar.
- Tagihan jatuh tempo terdekat.
- Pembayaran terbaru.
- Aktivitas terbaru.
- Kalender booking.
- Lease yang segera berakhir.

### Quick Action

- Tambah penghuni.
- Buat tagihan.
- Catat pembayaran.
- Tambah kamar.
- Buat pengumuman.

---

## 9.10 Dashboard Tenant

### Ringkasan

- Kamar aktif.
- Sisa masa sewa.
- Tagihan aktif.
- Jatuh tempo terdekat.
- Status pembayaran terakhir.
- Keluhan yang masih diproses.
- Pengumuman terbaru.

### Quick Action

- Bayar tagihan.
- Unggah bukti pembayaran.
- Buat keluhan.
- Hubungi owner.
- Lihat detail sewa.

---

## 9.11 Keluhan dan Perawatan

### Kategori

- Listrik.
- Air.
- Perabot.
- Kebersihan.
- Keamanan.
- Internet.
- Fasilitas umum.
- Lainnya.

### Status

- `submitted`
- `acknowledged`
- `in_progress`
- `resolved`
- `closed`
- `rejected`

### Fitur Tenant

- Membuat keluhan.
- Menambahkan deskripsi dan foto.
- Menentukan tingkat urgensi.
- Melihat progres.
- Memberikan konfirmasi setelah selesai.

### Fitur Owner

- Melihat semua keluhan.
- Mengubah status.
- Menambahkan catatan penanganan.
- Menentukan estimasi penyelesaian.
- Menutup keluhan.

### Aturan

- Tenant hanya dapat melihat keluhan miliknya.
- Owner dapat melihat seluruh keluhan.
- Setiap perubahan status tercatat di activity log.

---

## 9.12 Pengumuman

### Fitur Owner

- Membuat pengumuman.
- Menentukan target semua tenant atau kamar tertentu.
- Menjadwalkan waktu tayang.
- Menandai sebagai penting.
- Mengarsipkan pengumuman.

### Fitur Tenant

- Melihat pengumuman aktif.
- Menandai pengumuman telah dibaca.

### Contoh

- Jadwal mati listrik.
- Perbaikan air.
- Pengingat pembayaran.
- Perubahan aturan kos.
- Kegiatan di area kos.

---

## 9.13 Notifikasi

### Kanal

- Notifikasi di dalam aplikasi.
- Push notification.
- Email opsional.
- WhatsApp tetap berupa tombol kontak, bukan integrasi otomatis pada MVP.

### Trigger Utama

- Tagihan baru dibuat.
- Tagihan mendekati jatuh tempo.
- Tagihan melewati jatuh tempo.
- Bukti pembayaran dikirim.
- Pembayaran diterima atau ditolak.
- Booking diterima atau ditolak.
- Keluhan berubah status.
- Pengumuman baru.
- Masa sewa segera berakhir.

### Preferensi

Pengguna dapat menyalakan atau mematikan notifikasi non-kritis. Notifikasi keamanan dan pembayaran penting tetap aktif.

---

## 9.14 Laporan

### Jenis Laporan

- Pendapatan.
- Tagihan.
- Pembayaran.
- Okupansi kamar.
- Booking.
- Penghuni.
- Lease yang berakhir.
- Keluhan dan perawatan.

### Filter

- Hari ini.
- Minggu ini.
- Bulan ini.
- Tahun ini.
- Rentang tanggal custom.
- Kamar.
- Tenant.
- Status.
- Metode pembayaran.

### Output

- Tampilan dashboard.
- Export CSV/XLSX pada web.
- PDF ringkasan melalui fungsi server.

### Metrik

- Total pendapatan.
- Pendapatan bersih tercatat.
- Tagihan belum tertagih.
- Persentase pembayaran tepat waktu.
- Tingkat okupansi.
- Rata-rata durasi sewa.
- Jumlah keluhan per kategori.

---

## 9.15 Pengaturan Kos

### Profil Kos

- Nama kos.
- Logo.
- Deskripsi.
- Alamat.
- Koordinat peta.
- Nomor WhatsApp.
- Email.
- Foto galeri.
- Fasilitas umum.
- Jam operasional.

### Pembayaran

- Rekening bank.
- Nama pemilik rekening.
- Instruksi pembayaran.
- Metode pembayaran aktif.
- Masa verifikasi.

### Tagihan

- Hari jatuh tempo default.
- Denda keterlambatan opsional.
- Pengingat otomatis.
- Format nomor invoice.

### Booking

- Jenis sewa yang diaktifkan.
- Minimal durasi.
- Maksimal durasi.
- Durasi booking pending.
- Kebijakan pembatalan.

### Tampilan

- Tema terang atau gelap.
- Warna brand.
- Foto hero.
- Konten FAQ.

---

## 10. Navigasi Aplikasi

## 10.1 Guest

```text
Beranda
├── Kamar
│   └── Detail Kamar
├── Tentang Kos
├── Fasilitas
├── FAQ
├── Kontak
└── Login
```

## 10.2 Tenant Mobile

Gunakan bottom navigation maksimal lima item:

```text
Beranda
Tagihan
Sewa
Keluhan
Profil
```

Menu tambahan dapat muncul dari halaman profil:

- Riwayat pembayaran.
- Pengumuman.
- Notifikasi.
- Bantuan.
- Pengaturan.

## 10.3 Owner Mobile

```text
Dashboard
Kamar
Transaksi
Penghuni
Menu
```

Isi Menu:

- Booking.
- Tagihan.
- Pembayaran.
- Keluhan.
- Pengumuman.
- Laporan.
- Pengaturan.

## 10.4 Owner Web

Gunakan sidebar agar operasional desktop lebih cepat.

---

## 11. Daftar Layar

### Public

1. Splash screen.
2. Landing page.
3. Daftar kamar.
4. Detail kamar.
5. Form booking.
6. Booking berhasil.
7. Login.
8. Lupa password.

### Tenant

1. Dashboard.
2. Detail sewa.
3. Daftar tagihan.
4. Detail tagihan.
5. Pilih metode pembayaran.
6. Upload bukti pembayaran.
7. Riwayat pembayaran.
8. Detail kuitansi.
9. Daftar keluhan.
10. Buat keluhan.
11. Detail keluhan.
12. Daftar pengumuman.
13. Detail pengumuman.
14. Notifikasi.
15. Profil.
16. Pengaturan notifikasi.

### Owner

1. Dashboard.
2. Daftar kamar.
3. Form kamar.
4. Detail kamar.
5. Daftar penghuni.
6. Form penghuni.
7. Detail penghuni.
8. Daftar booking.
9. Kalender booking.
10. Detail booking.
11. Daftar lease.
12. Form lease.
13. Detail lease.
14. Daftar tagihan.
15. Form tagihan.
16. Detail tagihan.
17. Daftar pembayaran.
18. Verifikasi pembayaran.
19. Daftar keluhan.
20. Detail keluhan.
21. Daftar pengumuman.
22. Form pengumuman.
23. Laporan.
24. Activity log.
25. Pengaturan kos.
26. Pengaturan pembayaran.
27. Pengaturan booking.

---

## 12. Model Data Firestore

Gunakan struktur yang tetap mendukung satu properti saat ini, tetapi tidak mengunci pengembangan masa depan.

```text
users/{userId}
properties/{propertyId}
properties/{propertyId}/rooms/{roomId}
properties/{propertyId}/bookings/{bookingId}
properties/{propertyId}/leases/{leaseId}
properties/{propertyId}/invoices/{invoiceId}
properties/{propertyId}/payments/{paymentId}
properties/{propertyId}/complaints/{complaintId}
properties/{propertyId}/announcements/{announcementId}
properties/{propertyId}/notifications/{notificationId}
properties/{propertyId}/activityLogs/{logId}
properties/{propertyId}/settings/{settingId}
```

### 12.1 users

```ts
interface UserDocument {
  uid: string;
  role: 'owner' | 'tenant';
  propertyId: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'invited';
  currentLeaseId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.2 rooms

```ts
interface RoomDocument {
  propertyId: string;
  code: string;
  name: string;
  floor?: number;
  status: 'available' | 'reserved' | 'occupied' | 'maintenance' | 'inactive';
  monthlyPrice: number;
  dailyPrice?: number;
  hourlyPrice?: number;
  depositAmount?: number;
  capacity: number;
  size?: string;
  facilities: string[];
  description: string;
  coverImageUrl?: string;
  imageUrls: string[];
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.3 bookings

```ts
interface BookingDocument {
  propertyId: string;
  roomId: string;
  userId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  rentalType: 'hourly' | 'daily' | 'monthly';
  startAt: Timestamp;
  endAt: Timestamp;
  totalAmount: number;
  status:
    | 'draft'
    | 'pending'
    | 'awaiting_payment'
    | 'confirmed'
    | 'checked_in'
    | 'completed'
    | 'cancelled'
    | 'expired'
    | 'rejected';
  expiresAt?: Timestamp;
  rejectionReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.4 leases

```ts
interface LeaseDocument {
  propertyId: string;
  tenantId: string;
  roomId: string;
  bookingId?: string;
  rentalType: 'hourly' | 'daily' | 'monthly';
  startAt: Timestamp;
  endAt: Timestamp;
  agreedPrice: number;
  depositAmount: number;
  billingDay?: number;
  status: 'scheduled' | 'active' | 'ending_soon' | 'ended' | 'terminated';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.5 invoices

```ts
interface InvoiceItem {
  type: 'rent' | 'deposit' | 'electricity' | 'water' | 'penalty' | 'damage' | 'service' | 'custom';
  label: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceDocument {
  propertyId: string;
  invoiceNumber: string;
  tenantId: string;
  leaseId: string;
  roomId: string;
  periodLabel: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  penalty: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  dueAt: Timestamp;
  status:
    | 'draft'
    | 'unpaid'
    | 'partially_paid'
    | 'pending_verification'
    | 'paid'
    | 'overdue'
    | 'cancelled';
  snapshot: {
    tenantName: string;
    roomCode: string;
    propertyName: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.6 payments

```ts
interface PaymentDocument {
  propertyId: string;
  invoiceId: string;
  tenantId: string;
  amount: number;
  method: 'bank_transfer' | 'cash' | 'gateway' | 'custom';
  status: 'pending' | 'submitted' | 'verified' | 'rejected' | 'refunded' | 'cancelled';
  proofUrl?: string;
  note?: string;
  rejectionReason?: string;
  submittedAt?: Timestamp;
  verifiedAt?: Timestamp;
  verifiedBy?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 12.7 complaints

```ts
interface ComplaintDocument {
  propertyId: string;
  tenantId: string;
  leaseId: string;
  roomId: string;
  category: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  imageUrls: string[];
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  ownerNote?: string;
  estimatedResolutionAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## 13. Firestore Security Rules

### Prinsip

- Default deny.
- Pengguna wajib terautentikasi untuk data pribadi.
- Role dan `propertyId` divalidasi dari dokumen pengguna.
- Tenant hanya dapat membaca data miliknya.
- Tenant tidak boleh mengubah nominal, status tagihan, atau status pembayaran.
- Owner hanya dapat mengakses data propertinya.
- Field sensitif diubah melalui Cloud Functions bila membutuhkan proses atomik atau hak istimewa.

### Contoh Kebijakan

```text
Public:
- Boleh membaca profil properti publik.
- Boleh membaca kamar dengan isPublished = true.
- Boleh membuat booking dengan field terbatas.

Tenant:
- Boleh membaca profil sendiri.
- Boleh membaca lease milik sendiri.
- Boleh membaca invoice dan payment milik sendiri.
- Boleh membuat payment submission milik sendiri.
- Boleh membuat dan membaca complaint milik sendiri.
- Tidak boleh mengubah status invoice/payment.

Owner:
- Boleh CRUD data dalam propertyId miliknya.
- Tidak boleh mengakses properti lain.
```

---

## 14. Cloud Functions

Gunakan fungsi server hanya untuk operasi yang tidak aman dilakukan langsung dari client.

### Fungsi Utama

- Membuat akun undangan tenant.
- Menetapkan custom claims atau role.
- Membuat invoice otomatis setiap periode.
- Mengubah status invoice menjadi overdue.
- Mengirim push notification terjadwal.
- Memverifikasi transaksi payment gateway.
- Memproses webhook payment gateway.
- Membuat PDF invoice/kuitansi.
- Menulis activity log untuk aksi penting.
- Membersihkan file Storage yang tidak terpakai.

### Scheduled Jobs

- Setiap hari: tandai invoice lewat jatuh tempo.
- Setiap hari: kirim pengingat H-3 dan H-1.
- Setiap hari: tandai lease yang segera berakhir.
- Setiap jam: kedaluwarsakan booking pending.

---

## 15. Integrasi Payment Gateway

Integrasi payment gateway bukan syarat rilis MVP pertama. MVP harus sudah berguna dengan pembayaran manual.

Saat diaktifkan:

- Secret key tidak boleh disimpan di aplikasi React Native.
- Pembuatan transaksi dilakukan melalui Cloud Functions.
- Webhook diverifikasi di server.
- Status transaksi dari client tidak boleh langsung dipercaya.
- Invoice hanya menjadi lunas setelah server mengonfirmasi pembayaran.
- Simpan payload penting seperlunya tanpa menyimpan data sensitif kartu.

---

## 16. Offline dan Sinkronisasi

### Target

- Pengguna tetap dapat membuka data terakhir yang telah dimuat.
- Form belum terkirim tidak langsung hilang.
- Tampilkan indikator offline.
- Hindari menjanjikan pembayaran berhasil sebelum server mengonfirmasi.

### Aturan

- Operasi finansial sensitif harus mendapat konfirmasi server.
- Konflik data menggunakan nilai server sebagai sumber kebenaran.
- Tombol submit dinonaktifkan saat proses masih berjalan untuk mencegah duplikasi.

---

## 17. Desain UI/UX

### Arah Visual

- Modern, tenang, dan premium.
- Bukan tampilan marketplace penuh kartu promosi.
- Fokus pada operasional dan kejelasan data.
- Hindari badge berlebihan, glow, gradient acak, dan elemen generik yang terlihat seperti AI template.

### Warna

- Hijau gelap sebagai warna brand utama.
- Latar terang hangat untuk mode light.
- Latar charcoal untuk mode dark.
- Warna status hanya digunakan saat memiliki arti.

### Tipografi

- Font display klasik untuk hero atau heading tertentu.
- Font sans-serif yang sangat terbaca untuk dashboard dan data.
- Contoh pasangan: Cormorant Garamond untuk display dan Inter/Manrope untuk interface.

### Komponen

- Cards sederhana dengan hierarchy yang kuat.
- Bottom sheet untuk aksi mobile.
- Drawer atau modal hanya untuk form singkat.
- Form panjang menggunakan halaman sendiri.
- Tabel digunakan pada web, list card digunakan pada mobile.
- Empty state harus memberi tindakan yang jelas.

### Responsive

- Mobile-first untuk tenant.
- Owner tetap nyaman di mobile.
- Owner web memiliki sidebar dan area data lebih luas.

---

## 18. Validasi dan Penanganan Error

### Form

- Validasi dilakukan sebelum submit.
- Error ditampilkan dekat field terkait.
- Pesan error menggunakan bahasa yang dipahami pengguna.
- Data yang sudah diisi tidak hilang saat gagal submit.

### Kondisi Wajib

- Loading skeleton.
- Empty state.
- Offline state.
- Permission denied.
- Data tidak ditemukan.
- Upload gagal.
- Sesi kedaluwarsa.
- Konflik booking.
- Pembayaran ganda.

---

## 19. Non-Functional Requirements

### Keamanan

- Firestore Rules menggunakan default deny.
- Firebase App Check diaktifkan sebelum produksi.
- File bukti pembayaran tidak bersifat publik.
- Secret hanya disimpan di environment server.
- Aksi owner penting tercatat.
- Data keuangan tidak dapat diedit langsung oleh tenant.

### Performa

- Gunakan pagination pada list besar.
- Kompres foto sebelum upload.
- Gunakan thumbnail untuk daftar kamar.
- Buat Firestore composite indexes sesuai query.
- Hindari listener realtime untuk data yang tidak perlu realtime.

### Reliabilitas

- Operasi finansial menggunakan transaction atau batched write.
- Proses verifikasi pembayaran bersifat idempotent.
- Booking harus melakukan pemeriksaan bentrok sebelum konfirmasi.

### Aksesibilitas

- Target sentuh minimal nyaman.
- Kontras teks memadai.
- Status tidak hanya dibedakan dengan warna.
- Label form dapat dibaca screen reader.
- Ukuran teks mendukung scaling.

### Privasi

- Hanya simpan data identitas yang benar-benar dibutuhkan.
- Tenant tidak dapat melihat informasi tenant lain.
- Sediakan proses penghapusan atau anonimisasi data sesuai kebutuhan operasional.

---

## 20. Analytics dan Event

### Event Penting

- `login_success`
- `room_viewed`
- `booking_submitted`
- `booking_confirmed`
- `invoice_created`
- `payment_submitted`
- `payment_verified`
- `complaint_created`
- `complaint_resolved`
- `announcement_opened`

### Catatan

Jangan mengirim data identitas pribadi, nomor rekening, atau detail bukti pembayaran ke analytics.

---

## 21. Environment Variables

Contoh nama variabel:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=
EXPO_PUBLIC_FIREBASE_APP_CHECK_KEY=

# Server-only, jangan memakai prefix EXPO_PUBLIC
PAYMENT_SERVER_KEY=
PAYMENT_CLIENT_KEY=
PAYMENT_WEBHOOK_SECRET=
```

### Aturan

- Nilai dengan prefix `EXPO_PUBLIC_` dianggap dapat terlihat oleh client.
- Secret pembayaran hanya ada di environment Cloud Functions.
- Environment development, preview, dan production harus dipisahkan.

---

## 22. Struktur Folder Rekomendasi

```text
src/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (tenant)/
│   ├── (owner)/
│   └── _layout.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── cards/
│   └── charts/
├── features/
│   ├── auth/
│   ├── rooms/
│   ├── tenants/
│   ├── bookings/
│   ├── leases/
│   ├── invoices/
│   ├── payments/
│   ├── complaints/
│   ├── announcements/
│   └── reports/
├── services/
│   ├── firebase/
│   ├── auth/
│   ├── firestore/
│   ├── storage/
│   └── notifications/
├── hooks/
├── store/
├── schemas/
├── types/
├── utils/
├── constants/
└── theme/
```

---

## 23. Strategi Deployment

## 23.1 Web ke Vercel

### Target

- Landing page publik.
- Tenant web.
- Owner dashboard web.

### Build

```bash
npx expo export --platform web
```

Output build berada di folder `dist`.

### Konfigurasi Vercel

- Build Command: `npx expo export --platform web`
- Output Directory: `dist`
- Install Command: `npm install`
- Environment Variables: seluruh `EXPO_PUBLIC_FIREBASE_*` yang diperlukan.

Untuk SPA fallback, siapkan `vercel.json` sesuai output router yang digunakan.

Contoh untuk SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Gunakan konfigurasi berbeda bila Expo Router memakai static rendering dengan file route terpisah.

## 23.2 Android dengan EAS

### Preview APK

```bash
eas build --platform android --profile preview
```

### Production AAB

```bash
eas build --platform android --profile production
```

### Contoh `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

---

## 24. Tahapan Pengembangan

## Milestone 1 — Foundation

- Inisialisasi Expo + TypeScript.
- Expo Router.
- Tema dan design tokens.
- Firebase project development.
- Struktur folder.
- Error boundary dan loading dasar.

**Definition of Done:** aplikasi berjalan di Android emulator/device dan web.

## Milestone 2 — Authentication dan Role

- Login.
- Reset password.
- Persistensi sesi.
- User profile.
- Route guard owner/tenant.
- Owner bootstrap.

**Definition of Done:** owner dan tenant masuk ke dashboard berbeda dengan akses aman.

## Milestone 3 — Landing dan Kamar

- Landing page.
- Profil kos.
- Daftar kamar.
- Detail kamar.
- CRUD kamar owner.
- Upload gambar.

**Definition of Done:** owner dapat mempublikasikan kamar dan guest dapat melihatnya.

## Milestone 4 — Penghuni dan Lease

- CRUD penghuni.
- Undangan tenant.
- Lease.
- Pindah kamar.
- Perpanjangan dan penghentian sewa.

**Definition of Done:** data penghuni dan kamar aktif tersinkron.

## Milestone 5 — Booking

- Form booking publik.
- Cek ketersediaan.
- Kalender booking.
- Konfirmasi dan penolakan.
- Expiry booking.

**Definition of Done:** tidak ada booking terkonfirmasi yang bentrok.

## Milestone 6 — Tagihan

- Invoice.
- Item tagihan.
- Jatuh tempo.
- Tagihan otomatis bulanan.
- Status overdue.

**Definition of Done:** owner dapat menerbitkan tagihan dan tenant dapat melihatnya.

## Milestone 7 — Pembayaran

- Transfer manual.
- Upload bukti.
- Verifikasi owner.
- Pembayaran tunai.
- Kuitansi.

**Definition of Done:** status invoice selalu sesuai total pembayaran terverifikasi.

## Milestone 8 — Tenant Experience

- Dashboard tenant.
- Riwayat pembayaran.
- Pengumuman.
- Keluhan.
- Push notification.

**Definition of Done:** tenant dapat menyelesaikan kebutuhan utama tanpa chat manual.

## Milestone 9 — Owner Dashboard dan Laporan

- KPI dashboard.
- Grafik.
- Filter laporan.
- Export laporan.
- Activity log.

**Definition of Done:** owner dapat memantau kondisi bisnis dan membuat laporan bulanan.

## Milestone 10 — Production

- Firestore Rules final.
- App Check.
- Index Firestore.
- Optimasi gambar.
- Pengujian offline.
- Deploy web Vercel.
- Build APK internal.
- Build AAB produksi.
- Dokumentasi operasional.

---

## 25. Prioritas MVP

### Must Have

- Authentication dan role.
- CRUD kamar.
- CRUD penghuni.
- Lease aktif.
- Tagihan.
- Pembayaran manual dan verifikasi.
- Dashboard owner.
- Dashboard tenant.
- Riwayat pembayaran.
- Pengumuman.
- Firestore Security Rules.
- Web deployment dan APK testing.

### Should Have

- Booking publik.
- Keluhan.
- Push notification.
- Laporan dan export.
- Penyewaan harian.

### Could Have

- Penyewaan per jam.
- Payment gateway.
- PDF kontrak.
- Meter listrik atau air.
- Saldo kredit tenant.
- Multi-bahasa.

### Won't Have pada MVP

- Marketplace multi-kos.
- Multi-owner independen.
- Rating dan review publik.
- Komisi transaksi.
- Chat realtime penuh.

---

## 26. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Firestore Rules terlalu longgar | Kebocoran data | Default deny, emulator testing, role/property validation |
| Booking bentrok | Operasional kacau | Transaction dan re-check sebelum konfirmasi |
| Tenant mengubah status pembayaran | Kerugian finansial | Status hanya diubah owner atau server |
| Bukti pembayaran dapat dilihat publik | Pelanggaran privasi | Storage Rules dan URL terkontrol |
| Biaya Firebase meningkat | Beban operasional | Pagination, agregasi, batasi realtime listener |
| Web dan native memiliki perilaku berbeda | Bug lintas platform | Uji per platform dan gunakan adapter bila perlu |
| Upload gambar terlalu besar | Lambat dan mahal | Kompresi client serta batas ukuran |
| Notifikasi gagal | Tenant melewatkan tagihan | In-app notification tetap menjadi sumber utama |

---

## 27. Pengujian

### Unit Test

- Perhitungan invoice.
- Perhitungan sisa pembayaran.
- Validasi periode booking.
- Mapping status.
- Format mata uang dan tanggal.

### Integration Test

- Auth dan role guard.
- CRUD kamar.
- Booking hingga lease.
- Invoice hingga payment verified.
- Upload bukti pembayaran.
- Complaint lifecycle.

### Security Test

- Tenant mencoba membaca invoice tenant lain.
- Tenant mencoba mengubah total invoice.
- Guest mencoba membaca bukti pembayaran.
- Owner mencoba membaca propertyId lain.
- Client mencoba membuat pembayaran langsung berstatus verified.

### Device Test

- Android kecil.
- Android layar besar.
- Browser desktop.
- Browser mobile.
- Koneksi lambat.
- Kondisi offline lalu online kembali.

---

## 28. Definition of Done Global

Sebuah fitur dianggap selesai apabila:

- UI mengikuti desain dan responsive.
- Loading, empty, error, dan offline state tersedia.
- Validasi client dan security backend tersedia.
- Hak akses owner/tenant sudah diuji.
- Tidak ada secret di client.
- Data penting mencatat `createdAt` dan `updatedAt` dari server.
- Aksi finansial aman dari submit ganda.
- TypeScript tidak memiliki error.
- Lint dan test utama lolos.
- Berfungsi di Android dan web.

---

## 29. Ringkasan Keputusan Produk

Manzsa Residence harus diposisikan sebagai:

> **Aplikasi manajemen kos pribadi untuk satu usaha kos, tempat owner mengelola operasional dan tenant mengurus kebutuhan sewanya.**

Produk ini bukan aplikasi pencarian kos dan tidak memiliki konsep mitra. Fokusnya adalah operasional nyata: kamar, penghuni, booking, lease, tagihan, pembayaran, keluhan, pengumuman, dan laporan.

Arsitektur final:

```text
React Native + Expo + TypeScript
Firebase Authentication
Cloud Firestore
Firebase Storage
Firebase Cloud Functions
Firebase Cloud Messaging
Expo Web -> Vercel
Android APK/AAB -> Expo EAS Build
```
