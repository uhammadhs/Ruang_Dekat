# RuangDekat Social 2026

Platform sosial mobile-first untuk komunitas lokal, karya nyata, event, UMKM, peluang, dan reputasi pengguna. Dibangun dengan Next.js 16, Supabase, Cloudinary, dan Gemini 2.5 Flash.

> **Status**: Production-ready MVP — 23 routes, 21 DB tables with RLS, auth + search + notifikasi + admin moderation + AI assistant + PWA manifest.

---

## Fitur

### Feed & Posting
- Feed real-time dari Supabase dengan filter tab: Semua, Karya, Event, Peluang, Tanya
- Posting with media upload (Cloudinary), proof/reference, location
- Like/unlike, save/unsave, comment (optimistic UI)
- AI caption assistant via Gemini 2.5 Flash (di halaman create)
- Post type labels otomatis dalam Bahasa Indonesia

### Komunitas
- Buat dan jelajahi komunitas lokal
- Join/leave dengan konfirmasi dialog
- Posting dalam komunitas
- Member count real-time
- Discovery via search

### Event
- Buat event dengan RSVP (Hadir / Tertarik / Batal)
- Attendee count real-time
- Host profile link
- Filter event mendatang

### Profil & Reputasi
- Edit profil inline (display name, bio, lokasi, avatar upload)
- Trust score (0–100) visible di setiap posting
- Follower/following count
- Riwayat posting
- Link UMKM / business pages

### Admin
- Dashboard stats (users, posts, open reports)
- Moderation: sembunyikan/pulihkan post, selesaikan laporan
- AI-assisted moderation logs

### Pencarian
- Cari komunitas via search bar (desktop + mobile)
- Halaman `/search` dengan hasil real-time

### Notifikasi
- Halaman `/notifications` terintegrasi dengan DB
- Filter by read/unread

### Keamanan
- Row Level Security (RLS) di semua 21 tabel
- Auth middleware via `proxy.ts` (Next.js 16 convention)
- CSP headers + security headers via `next.config.ts`
- Rate limiting di API routes (upload 10/menit, AI 20/menit)
- Open redirect validation
- Validasi input dengan zod schemas
- Server-side Cloudinary upload (base64 aman dari client)

---

## Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Database | Supabase Postgres + RLS |
| Auth | Supabase Auth (email/password) |
| Media | Cloudinary (server-side base64) |
| AI | Gemini 2.5 Flash via `@google/genai` SDK |
| Styling | Tailwind CSS v4 |
| Icon | lucide-react (tree-shaken) |
| Deploy | Vercel |

---

## Cara Menjalankan

```bash
npm install
cp .env.example .env.local
# Isi env vars (lihat di bawah)
npm run dev
```

Buka `http://localhost:3000`.

### Build Production

```bash
npm run typecheck
npm run build
npm run start
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=123456
CLOUDINARY_API_SECRET=abc123
CLOUDINARY_UPLOAD_FOLDER=ruangdekat

# Gemini
GEMINI_API_KEY=AIzaxxx
GEMINI_MODEL=gemini-2.5-flash

# App URL (untuk metadata & sitemap)
NEXT_PUBLIC_APP_URL=https://ruangdekat.vercel.app
```

---

## Setup Supabase

1. Buat project di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**
3. Jalankan `supabase/schema.sql` (buat semua tabel, RLS, indexes, helper functions)
4. Jalankan `supabase/migrations/20260619_handle_new_user.sql` (auth trigger auto-create profile)
5. (Opsional) Jalankan `supabase/seed.sql` untuk data demo

---

## Route Map (23 Routes)

| Route | Type | Auth | Deskripsi |
|-------|------|------|-----------|
| `/` | Dynamic | ✗ | Home feed |
| `/login` | Static | ✗ | Login |
| `/register` | Static | ✗ | Register |
| `/forgot-password` | Static | ✗ | Reset password |
| `/create` | Static | ✓ | Buat posting |
| `/post/[id]` | Dynamic | ✗ | Detail posting + komentar |
| `/profile` | Dynamic | ✓ | Profil sendiri |
| `/profile/[id]` | Dynamic | ✗ | Profil publik |
| `/communities` | Dynamic | ✗ | Jelajah komunitas |
| `/community/[slug]` | Dynamic | ✗ | Detail komunitas |
| `/community/new` | Static | ✓ | Buat komunitas |
| `/events` | Dynamic | ✗ | Jelajah event |
| `/event/[id]` | Dynamic | ✗ | Detail event + RSVP |
| `/event/new` | Static | ✓ | Buat event |
| `/search` | Dynamic | ✗ | Pencarian komunitas |
| `/notifications` | Dynamic | ✗ | Notifikasi |
| `/report` | Static | ✓ | Laporkan konten |
| `/admin` | Dynamic | Admin | Dashboard moderasi |
| `/about` | Static | ✗ | Tentang |
| `/privacy` | Static | ✗ | Kebijakan privasi |
| `/sitemap.xml` | Static | ✗ | Sitemap |
| `/manifest.webmanifest` | Static | ✗ | PWA manifest |

