# website-nurtifamily
NutriFamily
NutriFamily adalah website untuk membantu pengguna mengelola stok bahan makanan dan melihat inspirasi resep masakan keluarga.
1. Teknologi
- HTML5 untuk struktur halaman.
- CSS3 untuk tampilan dan responsivitas.
- Bootstrap 5.3.3 untuk komponen dan layout.
- Bootstrap Icons untuk ikon.
- JavaScript untuk navigasi dan interaksi.
- sessionStorage untuk sesi login, serta penyimpanan browser yang digunakan oleh fitur aplikasi.
Bootstrap, Bootstrap Icons, dan Google Fonts dimuat melalui CDN. Koneksi internet diperlukan agar aset CDN tersebut dapat dimuat dengan baik.
2. Cara Menjalankan Project
Project ini berupa website frontend statis. Tidak perlu memasang Node.js, menjalankan npm install, atau menyiapkan database untuk menjalankan versi ini.
Cara A. Menggunakan Visual Studio Code
1. Ekstrak file ZIP project.
2. Buka folder nutrifamily di Visual Studio Code.
3. Pasang ekstensi Live Server jika belum tersedia.
4. Klik kanan file index.html.
5. Pilih Open with Live Server.
6. Website akan terbuka di browser. Biasanya alamatnya menyerupai http://127.0.0.1:5500.
Cara B. Membuka Langsung
1. Ekstrak file ZIP.
2. Buka folder nutrifamily.
3. Klik dua kali file index.html.
Cara ini dapat digunakan untuk melihat halaman awal. Namun, beberapa fitur browser bisa bekerja lebih konsisten jika website dijalankan melalui Live Server.
3. Halaman yang Tersedia
Halaman utama
- index.html: halaman beranda NutriFamily.
Halaman pengguna
Semua halaman berikut berada di folder pages/.
- login.html: masuk ke akun pengguna.
- register.html: membuat akun pengguna.
- forgot-password.html: alur lupa kata sandi.
- reset-password.html: halaman pengaturan ulang kata sandi.
- dashboard.html: ringkasan persediaan.
- stock.html: melihat dan mengelola stok bahan.
- add-ingredient.html: menambahkan bahan.
- edit-ingredient.html: mengubah data bahan.
- delete-ingredient.html: menghapus bahan.
- reports.html: melihat laporan.
- recipes.html: melihat katalog resep.
- recipe-detail.html: melihat detail resep.
Halaman admin
- admin-login.html: masuk ke halaman admin.
- admin.html: mengelola katalog resep.
- edit-recipe.html: mengubah resep.
- delete-recipe.html: menghapus resep.
4. Login Admin untuk Pengujian
Gunakan akun berikut untuk mencoba halaman admin pada versi project ini.
- Email: admin16@gmail.com
- Kata sandi: admin123
Akun tersebut ditetapkan langsung di kode frontend untuk kebutuhan demo. Jangan gunakan kredensial ini untuk layanan nyata. Sistem login frontend saja tidak aman untuk aplikasi produksi karena kode dapat dilihat pengguna.
5. Struktur Folder
nutrifamily/
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── components.css
│   │   ├── responsive.css
│   │   └── enhance.css
│   ├── img/
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── data.js
│       ├── enhance.js
│       ├── recipe.js
│       └── stock.js
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── stock.html
    ├── recipes.html
    └── ... halaman lainnya
6. Fungsi File Penting
- assets/css/style.css: gaya utama website.
- assets/css/components.css: gaya komponen antarmuka.
- assets/css/responsive.css: penyesuaian tampilan untuk ukuran layar berbeda.
- assets/css/enhance.css: tambahan penyempurnaan tampilan.
- assets/js/app.js: navigasi, tombol, modal, dan interaksi umum.
- assets/js/auth.js: alur login, registrasi, dan pemeriksaan akses halaman.
- assets/js/data.js: data dan fungsi penyimpanan aplikasi.
- assets/js/recipe.js: fungsi terkait resep.
- assets/js/stock.js: fungsi terkait stok bahan.
- assets/js/enhance.js: penyempurnaan interaksi antarmuka.
7. Cara Mengubah Project
1. Untuk mengubah warna, ukuran, atau tata letak, mulai dari file CSS di assets/css/.
2. Untuk mengubah teks dan susunan halaman, edit file HTML yang sesuai di index.html atau pages/.
3. Untuk mengubah interaksi atau aturan fitur, periksa file JavaScript yang relevan di assets/js/.
4. Simpan file lalu muat ulang browser untuk melihat perubahan.
5. Pertahankan nama file dan struktur folder agar tautan CSS, gambar, dan JavaScript tidak rusak.
8. Catatan Penyimpanan dan Batasan
Project ini merupakan frontend dan tidak menyertakan server backend atau database terpisah. Data demo dapat bergantung pada mekanisme penyimpanan browser yang diterapkan di JavaScript. Data tersebut tidak otomatis tersinkron ke perangkat lain dan dapat hilang jika data situs/browser dibersihkan.
Fitur login dan pembatasan halaman di sisi frontend hanya untuk demonstrasi. Untuk penggunaan nyata, aplikasi perlu backend, database, validasi server, dan sistem autentikasi yang aman.
9. Troubleshooting
- CSS atau gambar tidak tampil: pastikan folder assets/ tetap berada di dalam folder nutrifamily dan jangan memindahkan file HTML secara terpisah.
- Halaman tidak ditemukan: jalankan index.html dari folder project yang benar dan gunakan tautan navigasi di website.
- Bootstrap atau ikon tidak tampil: periksa koneksi internet karena file tersebut dimuat melalui CDN.
- Data tidak terlihat: coba gunakan browser yang sama dan jangan membuka project melalui lokasi atau profil browser berbeda.
- Perubahan tidak muncul: simpan file lalu lakukan refresh browser. Jika perlu, lakukan hard refresh.
Dibuat sebagai panduan menjalankan dan mengembangkan project NutriFamily.
