-- RuangDekat Social 2026 Supabase schema
-- Jalankan di Supabase SQL Editor setelah project dibuat.

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

create type public.post_type as enum ('local', 'work', 'event', 'opportunity', 'question');
create type public.visibility_type as enum ('public', 'community', 'private');
create type public.member_role as enum ('owner', 'admin', 'moderator', 'member');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_\.]{3,32}$'),
  display_name text not null check (char_length(display_name) between 2 and 80),
  bio text default '' check (char_length(bio) <= 300),
  avatar_url text,
  location_city text,
  location_district text,
  skills text[] default '{}',
  interests text[] default '{}',
  trust_score int not null default 40 check (trust_score between 0 and 100),
  is_verified boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 3 and 80),
  slug text unique not null check (slug ~ '^[a-z0-9-]{3,80}$'),
  description text default '' check (char_length(description) <= 600),
  category text not null,
  location_city text,
  location_district text,
  visibility visibility_type not null default 'public',
  member_count int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_members (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role member_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (community_id, user_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  community_id uuid references public.communities(id) on delete set null,
  type post_type not null default 'local',
  title text not null check (char_length(title) between 3 and 140),
  content text not null check (char_length(content) between 3 and 4000),
  proof text default '' check (char_length(proof) <= 300),
  visibility visibility_type not null default 'public',
  location_city text,
  location_district text,
  ai_assisted boolean not null default false,
  trust_level int not null default 0 check (trust_level between 0 and 100),
  is_pinned boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  url text not null,
  cloudinary_public_id text,
  media_type text not null default 'image',
  width int,
  height int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1200),
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.post_saves (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  community_id uuid references public.communities(id) on delete set null,
  title text not null check (char_length(title) between 3 and 140),
  description text default '' check (char_length(description) <= 2000),
  starts_at timestamptz not null,
  ends_at timestamptz,
  location_name text,
  location_city text,
  location_district text,
  attendee_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_attendees (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'going' check (status in ('going', 'interested', 'cancelled')),
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  status report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (post_id is not null or comment_id is not null or reported_user_id is not null)
);

create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  mode text not null,
  input_hash text not null,
  output_preview text,
  model text not null default 'gemini-2.5-flash',
  created_at timestamptz not null default now()
);

create table if not exists public.moderation_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);

-- Missing tables: badge system, trust score, notifications, business pages, portfolios

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  icon_url text,
  criteria text,
  created_at timestamptz default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz default now(),
  unique (user_id, badge_id)
);

create table if not exists public.trust_score_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  old_score int not null,
  new_score int not null,
  reason text not null,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  post_id uuid references public.posts(id) on delete cascade,
  community_id uuid references public.communities(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.business_pages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  slug text unique not null,
  description text default '',
  category text,
  address text,
  location_city text,
  location_district text,
  phone text,
  whatsapp text,
  website text,
  logo_url text,
  cover_url text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business_pages(id) on delete cascade,
  name text not null,
  description text default '',
  price_range text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text default '',
  media_url text,
  media_type text default 'image',
  tags text[] default '{}',
  created_at timestamptz default now()
);

