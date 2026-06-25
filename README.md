# NursePath: Clinical Reference Tool for Nursing Students

<p align="center">
  <img src="image-512.png" alt="NursePath Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A Digital Clinical Reference Companion for Student Nurses</strong>
</p>

<p align="center">
  <em>Version 1.4 | 2026 | Universidad de Dagupan — Officially Adopted</em>
</p>

---

## Quick Links

- **App:** [block9nurseapp.vercel.app](https://block9nurseapp.vercel.app/)
- **Dashboard (Faculty):** [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)
- **User Guide:** [USER_GUIDE.md](USER_GUIDE.md)
- **IPOPHL Copyright:** Registered April 8, 2026 — Class N Computer Program

---

## Executive Summary

**NursePath** is a Progressive Web Application (PWA) developed as a **digital clinical reference tool** for nursing students. Think of it as an interactive pocket reference card — it interprets physiological data against WHO-based and textbook-standard parameters and displays the finding for the student to evaluate. It does not diagnose, prescribe, or make clinical decisions. The student does.

The application has been officially adopted by **Universidad de Dagupan's College of Nursing** for use during clinical duties, sim lab sessions, and classroom instruction as part of a faculty-supervised pilot program.

### What It Does

- Interprets vital sign readings against age-adjusted, pregnancy-aware, and comorbidity-specific reference ranges
- Provides a searchable OTC medication reference with Philippine brand names and condition safety ratings
- Computes IV flow rates, BMI, AOG, and EDD using standard clinical formulas
- Operates fully offline after initial load — reliable on hospital wards with limited connectivity
- Tracks anonymous usage telemetry for faculty evaluation via Supabase

### What It Does Not Do

- It does not store any vital sign values entered by students
- It does not diagnose patients or recommend specific interventions
- It does not replace the clinical instructor's judgment or the hospital's protocols

---

## Intended Use

NursePath is authorized for use by student nurses during clinical rotations, sim lab sessions, and classroom case studies at Universidad de Dagupan. Students may use it at any point during their clinical duties in the same way they would use a pocket drug handbook or a vital signs reference card.

All outputs are framed as reference findings — not clinical orders. The student's own assessment and their Clinical Instructor's guidance always take precedence.

> **Reference tool, not decision maker. The student is always the clinician.**

---

## Features

### 🩺 Vital Signs Interpretation Engine
- Age-stratified reference ranges: Infant through Elderly (7 age groups)
- Pregnancy-adjusted ranges with gestational hypertension and preeclampsia pattern detection
- Comorbidity-aware context notes: Hypertension, Diabetes, Asthma, COPD, CKD
- Output language uses "SIM ALERT", "Simulation Finding", and "Ref Note" framing — never clinical orders
- Real-time analysis via `liveAnalyze()` and explicit generation via `simulateVitalSigns()`
- Core logic isolated in `assets/vitals-analysis.js` (`window.NursePathClinical` namespace)

### 💊 OTC Medication Reference
- 34 OTC medications with Philippine brand names
- Condition-specific safety ratings (Safe / Caution / Contraindicated)
- TLDR and expanded detail tabs per medication
- Drug class, mechanism of action, pharmacokinetics, nursing considerations
- Includes DOH-recognized Philippine herbal medicines
- Copy-to-clipboard quick reference feature
- Core logic in `assets/ui-helpers.js` (`window.NursePathUIHelpers` namespace)

### 💉 IV Flow Rate Calculator
- mL/hr: `Volume (mL) ÷ Time (hours)`
- gtt/min: `(mL/hr ÷ 60) × Drop Factor`
- Supports drop factors: 10, 15, 20, and 60 gtt/mL

### 🤰 AOG & EDD Calculator
- Naegele's Rule: `LMP + 280 days = EDD`
- Weeks and days breakdown with trimester determination
- Pregnancy milestone tracker (viability, trimesters, screening windows)

### ⚖️ BMI Calculator
- Standard formula: `Weight (kg) ÷ Height (m)²`
- WHO category classification with color-coded output

### 📴 Offline Capability
- Full PWA with Service Worker (stale-while-revalidate strategy)
- Works on hospital wards after first load — no Wi-Fi required
- Usage events queue locally and sync to Supabase automatically on reconnect

### 👻 Ghost Persistence (Auth)
- Email-based pilot identity — no password, no signup screen
- Device-sealed on first entry for auto-bypass on subsequent launches
- Built-in cooldown and typo-domain detection (e.g. `gmal.com → gmail.com`)
- Access modes: `Demo` (open), `Pilot` (allowlisted domain or invite code), `Admin` (faculty token)
- Emergency reset: tap the NursePath logo 5 times to clear local identity

### 📈 Usage Analytics
- Event types: `session_start`, `session_end`, `feature_open`, `feature_use`, `result_generated`, `copy_reference`, `help_opened`, `error_shown`
- Button-driven telemetry only — no keystroke tracking
- Local queue first (`nursepath_usage_queue_v1`) with batch sync to Supabase
- Anonymous by default; consent-controlled toggle on auth overlay
- Session IDs, duration tracking, and CSV export for faculty reporting
- Faculty dashboard: [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)

---

## Technical Architecture

### Development Approach

Developed using AI-assisted programming, combining the developer's nursing education background with AI coding assistance.

| Component | Responsibility |
|---|---|
| Content Selection & Requirements | Rance Adriel M. Pascua, BSN Student |
| Clinical Formula Verification | Rance Adriel M. Pascua, BSN Student |
| Feature Planning & Design | Rance Adriel M. Pascua, BSN Student |
| Code Implementation | Assisted by Claude (Anthropic) & GitHub Copilot |
| Testing & Review | Rance Adriel M. Pascua, BSN Student |

### Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | Tailwind CSS (inlined) |
| Clinical Logic | `assets/vitals-analysis.js` |
| UI Helpers | `assets/ui-helpers.js` |
| Offline | Service Worker (stale-while-revalidate) |
| Analytics | Supabase (batch insert, anon RLS) |
| Auth | Ghost Persistence (localStorage device seal) |
| Hosting | Vercel |

### File Structure

```
/
├── index.html                  # Main application (~4,350 lines)
├── sw.js                       # Service Worker (v1.4)
├── manifest.json               # PWA manifest
├── browserconfig.xml           # Windows tile config
├── image-192.png               # PWA icon
├── image-512.png               # PWA icon / logo
├── assets/
│   ├── vitals-analysis.js      # Vital signs engine (NursePathClinical namespace)
│   └── ui-helpers.js           # UI logic — OTC, calculators (NursePathUIHelpers namespace)
└── dashboard/                  # Faculty dashboard (React + Vite + Supabase)
    ├── src/
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── Overview.tsx
    │   │   ├── Analytics.tsx
    │   │   ├── Users.tsx
    │   │   └── Export.tsx
    │   └── lib/supabase.ts
    └── vite.config.ts
```

---

## Content Sources

All clinical reference content is derived from standard nursing textbooks and recognized guidelines:

- Brunner & Suddarth's Textbook of Medical-Surgical Nursing (14th Edition)
- Kozier & Erb's Fundamentals of Nursing (11th Edition)
- Lippincott's Nursing Drug Guide
- Pillitteri's Maternal & Child Health Nursing
- Philippine National Drug Formulary
- WHO BMI Classification Guidelines
- WHO Vital Signs Reference Ranges
- DOH Traditional Medicine Guidelines

---

## Current Status

| Phase | Status | Description |
|---|---|---|
| Development | ✅ Complete | Core features implemented and tested |
| Internal Testing | ✅ Complete | Developer and peer review complete |
| IPOPHL Registration | ✅ Complete | Filed April 8, 2026 — Class N Computer Program |
| Faculty Review | ✅ Complete | Approved by College of Nursing faculty |
| **University Adoption** | 🔄 **Active** | Officially adopted — pilot rollout in progress |
| Student Feedback | 🔄 In Progress | Gathering feedback from pilot cohort |
| Version 2.0 Planning | ⏳ Pending | Based on pilot outcomes |

---

## Access & Setup

### Student Access

1. Open [block9nurseapp.vercel.app](https://block9nurseapp.vercel.app/)
2. Enter your school email (`@cdd.edu.ph`) or the invite code provided by your instructor
3. Check the **Consent Box** for usage tracking (required for pilot evaluation)
4. Tap **Enter Pilot Workspace**
5. Accept the **Simulation Mode Agreement** (valid for 30 days)
6. Install as a PWA for best offline experience

**Install instructions:**
- **Android (Chrome):** Three-dot menu → Install app / Add to Home Screen
- **iOS (Safari):** Share icon → Add to Home Screen
- **Desktop:** Install icon in the browser address bar

### Faculty Dashboard Access

Contact the pilot coordinator for dashboard credentials. Do not share access credentials.

Dashboard URL: [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)

---

## Supabase Setup (For Developers)

### Required Environment Variables

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_PASSWORD=your_secure_password   # Do NOT leave as default
```

> ⚠️ Always set `VITE_ADMIN_PASSWORD` in your Vercel environment variables. The fallback default is insecure.

### SQL Setup (Run in Supabase SQL Editor)

```sql
-- 1) Email auth log
create table if not exists public.auth_email_log (
  id bigint generated by default as identity primary key,
  email text not null,
  status text not null,
  reason text,
  timestamp timestamptz not null default now()
);
alter table public.auth_email_log enable row level security;
drop policy if exists "allow anon insert auth_email_log" on public.auth_email_log;
create policy "allow anon insert auth_email_log"
on public.auth_email_log for insert to anon, authenticated with check (true);

-- 2) Usage events
create table if not exists public.usage_events (
  id bigint generated by default as identity primary key,
  event_id uuid not null default gen_random_uuid(),
  user_email text,
  session_id uuid,
  feature text not null,
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  timestamp timestamptz not null default now(),
  online boolean,
  duration_ms integer
);
alter table public.usage_events enable row level security;
drop policy if exists "allow anon usage insert" on public.usage_events;
create policy "allow anon usage insert"
on public.usage_events for insert to anon, authenticated with check (true);
drop policy if exists "allow anon usage select" on public.usage_events;
create policy "allow anon usage select"
on public.usage_events for select to anon, authenticated using (true);

