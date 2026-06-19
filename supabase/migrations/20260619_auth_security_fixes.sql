-- Migration: Auth security and data consistency triggers
-- 1. Protect system columns in profiles table
-- 2. Automate member counts in communities table
-- 3. Automate attendee counts in events table

-- 1. Profiles System Columns Protection
create or replace function public.protect_profile_system_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles 
    where id = auth.uid() and is_admin = true
  ) then
    new.is_admin := old.is_admin;
    new.is_verified := old.is_verified;
    new.trust_score := old.trust_score;
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_updated_protect_fields on public.profiles;
create trigger on_profile_updated_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_system_fields();

-- 2. Communities Member Count Automation
-- Update default value of member_count to 0
alter table public.communities alter column member_count set default 0;

create or replace function public.maintain_community_member_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.communities
    set member_count = member_count + 1
    where id = new.community_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.communities
    set member_count = greatest(member_count - 1, 0)
    where id = old.community_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists on_community_member_change on public.community_members;
create trigger on_community_member_change
  after insert or delete on public.community_members
  for each row execute function public.maintain_community_member_count();

-- Recalculate member counts based on current memberships
update public.communities c
set member_count = (
  select count(*) 
  from public.community_members 
  where community_id = c.id
);

-- 3. Events Attendee Count Automation
create or replace function public.maintain_event_attendee_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (TG_OP = 'INSERT') then
    if (new.status != 'cancelled') then
      update public.events
      set attendee_count = attendee_count + 1
      where id = new.event_id;
    end if;
    return new;
  elsif (TG_OP = 'UPDATE') then
    if (old.status = 'cancelled' and new.status != 'cancelled') then
      update public.events
      set attendee_count = attendee_count + 1
      where id = new.event_id;
    elsif (old.status != 'cancelled' and new.status = 'cancelled') then
      update public.events
      set attendee_count = greatest(attendee_count - 1, 0)
      where id = new.event_id;
    end if;
    return new;
  elsif (TG_OP = 'DELETE') then
    if (old.status != 'cancelled') then
      update public.events
      set attendee_count = greatest(attendee_count - 1, 0)
      where id = old.event_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists on_event_attendee_change on public.event_attendees;
create trigger on_event_attendee_change
  after insert or update or delete on public.event_attendees
  for each row execute function public.maintain_event_attendee_count();

-- Recalculate event attendee counts based on current going/interested attendees
update public.events e
set attendee_count = (
  select count(*) 
  from public.event_attendees 
  where event_id = e.id and status != 'cancelled'
);
