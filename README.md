# Backend Data Siswa

API backend untuk mengelola data siswa menggunakan Express dan MySQL.

**Terakhir diperbarui: 18 November 2026**

## Menjalankan aplikasi

1. Pastikan Node.js dan MySQL sudah tersedia.
2. Buat file `Backend/.env` dengan konfigurasi database:

   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   DB_PORT=3306
   PORT=3000
   ```

3. Pasang dependensi dan jalankan server:

   ```bash
   cd Backend
   npm install
   npm start
   ```

Server berjalan di `http://localhost:3000` (atau port yang ditentukan melalui `PORT`).
