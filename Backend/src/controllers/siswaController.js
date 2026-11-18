import db from '../config/db.js';

// MENAMPILKAN DATA SISWA
export const getSiswa = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT id, kode_siswa, nama_siswa, alamat_siswa,
                DATE_FORMAT(tgl_siswa, '%Y-%m-%d') AS tgl_siswa,
                jurusan_siswa
             FROM siswa ORDER BY id DESC`
        );

        res.json(rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// MENAMBAHKAN DATA SISWA
export const tambahSiswa = async (req, res) => {
    try {
        const {
            kode_siswa,
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO siswa
            (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
            VALUES (?, ?, ?, ?, ?)`,
            [
                kode_siswa,
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa
            ]
        );

        res.status(201).json({
            message: 'Data siswa berhasil ditambahkan',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// MENGEDIT DATA SISWA
export const editSiswa = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            kode_siswa,
            nama_siswa,
            alamat_siswa,
            tgl_siswa,
            jurusan_siswa
        } = req.body;

        const [result] = await db.query(
            `UPDATE siswa SET
            kode_siswa = ?,
            nama_siswa = ?,
            alamat_siswa = ?,
            tgl_siswa = ?,
            jurusan_siswa = ?
            WHERE id = ?`,
            [
                kode_siswa,
                nama_siswa,
                alamat_siswa,
                tgl_siswa || null,
                jurusan_siswa,
                id
            ]
        );

        if (result.affectedRows === 0) {
            const [rows] = await db.query(
                'SELECT id FROM siswa WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    message: 'Data siswa tidak ditemukan'
                });
            }
        }

        res.json({
            message: 'Data siswa berhasil diedit'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// MENGHAPUS DATA SISWA
export const hapusSiswa = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM siswa WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Data siswa tidak ditemukan'
            });
        }

        res.json({
            message: 'Data siswa berhasil dihapus'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};