-- ==========================================
-- Supabase Consolidation Migration: 001_init.sql
-- Description: Consolidated tables, triggers, indices, and row level security (RLS) policies.
-- Safe to run multiple times manually in Supabase SQL Editor.
-- ==========================================

-- Reusable updated_at timestamp trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_role text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for public.profiles
drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Enable RLS for public.profiles
alter table public.profiles enable row level security;

-- Policies for public.profiles
drop policy if exists "Users can select own profile" on public.profiles;
create policy "Users can select own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = id);


-- 2. Analysis Sessions Table
create table if not exists public.analysis_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_text text,
  jd_text text,
  target_date date,
  focus_areas text,
  ats_result jsonb,
  job_match_result jsonb,
  roadmap_result jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for public.analysis_sessions
drop trigger if exists handle_sessions_updated_at on public.analysis_sessions;
create trigger handle_sessions_updated_at
  before update on public.analysis_sessions
  for each row execute function public.set_updated_at();

-- Enable RLS for public.analysis_sessions
alter table public.analysis_sessions enable row level security;

-- Policies for public.analysis_sessions
drop policy if exists "Users can select own sessions" on public.analysis_sessions;
create policy "Users can select own sessions" on public.analysis_sessions for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own sessions" on public.analysis_sessions;
create policy "Users can insert own sessions" on public.analysis_sessions for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own sessions" on public.analysis_sessions;
create policy "Users can update own sessions" on public.analysis_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own sessions" on public.analysis_sessions;
create policy "Users can delete own sessions" on public.analysis_sessions for delete using (auth.uid() = user_id);

-- Indexes for public.analysis_sessions
create index if not exists idx_analysis_sessions_user_created on public.analysis_sessions(user_id, created_at desc);
create index if not exists idx_analysis_sessions_user_updated on public.analysis_sessions(user_id, updated_at desc);


-- 3. API Rate Limits Table
create table if not exists public.api_rate_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ip_address text,
  feature_name text not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for public.api_rate_limits
drop trigger if exists handle_rate_limits_updated_at on public.api_rate_limits;
create trigger handle_rate_limits_updated_at
  before update on public.api_rate_limits
  for each row execute function public.set_updated_at();

-- Enable RLS for public.api_rate_limits
alter table public.api_rate_limits enable row level security;

-- Policies for public.api_rate_limits
drop policy if exists "Enable select for users" on public.api_rate_limits;
create policy "Enable select for users" on public.api_rate_limits for select using (auth.uid() = user_id OR user_id is null);

drop policy if exists "Enable insert for users" on public.api_rate_limits;
create policy "Enable insert for users" on public.api_rate_limits for insert with check (auth.uid() = user_id OR user_id is null);

drop policy if exists "Enable update for users" on public.api_rate_limits;
create policy "Enable update for users" on public.api_rate_limits for update using (auth.uid() = user_id OR user_id is null) with check (auth.uid() = user_id OR user_id is null);

-- Indexes for public.api_rate_limits
create index if not exists idx_api_rate_limits_lookup on public.api_rate_limits(feature_name, window_start, user_id, ip_address);
create unique index if not exists idx_api_rate_limits_unique_user on public.api_rate_limits(feature_name, window_start, user_id) where user_id is not null;
create unique index if not exists idx_api_rate_limits_unique_ip on public.api_rate_limits(feature_name, window_start, ip_address) where user_id is null;


-- 4. AI Request Logs Table
create table if not exists public.ai_request_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feature_name text not null,
  model_used text,
  fallback_used boolean default false,
  key_label_used text,
  status text not null,
  error_code text,
  latency_ms integer,
  created_at timestamptz default now()
);

-- Enable RLS for public.ai_request_logs
alter table public.ai_request_logs enable row level security;

-- Policies for public.ai_request_logs
drop policy if exists "Users can select own request logs" on public.ai_request_logs;
create policy "Users can select own request logs" on public.ai_request_logs for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can insert own request logs" on public.ai_request_logs;
create policy "Users can insert own request logs" on public.ai_request_logs for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "System can insert anonymous logs" on public.ai_request_logs;
create policy "System can insert anonymous logs" on public.ai_request_logs for insert to anon with check (user_id is null);

-- Index for public.ai_request_logs
create index if not exists idx_ai_request_logs_user_created on public.ai_request_logs(user_id, created_at desc);


-- 5. Skill Audits Table (Legacy / Dashboard Compatibility)
create table if not exists public.skill_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skills jsonb,
  readiness integer default 0,
  role_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for public.skill_audits
drop trigger if exists handle_skill_audits_updated_at on public.skill_audits;
create trigger handle_skill_audits_updated_at
  before update on public.skill_audits
  for each row execute function public.set_updated_at();

-- Enable RLS for public.skill_audits
alter table public.skill_audits enable row level security;

-- Policies for public.skill_audits
drop policy if exists "Users can select own skill audits" on public.skill_audits;
create policy "Users can select own skill audits" on public.skill_audits for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own skill audits" on public.skill_audits;
create policy "Users can insert own skill audits" on public.skill_audits for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own skill audits" on public.skill_audits;
create policy "Users can update own skill audits" on public.skill_audits for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own skill audits" on public.skill_audits;
create policy "Users can delete own skill audits" on public.skill_audits for delete using (auth.uid() = user_id);


-- 6. Job Analyses Table (Legacy / Dashboard Compatibility)
create table if not exists public.job_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_text text,
  jd_text text,
  result jsonb,
  score integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger for public.job_analyses
drop trigger if exists handle_job_analyses_updated_at on public.job_analyses;
create trigger handle_job_analyses_updated_at
  before update on public.job_analyses
  for each row execute function public.set_updated_at();

-- Enable RLS for public.job_analyses
alter table public.job_analyses enable row level security;

-- Policies for public.job_analyses
drop policy if exists "Users can select own job analyses" on public.job_analyses;
create policy "Users can select own job analyses" on public.job_analyses for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own job analyses" on public.job_analyses;
create policy "Users can insert own job analyses" on public.job_analyses for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own job analyses" on public.job_analyses;
create policy "Users can update own job analyses" on public.job_analyses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own job analyses" on public.job_analyses;
create policy "Users can delete own job analyses" on public.job_analyses for delete using (auth.uid() = user_id);


-- 7. Parser History Table (Legacy / Dashboard Compatibility)
create table if not exists public.parser_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input_text text,
  detected_skills jsonb,
  created_at timestamptz default now()
);

-- Enable RLS for public.parser_history
alter table public.parser_history enable row level security;

-- Policies for public.parser_history
drop policy if exists "Users can select own parser history" on public.parser_history;
create policy "Users can select own parser history" on public.parser_history for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own parser history" on public.parser_history;
create policy "Users can insert own parser history" on public.parser_history for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own parser history" on public.parser_history;
create policy "Users can delete own parser history" on public.parser_history for delete using (auth.uid() = user_id);
