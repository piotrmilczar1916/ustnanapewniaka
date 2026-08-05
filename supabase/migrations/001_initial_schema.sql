-- UstnaNaPewniaka.pl — schemat początkowy
-- Uruchom w Supabase: SQL Editor → New query → wklej i Run

-- Profil użytkownika (powiązany z auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  plan text not null default 'free' check (plan in ('free', 'full')),
  access_until date,
  created_at timestamptz not null default now()
);

-- Wyniki symulacji
create table if not exists public.session_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  question_code text not null,
  question_kind text not null check (question_kind in ('jawne', 'niejawne')),
  question_title text not null,
  total_points integer not null,
  max_points integer not null,
  percentage integer not null,
  criteria jsonb not null default '[]'::jsonb
);

create index if not exists session_results_user_id_created_at_idx
  on public.session_results (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.session_results enable row level security;

-- Profil: odczyt własnego (plan zmienia webhook płatności przez service role)
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Blokada zmiany planu z poziomu klienta
create or replace function public.protect_profile_plan()
returns trigger
language plpgsql
as $$
begin
  if new.plan is distinct from old.plan then
    raise exception 'Plan może zmienić tylko serwer płatności.';
  end if;
  if new.access_until is distinct from old.access_until then
    raise exception 'Data dostępu może zmienić tylko serwer płatności.';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_plan_trigger on public.profiles;

create trigger protect_profile_plan_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_plan();
create policy "session_results_select_own"
  on public.session_results for select
  using (auth.uid() = user_id);

create policy "session_results_insert_own"
  on public.session_results for insert
  with check (auth.uid() = user_id);

-- Trigger: utwórz profil po rejestracji
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