-- 3) Indexes
create index if not exists usage_events_timestamp_idx on public.usage_events (timestamp desc);
create index if not exists usage_events_feature_action_idx on public.usage_events (feature, action);
create index if not exists usage_events_user_email_idx on public.usage_events (user_email);
create index if not exists usage_events_session_id_idx on public.usage_events (session_id);
create index if not exists auth_email_log_timestamp_idx on public.auth_email_log (timestamp desc);
create index if not exists auth_email_log_email_idx on public.auth_email_log (email);
```

### Verification Queries

```sql
-- Tables exist
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('auth_email_log', 'usage_events');

-- RLS enabled
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('auth_email_log', 'usage_events');

-- Policies exist
select schemaname, tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename in ('auth_email_log', 'usage_events');
```

### Pilot Reporting Queries

```sql
-- Top features used
select feature, action, count(*) as events
from public.usage_events
group by feature, action order by events desc;

-- Average session duration
select avg(duration_ms)::bigint as avg_session_ms
from public.usage_events
where feature = 'session' and action = 'session_end' and duration_ms is not null;

-- Distinct users
select count(distinct user_email) as users
from public.usage_events where user_email is not null;
```

---

## Important Notices

### For Students

NursePath is a reference tool — use it the way you would use a pocket drug handbook or vital signs card. The app shows you what the textbook says about a set of values. What you do next is your clinical call, verified by your Clinical Instructor.

- Never input patient names, initials, room numbers, or any identifying information
- Your CI's guidance and the hospital's protocols always take precedence
- Vital sign values you enter are never stored on any server

### For Developers / Contributors

- Do not use this codebase for production clinical decision support without formal regulatory review
- The open Supabase insert policy (`with check (true)`) is acceptable for a supervised pilot — tighten it before any public production deployment
- Keep telemetry payloads small: store counts, status, and categories — never raw patient values
- Periodically archive or delete old telemetry records

---

## Intellectual Property

**Copyright:** © 2025–2026 Rance Adriel M. Pascua
**IPOPHL Registration:** Class N — Computer Program | Filed April 8, 2026
**License:** Academic Use — See [LICENSE.txt](LICENSE.txt)

This software is the intellectual property of Rance Adriel M. Pascua. Non-commercial academic use is permitted. Commercial use, redistribution, or modification requires written permission. Attribution is required in any derivative works.

---

## Contact

**Developer:** Rance Adriel M. Pascua
**Program:** Bachelor of Science in Nursing
**Institution:** Universidad de Dagupan
**Email:** adrielrancepascua@gmail.com
**Academic Year:** 2025–2026

---

<p align="center">
  <em>NursePath — Built by a nursing student, for nursing students.</em><br>
  <em>© 2025–2026 Rance Adriel M. Pascua | Universidad de Dagupan | IPOPHL Registered</em>
</p># NursePath: Clinical Reference Tool for Nursing Students

<p align="center">
  <img src="image-512.png" alt="NursePath Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A Digital Clinical Reference Companion for Student Nurses</strong>
</p>

<p align="center">
  <em>Version 1.4 | 2026 | Universidad de Dagupan — Officially Adopted</em>
</p>

---

## Quick Links

- **App:** [block9nurseapp.vercel.app](https://block9nurseapp.vercel.app/)
- **Dashboard (Faculty):** [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)
- **User Guide:** [USER_GUIDE.md](USER_GUIDE.md)
- **IPOPHL Copyright:** Registered April 8, 2026 — Class N Computer Program

---

## Executive Summary

**NursePath** is a Progressive Web Application (PWA) developed as a **digital clinical reference tool** for nursing students. Think of it as an interactive pocket reference card — it interprets physiological data against WHO-based and textbook-standard parameters and displays the finding for the student to evaluate. It does not diagnose, prescribe, or make clinical decisions. The student does.

The application has been officially adopted by **Universidad de Dagupan's College of Nursing** for use during clinical duties, sim lab sessions, and classroom instruction as part of a faculty-supervised pilot program.

### What It Does

- Interprets vital sign readings against age-adjusted, pregnancy-aware, and comorbidity-specific reference ranges
- Provides a searchable OTC medication reference with Philippine brand names and condition safety ratings
- Computes IV flow rates, BMI, AOG, and EDD using standard clinical formulas
- Operates fully offline after initial load — reliable on hospital wards with limited connectivity
- Tracks anonymous usage telemetry for faculty evaluation via Supabase

### What It Does Not Do

- It does not store any vital sign values entered by students
- It does not diagnose patients or recommend specific interventions
- It does not replace the clinical instructor's judgment or the hospital's protocols

---

## Intended Use

NursePath is authorized for use by student nurses during clinical rotations, sim lab sessions, and classroom case studies at Universidad de Dagupan. Students may use it at any point during their clinical duties in the same way they would use a pocket drug handbook or a vital signs reference card.

All outputs are framed as reference findings — not clinical orders. The student's own assessment and their Clinical Instructor's guidance always take precedence.

> **Reference tool, not decision maker. The student is always the clinician.**

---

## Features

### 🩺 Vital Signs Interpretation Engine
- Age-stratified reference ranges: Infant through Elderly (7 age groups)
- Pregnancy-adjusted ranges with gestational hypertension and preeclampsia pattern detection
- Comorbidity-aware context notes: Hypertension, Diabetes, Asthma, COPD, CKD
- Output language uses "SIM ALERT", "Simulation Finding", and "Ref Note" framing — never clinical orders
- Real-time analysis via `liveAnalyze()` and explicit generation via `simulateVitalSigns()`
- Core logic isolated in `assets/vitals-analysis.js` (`window.NursePathClinical` namespace)

### 💊 OTC Medication Reference
- 34 OTC medications with Philippine brand names
- Condition-specific safety ratings (Safe / Caution / Contraindicated)
- TLDR and expanded detail tabs per medication
- Drug class, mechanism of action, pharmacokinetics, nursing considerations
- Includes DOH-recognized Philippine herbal medicines
- Copy-to-clipboard quick reference feature
- Core logic in `assets/ui-helpers.js` (`window.NursePathUIHelpers` namespace)

### 💉 IV Flow Rate Calculator
- mL/hr: `Volume (mL) ÷ Time (hours)`
- gtt/min: `(mL/hr ÷ 60) × Drop Factor`
- Supports drop factors: 10, 15, 20, and 60 gtt/mL

### 🤰 AOG & EDD Calculator
- Naegele's Rule: `LMP + 280 days = EDD`
- Weeks and days breakdown with trimester determination
- Pregnancy milestone tracker (viability, trimesters, screening windows)

### ⚖️ BMI Calculator
- Standard formula: `Weight (kg) ÷ Height (m)²`
- WHO category classification with color-coded output

### 📴 Offline Capability
- Full PWA with Service Worker (stale-while-revalidate strategy)
- Works on hospital wards after first load — no Wi-Fi required
- Usage events queue locally and sync to Supabase automatically on reconnect

### 👻 Ghost Persistence (Auth)
- Email-based pilot identity — no password, no signup screen
- Device-sealed on first entry for auto-bypass on subsequent launches
- Built-in cooldown and typo-domain detection (e.g. `gmal.com → gmail.com`)
- Access modes: `Demo` (open), `Pilot` (allowlisted domain or invite code), `Admin` (faculty token)
- Emergency reset: tap the NursePath logo 5 times to clear local identity

### 📈 Usage Analytics
- Event types: `session_start`, `session_end`, `feature_open`, `feature_use`, `result_generated`, `copy_reference`, `help_opened`, `error_shown`
- Button-driven telemetry only — no keystroke tracking
- Local queue first (`nursepath_usage_queue_v1`) with batch sync to Supabase
- Anonymous by default; consent-controlled toggle on auth overlay
- Session IDs, duration tracking, and CSV export for faculty reporting
- Faculty dashboard: [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)

---

## Technical Architecture

### Development Approach

Developed using AI-assisted programming, combining the developer's nursing education background with AI coding assistance.

| Component | Responsibility |
|---|---|
| Content Selection & Requirements | Rance Adriel M. Pascua, BSN Student |
| Clinical Formula Verification | Rance Adriel M. Pascua, BSN Student |
| Feature Planning & Design | Rance Adriel M. Pascua, BSN Student |
| Code Implementation | Assisted by Claude (Anthropic) & GitHub Copilot |
| Testing & Review | Rance Adriel M. Pascua, BSN Student |

### Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Styling | Tailwind CSS (inlined) |
| Clinical Logic | `assets/vitals-analysis.js` |
| UI Helpers | `assets/ui-helpers.js` |
| Offline | Service Worker (stale-while-revalidate) |
| Analytics | Supabase (batch insert, anon RLS) |
| Auth | Ghost Persistence (localStorage device seal) |
| Hosting | Vercel |

### File Structure

```
/
├── index.html                  # Main application (~4,350 lines)
├── sw.js                       # Service Worker (v1.4)
├── manifest.json               # PWA manifest
├── browserconfig.xml           # Windows tile config
├── image-192.png               # PWA icon
├── image-512.png               # PWA icon / logo
├── assets/
│   ├── vitals-analysis.js      # Vital signs engine (NursePathClinical namespace)
│   └── ui-helpers.js           # UI logic — OTC, calculators (NursePathUIHelpers namespace)
└── dashboard/                  # Faculty dashboard (React + Vite + Supabase)
    ├── src/
    │   ├── App.tsx
    │   ├── pages/
    │   │   ├── Overview.tsx
    │   │   ├── Analytics.tsx
    │   │   ├── Users.tsx
    │   │   └── Export.tsx
    │   └── lib/supabase.ts
    └── vite.config.ts
