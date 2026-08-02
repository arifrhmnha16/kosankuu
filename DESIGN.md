# DESIGN.md — Manzsa Residence

**Produk:** Aplikasi manajemen satu kos milik sendiri  
**Platform:** React Native + Expo, Android/iOS-ready, React Native Web  
**Backend:** Firebase Authentication, Cloud Firestore, Firebase Storage, Cloud Functions  
**Web deployment:** Vercel  
**Dokumen acuan:** `PRD_Manzsa_Residence_React_Native.md`  
**Status:** Design system dan spesifikasi UI implementatif

---

## 1. Tujuan Desain

Manzsa Residence harus terasa seperti aplikasi properti modern yang tenang, terang, rapi, dan mudah dipahami dalam beberapa detik. Referensi visual utama adalah aplikasi resort pada screenshot: dominasi putih, biru muda, kartu berlapis, foto properti besar, sudut membulat, dan navigasi bawah yang ringan.

Desain tidak boleh berubah menjadi marketplace kos. Seluruh UI harus tetap memperlihatkan bahwa aplikasi ini mengelola **satu properti kos milik owner**, dengan tiga konteks pengguna:

1. **Guest** melihat informasi Manzsa Residence dan kamar yang tersedia.
2. **Tenant** mengelola sewa, tagihan, pembayaran, dan keluhan miliknya.
3. **Owner** mengelola kamar, penghuni, transaksi, booking, dan laporan.

### Sasaran pengalaman

- Informasi terpenting terlihat tanpa banyak scroll.
- Pengguna selalu tahu status kamar, tagihan, pembayaran, atau keluhan.
- Satu layar memiliki satu fokus utama.
- Tampilan terasa premium, tetapi tetap realistis untuk aplikasi kos.
- Komponen mudah dipakai dengan satu tangan di layar Android kecil.
- Web dan mobile terasa satu keluarga, bukan dua produk berbeda.

---

## 2. Arah Visual

### Kata kunci

- Airy
- Clean
- Calm
- Soft blue
- Property-focused
- Modern Indonesian
- Friendly but professional
- Premium without luxury excess

### Karakter visual

- Latar putih kebiruan, bukan putih polos menyilaukan.
- Biru cerah dipakai hanya untuk aksi utama dan informasi aktif.
- Navy gelap dipakai untuk teks utama agar kontras kuat.
- Foto kamar menjadi elemen visual utama.
- Kartu memakai border tipis dan shadow lembut.
- Radius besar dipakai pada kartu penting, tetapi tidak pada semua elemen.
- Ikon outline sederhana, konsisten, dan tidak dekoratif berlebihan.
- Ornamen gelombang atau gradient hanya boleh muncul pada hero, splash, dan header tertentu.

### Larangan visual

- Jangan memakai glassmorphism di seluruh layar.
- Jangan memakai gradient pada setiap tombol dan kartu.
- Jangan memenuhi layar dengan badge.
- Jangan membuat semua section mengambang tanpa hierarki.
- Jangan memakai ilustrasi AI generik seperti gedung futuristik, manusia 3D, atau blob abstrak.
- Jangan memakai ikon berbeda gaya dalam satu layar.
- Jangan menampilkan fitur pencarian kos lintas lokasi atau kos mitra.
- Jangan meniru screenshot secara mentah; adaptasikan untuk operasional kos.

---

## 3. Brand Foundation

### Nama produk

**Manzsa Residence**

### Deskripsi pendek

> Kelola kamar, penghuni, tagihan, dan kebutuhan kos dalam satu aplikasi.

### Nada komunikasi

- Jelas
- Singkat
- Ramah
- Tidak terlalu formal
- Tidak memakai istilah teknis jika tidak diperlukan

### Contoh copy

**Benar:**

- Tagihan Agustus belum dibayar.
- Pembayaran sedang diperiksa.
- Kamar A03 tersedia.
- Keluhan internet sedang ditangani.

**Hindari:**

- Transaksi Anda telah sukses diproses oleh sistem.
- Jelajahi hunian impian terbaik di sekitar Anda.
- Temukan ribuan properti eksklusif.

---

## 4. Color System

Warna dibuat menyerupai nuansa screenshot: putih kebiruan, biru langit, dan navy kuat.

### 4.1 Brand Colors

| Token | Hex | Penggunaan |
|---|---|---|
| `brand-50` | `#EFF8FF` | Background section aktif |
| `brand-100` | `#DDEFFF` | Surface biru lembut |
| `brand-200` | `#B9DFFF` | Border atau highlight |
| `brand-300` | `#82C5FF` | Grafik sekunder |
| `brand-400` | `#45A8FF` | Ikon aktif |
| `brand-500` | `#168BF2` | Primary action |
| `brand-600` | `#0875D1` | Pressed state |
| `brand-700` | `#075DA5` | Teks link gelap |
| `brand-800` | `#10446F` | Header tertentu |
| `brand-900` | `#102B47` | Navy brand |

