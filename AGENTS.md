# RuangDekat Social 2026 — Agent Guide

## Project Overview

Mobile-first social community platform for local communities, real work, events, MSMEs, opportunities, and user reputation. Stack: Next.js 16 App Router, TypeScript, Supabase (Auth + Postgres + RLS), Cloudinary, Gemini 2.5 Flash.

---

## Current State (Audit 2026-06-19 — After Phase 1-8 Implementation)

### What Works (Real)
- Build pipeline: `npm install`, `npm run typecheck`, `npm run build` all pass
- PWA manifest served at `/manifest.webmanifest`
- Tailwind CSS v4 with custom design tokens
- Responsive layout: mobile bottom nav, desktop 3-column
- Cloudinary upload via server-side base64
- Gemini 2.5 Flash via `@google/genai` SDK
- Supabase browser client (singleton) + admin client + server client
- `.npmrc` with `legacy-peer-deps=true`, `audit=false`
- **Auth pages**: `/login`, `/register`, `/forgot-password`
- **Auth middleware**: protects `/create`, `/profile`, `/admin`, `/community/new`, `/event/new`
- **Auth callback**: `/auth/callback` for OAuth/email confirmation
- **Auth trigger**: auto-creates profile on signup
- **API routes**: both `/api/media/upload` and `/api/ai/assist` now have auth checks
- **AI logging**: logs to `ai_logs` table with input hash
- **Supabase query helpers**: `src/lib/supabase-queries.ts` covers profiles, posts, comments, likes, saves, follows, communities, events, reports, notifications

### Database Schema (`supabase/schema.sql`)
- ✅ 20 tables with RLS: all previous 13 + `badges`, `user_badges`, `trust_score_log`, `notifications`, `business_pages`, `services`, `portfolios`
- ✅ RLS policies for all tables (including new ones)
- ✅ 22 indexes for performance
- ✅ Helper functions: `is_admin()`, `is_community_member()`, `toggle_post_like()`, `toggle_post_save()`, `increment_community_member_count()`, `decrement_community_member_count()`, `create_notification()`, `touch_updated_at()`
- ✅ Auth trigger: `handle_new_user()` auto-creates profile on signup

### All Pages — Status

| Page | Status | Real Data? | Auth? |
|------|--------|-----------|-------|
| `/login` | **NEW** — Login form | Yes | Public |
| `/register` | **NEW** — Register form | Yes | Public |
| `/forgot-password` | **NEW** — Reset password | Yes | Public |
| `/` (Home/Feed) | **Updated** — Real feed from Supabase | ✅ Yes | With/without auth |
| `/create` | **Updated** — Real post creation | ✅ Yes to DB | ✅ Required |
| `/post/[id]` | **NEW** — Post detail + comments | ✅ Yes | With/without auth |
| `/profile` | **Updated** — Real profile from DB | ✅ Yes | ✅ Required |
| `/profile/[id]` | **NEW** — Public profile | ✅ Yes | With/without auth |
| `/communities` | **Updated** — Real from Supabase | ✅ Yes | With/without auth |
| `/community/[slug]` | **NEW** — Community detail | ✅ Yes | With/without auth |
| `/community/new` | **NEW** — Create community | ✅ Yes to DB | ✅ Required |
| `/events` | **Updated** — Real from Supabase | ✅ Yes | With/without auth |
| `/event/[id]` | **NEW** — Event detail + RSVP | ✅ Yes | With/without auth |
| `/event/new` | **NEW** — Create event | ✅ Yes to DB | ✅ Required |
| `/admin` | **Updated** — Real stats + reports | ✅ Yes | ✅ Admin only |
| `/report` | **NEW** — Report content | ✅ Yes to DB | ✅ Required |