### API Routes

| Route | Rate Limit | Auth | Deskripsi |
|-------|-----------|------|-----------|
| `POST /api/media/upload` | 10 req/m | ✓ | Upload gambar ke Cloudinary |
| `POST /api/ai/assist` | 20 req/m | ✓ | AI caption/summary/moderation |

---

## Struktur Proyek

```
src/
├── app/                          App Router pages
│   ├── (auth)/                   Login, register, forgot-password
│   ├── admin/                    Dashboard moderasi
│   ├── api/ai/assist/            Gemini AI endpoint
│   ├── api/media/upload/         Cloudinary upload endpoint
│   ├── auth/callback/            OAuth callback handler
│   ├── communities/              Jelajah komunitas
│   ├── community/[slug]/         Detail + join komunitas
│   ├── community/new/            Buat komunitas
│   ├── create/                   Buat posting
│   ├── event/[id]/               Detail + RSVP
│   ├── event/new/                Buat event
│   ├── events/                   Jelajah event
│   ├── notifications/            Notifikasi
│   ├── post/[id]/                Detail posting + komentar
│   ├── profile/                  Profil sendiri
│   ├── profile/[id]/             Profil publik
│   ├── report/                   Laporkan konten
│   ├── search/                   Pencarian
│   ├── about/                    Halaman tentang
│   ├── privacy/                  Kebijakan privasi
│   ├── layout.tsx                Root layout + error boundary
│   ├── loading.tsx               Feed skeleton
│   ├── sitemap.ts                Sitemap dinamis
│   └── globals.css               Tailwind v4 + design tokens
├── components/                   UI components
│   ├── ui/                       button, card, badge, skeleton, confirm-dialog
│   ├── bottom-nav.tsx            Bottom navigation (mobile)
│   ├── desktop-sidebar.tsx       Sidebar (desktop)
│   ├── right-panel.tsx           Right panel (desktop large)
│   ├── top-bar.tsx               Top bar with search + notif
│   ├── feed-card.tsx             Feed post card
│   ├── home-shell.tsx            Home feed + filter
│   ├── logo.tsx                  Logo + tagline
│   ├── session-provider.tsx      Auth context provider
│   └── error-boundary.tsx        React error boundary
├── lib/
│   ├── supabase.ts               Browser client singleton
│   ├── supabase-server.ts        Server client (@supabase/ssr)
│   ├── supabase-admin.ts         Admin client (service role)
│   ├── supabase-queries.ts       Query helpers (profiles, posts, comments, likes, dll)
│   ├── types.ts                  TypeScript types
│   ├── utils.ts                  cn, formatDate, formatCompactNumber, getPostTypeLabel
│   ├── cloudinary.ts             Server-side upload helper
│   ├── gemini.ts                 Gemini 2.5 Flash helper
│   └── rate-limit.ts             In-memory rate limiter
├── proxy.ts                      Next.js 16 middleware (auth guard)
```

```
supabase/
├── schema.sql                    Full schema + RLS + indexes + helper functions
├── seed.sql                      Development seed data
└── migrations/
    └── 20260619_handle_new_user.sql   Auth trigger
```

---

## Keamanan

- ✅ Semua secret keys hanya di server (`SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY`)
- ✅ Row Level Security aktif di 21 tabel
- ✅ Auth guard di `proxy.ts` (Next.js 16)
- ✅ CSP + X-Content-Type-Options + X-Frame-Options + Referrer-Policy via `next.config.ts`
- ✅ Rate limiting di API routes
- ✅ Open redirect protection di auth callback
- ✅ Zod validation di API routes
- ✅ Admin route validation server-side

---

## UX Highlights

- **Mobile-first**: Bottom nav, safe area, 44px+ touch targets
- **Desktop 3-column**: Sidebar + feed + right panel
- **Loading skeletons** di semua route
- **Error boundary** global
- **Confirm dialog** sebelum destructive actions (leave community, cancel RSVP)
- **Empty state dengan CTA** — user selalu diarahkan ke aksi berikutnya
- **Post type labels** dalam Bahasa Indonesia
- **Skip-to-content link** untuk aksesibilitas keyboard
- **Guest redirect** — user diajak login dengan jelas

---

## Catatan Produksi

- Pastikan semua env vars terisi di Vercel dashboard
- `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, `GEMINI_API_KEY` tidak boleh terekspos ke client
- Aktifkan email verification di Supabase Auth settings
- Untuk production dengan traffic tinggi, migrasi upload video ke signed upload / background queue
- Pertimbangkan Redis untuk rate limiting di production (saat ini in-memory)

---

Dibangun dengan ❤️ untuk komunitas lokal Indonesia.