create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_posts_location on public.posts(location_city, location_district);
create index if not exists idx_posts_type on public.posts(type);
create index if not exists idx_communities_location on public.communities(location_city, location_district);
create index if not exists idx_events_starts_at on public.events(starts_at);
create index if not exists idx_comments_post_id on public.comments(post_id, created_at);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_location on public.profiles(location_city);
create index if not exists idx_communities_slug on public.communities(slug);
create index if not exists idx_reactions_post_id on public.post_likes(post_id);
create index if not exists idx_saves_user_id on public.post_saves(user_id);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read, created_at desc);
create index if not exists idx_business_slug on public.business_pages(slug);
create index if not exists idx_posts_user_id on public.posts(user_id, created_at desc);
create index if not exists idx_posts_community on public.posts(community_id, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger communities_touch_updated_at before update on public.communities for each row execute function public.touch_updated_at();
create trigger posts_touch_updated_at before update on public.posts for each row execute function public.touch_updated_at();
create trigger comments_touch_updated_at before update on public.comments for each row execute function public.touch_updated_at();
create trigger events_touch_updated_at before update on public.events for each row execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

-- Helper: increment community member count
create or replace function public.increment_community_member_count(community_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.communities set member_count = member_count + 1 where id = community_id;
end;
$$;

-- Helper: decrement community member count
create or replace function public.decrement_community_member_count(community_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.communities set member_count = greatest(member_count - 1, 0) where id = community_id;
end;
$$;

-- Helper: toggle post like
create or replace function public.toggle_post_like(p_post_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists(select 1 from public.post_likes where post_id = p_post_id and user_id = p_user_id) then
    delete from public.post_likes where post_id = p_post_id and user_id = p_user_id;
  else
    insert into public.post_likes (post_id, user_id) values (p_post_id, p_user_id);
  end if;
end;
$$;

-- Helper: toggle post save
create or replace function public.toggle_post_save(p_post_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists(select 1 from public.post_saves where post_id = p_post_id and user_id = p_user_id) then
    delete from public.post_saves where post_id = p_post_id and user_id = p_user_id;
  else
    insert into public.post_saves (post_id, user_id) values (p_post_id, p_user_id);
  end if;
end;
$$;

-- Helper: create notification
create or replace function public.create_notification(
  p_user_id uuid,
  p_type text,
  p_actor_id uuid,
  p_post_id uuid default null,
  p_community_id uuid default null,
  p_event_id uuid default null,
  p_message text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_user_id <> p_actor_id then
    insert into public.notifications (user_id, type, actor_id, post_id, community_id, event_id, message)
    values (p_user_id, p_type, p_actor_id, p_post_id, p_community_id, p_event_id, p_message);
  end if;
end;
$$;

create or replace function public.is_community_member(target_community_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.community_members
    where community_id = target_community_id and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_saves enable row level security;
alter table public.follows enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.reports enable row level security;
alter table public.ai_logs enable row level security;
alter table public.moderation_logs enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.trust_score_log enable row level security;
alter table public.notifications enable row level security;
alter table public.business_pages enable row level security;
alter table public.services enable row level security;
alter table public.portfolios enable row level security;

create policy "profiles are readable" on public.profiles for select using (true);
create policy "users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "users can update own profile" on public.profiles for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

create policy "public communities readable" on public.communities for select using (visibility = 'public' or owner_id = auth.uid() or public.is_admin());
create policy "authenticated can create communities" on public.communities for insert with check (auth.uid() = owner_id);
create policy "owners admins update communities" on public.communities for update using (auth.uid() = owner_id or public.is_admin()) with check (auth.uid() = owner_id or public.is_admin());

create policy "community members readable" on public.community_members for select using (true);
create policy "users can join communities" on public.community_members for insert with check (auth.uid() = user_id);
create policy "members can leave own membership" on public.community_members for delete using (auth.uid() = user_id or public.is_admin());

create policy "posts readable" on public.posts for select using (
  is_deleted = false and (
    visibility = 'public'
    or user_id = auth.uid()
    or public.is_admin()
    or (community_id is not null and public.is_community_member(community_id))
  )
);
create policy "authenticated can create own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "owners admins update posts" on public.posts for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

create policy "post media readable with post" on public.post_media for select using (
  exists(select 1 from public.posts p where p.id = post_id and p.is_deleted = false)
);
create policy "post owners insert media" on public.post_media for insert with check (
  exists(select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid())
);

create policy "comments readable" on public.comments for select using (
  is_deleted = false and exists(select 1 from public.posts p where p.id = post_id and p.is_deleted = false)
);
create policy "authenticated can comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "owners admins update comments" on public.comments for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

create policy "likes readable" on public.post_likes for select using (true);
create policy "users manage own likes" on public.post_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "saves own readable" on public.post_saves for select using (auth.uid() = user_id);
create policy "users manage own saves" on public.post_saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "follows readable" on public.follows for select using (true);
create policy "users manage own follows" on public.follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

create policy "events readable" on public.events for select using (true);
create policy "authenticated can create own events" on public.events for insert with check (auth.uid() = host_id);
create policy "hosts admins update events" on public.events for update using (auth.uid() = host_id or public.is_admin()) with check (auth.uid() = host_id or public.is_admin());

create policy "event attendees readable" on public.event_attendees for select using (true);
create policy "users manage own attendance" on public.event_attendees for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users create reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "admins read reports" on public.reports for select using (public.is_admin() or reporter_id = auth.uid());
create policy "admins update reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());

create policy "users read own ai logs" on public.ai_logs for select using (auth.uid() = user_id or public.is_admin());
create policy "users create own ai logs" on public.ai_logs for insert with check (auth.uid() = user_id or user_id is null);

create policy "admins read moderation logs" on public.moderation_logs for select using (public.is_admin());
create policy "admins create moderation logs" on public.moderation_logs for insert with check (public.is_admin());

-- Badges: anyone can read, only admin can write
create policy "badges readable" on public.badges for select using (true);
create policy "badges admin insert" on public.badges for insert with check (public.is_admin());
create policy "badges admin update" on public.badges for update using (public.is_admin()) with check (public.is_admin());

-- User badges: users read own + public, admin all, system insert
create policy "user_badges readable" on public.user_badges for select using (auth.uid() = user_id or public.is_admin());
create policy "user_badges admin all" on public.user_badges for all using (public.is_admin()) with check (public.is_admin());
create policy "user_badges system insert" on public.user_badges for insert with check (auth.role() = 'service_role');

-- Trust score log: users read own, admin all, system insert
create policy "trust_score_log readable own" on public.trust_score_log for select using (auth.uid() = user_id or public.is_admin());
create policy "trust_score_log system insert" on public.trust_score_log for insert with check (auth.role() = 'service_role');

-- Notifications: users read own, system insert, users update is_read
create policy "notifications readable own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications system insert" on public.notifications for insert with check (auth.role() = 'service_role');
create policy "notifications update read status" on public.notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Business pages: anyone can read, owner can insert/update
create policy "business_pages readable" on public.business_pages for select using (true);
create policy "business_pages owner insert" on public.business_pages for insert with check (auth.uid() = owner_id);
create policy "business_pages owner update" on public.business_pages for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Services: anyone can read, owner can insert/update
create policy "services readable" on public.services for select using (true);
create policy "services owner insert" on public.services for insert with check (exists(select 1 from public.business_pages b where b.id = business_id and b.owner_id = auth.uid()));
create policy "services owner update" on public.services for update using (exists(select 1 from public.business_pages b where b.id = business_id and b.owner_id = auth.uid())) with check (exists(select 1 from public.business_pages b where b.id = business_id and b.owner_id = auth.uid()));

-- Portfolios: anyone can read, owner can insert/update
create policy "portfolios readable" on public.portfolios for select using (true);
create policy "portfolios owner insert" on public.portfolios for insert with check (auth.uid() = user_id);
create policy "portfolios owner update" on public.portfolios for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