### 4.2 Neutral Colors

| Token | Hex | Penggunaan |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Surface utama |
| `neutral-25` | `#FBFDFF` | Latar dasar |
| `neutral-50` | `#F5F9FD` | Background aplikasi |
| `neutral-100` | `#EDF2F7` | Divider lembut |
| `neutral-200` | `#DDE6EF` | Border input dan kartu |
| `neutral-300` | `#C6D1DC` | Disabled border |
| `neutral-400` | `#95A3B3` | Placeholder |
| `neutral-500` | `#66758A` | Secondary text |
| `neutral-600` | `#4A596C` | Body strong |
| `neutral-700` | `#334155` | Label |
| `neutral-800` | `#1E293B` | Heading |
| `neutral-900` | `#0F1F33` | Main text |

### 4.3 Semantic Colors

| Status | Background | Foreground | Border |
|---|---|---|---|
| Success | `#EAF8F0` | `#18794E` | `#BFE8D1` |
| Warning | `#FFF7E6` | `#A15C00` | `#F3D49A` |
| Danger | `#FFF0F0` | `#C0362C` | `#F4C2BE` |
| Info | `#EFF8FF` | `#0875D1` | `#B9DFFF` |
| Pending | `#F5F1FF` | `#6D4CC4` | `#D8CBF7` |

### 4.4 Status Mapping

- Kamar tersedia: Success
- Kamar terisi: Brand
- Kamar dipesan: Pending
- Kamar maintenance: Warning
- Kamar nonaktif: Neutral
- Tagihan lunas: Success
- Tagihan belum lunas: Warning
- Tagihan terlambat: Danger
- Pembayaran diperiksa: Pending
- Keluhan selesai: Success
- Keluhan diproses: Brand
- Keluhan darurat: Danger

### 4.5 Gradient

Gunakan gradient hanya untuk area penting.

```text
Hero Soft Blue:
#F7FBFF → #E7F4FF

Primary Accent:
#168BF2 → #51B4FF

Navy Header:
#102B47 → #174A72
```

Gradient tidak boleh dipakai pada semua card.

---

## 5. Typography

### 5.1 Font Family

Gunakan dua keluarga font yang tersedia melalui Expo Google Fonts:

- **Manrope** — heading, angka finansial, navigation label penting.
- **Inter** — body, input, caption, tabel, dan informasi panjang.

Fallback:

```text
Manrope, Inter, system-ui, sans-serif
```

### 5.2 Font Weights

- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extra Bold: 800, hanya untuk angka atau hero tertentu

### 5.3 Mobile Type Scale

| Token | Font | Size | Line Height | Weight | Penggunaan |
|---|---|---:|---:|---:|---|
| `display-lg` | Manrope | 32 | 40 | 700 | Hero publik |
| `display-sm` | Manrope | 28 | 36 | 700 | Welcome dashboard |
| `title-xl` | Manrope | 24 | 32 | 700 | Judul layar |
| `title-lg` | Manrope | 20 | 28 | 700 | Judul section besar |
| `title-md` | Manrope | 18 | 26 | 600 | Judul card |
| `title-sm` | Manrope | 16 | 24 | 600 | Subsection |
| `body-lg` | Inter | 16 | 24 | 400 | Body utama |
| `body-md` | Inter | 14 | 21 | 400 | Konten default |
| `body-sm` | Inter | 13 | 19 | 400 | Metadata |
| `label-lg` | Inter | 15 | 20 | 600 | Tombol besar |
| `label-md` | Inter | 13 | 18 | 600 | Chip dan tab |
| `caption` | Inter | 12 | 17 | 500 | Timestamp dan helper |
| `micro` | Inter | 10 | 14 | 600 | Label grafik |
| `money-lg` | Manrope | 28 | 34 | 800 | Total tagihan |
| `money-md` | Manrope | 20 | 26 | 700 | Harga kamar |

### 5.4 Typography Rules

- Heading maksimal dua baris.
- Harga selalu memakai Manrope Bold atau Extra Bold.
- Body panjang memakai Inter Regular.
- Jangan memakai huruf kapital semua kecuali micro label tertentu.
- Gunakan tabular numbers untuk angka laporan bila tersedia.
- Format uang: `Rp1.250.000`, bukan `Rp 1,250,000`.
- Format tanggal: `12 Agustus 2026`.
- Gunakan kalimat langsung, bukan label yang terlalu panjang.

---

## 6. Spacing, Radius, dan Elevation

### 6.1 Spacing Scale

Gunakan dasar 4 pt.

| Token | Nilai |
|---|---:|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 20 |
| `space-6` | 24 |
| `space-8` | 32 |
| `space-10` | 40 |
| `space-12` | 48 |
| `space-16` | 64 |

