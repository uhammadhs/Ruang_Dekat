# Arsitektur RuangDekat

## Tujuan

Membuat social community platform mobile-first yang fokus pada komunitas lokal, karya nyata, event, UMKM, peluang, dan reputasi pengguna.

## Layer

```txt
Client Web PWA / Mobile Wrapper
        |
Next.js App Router
        |
API Routes / Server Actions
        |
+-- Supabase Auth + Postgres + RLS
+-- Cloudinary Media Upload + Optimization
+-- Gemini 2.5 Flash AI Assist
+-- Future: Search Engine, Redis Rate Limit, Queue Worker
```

## Keputusan teknis

- Next.js dipakai untuk web app, SEO, routing, API routes, dan PWA.
- Supabase dipakai untuk auth, Postgres, RLS, dan realtime tahap berikutnya.
- Cloudinary dipakai untuk asset media karena optimasi gambar matang dan URL delivery siap CDN.
- Gemini 2.5 Flash dipakai khusus AI assistant agar biaya dan latency tetap ringan.
- UI dibuat custom dengan Tailwind CSS agar tidak terlihat template generik.

## Modul produksi berikutnya

1. Auth pages: login, register, forgot password.
2. Supabase repository layer untuk feed, profile, communities, events.
3. Rate limit dengan Upstash Redis / Cloudflare Turnstile.
4. Full text search dengan Typesense / Meilisearch.
5. Notification system.
6. Realtime comments/chat dengan Supabase Realtime.
7. Native mobile app Expo dengan shared API contract.
