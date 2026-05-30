# SortMySkills — Functionality Overview

> For parser internals and validation systems, see **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)**.  
> For visual maps and persistence layouts, see **[APP_FLOW.md](./APP_FLOW.md)**.  
> For code guides and Q&A preparation, see **[REVIEWER_GUIDE.md](./REVIEWER_GUIDE.md)**.  
> For product milestones, see **[ROADMAP.md](./ROADMAP.md)**.

SortMySkills is a secure, authenticated **career intelligence SaaS platform** built with Next.js 15, React 19, Tailwind CSS 4, Supabase, Groq AI, GSAP, and Lenis.

---

## 1. Marketing Homepage (`/`)

* **Hero & Tokenizer Demo**: Editorial asymmetric layout. Auto-cycling raw tech text parses against `SKILL_MAP` to display dynamic tokenization.
* **Interactive Playground**: paste chaotic resume blocks to view inferred discipline (e.g. Frontend Engineering) and alignment tags.
* **Theme System Display**: Swap dark/light modes and try brand palettes (Terracotta, Neon, Amber, Slate).

---

## 2. Unified Career Analyser (`/career-analyser`)

This is the central candidate workspace, combining instant client scans with validated AI roadmaps. Note: `/job-match` redirects here automatically.

### A. Inputs Panel
* Pastes Resume and target Job Description (JD) text once.
* **Load demo sample**: Instantly populates mock variables (John Doe / TechCorp) for trial and triggers **"Demo data loaded"** warning badges to avoid saving duplicate data.

### B. Readiness Scan (Formerly ATS Compatibility)
* Evaluates resume completeness across **5 distinct weighting factors**: Keyword Match (35%), Format & Structure (20%), Word Count (15%), Recruiter Tones (15%), and Contacts (15%).
* Renders a breakdown panel indicating structural strengths and targeted quick wins.

### C. Skill Gap Check
* Compares parsed resume tokens against target JD requirements.
* Classifies tags as: **Skills You Have** (Green), **Missing Skills** (Orange), or **Bonus Skills** (Blue).
* Missing skills automatically trigger direct **Course Bridges** linking to relevant Coursera searches.

### D. Study Roadmap Generator
* Input a target job-ready date and optional focus areas.
* Uses **Groq Llama-3** to output a week-by-week transition schedule.
* **Hallucination Defense**: Automatically sanitizes and maps AI-suggested resources against a local registry of 14 free platforms (Odin Project, MDN, freeCodeCamp, roadmap.sh).
* **Zod Validation**: Safe-parses and validates JSON payloads before database insert or returning.
* **Persistent Milestones**: Generates an interactive weekly milestone checklist stored in `localStorage`.

### E. Data Privacy Deletion
* Displays a **🔒 Resume Privacy Notice** documenting session synchronization.
* Dedicated "Delete Saved Analysis" button triggers the secure `deleteMyAnalysisSessionsAction` server action to clear account history and local footprints.

---

## 3. Skill Development Planner (`/skill-development`)

* **Role Selection**: Six target role profiles (Frontend, Backend, Analyst, ML, UX, PM) loaded with descriptions, average salaries, and baseline skills.
* **Readiness Chart**: Checkbox toggles calculate readiness ratios. Renders a Recharts bar chart comparing required baseline targets against your actual skills.
* **Static Roadmap**: Shows hand-curated Coursera Certificates specifically addressing target checkboxes that are unchecked.

---

## 4. Interview Question Packs (`/interview-packs`)

* **Catalog Grid**: Displays packs for the 6 primary career families (100 Q&As per pack).
* **Slug Detail Page (`/interview-packs/[slug]`)**: View cards with questions categorized by Easy (35), Medium (35), and Hard (30). Easy difficulty filtering supports mock interview drills.

---

## 5. Account Settings & Stats (`/profile`)

* **Interactive Profile Card**: Displays verified emails, role selections (student, graduate, job seeker), and custom display names.
* **Database Synchronisation**: Synchronizes user details securely with Postgres `public.profiles` and Supabase Auth metadata.
* **Workspace Metrics**: Displays dynamic parallel Postgres statistics:
  * Completed Audits count (analysis sessions logged).
  * Career Comparisons count (active comparisons run).
  * Parser Mapping counts (taxonomy normalizations logged).

---

## 6. Skill Parser Specificity (`src/lib/skill-map.ts`)

Central lookup registry standardizes messy aliases into canonical titles with high-specificity rules:

| Aliases | Resolved Canonical Tag | Category Mapped |
|---------|------------------------|-----------------|
| `pandas` | Pandas | Data Science & Analytics |
| `numpy` | NumPy | Data Science & Analytics |
| `pytorch` | PyTorch | AI & Machine Learning |
| `tensorflow`, `tf` | TensorFlow | AI & Machine Learning |
| `scikit-learn`, `sklearn` | Scikit-learn | AI & Machine Learning |
| `firebase` | Firebase | Cloud & Hosting Services |
| `dynamodb` | DynamoDB | Cloud & Hosting Services |
| `docker` | Docker | DevOps |
| `kubernetes`, `k8s` | Kubernetes | DevOps |
| `s3` | Amazon S3 | Cloud Infrastructure |
| `ec2` | Amazon EC2 | Cloud Infrastructure |
| `lambda` | AWS Lambda | Cloud Infrastructure |
| `go`, `golang` | Go (protected against verb "go") | Languages |
