# Share Story Starter Project

## Pengantar

Project ini dirancang sebagai tugas submission dicoding

## Deskripsi

ShareStoryApp adalah aplikasi untuk saling berbagi cerita, foto dan lokasi.

## Prasyarat

- Node.js (disarankan versi terbaru)
- npm atau yarn

## Instalasi

- Clone Poject

```
git clone ...
```

- Masuk ke direktori proyek:

  ```bash
  cd project
  ```

- Pasang seluruh dependensi:
  ```bash
  npm install
  ```

## Scripts

- `npm run build`: Membuat build production menggunakan Webpack.
- `npm run start-dev`: Menjalankan server development menggunakan Webpack Dev Server.
- `npm run serve`: Menjalankan server HTTP untuk build yang sudah dibuat.
- `npm run prettier`: Memeriksa format kode menggunakan Prettier.
- `npm run prettier:write`: Memformat ulang kode menggunakan Prettier.

- Kriteria Wajib 1: Mempertahankan Seluruh Kriteria Wajib Submission Sebelumnya
- Berikut adalah daftar kriteria pada submission sebelumnya yang perlu dipertahankan. Memanfaatkan satu API sebagai sumber data. Menggunakan arsitektur single-page application. Menampilkan data dari API. Memiliki fitur tambah data baru. Menerapkan aksesibilitas sesuai dengan standar. Merancang transisi halaman yang halus.

- Kriteria Wajib 2: Menerapkan Push Notification
- Kriteria Wajib 3: Mengadopsi PWA (Installable & Offline)
  - Mengadopsi arsitektur Application Shell: memisahkan bagian konten statis dan dinamis
  - Aplikasi dapat dipasang ke Homescreen: ditandai dengan munculnya icon add to homescreen pada browser
  - Aplikasi dapat diakses dalam keadaan offline tanpa ada bagian UI yang gagal ditampilkan
- Kriteria Wajib 4: Manfaatkan IndexedDB untuk Menyimpan Data
- Kriteria Wajib 5: Distribusikan secara Publik

- Kriteria Opsional 1: Memiliki Shortcuts dan Screenshots untuk Desktop dan Mobile
- Kriteria Opsional 2: Menggunakan Workbox untuk Offline Capability
- Kriteria Opsional 3: Menyediakan Halaman Not Found
