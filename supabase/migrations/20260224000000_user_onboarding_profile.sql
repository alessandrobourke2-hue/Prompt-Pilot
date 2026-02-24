-- Create user_onboarding_profile table
create table if not exists public.user_onboarding_profile (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  role             text not null,
  role_other       text,
  use_cases        jsonb not null default '[]',
  ai_experience    text not null,
  tools            jsonb not null default '[]',
  tone_preference  text not null,
  primary_goal     text not null,
  display_name     text not null,
  org_name         text,
  workspace_name   text,
  onboarding_complete bool not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Auto-update updated_at on row changes
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_onboarding_profile_updated_at
  before update on public.user_onboarding_profile
  for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security
alter table public.user_onboarding_profile enable row level security;

-- Users can only read their own profile
create policy "Users can read own onboarding profile"
  on public.user_onboarding_profile for select
  using (auth.uid() = user_id);

-- Users can insert their own profile
create policy "Users can insert own onboarding profile"
  on public.user_onboarding_profile for insert
  with check (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own onboarding profile"
  on public.user_onboarding_profile for update
  using (auth.uid() = user_id);