### 6.2 Radius

| Token | Nilai | Penggunaan |
|---|---:|---|
| `radius-xs` | 8 | Badge kecil |
| `radius-sm` | 12 | Input dan list row |
| `radius-md` | 16 | Button dan card biasa |
| `radius-lg` | 20 | Card utama |
| `radius-xl` | 28 | Hero card dan sheet |
| `radius-pill` | 999 | Chip dan segmented control |

### 6.3 Shadow

#### Card subtle

```text
shadowColor: #102B47
shadowOpacity: 0.07
shadowRadius: 16
shadowOffset: 0 8
elevation: 2
```

#### Floating navigation

```text
shadowColor: #102B47
shadowOpacity: 0.12
shadowRadius: 24
shadowOffset: 0 12
elevation: 8
```

#### Modal

```text
shadowColor: #0F1F33
shadowOpacity: 0.18
shadowRadius: 32
shadowOffset: 0 16
elevation: 12
```

### 6.4 Border

- Default border: 1 px `neutral-200`.
- Focus border: 1.5 px `brand-500`.
- Error border: 1.5 px semantic danger.
- Divider: 1 px `neutral-100`.
- Card berfoto boleh tanpa border jika shadow sudah jelas.

---

## 7. Iconography dan Imagery

### 7.1 Icon Set

Gunakan **Lucide React Native** sebagai ikon utama.

Aturan:

- Stroke 1.8–2 px.
- Ukuran umum 20–24 px.
- Ikon tombol kecil 18–20 px.
- Ikon dekoratif card 24–28 px.
- Jangan mencampur ikon filled dan outline tanpa alasan status.

### 7.2 Ikon Utama

- Beranda: `House`
- Kamar: `BedDouble`
- Tagihan: `ReceiptText`
- Pembayaran: `WalletCards`
- Penghuni: `Users`
- Keluhan: `Wrench`
- Pengumuman: `Megaphone`
- Booking: `CalendarDays`
- Laporan: `ChartNoAxesCombined`
- Profil: `CircleUserRound`
- Notifikasi: `Bell`
- Lokasi: `MapPin`

### 7.3 Foto

- Foto kamar harus terang, realistis, dan tidak terlalu HDR.
- Rasio utama card kamar: 4:3.
- Hero detail kamar: 16:10 atau 4:3.
- Galeri thumbnail: 1:1.
- Gunakan `expo-image` dan placeholder blur.
- Foto tidak boleh tertutup teks terlalu banyak.
- Overlay foto maksimal 20–35% untuk keterbacaan.

### 7.4 Placeholder

Jika foto tidak tersedia:

- Gunakan background `brand-50`.
- Ikon `BedDouble` ukuran 32 px.
- Teks kecil “Foto belum tersedia”.
- Jangan memakai stok foto acak.

---

## 8. Layout System

### 8.1 Mobile Canvas

Mockup utama dibuat pada:

- Lebar: 390 px
- Tinggi referensi: 844 px
- Horizontal padding: 20 px
- Gap antar-section: 24–28 px
- Safe area harus dihormati.
- Bottom content padding: minimal 104 px jika bottom navigation aktif.

### 8.2 Mobile Grid

- 4 columns.
- Gutter 12 px.
- Margin 20 px.
- Card utama biasanya span 4 columns.
- Quick action dapat memakai 4 item satu baris atau 2×2.

### 8.3 Tablet

- Lebar konten maksimal 720 px untuk tenant.
- Owner menggunakan dua kolom pada dashboard.
- Form dapat dibagi menjadi dua kolom.

### 8.4 Web

#### Public Web

- Max width 1280 px.
- 12-column grid.
- Hero dua kolom: copy dan galeri properti.
- Navbar sticky dengan background putih transparan ringan.

#### Owner Web

- Sidebar 264 px.
- Top bar 72 px.
- Content padding 32 px.
- Grid dashboard 12 kolom.
- Tabel digunakan hanya ketika datanya padat.

#### Tenant Web

- Max width 960 px.
- Struktur card tetap mirip mobile.
- Tidak perlu sidebar besar.

---

## 9. Navigation

### 9.1 Guest Mobile

```text
Beranda
Kamar
Fasilitas
Tentang
Login
```

Guest tidak wajib memakai bottom navigation. Gunakan top bar dan CTA yang jelas.

### 9.2 Tenant Bottom Navigation

Maksimal lima item:

```text
Beranda
Tagihan
Sewa
Keluhan
Profil
```

Spesifikasi:

- Tinggi visual 72 px ditambah safe area.
- Background putih.
- Radius atas 24 px jika floating.
- Item aktif memakai lingkaran atau pill biru lembut.
- Label aktif berwarna `brand-600`.
- Label nonaktif `neutral-500`.
- Hindari tombol tengah besar jika tidak ada aksi yang benar-benar utama.

