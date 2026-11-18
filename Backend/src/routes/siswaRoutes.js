
import express from 'express';

import {
    getSiswa,
    tambahSiswa,
    editSiswa,
    hapusSiswa
} from '../controllers/siswaController.js';

const router = express.Router();

// Menampilkan data siswa
router.get('/', getSiswa);

// Menambahkan data siswa
router.post('/', tambahSiswa);

// Mengedit data siswa
router.put('/:id', editSiswa);

// Menghapus data siswa
router.delete('/:id', hapusSiswa);

export default router;