### Features Implemented
1. ✅ Auth pages (login, register, forgot password)
2. ✅ Auth middleware + protected routes
3. ✅ Profile auto-creation on signup (DB trigger)
4. ✅ Real feed from Supabase with filter tabs
5. ✅ Create post with save to Supabase + post_media
6. ✅ Post detail page
7. ✅ Comments CRUD (create, read)
8. ✅ Like/unlike with optimistic UI
9. ✅ Save/unsave post
10. ✅ Follow/unfollow (query ready)
11. ✅ Community create, detail, join/leave
12. ✅ Event create, detail, RSVP (going/interested/cancelled)
13. ✅ Report creation flow
14. ✅ Admin moderation (hide/restore post, resolve reports)
15. ✅ AI logging to `ai_logs` table
16. ✅ Edit profile (inline edit + avatar upload)
17. ✅ Public profile for other users
18. ✅ API route auth checks (both endpoints)
19. ✅ `supabase/seed.sql` with dev seed data
20. ✅ Supabase query helpers (`src/lib/supabase-queries.ts`)
21. ✅ Updated types (`src/lib/types.ts`) with all DB types
22. ✅ Session provider (`src/components/session-provider.tsx`)

### Still Missing / Can be Improved
- ❌ `notifications` — DB table created, but no push/in-app notifications yet
- ❌ Search functionality — UI exists, non-functional
- ❌ Badge system — DB tables exist, no UI to display them
- ❌ Business pages (UMKM) — DB tables exist, no UI yet
- ❌ Loading skeletons on all pages (basic empty states exist)
- ❌ Error boundaries
- ❌ PWA icons — need proper icon assets
- ❌ Rate limiting on API endpoints
- ❌ Dark mode
- ✅ Migrated to `proxy.ts` (Next.js 16 convention)

### Security Status
- ✅ Auth check on all API routes
- ✅ Admin validation on `/admin` page (server-side)
- ✅ RLS active on all tables
- ✅ No secret keys exposed to client
- ✅ Input validation with zod schemas
- ❌ No rate limiting
- ❌ No CSP headers
- ⚠️ `cloudinary.ts` uses base64 upload (memory intensive for large files)

---

## Key Architecture Decisions

### Supabase Client Usage
- **Browser**: `getSupabaseBrowserClient()` — singleton, uses anon key, session persistence
- **Server**: `createClient()` from `src/lib/supabase-server.ts` — uses `@supabase/ssr` with `next/headers` cookies
- **Admin**: `getSupabaseAdminClient()` — uses service role key, server-only

### File Organization
```
src/
  app/              App Router pages + API routes
  components/       React components (server by default, "use client" when needed)
  lib/              Utilities, clients, types, queries
  data/             Mock data (for reference only, not imported in main flow)
supabase/
  schema.sql        Production schema + RLS
  seed.sql          Development seed data
  migrations/       SQL migrations (e.g., auth trigger)
```

### Auth Flow
- Login page at `/login` → sign in → redirect to `/`
- Register at `/register` → sign up → auto-create profile (DB trigger) → redirect to `/login`
- Protected routes: middleware checks session via `@supabase/ssr`, redirects to `/login` if unauthenticated
- Admin routes: check `is_admin` on profile server-side
- Session state managed via `SessionProvider` (React Context)

### Key Env Vars
| Variable | Where Used | Secret? |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes |
| `CLOUDINARY_CLOUD_NAME` | Server | No |
| `CLOUDINARY_API_KEY` | Server | No |
| `CLOUDINARY_API_SECRET` | Server only | Yes |
| `CLOUDINARY_UPLOAD_FOLDER` | Server | No |
| `GEMINI_API_KEY` | Server only | Yes |
| `GEMINI_MODEL` | Server | No |

### Key Reminders
- Never expose service role key, Cloudinary secret, or Gemini key to client
- Always validate auth on API routes
- Always validate input with zod schemas
- All uploads go through Cloudinary server-side
- RLS is the first line of defense, but server also validates
- Gemini model must be `gemini-2.5-flash`
- Mobile-first: bottom nav, safe area, 44px touch targets
- Build must pass before marking feature complete

### Setup Steps
1. Create Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/migrations/20260619_handle_new_user.sql` in SQL Editor
4. (Optional) Run `supabase/seed.sql` for demo data
5. Copy `.env.example` to `.env.local` and fill in values
6. `npm install && npm run build`
7. Deploy to Vercel

### Vercel Deploy Checklist
- Set all env vars in Vercel dashboard
- Enable "Node.js >= 20.x" in project settings
- The `.npmrc` prevents audit hangs
- `package.json` has `engines: { node: ">=20.0.0" }`
