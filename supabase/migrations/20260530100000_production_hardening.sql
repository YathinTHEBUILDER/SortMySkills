-- ==========================================
-- Supabase Migration: Production Hardening & Security Tightening
-- Created: May 2026
-- Description: Adds optimal indexes for querying and tightens row level security (RLS) policies.
-- ==========================================

-- 1. Create optimal performance indexes
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_user_created 
  ON public.analysis_sessions (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_api_rate_limits_lookup 
  ON public.api_rate_limits (ip_address, user_id, feature_name, window_start);

CREATE INDEX IF NOT EXISTS idx_ai_request_logs_user_created 
  ON public.ai_request_logs (user_id, created_at DESC);


-- 2. Tighten public.api_rate_limits RLS policies
-- Drop wide-open anonymous policies
DROP POLICY IF EXISTS "Allow select rate limits for everyone" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Allow insert rate limits for everyone" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Allow update rate limits for everyone" ON public.api_rate_limits;

-- Re-create secure scoped policies
CREATE POLICY "Users can select own rate limits" 
  ON public.api_rate_limits
  FOR SELECT 
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own rate limits" 
  ON public.api_rate_limits
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own rate limits" 
  ON public.api_rate_limits
  FOR UPDATE 
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);


-- 3. Tighten public.ai_request_logs RLS policies
-- Drop wide-open policies if any exist
DROP POLICY IF EXISTS "Allow select logs for everyone" ON public.ai_request_logs;
DROP POLICY IF EXISTS "Allow insert logs for everyone" ON public.ai_request_logs;

-- Re-create secure scoped policies for request logging
CREATE POLICY "Users can select own request logs" 
  ON public.ai_request_logs
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own request logs" 
  ON public.ai_request_logs
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert anonymous logs" 
  ON public.ai_request_logs
  FOR INSERT 
  TO anon
  WITH CHECK (user_id IS NULL);