### 9.3 Owner Bottom Navigation

```text
Dashboard
Kamar
Transaksi
Penghuni
Menu
```

Menu membuka bottom sheet berisi:

- Booking
- Tagihan
- Pembayaran
- Keluhan
- Pengumuman
- Laporan
- Pengaturan

### 9.4 Top Bar

Jenis:

1. **Home header** — avatar, salam, nama properti, notifikasi.
2. **Standard header** — tombol kembali, judul, optional action.
3. **Image header** — tombol kembali dan bookmark/aksi di atas foto.
4. **Owner web top bar** — judul halaman, search, notification, profile.

---

## 10. Component System

Semua komponen harus memiliki state default, pressed, focus, disabled, loading, success, dan error bila relevan.

### 10.1 Button

#### Primary Button

- Tinggi 52 px.
- Radius 16 px.
- Background `brand-500`.
- Label putih, Inter 15/600.
- Ikon opsional 20 px.
- Pressed: `brand-600`.
- Disabled: `neutral-200`, teks `neutral-400`.

#### Secondary Button

- Background `brand-50`.
- Teks `brand-700`.
- Border `brand-200`.

#### Outline Button

- Background transparan.
- Border `neutral-200`.
- Teks `neutral-800`.

#### Destructive Button

- Background danger foreground.
- Hanya untuk aksi yang benar-benar merusak.

#### Floating Arrow Button

Mengadaptasi CTA bulat pada screenshot.

- Ukuran 52×52 px.
- Lingkaran biru.
- Ikon panah putih.
- Digunakan di card harga atau next step, bukan di semua halaman.

### 10.2 Icon Button

- Ukuran sentuh minimal 44×44 px.
- Visual container 40×40 px.
- Radius 14 atau pill.
- Background putih atau brand-50.
- Harus memiliki accessibility label.

### 10.3 Input

- Tinggi minimal 52 px.
- Radius 14 px.
- Border `neutral-200`.
- Label di atas input, bukan placeholder-only.
- Error text di bawah input.
- Prefix/suffix icon opsional.

Jenis input:

- Text
- Currency
- Phone
- Date picker
- Select
- Search
- Text area
- Upload area

### 10.4 Search Field

- Tinggi 50 px.
- Radius 18 px.
- Ikon search kiri.
- Tombol filter kecil di kanan.
- Guest search hanya mencari kamar atau fasilitas di properti ini, bukan kos lain.

### 10.5 Chip

Jenis:

- Filter chip
- Status chip
- Facility chip
- Choice chip

Aturan:

- Tinggi 34–38 px.
- Radius pill.
- Label 13/600.
- Status chip maksimal satu atau dua per card.
- Jangan membuat setiap metadata menjadi badge.

### 10.6 Segmented Control

Digunakan untuk:

- Bulanan / Harian / Per jam
- Aktif / Selesai
- Grid / List
- Pendapatan / Okupansi

Spesifikasi:

- Container `neutral-100`.
- Active segment putih dengan shadow tipis.
- Tinggi 42 px.
- Radius 14 px.

### 10.7 Section Header

Isi:

- Judul kiri.
- Optional subtitle.
- Link “Lihat semua” kanan.

Judul tidak boleh terlalu besar. Section header harus memberi jeda jelas antara kelompok informasi.

### 10.8 Room Card

#### Public Room Card

- Foto 4:3.
- Status tersedia di atas foto.
- Nama kamar.
- Harga per bulan.
- Maksimal tiga fasilitas ringkas.
- CTA “Lihat detail”.
- Tidak menampilkan rating palsu.

#### Owner Room Card

- Kode kamar besar.
- Status kamar.
- Nama tenant aktif jika ada.
- Jatuh tempo berikutnya.
- Quick action melalui menu tiga titik.

#### Compact Room Card

Dipakai untuk carousel atau dashboard.

- Lebar 210–230 px.
- Foto dengan overlay lembut.
- Nama kamar dan harga.
- Maksimal satu status chip.

### 10.9 Lease Summary Card

Kartu utama tenant, menggantikan kartu “recently visited” pada screenshot.

Isi:

- Label “Sewa aktif”.
- Kamar, contoh: `Kamar A03`.
- Periode sewa.
- Progress sisa masa sewa.
- Status pembayaran terbaru.
- CTA “Lihat sewa”.

Visual:

- Background navy gradient.
- Teks putih.
- Ilustrasi kecil kunci atau rumah, bukan gambar dekoratif berlebihan.

### 10.10 Invoice Card

Isi:

- Nomor invoice.
- Jenis tagihan.
- Total.
- Jatuh tempo.
- Status.
- CTA sesuai kondisi.

CTA:

- Belum dibayar: `Bayar sekarang`.
- Diperiksa: `Lihat pembayaran`.
- Lunas: `Lihat kuitansi`.
- Terlambat: `Bayar sekarang` dengan danger indicator.