```

---

## Content Sources

All clinical reference content is derived from standard nursing textbooks and recognized guidelines:

- Brunner & Suddarth's Textbook of Medical-Surgical Nursing (14th Edition)
- Kozier & Erb's Fundamentals of Nursing (11th Edition)
- Lippincott's Nursing Drug Guide
- Pillitteri's Maternal & Child Health Nursing
- Philippine National Drug Formulary
- WHO BMI Classification Guidelines
- WHO Vital Signs Reference Ranges
- DOH Traditional Medicine Guidelines

---

## Current Status

| Phase | Status | Description |
|---|---|---|
| Development | ✅ Complete | Core features implemented and tested |
| Internal Testing | ✅ Complete | Developer and peer review complete |
| IPOPHL Registration | ✅ Complete | Filed April 8, 2026 — Class N Computer Program |
| Faculty Review | ✅ Complete | Approved by College of Nursing faculty |
| **University Adoption** | 🔄 **Active** | Officially adopted — pilot rollout in progress |
| Student Feedback | 🔄 In Progress | Gathering feedback from pilot cohort |
| Version 2.0 Planning | ⏳ Pending | Based on pilot outcomes |

---

## Access & Setup

### Student Access

1. Open [block9nurseapp.vercel.app](https://block9nurseapp.vercel.app/)
2. Enter your school email (`@cdd.edu.ph`) or the invite code provided by your instructor
3. Check the **Consent Box** for usage tracking (required for pilot evaluation)
4. Tap **Enter Pilot Workspace**
5. Accept the **Simulation Mode Agreement** (valid for 30 days)
6. Install as a PWA for best offline experience

**Install instructions:**
- **Android (Chrome):** Three-dot menu → Install app / Add to Home Screen
- **iOS (Safari):** Share icon → Add to Home Screen
- **Desktop:** Install icon in the browser address bar

### Faculty Dashboard Access

Contact the pilot coordinator for dashboard credentials. Do not share access credentials.

Dashboard URL: [nursepath-dashboard.vercel.app](https://nursepath-dashboard.vercel.app/)

---

## Supabase Setup (For Developers)

### Required Environment Variables

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ADMIN_PASSWORD=your_secure_password   # Do NOT leave as default
```

