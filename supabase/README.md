# Supabase

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and add your URL and anon key.
3. Enable Email auth in **Authentication → Providers**.

## Planned migrations

When ready, add SQL files under `migrations/`:

- `profiles` — linked to `auth.users`
- `skill_audits` — role, skills[], readiness, `user_id`
- `job_analyses` — resume/jd text, results JSON, `user_id`
- `parser_history` — input, tags[], `user_id`

The app already includes `AuthProvider`, login page, and settings status UI.