### 10.11 Payment Card

- Metode pembayaran.
- Jumlah.
- Tanggal.
- Status verifikasi.
- Thumbnail bukti pembayaran opsional.
- Alasan penolakan hanya muncul bila status rejected.

### 10.12 Complaint Card

- Kategori dan judul.
- Status progress.
- Tanggal dibuat.
- Urgensi.
- Foto kecil jika ada.
- Timeline mini maksimum tiga langkah.

### 10.13 Announcement Card

- Ikon megaphone.
- Judul.
- Ringkasan dua baris.
- Waktu publikasi.
- Indicator penting hanya jika benar-benar penting.

### 10.14 Stat Card

#### Mobile

- Dua card per baris.
- Nilai besar.
- Label pendek.
- Optional delta kecil.

#### Owner Web

- Empat card per baris.
- Ikon hanya sebagai penanda, bukan fokus.

### 10.15 Chart Card

- Background putih.
- Heading dan filter periode.
- Grafik tidak memakai lebih dari tiga warna.
- Tooltip sederhana.
- Empty state bila data kosong.
- Angka utama tetap ditulis, jangan mengandalkan grafik saja.

### 10.16 Bottom Sheet

Digunakan untuk:

- Filter
- Pilih metode pembayaran
- Menu owner
- Pilih tanggal
- Confirm action ringan

Spesifikasi:

- Radius atas 28 px.
- Drag handle 40×4 px.
- Padding 20–24 px.
- CTA sticky di bawah jika form panjang.

### 10.17 Modal

Modal hanya untuk:

- Konfirmasi destructive.
- Verifikasi pembayaran.
- Aksi singkat yang tidak layak menjadi halaman baru.

Form panjang harus menjadi screen atau bottom sheet penuh.

### 10.18 Toast

- Muncul di bagian atas atau bawah, tidak menutup bottom navigation.
- Maksimum dua baris.
- Success, error, warning, info.
- Dismiss otomatis 3–5 detik, kecuali error kritis.

### 10.19 Skeleton

- Mengikuti bentuk konten asli.
- Gunakan neutral-100 dan neutral-50.
- Tidak memakai shimmer terlalu cepat.

### 10.20 Empty State

Struktur:

1. Ikon atau ilustrasi sederhana.
2. Judul spesifik.
3. Penjelasan singkat.
4. Satu CTA jika relevan.

Contoh:

> Belum ada tagihan aktif  
> Tagihan baru dari owner akan muncul di sini.

---

## 11. Mockup Utama

Bagian ini menjadi arahan high-fidelity mockup. Gunakan canvas 390×844 px.

## 11.1 Tenant Home — Mockup A

Layar ini mengadaptasi komposisi home pada screenshot, tetapi konteksnya adalah penghuni kos.

### Struktur vertikal

#### A. Header

- Safe area atas.
- Avatar kiri.
- Teks kecil: `Selamat sore`.
- Teks utama: nama tenant.
- Nama properti: `Manzsa Residence`.
- Tombol notifikasi kanan dengan dot jika ada notifikasi baru.

#### B. Lease Summary Card

Kartu navy besar dengan radius 24 px.

Isi:

- Label `Sewa aktif`.
- `Kamar A03`.
- `Berakhir 28 September 2026`.
- Progress bar masa sewa.
- Tombol outline kecil `Lihat detail`.

Kartu harus menjadi fokus utama layar.

#### C. Search atau Quick Access Container

Bukan pencarian kos. Gunakan container putih yang berisi:

- Search: `Cari tagihan, pengumuman, atau bantuan`.
- Tombol filter kecil.
- Quick action horizontal:
  - Bayar tagihan
  - Keluhan
  - Hubungi owner
  - Pengumuman

#### D. Active Bill Section

Section title: `Tagihan aktif` dan `Lihat semua`.

Card tagihan berisi:

- `Sewa Agustus 2026`.
- `Rp1.250.000`.
- `Jatuh tempo 10 Agustus`.
- Status belum dibayar.
- CTA `Bayar sekarang`.

#### E. Announcement Section

Carousel card kecil:

- Pemeliharaan air.
- Jadwal kebersihan.
- Informasi listrik.

#### F. Bottom Navigation

- Home aktif.
- Tagihan.
- Sewa.
- Keluhan.
- Profil.

Visual floating putih dengan shadow lembut seperti screenshot.

---

## 11.2 Public Room Detail — Mockup B

Layar ini mengadaptasi screen detail properti pada screenshot.

### Struktur

#### A. Hero Image

- Foto kamar memenuhi bagian atas 300–340 px.
- Gradient putih dari transparan ke putih di bagian bawah.
- Tombol back kiri.
- Tombol bookmark atau share kanan.
- Nama kamar di atas foto atau tepat setelahnya.

#### B. Main Information

