# Backend Data Siswa

Aplikasi pengelolaan data siswa dengan frontend Vite, API Express, dan database MySQL.

**Terakhir diperbarui: 18 November 2026**

## Persiapan

Pastikan Node.js dan MySQL tersedia. Buat file `Backend/.env`:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
PORT=3000
```

Ganti nilai contoh dengan konfigurasi MySQL lokal. Jangan unggah file `.env`.

## Menjalankan aplikasi

Jalankan API di terminal pertama:

```bash
cd Backend
npm install
npm start
```

Jalankan frontend di terminal kedua:

```bash
cd Frontend
npm install
npm run dev
```

Buka `http://localhost:5173`. API berjalan di `http://localhost:3000`.
