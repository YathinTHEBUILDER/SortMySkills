-- ==========================================
-- Supabase Migration: AI Reliability & Persistence
-- Created: May 2026
-- Description: Sets up tables for Supabase-backed rate limiting,
--              analysis session storage, and AI request logging with RLS policies.
-- ==========================================

-- 1. Create API Rate Limits Table
create table public.api_rate_limits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  ip_address text not null,
  feature_name text not null,
  window_start timestamp with time zone not null,
  request_count integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for Upsert Efficiency
create unique index api_rate_limits_user_feature_window_idx on public.api_rate_limits (user_id, feature_name, window_start) where user_id is not null;
create unique index api_rate_limits_ip_feature_window_idx on public.api_rate_limits (ip_address, feature_name, window_start) where user_id is null;

-- Enable RLS
alter table public.api_rate_limits enable row level security;

-- Rate Limits Policies
create policy "Allow select rate limits for everyone" on public.api_rate_limits for select using (true);
create policy "Allow insert rate limits for everyone" on public.api_rate_limits for insert with check (true);
create policy "Allow update rate limits for everyone" on public.api_rate_limits for update using (true) with check (true);


-- 2. Create Analysis Sessions Table
create table public.analysis_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  resume_text text not null,
  jd_text text not null,
  target_date text,
  focus_areas text,
  ats_result jsonb,
  job_match_result jsonb,
  roadmap_result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analysis_sessions enable row level security;

-- Sessions Policies
create policy "Users can view their own sessions" on public.analysis_sessions for select to authenticated using (user_id = auth.uid());
create policy "Users can insert their own sessions" on public.analysis_sessions for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update their own sessions" on public.analysis_sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete their own sessions" on public.analysis_sessions for delete to authenticated using (user_id = auth.uid());


-- 3. Create Career Analyser Results Table
create table public.career_analyser_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id uuid references public.analysis_sessions on delete cascade,
  feature_type text not null, -- 'ats' | 'match' | 'roadmap'
  result_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.career_analyser_results enable row level security;

-- Analyser Results Policies
create policy "Users can view their own analyser results" on public.career_analyser_results for select to authenticated using (user_id = auth.uid());
create policy "Users can insert their own analyser results" on public.career_analyser_results for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update their own analyser results" on public.career_analyser_results for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete their own analyser results" on public.career_analyser_results for delete to authenticated using (user_id = auth.uid());


-- 4. Create AI Generations Table
create table public.ai_generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  feature_name text not null, -- 'why-no-reply' | 'resume-builder' etc.
  prompt_inputs jsonb not null,
  generated_output jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ai_generations enable row level security;

-- Generations Policies
create policy "Users can view their own generations" on public.ai_generations for select to authenticated using (user_id = auth.uid());
create policy "Users can insert their own generations" on public.ai_generations for insert to authenticated with check (user_id = auth.uid());
create policy "Users can update their own generations" on public.ai_generations for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users can delete their own generations" on public.ai_generations for delete to authenticated using (user_id = auth.uid());


-- 5. Create AI Request Logs Table
create table public.ai_request_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  feature_name text not null, -- 'why-no-reply' | 'roadmap' | 'resume-builder' | 'jd-translate'
  model_used text not null,
  fallback_used boolean not null default false,
  key_label_used text not null, -- 'PRIMARY', 'FALLBACK_1', 'FALLBACK_2', 'LEGACY'
  status text not null, -- 'success' | 'failure'
  error_code text,
  latency_ms integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ai_request_logs enable row level security;

-- Request Logs Policies
create policy "Allow select logs for everyone" on public.ai_request_logs for select using (true);
create policy "Allow insert logs for everyone" on public.ai_request_logs for insert with check (true);