- Status: `Tersedia`.
- Nama: `Kamar Deluxe A05`.
- Lokasi ringkas: `Manzsa Residence, Jatiwangi`.
- Luas dan kapasitas.
- Harga: `Rp1.350.000/bulan`.

Tidak perlu jarak dalam kilometer karena ini bukan aplikasi pencarian resort.

#### C. Gallery Thumbnails

- 4–5 thumbnail horizontal.
- Thumbnail aktif memakai border brand.
- Thumbnail terakhir dapat menampilkan `+6`.

#### D. Facilities

Card fasilitas 4 kolom:

- Tempat tidur
- Kamar mandi dalam
- Wi-Fi
- Lemari

Gunakan ikon kecil dan label dua baris maksimal.

#### E. Detail

- Deskripsi kamar.
- Aturan singkat.
- Deposit.
- Minimum sewa.
- Tombol `Lihat semua detail` bila konten panjang.

#### F. Sticky Price Bar

Bottom card putih dengan radius 24 px.

- Harga kiri.
- Keterangan `/bulan`.
- Tombol bulat panah atau tombol `Ajukan booking` kanan.

---

## 11.3 Owner Dashboard — Mockup C

### Header

- Salam dan nama owner.
- Property switch tidak diperlukan pada MVP.
- Notification icon.

### Summary Hero

Card biru muda atau navy lembut:

- Pendapatan bulan ini.
- Persentase dibanding bulan lalu.
- CTA `Lihat laporan`.

### Stat Grid

2×2:

- Kamar terisi.
- Kamar tersedia.
- Tagihan belum lunas.
- Keluhan aktif.

### Quick Actions

- Tambah penghuni.
- Buat tagihan.
- Catat pembayaran.
- Tambah kamar.

### Upcoming Section

- Tagihan jatuh tempo.
- Lease segera berakhir.
- Booking menunggu persetujuan.

### Recent Activity

List dengan timeline sederhana.

---

## 12. Screen Specifications

## 12.1 Splash Screen

- Background `neutral-25` atau soft blue gradient.
- Logo atau wordmark di tengah.
- Tidak lebih dari 1.5–2 detik jika data sudah siap.
- Tidak memakai ilustrasi besar.

## 12.2 Login

- Header ringan dengan foto properti kecil atau pattern lembut.
- Judul: `Masuk ke Manzsa Residence`.
- Input email dan password.
- CTA primary penuh.
- Link lupa password.
- Tidak ada registrasi publik owner.
- Tenant aktivasi akun lewat undangan.

## 12.3 Public Home

Section:

1. Hero kos.
2. Keunggulan utama.
3. Kamar tersedia.
4. Fasilitas.
5. Galeri.
6. Lokasi.
7. FAQ.
8. Kontak owner.

Tidak ada search berdasarkan kota.

## 12.4 Room List

- Header dengan jumlah kamar tersedia.
- Segmented control jenis sewa jika fitur diaktifkan.
- Filter harga dan fasilitas.
- Grid dua kolom pada mobile hanya jika card tetap terbaca; default satu kolom.
- Guest hanya melihat kamar yang dipublikasikan.

## 12.5 Tenant Invoices

- Summary total belum dibayar.
- Filter: Aktif, Diperiksa, Lunas.
- Invoice cards.
- Empty state yang spesifik.

## 12.6 Invoice Detail

- Nomor invoice.
- Status besar.
- Breakdown item.
- Total.
- Jatuh tempo.
- Payment history.
- Sticky CTA sesuai status.

## 12.7 Upload Payment Proof

- Ringkasan rekening owner.
- Input jumlah.
- Tanggal transfer.
- Upload bukti.
- Catatan opsional.
- Preview foto.
- CTA submit.
- Setelah submit tampilkan state `Sedang diperiksa`.

## 12.8 Lease Detail

- Kamar dan status.
- Periode sewa.
- Harga snapshot.
- Deposit.
- Aturan.
- Riwayat perpanjangan.
- CTA hubungi owner.

## 12.9 Complaint List

- Filter status.
- Tombol buat keluhan.
- Complaint cards.
- Keluhan aktif tampil di atas.

## 12.10 Complaint Detail

- Judul dan kategori.
- Urgensi.
- Timeline status.
- Foto.
- Catatan owner.
- Estimasi penyelesaian.
- Tombol konfirmasi selesai bila status resolved.

## 12.11 Owner Rooms

- Summary jumlah kamar berdasarkan status.
- Search kamar.
- Filter status.
- Toggle grid/list.
- Floating button tambah kamar.
- Room card owner.

## 12.12 Owner Room Detail

- Galeri.
- Status.
- Tenant aktif.
- Detail harga.
- Histori sewa.
- Tombol edit.
- Menu status maintenance atau arsip.

## 12.13 Owner Tenants

