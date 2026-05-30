# Supabase Consolidation Migration Setup

This directory houses the consolidated SQL schema definition for SortMySkills.

## File Structure

```text
supabase/
├── migrations/
│   └── 001_init.sql   # Consolidated manual-run safe schema setup
└── README.md          # This instruction document
```

---

## 1. How to Run the Migration Manually

1. Log in to your project workspace at [supabase.com](https://supabase.com).
2. On the left navigation sidebar, click on the **SQL Editor** icon.
3. Click on **New Query**.
4. Open the file [001_init.sql](./migrations/001_init.sql), copy its complete text, and paste it into the query editor.
5. Click **Run**. All triggers, indexes, tables, and Row Level Security (RLS) policies will be transactionally provisioned.

---

## 2. Required Environment Variables

Add the following credentials to your local `.env.local` or Next.js hosting environment:

```text
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-endpoint
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-public-anon-key
```

---

## 3. Database Tables Purpose

* **`profiles`**: Synchronizes user membership credentials, display names, and target placement career selections.
* **`analysis_sessions`**: Securely caches the candidate's parsed resume text, target job description (JD), target date, and generated AI roadmap JSONs.
* **`api_rate_limits`**: Windowed database-backed rate tracker protecting APIs against script abuse.
* **`ai_request_logs`**: Logs model completion diagnostics and latency telemetry for operational analysis.
* **`skill_audits`**, **`job_analyses`**, **`parser_history`**: Legacy database models preserved to maintain full backward compatibility with older dashboard statistics.

---

## 4. Row Level Security (RLS) Policies

Row Level Security is enabled globally on every database model to safeguard data privacy:
* **Accounts & Sessions**: Users can strictly query, insert, edit, and delete only records matching their unique `auth.uid() = user_id`.
* **Telemetry**: Users can view and log their own rates and request records, but cannot browse public rate parameters or read foreign system logs.
* **Anonymous Access**: Policies are configured to handle anonymous client sessions securely when matching rate windows or system status metrics.

---

## 5. Privacy Notice & Data Deletion

* SortMySkills persists pasted resume and target JD text strictly to enable resume workspace persistence across active logins.
* **Wipe Data foot-print**: Candidates have full control over their data. Clicking **Delete Saved Analysis Data** inside the Career Analyser cleanly wipes all database record references, clears milestones checkbox items, resets workspace panels, and wipes all localStorage keys permanently.
