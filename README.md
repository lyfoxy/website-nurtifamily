# NutriFamily

Website frontend untuk membantu pengguna mengelola persediaan bahan makanan, memantau stok, dan melihat inspirasi resep keluarga.

## Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Cara Menjalankan](#cara-menjalankan)
- [Panduan Menggunakan Website](#panduan-menggunakan-website)
- [Struktur Folder](#struktur-folder)
- [Fungsi File Penting](#fungsi-file-penting)
- [Penyimpanan Data](#penyimpanan-data)
- [Catatan Keamanan](#catatan-keamanan)
- [Mengatasi Masalah](#mengatasi-masalah)
- [Lisensi](#lisensi)

## Tentang Project

NutriFamily dibuat sebagai website frontend untuk membantu pengguna mengatur bahan makanan di rumah. Pengguna dapat melihat data persediaan, mengelola stok, serta menjelajahi resep.

Versi ini berjalan di browser dan belum menggunakan backend atau database eksternal.

## Fitur Utama

| Fitur | Keterangan |
| --- | --- |
| Beranda | Menampilkan halaman utama NutriFamily. |
| Akun pengguna | Registrasi, login, dan alur pemulihan kata sandi berbasis frontend. |
| Dashboard | Menampilkan ringkasan persediaan. |
| Manajemen stok | Menambah, melihat, mengubah, dan menghapus bahan makanan. |
| Data Master | Mengelola data pendukung seperti kategori, lokasi, atau satuan jika tersedia pada versi ini. |
| Resep | Melihat daftar resep dan detail resep. |
| Admin Panel | Mengelola katalog resep melalui halaman admin. |
| Laporan | Melihat ringkasan persediaan. |

## Teknologi

| Teknologi | Kegunaan |
| --- | --- |
| HTML5 | Menyusun struktur halaman. |
| CSS3 | Mengatur warna, tata letak, dan tampilan responsif. |
| Bootstrap 5.3.3 | Membantu membuat layout dan komponen antarmuka. |
| Bootstrap Icons | Menampilkan ikon. |
| JavaScript | Menangani interaksi dan logika frontend. |
| `localStorage` / `sessionStorage` | Menyimpan data dan status sesi di browser sesuai implementasi kode. |

Bootstrap, Bootstrap Icons, dan Google Fonts dapat dimuat melalui CDN. Karena itu, koneksi internet diperlukan untuk menampilkan aset eksternal tersebut.

## Cara Menjalankan

Project ini adalah website frontend statis. Kamu tidak perlu menjalankan `npm install` atau menyiapkan database untuk membuka versi ini.

### Opsi 1: Visual Studio Code dan Live Server

1. Unduh lalu ekstrak ZIP project.
2. Buka folder `nutrifamily` di Visual Studio Code.
3. Pasang ekstensi **Live Server** jika belum tersedia.
4. Buka file `index.html`.
5. Klik kanan pada file tersebut, lalu pilih **Open with Live Server**.
6. Website akan terbuka di browser. Alamatnya biasanya mirip dengan `http://127.0.0.1:5500/`.

### Opsi 2: Buka langsung di browser

1. Ekstrak ZIP project.
2. Masuk ke folder `nutrifamily`.
3. Klik dua kali `index.html`.

Untuk menguji navigasi dan fitur penyimpanan, Live Server lebih disarankan.

## Panduan Menggunakan Website

### Pengguna

1. Buka halaman beranda.
2. Pilih menu masuk atau daftar.
3. Buat akun jika diperlukan, lalu masuk.
4. Buka Dashboard untuk melihat ringkasan persediaan.
5. Gunakan menu stok untuk mengelola bahan makanan.
6. Buka halaman Resep untuk melihat daftar dan detail resep.
7. Buka Laporan untuk melihat ringkasan persediaan.

### Admin Panel

1. Buka halaman `pages/admin-login.html` melalui website yang sudah dijalankan.
2. Masukkan kredensial demo yang ditentukan di kode project.
3. Setelah berhasil masuk, gunakan halaman Admin Panel untuk mengelola resep.

Jika kredensial admin belum diketahui atau sudah diubah, periksa file `assets/js/auth.js` atau file JavaScript terkait autentikasi. Jangan menganggap kredensial demo sebagai akun untuk website produksi.

## Struktur Folder

```text
nutrifamily/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── enhance.css
│   ├── img/
│   │   └── file gambar dan aset visual
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── data.js
│       ├── enhance.js
│       ├── recipe.js
│       └── stock.js
└── pages/
    ├── add-ingredient.html
    ├── admin-login.html
    ├── admin.html
    ├── dashboard.html
    ├── delete-ingredient.html
    ├── delete-recipe.html
    ├── edit-ingredient.html
    ├── edit-recipe.html
    ├── forgot-password.html
    ├── login.html
    ├── master.html
    ├── recipe-detail.html
    ├── recipes.html
    ├── register.html
    ├── reports.html
    ├── reset-password.html
    └── stock.html
```

## Fungsi File Penting

| File atau folder | Fungsi |
| --- | --- |
| `index.html` | Halaman utama website. |
| `assets/css/style.css` | Gaya utama website. |
| `assets/css/components.css` | Gaya komponen seperti kartu, tombol, dan elemen antarmuka. |
| `assets/css/responsive.css` | Penyesuaian tampilan untuk ukuran layar berbeda. |
| `assets/css/enhance.css` | Tambahan atau penyempurnaan tampilan. |
| `assets/js/app.js` | Menangani interaksi umum dan inisialisasi fitur halaman. |
| `assets/js/auth.js` | Logika terkait registrasi, login, dan akses pengguna. |
| `assets/js/data.js` | Data dan fungsi penyimpanan yang digunakan aplikasi. |
| `assets/js/recipe.js` | Logika yang berkaitan dengan resep. |
| `assets/js/stock.js` | Logika yang berkaitan dengan persediaan bahan. |
| `assets/js/enhance.js` | Penyempurnaan interaksi atau tampilan tambahan. |
| `assets/img/` | Gambar, logo, ikon, dan aset visual website. |
| `pages/` | Halaman tambahan untuk pengguna dan admin. |

## Cara Mengubah Project

- **Mengubah teks atau isi halaman:** edit file HTML yang sesuai di `index.html` atau folder `pages/`.
- **Mengubah warna dan tampilan:** edit file CSS di `assets/css/`.
- **Mengubah logika fitur:** periksa file JavaScript yang sesuai di `assets/js/`.
- **Mengganti gambar:** letakkan gambar di `assets/img/`, lalu sesuaikan jalur gambar di file yang menggunakannya.

Pertahankan nama file dan struktur folder agar jalur CSS, JavaScript, gambar, dan tautan ant halaman tetap benar. Setelah mengedit, simpan file lalu refresh browser.

## Penyimpanan Data

Data pada versi frontend ini disimpan di browser sesuai implementasi JavaScript. Data tidak otomatis tersinkron ke browser, perangkat, atau pengguna lain. Menghapus data situs di browser dapat menghapus data aplikasi yang tersimpan.

## Catatan Keamanan

Fitur autentikasi yang hanya berjalan di frontend ditujukan untuk demonstrasi dan pengujian. Kode frontend dapat dilihat pengguna, sehingga pemeriksaan login di sisi browser tidak cukup untuk melindungi data sensitif.

Untuk penggunaan produksi, gunakan backend, database, validasi di server, dan sistem autentikasi yang aman.

## Mengatasi Masalah

| Masalah | Solusi |
| --- | --- |
| Halaman tidak terbuka dengan benar | Jalankan `index.html` menggunakan Live Server dari folder utama project. |
| CSS atau gambar tidak muncul | Pastikan folder `assets/` tidak dipindah dan nama file sesuai dengan jalur yang dipanggil. |
| Bootstrap, ikon, atau font tidak tampil | Periksa koneksi internet karena aset eksternal dimuat melalui CDN. |
| Perubahan kode belum terlihat | Simpan file lalu refresh browser. Jika perlu, lakukan hard refresh. |
| Data tidak terlihat | Gunakan browser dan profil yang sama dengan saat data dibuat. Periksa juga penyimpanan situs di browser. |
| Halaman admin tidak bisa dibuka | Pastikan alamat halaman benar dan periksa konfigurasi autentikasi di file JavaScript terkait. |

## Lisensi

Lihat file `LICENSE` untuk ketentuan penggunaan kode project. Lisensi tersebut hanya berlaku untuk bagian yang memang berhak dilisensikan oleh pemilik project. Aset atau library pihak ketiga tetap mengikuti lisensi masing-masing.
