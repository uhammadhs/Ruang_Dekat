-- Trigger: auto-create profile on user signup
-- Jalankan setelah schema.sql

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  -- Generate username from email
  base_username := lower(split_part(new.email, '@', 1));
  -- Remove special chars, keep alphanumeric, underscore, dot
  base_username := regexp_replace(base_username, '[^a-z0-9_.]', '', 'g');
  -- Truncate to max 20 chars
  base_username := left(base_username, 20);
  -- Ensure minimum 3 chars
  if length(base_username) < 3 then
    base_username := 'user' || substr(new.id::text, 1, 8);
  end if;

  -- Ensure unique username
  final_username := base_username;
  while exists(select 1 from public.profiles where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$$;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
