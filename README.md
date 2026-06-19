# RuangDekat Social 2026

RuangDekat adalah MVP social community platform mobile-first untuk komunitas lokal, karya nyata, event, UMKM, dan peluang. Stack utama: Next.js, Supabase, Cloudinary, dan Gemini 2.5 Flash.

## Fitur utama

- Home feed mobile-first dengan tab: Sekitar, Karya, Event, Peluang.
- Komunitas lokal dan event discovery.
- Profil reputasi / trust score.
- Admin moderation dashboard.
- API AI assistant memakai Gemini 2.5 Flash.
- API upload media ke Cloudinary.
- Supabase SQL schema lengkap dengan RLS.
- Desain modern, tenang, tidak norak, responsif mobile dan desktop.

## Cara menjalankan

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

## Setup Supabase

1. Buat project Supabase.
2. Buka SQL Editor.
3. Jalankan `supabase/schema.sql`.
4. Isi env:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Setup Cloudinary

Isi env:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=ruangdekat
```

Endpoint upload tersedia di:

```txt
POST /api/media/upload
FormData: file
```

## Setup Gemini

Isi env:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

Endpoint AI tersedia di:

```txt
POST /api/ai/assist
Body JSON: { "mode": "caption" | "summary" | "moderation", "input": "..." }
```

## Build production

```bash
npm run typecheck
npm run build
npm run start
```

## Struktur

```txt
src/app             App Router pages dan API routes
src/components      UI components
src/lib             Supabase, Cloudinary, Gemini, helpers
src/data            Demo data untuk preview tanpa backend
docs                Arsitektur dan roadmap
supabase/schema.sql Database schema + RLS
```

## Catatan produksi

- Jangan expose `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, atau `GEMINI_API_KEY` di client.
- Pakai rate limit di edge / Cloudflare sebelum public launch.
- Aktifkan email verification dan MFA untuk admin.
- Upload video sebaiknya dipindah ke flow signed upload / background queue jika traffic sudah tinggi.