> ⚠️ Always set `VITE_ADMIN_PASSWORD` in your Vercel environment variables. The fallback default is insecure.

### SQL Setup (Run in Supabase SQL Editor)

```sql
-- 1) Email auth log
create table if not exists public.auth_email_log (
  id bigint generated by default as identity primary key,
  email text not null,
  status text not null,
  reason text,
  timestamp timestamptz not null default now()
);
alter table public.auth_email_log enable row level security;
drop policy if exists "allow anon insert auth_email_log" on public.auth_email_log;
create policy "allow anon insert auth_email_log"
on public.auth_email_log for insert to anon, authenticated with check (true);

-- 2) Usage events
create table if not exists public.usage_events (
  id bigint generated by default as identity primary key,
  event_id uuid not null default gen_random_uuid(),
  user_email text,
  session_id uuid,
  feature text not null,
  action text not null,
  meta jsonb not null default '{}'::jsonb,
  timestamp timestamptz not null default now(),
  online boolean,
  duration_ms integer
);
alter table public.usage_events enable row level security;
drop policy if exists "allow anon usage insert" on public.usage_events;
create policy "allow anon usage insert"
on public.usage_events for insert to anon, authenticated with check (true);
drop policy if exists "allow anon usage select" on public.usage_events;
create policy "allow anon usage select"
on public.usage_events for select to anon, authenticated using (true);

-- 3) Indexes
create index if not exists usage_events_timestamp_idx on public.usage_events (timestamp desc);
create index if not exists usage_events_feature_action_idx on public.usage_events (feature, action);
create index if not exists usage_events_user_email_idx on public.usage_events (user_email);
create index if not exists usage_events_session_id_idx on public.usage_events (session_id);
create index if not exists auth_email_log_timestamp_idx on public.auth_email_log (timestamp desc);
create index if not exists auth_email_log_email_idx on public.auth_email_log (email);
```

