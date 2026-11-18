
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import db from './config/db.js';
import siswaRoutes from './routes/siswaRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTE DATA SISWA
app.use('/api/siswa', siswaRoutes);

// HALAMAN UTAMA
app.get('/', (req, res) => {
    res.send('API Data Siswa Berhasil Berjalan!');
});

// MENJALANKAN SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await db.query('SELECT 1');
        console.log('Database berhasil terhubung!');
    } catch (error) {
        console.error('Koneksi database gagal:', error.message);
    }

    console.log(`Server berjalan di http://localhost:${PORT}`);
});
