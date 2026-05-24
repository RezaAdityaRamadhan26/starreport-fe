# StarReport Frontend

StarReport adalah aplikasi Pelaporan Masyarakat modern bergaya SaaS. Proyek ini merupakan bagian *frontend* yang dibangun menggunakan Next.js 16 (App Router) dan telah terhubung penuh dengan *backend* Express.js (`http://localhost:8000`).

---

## 🚀 Arsitektur & Teknologi

Proyek ini dibangun dengan *tech stack* dan alat modern berikut:

- **Framework**: Next.js 16 (App Router) dengan TypeScript.
- **Styling**: Tailwind CSS v4 untuk *utility-first styling* tanpa dependensi eksternal yang berat.
- **State Management**: Zustand (`authStore.ts`) untuk menyimpan data otentikasi (user, token) secara persisten di `localStorage`.
- **API Client**: Axios (`lib/api.ts`) dengan *interceptor* untuk otomatis menyisipkan JWT token di setiap *request* dan menangani *redirect* saat sesi *expired* (401/403).
- **Icons**: Lucide React untuk ikon yang ringan, minimalis, dan konsisten.
- **Notifications**: React Hot Toast untuk notifikasi (*toast*) modern dan elegan.

---

## 🎨 Konsep Desain (UI/UX)

Desain aplikasi ini telah dirombak total dari tema bawaan (gelap) menjadi tema terang (*Light Theme*) yang terinspirasi dari aplikasi SaaS kelas dunia (*Silicon Valley-level SaaS* seperti Vercel, Linear, dan Stripe):

1. **Light Theme & Flat Design**: Menggunakan latar belakang sangat terang (`bg-slate-50`), *card* putih bersih (`bg-white`), dan meminimalisir *drop shadow* tebal. Semua elemen menggunakan desain *flat* dengan *border* sangat tipis (`border-slate-200`).
2. **Emerald Accent**: Warna *emerald* (`emerald-500` / `#10B981`) digunakan secara eksklusif sebagai warna *accent* untuk tombol utama, efek *hover*, dan cincin fokus (*focus ring*) saat input aktif.
3. **Typography & Spacing**: Menggunakan font **Inter** dengan *tracking* ketat pada judul besar. Ruang kosong (*whitespace*) dimaksimalkan dengan *padding* ganda (`p-6` hingga `p-8`) agar antarmuka terasa lapang dan profesional.
4. **Bento Grid**: *Layout dashboard* dan fitur di halaman *landing* menggunakan pendekatan *Asymmetrical Bento Grids* yang kekinian dibandingkan kolom kaku tradisional.
5. **Micro-animations**: Menggunakan utilitas CSS kustom (`animate-fade-in`, `animate-fade-up`, `stagger`) untuk memberikan transisi halus seperti aplikasi *native*.

---

## 📂 Struktur Halaman & Fitur

Aplikasi ini memiliki sistem *routing* berbasis *role* (Pengguna Biasa, Admin, dan Super Admin):

### 1. Landing & Auth (`/`, `/login`, `/register`)
- **Landing Page**: Dilengkapi dengan tipografi besar (*massive tracking*), *badge* modern, dan *Bento Grid* fitur yang menganimasikan dirinya saat dimuat.
- **Auth**: *Card login/register* rata tengah (*centered flat cards*) dengan desain minimal. Form *register* menyertakan validasi kecocokan *password* (minimal 6 karakter).

### 2. User Dashboard (Citizen View)
Pengguna reguler mendapatkan tampilan lapang tanpa *sidebar*, menggunakan Navigasi Atas (*Top Navbar*) dengan efek *backdrop blur*.
- **Dashboard (`/dashboard`)**: Metrik ringkas (*total laporan*, *diproses*, *ditolak*) dalam kartu *bento*. Menampilkan *preview* singkat laporan terbaru.
- **Buat Laporan (`/dashboard/reports/create`)**: Proses berbasis *Wizard* 3 tahap (*Info -> Lampiran -> Review*). Memiliki area *Drag & Drop* untuk mengunggah gambar.
- **Laporan Saya (`/dashboard/my-reports`)**: Daftar seluruh laporan yang pernah dibuat pengguna yang masuk.
- **Semua Laporan (`/dashboard/reports`)**: *Feed* laporan publik dengan kartu yang rapi (menampilkan *thumbnail* gambar dan *soft pill status badges*). Terdapat filter pencarian, status, dan kategori, lengkap dengan *pagination*.

### 3. Admin & Super Admin Management
Admin dan Super Admin mendapatkan tampilan profesional dengan **Slim Collapsible Sidebar** di sebelah kiri (dengan *toggle* tutup/buka bergaya Apple).
- **Admin Dashboard**: Metrik lebih komprehensif menampilkan ringkasan laporan seluruh platform.
- **Detail Laporan & Interaksi (`/dashboard/reports/[id]`)**: Halaman detail dengan fitur ubah status (bagi admin) menggunakan *dropdown* minimalis sebaris. Komentar dirender menggunakan pola gelembung obrolan (*threaded chat-bubble style*) untuk membedakan antara balasan pelapor dan balasan admin/petugas.
- **Manajemen Pengguna (`/dashboard/users`) - Hanya Super Admin**: Tabel tanpa garis vertikal, hanya pemisah horizontal tipis. Menggunakan **Apple-style segmented toggle** untuk merubah peran *user* secara instan.

### 4. Pengaturan (`/dashboard/settings`)
Halaman universal untuk semua peran untuk mengubah kata sandi dengan validasi keamanan.

---

## 🔗 Integrasi dengan Backend

Aplikasi *frontend* ini tersambung ke `http://localhost:8000/api`. Seluruh logika komunikasi diabstraksikan melalui folder `src/services/`:
- `authService.ts`: Mengatur login, registrasi, dan perubahan password.
- `reportService.ts`: Mengatur CRUD laporan, upload *multipart/form-data* (gambar), dan pengambilan data statistik.
- `commentService.ts`: Mengatur diskusi/komentar pada sebuah laporan.
- `categoryService.ts`: Mengambil referensi kategori.
- `userService.ts`: Mengatur pergantian hak akses (*roles*) dan hapus pengguna (khusus Super Admin).

Gambar dari laporan secara langsung diakses dari Endpoint Statis Express backend: `http://localhost:8000/uploads/`.

---

## 💻 Cara Menjalankan

1. Pastikan backend Express (`starreport-be`) sudah berjalan di *port* `8000`.
2. Buka terminal di folder `starreport-fe`.
3. Instal semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan aplikasi di mode pengembangan:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di *browser* Anda. Aplikasi sudah dapat diakses dan digunakan sepenuhnya.