- Search nama atau nomor kamar.
- Filter aktif, akan berakhir, keluar.
- Tenant list row:
  - Avatar.
  - Nama.
  - Kamar.
  - Jatuh tempo.
  - Status pembayaran.

## 12.14 Owner Transactions

Gunakan top tabs:

- Tagihan
- Pembayaran

Summary card:

- Total belum lunas.
- Pembayaran menunggu verifikasi.

## 12.15 Payment Verification

- Foto bukti besar dan dapat di-zoom.
- Data pengirim.
- Jumlah.
- Waktu transfer.
- Invoice terkait.
- Tombol tolak dan verifikasi.
- Penolakan wajib mengisi alasan.

## 12.16 Reports

### Mobile

- Filter periode di atas.
- Summary card.
- Grafik sederhana.
- Breakdown list.
- Tombol ekspor.

### Web

- Filter horizontal.
- Stat cards.
- Grafik dua kolom.
- Tabel detail.

---

## 13. Interaction States

### Loading

- Skeleton untuk halaman data.
- Spinner hanya untuk tombol atau proses pendek.
- Jangan menampilkan layar kosong dengan spinner besar terlalu lama.

### Offline

Banner ringan:

> Sedang offline. Perubahan akan disinkronkan saat koneksi kembali.

Aksi berisiko seperti verifikasi pembayaran harus menunggu koneksi stabil.

### Error

Pesan harus menjelaskan apa yang gagal dan langkah berikutnya.

**Benar:**

> Bukti pembayaran belum berhasil dikirim. Periksa koneksi lalu coba lagi.

**Hindari:**

> Error 500.

### Success

Gunakan toast dan perubahan state, bukan modal besar untuk semua keberhasilan.

### Confirmation

Konfirmasi hanya untuk:

- Menghapus atau mengarsipkan data.
- Membatalkan booking.
- Mengakhiri lease.
- Menolak pembayaran.
- Mengubah status kritis.

---

## 14. Motion Guidelines

Gunakan motion singkat dan fungsional.

- Button press: 100–150 ms.
- Card entrance: 180–240 ms.
- Bottom sheet: spring lembut.
- Tab indicator: 180 ms.
- Success check: 300–450 ms.
- Hindari parallax, bouncing berlebihan, dan animasi dekoratif looping.

Gunakan `react-native-reanimated` hanya ketika memberi feedback atau membantu orientasi.

---

## 15. Accessibility

- Minimum contrast teks normal 4.5:1.
- Touch target minimal 44×44 px.
- Jangan menyampaikan status hanya melalui warna.
- Semua icon-only button memiliki accessibility label.
- Form memiliki label yang jelas.
- Error terhubung dengan input terkait.
- Support font scaling sampai 130% tanpa layout rusak.
- Grafik memiliki ringkasan teks.
- Bottom sheet dapat ditutup dengan tombol, bukan gesture saja.
- Foto bukti pembayaran hanya bisa diakses user terkait.

---

## 16. Responsive Behavior

### Mobile kecil, 320–359 px

- Horizontal padding turun menjadi 16 px.
- Quick actions menjadi horizontal scroll atau 2×2.
- Harga dan status tidak boleh saling menabrak.
- Bottom navigation hanya memakai label pendek.

### Mobile normal, 360–430 px

- Gunakan layout utama desain.
- Dua stat cards per baris.

### Tablet, 768 px+

- Dashboard dua kolom.
- Detail dan side summary dapat berdampingan.
- Bottom nav dapat berubah menjadi navigation rail.

### Web, 1024 px+

- Owner memakai sidebar.
- Tabel ditampilkan untuk data padat.
- Detail dapat memakai master-detail.

---

## 17. React Native Implementation Notes

### 17.1 Suggested Structure

```text
app/
├── (public)/
│   ├── index.tsx
│   ├── rooms/
│   └── login.tsx
├── (tenant)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── invoices/
│   ├── lease/
│   ├── complaints/
│   └── profile/
├── (owner)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── rooms/
│   ├── tenants/
│   ├── transactions/
│   ├── bookings/
│   ├── complaints/
│   ├── reports/
│   └── settings/
└── _layout.tsx

src/
├── components/
│   ├── ui/
│   ├── rooms/
│   ├── invoices/
│   ├── payments/
│   ├── complaints/
│   └── dashboard/
├── design/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── theme.ts
├── hooks/
├── services/
├── store/
├── types/
└── utils/
```

### 17.2 Theme Token Example

```ts
export const colors = {
  brand: {
    50: '#EFF8FF',
    100: '#DDEFFF',
    200: '#B9DFFF',
    300: '#82C5FF',
    400: '#45A8FF',
    500: '#168BF2',
    600: '#0875D1',
    700: '#075DA5',
    800: '#10446F',
    900: '#102B47',
  },
  neutral: {
    0: '#FFFFFF',
    25: '#FBFDFF',
    50: '#F5F9FD',
    100: '#EDF2F7',
    200: '#DDE6EF',
    300: '#C6D1DC',
    400: '#95A3B3',
    500: '#66758A',
    600: '#4A596C',
    700: '#334155',
    800: '#1E293B',
    900: '#0F1F33',
  },
} as const;
```

