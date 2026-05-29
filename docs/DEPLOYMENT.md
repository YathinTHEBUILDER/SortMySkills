# Deployment Guide: Vercel & Supabase

This guide walks you through deploying **SortMySkills** to production using **Vercel** for hosting, **Supabase** for database/auth, and **Groq** for AI features.

---

## 1. Supabase Database & Auth Setup

### Step 1: Create a Supabase Project
1. Go to the [Supabase Dashboard](https://supabase.com/) and create a new project.
2. Choose a database password and select a region close to your user base.
3. Wait for the database to finish provisioning.

### Step 2: Run Database Migrations
To set up the tables, Row-Level Security (RLS) policies, and triggers:
1. In your Supabase dashboard, navigate to the **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Open the file [20260529000000_init_auth_tables.sql](file:///d:/Projects/SortMySkills/supabase/migrations/20260529000000_init_auth_tables.sql) from your workspace.
4. Copy the entire contents of that SQL file and paste them into the SQL Editor.
5. Click **Run**. You should see a success message indicating the tables, RLS policies, and triggers were created.

### Step 3: Retrieve API Credentials
1. Go to **Project Settings** (gear icon in the sidebar) -> **API**.
2. Copy the following credentials:
   - **Project URL** (under Project API keys / URL) — this will be `NEXT_PUBLIC_SUPABASE_URL`.
   - **anon public** key (under Project API keys / API Keys) — this will be `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 2. SMTP & Email Setup

The application uses **Gmail SMTP via Nodemailer** to send custom internal emails.

### Step 1: Generate a Google App Password
Since standard password authentication is blocked by Google for security, you must generate an App Password:
1. Go to your [Google Account settings](https://myaccount.google.com/).
2. Navigate to **Security** and enable **2-Step Verification** (if not already enabled).
3. Under 2-Step Verification, scroll down to **App passwords**.
4. Create a new App Password (e.g., name it `SortMySkills Vercel`).
5. Copy the generated 16-character password (without spaces).

### Step 2: Configure Environment Variables
You will need the following SMTP environment variables for the application:
- `GMAIL_SMTP_USER`: Your Gmail address (e.g., `yourname@gmail.com`).
- `GMAIL_SMTP_PASSWORD`: The 16-character App Password generated in the step above.
- `GMAIL_SENDER_EMAIL`: Your sender address (usually the same as `GMAIL_SMTP_USER`).
- `GMAIL_SENDER_NAME`: A display name for emails (e.g., `SortMySkills`).

> [!NOTE]
> If you also want to configure custom SMTP for Supabase's built-in emails (like sign-ups or OTPs), you can go to Supabase's **Project Settings** -> **Auth** -> **SMTP** and toggle **Enable SMTP** on, filling in the same Gmail SMTP settings:
> - **SMTP Host**: `smtp.gmail.com`
> - **Port**: `465` (SSL) or `587` (TLS)
> - **Username**: `yourname@gmail.com`
> - **Password**: your 16-character App Password

---

## 3. Groq API Setup

The resume feedback and job description translation APIs rely on the **Groq API**.
1. Go to the [Groq Console](https://console.groq.com/).
2. Create an account or sign in.
3. Go to **API Keys** -> **Create API Key**.
4. Give it a name (e.g., `SortMySkills-Prod`) and copy the key. This will be `GROQ_API_KEY`.

---

## 4. Vercel Deployment

### Step 1: Create a Vercel Project
1. Log in to [Vercel](https://vercel.com/) (using GitHub is recommended).
2. Click **Add New** -> **Project**.
3. Import the GitHub repository for **SortMySkills**.

### Step 2: Configure Build & Development Settings
Vercel automatically detects Next.js. You can leave the build command and output directory as defaults:
- **Framework Preset**: `Next.js`
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 3: Add Environment Variables
Add the following environment variables in the Vercel project configuration page:

| Variable Name | Value Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `NEXT_PUBLIC_SITE_URL` | Your production Vercel URL (e.g., `https://your-domain.vercel.app`) |
| `GMAIL_SMTP_USER` | Your Gmail address |
| `GMAIL_SMTP_PASSWORD` | Your Google App Password |
| `GMAIL_SENDER_EMAIL` | Your sender email (usually your Gmail address) |
| `GMAIL_SENDER_NAME` | `SortMySkills` |
| `GROQ_API_KEY` | Your Groq API key |

Click **Deploy**!

---

## 5. Configure Authentication Redirects in Supabase

After your Vercel deployment finishes, you will receive a production URL (e.g., `https://sortmyskills.vercel.app`). You need to configure this in Supabase so that users are redirected back to your app after authentication.

1. In your Supabase Dashboard, go to **Project Settings** -> **Auth**.
2. Scroll to the **Redirect URLs** section.
3. Click **Add URL** and add your Vercel production URL with the callback route:
   ```text
   https://your-project.vercel.app/auth/callback
   ```
4. If you want to support Vercel preview deployments (for Git pull requests), add a wildcard redirect URL:
   ```text
   https://your-project-*.vercel.app/auth/callback
   ```
5. Click **Save**.

---

## 6. Verifying Your Deployment

Once deployed:
1. Navigate to your deployed application's URL.
2. Sign up or log in via OTP to test the Supabase auth sync and the email delivery system.
3. Update your Profile name and target career role, then check if it successfully persists to the database.
4. Try out the `/job-match` page to compare a resume and JD, verifying the Groq API integration is fully functional.
5. Go to the `/skill-development` page to test checking skills and updating readiness percentages.
