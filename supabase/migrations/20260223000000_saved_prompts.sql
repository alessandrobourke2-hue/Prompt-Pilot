-- Create saved_prompts table
create table if not exists public.saved_prompts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  title        text not null,
  input        text not null,
  enhanced_prompt text not null,
  improvements jsonb not null default '[]',
  structure    text,
  created_at   timestamptz not null default now(),
  last_used    timestamptz
);

-- Index for fast per-user queries
create index if not exists saved_prompts_user_id_idx
  on public.saved_prompts (user_id, created_at desc);

-- Enable Row Level Security
alter table public.saved_prompts enable row level security;

-- Users can only see their own prompts
create policy "Users can read own prompts"
  on public.saved_prompts for select
  using (auth.uid() = user_id);

-- Users can insert their own prompts
create policy "Users can insert own prompts"
  on public.saved_prompts for insert
  with check (auth.uid() = user_id);

-- Users can update their own prompts
create policy "Users can update own prompts"
  on public.saved_prompts for update
  using (auth.uid() = user_id);

-- Users can delete their own prompts
create policy "Users can delete own prompts"
  on public.saved_prompts for delete
  using (auth.uid() = user_id);
