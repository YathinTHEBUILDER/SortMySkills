# Supabase Database Schema & Migrations

This folder houses the SQL migrations and schema definitions for the SortMySkills production-ready database backend.

## File Structure

```text
supabase/
├── migrations/
│   ├── 20260529000000_init_auth_tables.sql         # Initial profiles and user roles schema
│   ├── 20260530000000_ai_reliability_persistence.sql # Rate limit, sessions, request logs tables
│   └── 20260530100000_production_hardening.sql      # High-efficiency indexes and secure RLS policies
└── README.md                                       # This documentation file
```

---

## Table Structure by Feature

### 1. Account & Membership Profile
* **Table**: `public.profiles` (defined in `20260529000000_init_auth_tables.sql`)
* **Role Options**: `"student" | "graduate" | "job_seeker"` (Admin role has been removed for user-facing security).
* **Sync**: Connected via foreign key to `auth.users` on delete cascade.

### 2. Career Analyser Workspace
* **Table**: `public.analysis_sessions` (defined in `20260530000000_ai_reliability_persistence.sql`)
  * Stores user's latest parsed resume, target job description (JD), target readiness date, and optional focus areas.
  * Persists JSON results for `ats_result` (Readiness Score), `job_match_result` (Skill Gaps), and `roadmap_result` (AI Study Plan).
* **Table**: `public.career_analyser_results`
  * Historic log table for incremental scan state versioning.

### 3. API Rate Limiting
* **Table**: `public.api_rate_limits` (defined in `20260530000000_ai_reliability_persistence.sql`)
  * Implements persistent, windowed, IP-address & user-id constrained API rate limits to prevent script abuse.

### 4. AI Requests & Telemetry
* **Table**: `public.ai_generations`
  * Logs the inputs and raw outputs of various AI features for potential recovery and debugging.
* **Table**: `public.ai_request_logs`
  * Standard request tracking log containing latency, model name, fallback usage, and outcome status for operational diagnostics.

---

## Row Level Security (RLS) Policies

All tables have RLS enabled by default. To secure private user details:
* **`profiles`, `analysis_sessions`, `career_analyser_results`, `ai_generations`**:
  * Users can only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` their own rows (`auth.uid() = user_id`).
* **`api_rate_limits`**:
  * Scoped to either the authenticated user's ID (`auth.uid() = user_id`) or matched IP address with null user ID. Prevent users from checking/modifying other users' limit quotas.
* **`ai_request_logs`**:
  * Authenticated users can view and write their own telemetry logs. Anonymous inputs can only write log rows where `user_id` is null.

---

## Database Indexes

We use targeted composite indexes to ensure high performance under load:
1. `idx_analysis_sessions_user_created` (analysis_sessions): Speeds up fetching a user's latest session data.
2. `idx_api_rate_limits_lookup` (api_rate_limits): Speeds up rate-limiter check queries by grouping features, windows, and IP/User details.
3. `idx_ai_request_logs_user_created` (ai_request_logs): Speeds up user history and log metrics queries.

---

## How to Apply Migrations

### Using the Supabase CLI (Recommended)
1. Install and initialize the CLI inside your root directory.
2. Start the local database stack:
   ```bash
   supabase start
   ```
3. Apply migrations to the local database:
   ```bash
   supabase db reset
   ```
4. Push migrations to your remote production Supabase instance:
   ```bash
   supabase db push
   ```

### Using the Supabase Dashboard SQL Editor
If you are managing your project directly via the web dashboard without CLI integration:
1. Open your project on [supabase.com](https://supabase.com).
2. Click on **SQL Editor** in the left navigation panel.
3. Open a **New Query**.
4. Copy and paste the contents of the files in `supabase/migrations/` sequentially:
   1. `20260529000000_init_auth_tables.sql`
   2. `20260530000000_ai_reliability_persistence.sql`
   3. `20260530100000_production_hardening.sql`
5. Click **Run** for each migration query block to execute successfully.