### Verification Queries

```sql
-- Tables exist
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('auth_email_log', 'usage_events');

-- RLS enabled
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('auth_email_log', 'usage_events');

-- Policies exist
select schemaname, tablename, policyname, roles, cmd from pg_policies
where schemaname = 'public' and tablename in ('auth_email_log', 'usage_events');
```

### Pilot Reporting Queries

```sql
-- Top features used
select feature, action, count(*) as events
from public.usage_events
group by feature, action order by events desc;

-- Average session duration
select avg(duration_ms)::bigint as avg_session_ms
from public.usage_events
where feature = 'session' and action = 'session_end' and duration_ms is not null;

-- Distinct users
select count(distinct user_email) as users
from public.usage_events where user_email is not null;
```

---

## Important Notices

### For Students

NursePath is a reference tool — use it the way you would use a pocket drug handbook or vital signs card. The app shows you what the textbook says about a set of values. What you do next is your clinical call, verified by your Clinical Instructor.

- Never input patient names, initials, room numbers, or any identifying information
- Your CI's guidance and the hospital's protocols always take precedence
- Vital sign values you enter are never stored on any server

### For Developers / Contributors

- Do not use this codebase for production clinical decision support without formal regulatory review
- The open Supabase insert policy (`with check (true)`) is acceptable for a supervised pilot — tighten it before any public production deployment
- Keep telemetry payloads small: store counts, status, and categories — never raw patient values
- Periodically archive or delete old telemetry records

---

## Intellectual Property

**Copyright:** © 2025–2026 Rance Adriel M. Pascua
**IPOPHL Registration:** Class N — Computer Program | Filed April 8, 2026
**License:** Academic Use — See [LICENSE.txt](LICENSE.txt)

This software is the intellectual property of Rance Adriel M. Pascua. Non-commercial academic use is permitted. Commercial use, redistribution, or modification requires written permission. Attribution is required in any derivative works.

---

## Contact

**Developer:** Rance Adriel M. Pascua
**Program:** Bachelor of Science in Nursing
**Institution:** Universidad de Dagupan
**Email:** adrielrancepascua@gmail.com
**Academic Year:** 2025–2026

---

<p align="center">
  <em>NursePath — Built by a nursing student, for nursing students.</em><br>
  <em>© 2025–2026 Rance Adriel M. Pascua | Universidad de Dagupan | IPOPHL Registered</em>
</p>