### 17.3 Component Rules

- Komponen tidak boleh memiliki warna hardcoded di screen.
- Semua warna, radius, spacing, dan typography mengambil token.
- Gunakan variant props untuk status.
- Hindari satu file screen lebih dari sekitar 250–350 baris.
- Extract section menjadi komponen jika memiliki state atau dipakai ulang.
- Gunakan `Pressable` untuk interaction state.
- Gunakan `SafeAreaView` atau safe-area inset.
- Gunakan `KeyboardAvoidingView` pada form.

### 17.4 Image Handling

- Gunakan `expo-image`.
- Cache foto kamar.
- Kompres sebelum upload.
- Tampilkan progress upload.
- Gunakan aspect ratio konsisten.

### 17.5 Web Notes

- React Native Web dipakai untuk tenant dan public app.
- Owner dashboard web boleh memiliki layout khusus desktop.
- Hover state ditambahkan pada button, table row, dan card clickable.
- Keyboard navigation harus berfungsi.
- Jangan memaksakan bottom navigation mobile ke desktop owner.

---

## 18. Content Design

### Button Labels

Gunakan kata kerja yang jelas:

- Bayar sekarang
- Kirim bukti
- Verifikasi pembayaran
- Tolak pembayaran
- Tambah kamar
- Buat tagihan
- Ajukan booking
- Buat keluhan
- Simpan perubahan

Hindari:

- Submit
- Proceed
- Continue, jika bisa diganti lebih spesifik
- Click here

### Status Labels

Gunakan Bahasa Indonesia di UI:

| Data | Label UI |
|---|---|
| available | Tersedia |
| reserved | Dipesan |
| occupied | Terisi |
| maintenance | Perbaikan |
| inactive | Nonaktif |
| unpaid | Belum dibayar |
| pending_verification | Sedang diperiksa |
| paid | Lunas |
| overdue | Terlambat |
| submitted | Dikirim |
| in_progress | Sedang ditangani |
| resolved | Selesai |

Enum tetap memakai Bahasa Inggris di kode.

---

## 19. Anti AI-Slop Checklist

Sebelum screen dianggap selesai, periksa:

- Apakah setiap section benar-benar dibutuhkan?
- Apakah ada badge yang sebenarnya hanya metadata biasa?
- Apakah gradient dipakai terlalu sering?
- Apakah radius semua elemen terlalu besar?
- Apakah shadow terlalu tebal?
- Apakah card terlalu banyak sehingga hierarki hilang?
- Apakah ada copy generik seperti “Temukan pengalaman terbaik”?
- Apakah foto properti masih menjadi fokus?
- Apakah CTA utama langsung terlihat?
- Apakah UI masih jelas ketika data kosong?
- Apakah screen ini terasa seperti pengelolaan satu kos, bukan marketplace?

---

## 20. Design Acceptance Criteria

Desain dianggap sesuai jika:

1. Tenant dapat memahami tagihan aktif dan jatuh tempo kurang dari lima detik.
2. Owner dapat melihat kondisi kamar dan tagihan tertunda tanpa membuka menu tambahan.
3. Public room detail menampilkan foto, harga, fasilitas, dan CTA booking di satu alur yang jelas.
4. Bottom navigation tidak lebih dari lima item.
5. Seluruh status memiliki teks, bukan warna saja.
6. Semua tombol utama memiliki touch target minimal 44 px.
7. Tidak ada fitur marketplace kos lain atau pencarian lintas kota.
8. Typography, spacing, radius, dan warna memakai token konsisten.
9. Layout tetap usable pada lebar 320 px.
10. Tampilan web owner memakai sidebar dan memanfaatkan ruang desktop.
11. Gradient dan shadow digunakan terbatas.
12. Mockup utama terasa dekat dengan referensi screenshot tanpa menjadi salinan langsung.

---

## 21. Final Visual Summary

Manzsa Residence harus terlihat sebagai aplikasi kos yang modern dan matang:

- Background putih kebiruan.
- Biru terang sebagai primary action.
- Navy sebagai anchor visual.
- Foto kamar besar dan nyata.
- Card lembut dengan border tipis.
- Manrope untuk heading dan angka.
- Inter untuk informasi operasional.
- Bottom navigation ringan dan floating pada mobile.
- Owner dashboard lebih padat tetapi tetap bersih.
- Tidak ada elemen marketplace, rating palsu, atau listing kos mitra.

Dokumen ini harus dipakai sebagai sumber utama saat membuat mockup, komponen React Native, layout React Native Web, dan evaluasi konsistensi UI.
