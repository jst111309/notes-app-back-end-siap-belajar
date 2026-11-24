# Notes API — Proyek Latihan Siap Belajar

**Status:** Rekonstruksi mandiri berdasarkan potongan materi Dicoding yang dibagikan di percakapan; **bukan** salinan resmi branch latihan Dicoding dan **belum diuji end-to-end dengan database**. ZIP awal branch `master` hanya berisi README dan .gitignore.

## Cakupan

- Express app, pemisahan `src/server.js`, `src/server/`, `src/routes/`, `src/services/`.
- Middleware bawaan `express.json()`, third-party `helmet`, `cors`, `morgan`, middleware validasi Joi, custom error handler.
- PostgreSQL `pg` Pool, prepared/parameterized queries, Repository dan Controller CRUD Notes.
- Migration PostgreSQL untuk tabel `notes` dan `users`.
- **Bonus:** Endpoint `POST /users` untuk registrasi sederhana menggunakan bcrypt password hash (materi yang terakhir dibagikan baru membuat tabel `users`).
- **Belum dibuat:** login, JWT, authorization, isolasi notes per user, deployment AWS RDS/EC2. Jangan gunakan apa adanya untuk production.

## Persiapan di Windows / VS Code

1. Pastikan Node.js 20+ dan PostgreSQL sudah terpasang dan berjalan.
2. Buat database kosong bernama `notesapp` di pgAdmin, atau jalankan `CREATE DATABASE notesapp;` dari koneksi ke database `postgres`.
3. Buka folder ini di VS Code, buka Terminal, jalankan `npm install`.
4. Copy `.env.example` menjadi `.env`, lalu sesuaikan `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGHOST`, serta `DATABASE_URL`.
5. Jalankan `npm run migrate up` untuk membuat tabel `notes` dan `users`.
6. Jalankan `npm run start-dev` (atau `npm start`). Server default di `http://127.0.0.1:3000`.
7. Tes di Postman. Gunakan header `Content-Type: application/json` pada POST/PUT.

**Penting:** `npm run migrate create "nama-migration"` untuk membuat file migration baru; `npm run migrate up` menjalankan migrasi yang belum dijalankan. Jangan menjalankan migration yang sama manual dua kali. Jika tabel sebelumnya sudah dibuat sendiri, cek kondisi tabel dulu agar tidak bentrok.

## Endpoint API

| Method | Endpoint | Kegunaan |
|---|---|---|
| GET | `/` | Tes server |
| POST | `/notes` | Buat catatan |
| GET | `/notes` | Daftar catatan |
| GET | `/notes/:id` | Detail catatan |
| PUT | `/notes/:id` | Ubah catatan |
| DELETE | `/notes/:id` | Hapus catatan |
| POST | `/users` | Bonus: register pengguna (belum login) |

Contoh POST `/notes`:

```json
{"title":"Belajar Node.js","body":"Belajar Controller dan Repository","tags":["javascript","sql"]}
```

Contoh POST `/users`:

```json
{"username":"andi123","password":"passwordRahasia123","fullname":"Andi"}
```

Sukses POST `/notes` menghasilkan HTTP 201 dan `data.id`; pakai ID ini untuk GET/PUT/DELETE.

## Peta folder

```text
notes-app-back-end/
  src/
    server.js                    -> Menjalankan HTTP server
    server/index.js              -> Express dan middleware
    routes/index.js              -> Route utama
    middlewares/                 -> Validasi dan error handler
    exceptions/index.js          -> Class error
    utils/                       -> Response dan async wrapper
    database/pool.js             -> PostgreSQL Pool
    services/notes/
      routes/index.js            -> Route /notes
      controller/note-controller.js -> Request/response
      repositories/note-repositories.js -> SQL CRUD
      validators.js              -> Validasi input
    services/users/
      routes/index.js
      controller/user-controller.js
      repositories/user-repositories.js
      validators.js
  migrations/                    -> Struktur tabel
  .env.example                   -> Template konfigurasi (jangan commit .env)
  package.json
```

## Konsep pemula

1. **Routes:** Memilih handler sesuai URL dan HTTP method.
2. **Middleware:** Memeriksa / memproses request sebelum controller (misalnya validasi).
3. **Controller:** Menerima request, memanggil Repository, mengirim response.
4. **Repository:** Mengirim SQL ke PostgreSQL menggunakan `pool.query(...)`.
5. **Migration:** Membuat tabel database; bukan menyimpan record.

`Postman -> Route -> Middleware -> Controller -> Repository -> PostgreSQL -> Response`

## Catatan teknis

- `deleteNote()` mengembalikan `result.rows[0]?.id` agar ID yang tidak ada dapat ditangani controller dengan HTTP 404.
- PostgreSQL `tags` disimpan sebagai `TEXT[]` agar array JavaScript dapat dimasukkan oleh `pg`.
- `created_at` dan `updated_at` disimpan sebagai TEXT agar mirip materi, tetapi di proyek production biasanya lebih tepat `TIMESTAMPTZ`.
- Jika ingin mengikuti materi tepat sampai pembuatan tabel `users`, abaikan sementara folder `src/services/users/` (fitur register adalah tambahan).
- Password disimpan dalam **hash bcrypt**, tidak dalam plaintext. Registrasi belum berarti autentikasi sudah tersedia.
- RDS hanya bisa digunakan setelah konfigurasi database dan izin akses jaringan benar; tidak ada resource AWS yang dibuat oleh proyek ini.
