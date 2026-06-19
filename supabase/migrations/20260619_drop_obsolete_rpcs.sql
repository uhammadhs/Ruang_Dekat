-- Migration: Drop obsolete and insecure RPC functions
-- Since counts are now fully automated via database triggers, these functions are no longer required.

drop function if exists public.increment_community_member_count(uuid);
drop function if exists public.decrement_community_member_count(uuid);
drop function if exists public.increment_event_attendee_count(uuid);
drop function if exists public.decrement_event_attendee_count(uuid);
