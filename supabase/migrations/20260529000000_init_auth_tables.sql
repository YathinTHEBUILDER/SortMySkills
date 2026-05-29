-- ==========================================
-- Supabase Migration: Init Auth & App Tables
-- Created: May 2026
-- Description: Sets up profiles, skill_audits, job_analyses,
--              and parser_history with strict Row-Level Security (RLS).
-- ==========================================

-- 1. Create Profiles Table (Synced with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  display_name text,
  target_role text
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 2. Create Skill Audits Table
create table public.skill_audits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  role_id text not null,
  skills text[] not null,
  readiness integer not null
);

-- Enable RLS on Skill Audits
alter table public.skill_audits enable row level security;

-- 3. Create Job Analyses Table
create table public.job_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  resume_text text not null,
  jd_text text not null,
  results jsonb not null
);

-- Enable RLS on Job Analyses
alter table public.job_analyses enable row level security;

-- 4. Create Parser History Table
create table public.parser_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  input_text text not null,
  tags text[] not null
);

-- Enable RLS on Parser History
alter table public.parser_history enable row level security;


-- ==========================================
-- RLS Policies (Security Hardened)
-- ==========================================

-- Profiles Policies
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Skill Audits Policies
create policy "Users can view their own skill audits"
  on public.skill_audits
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own skill audits"
  on public.skill_audits
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own skill audits"
  on public.skill_audits
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own skill audits"
  on public.skill_audits
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Job Analyses Policies
create policy "Users can view their own job analyses"
  on public.job_analyses
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own job analyses"
  on public.job_analyses
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own job analyses"
  on public.job_analyses
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete their own job analyses"
  on public.job_analyses
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Parser History Policies
create policy "Users can view their own parser history"
  on public.parser_history
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own parser history"
  on public.parser_history
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can delete their own parser history"
  on public.parser_history
  for delete
  to authenticated
  using (user_id = auth.uid());


-- ==========================================
-- Triggers for User Sync
-- ==========================================

-- Function to handle syncing a new user to public.profiles
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql;

-- Trigger to execute the function on new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
