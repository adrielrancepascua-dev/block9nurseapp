# NursePath: An Academic Learning Companion for Nursing Students

<p align="center">
  <img src="image-512.png" alt="NursePath Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A Study Aid for Reinforcing Clinical Concepts in Nursing Education</strong>
</p>

<p align="center">
  <em>Version 1.1 | February 2026 | Faculty Review Phase</em>
</p>

---

## Executive Summary

**NursePath** is a Progressive Web Application (PWA) developed as an **academic learning tool** for nursing students. The application serves as a digital study companion that reinforces textbook concepts taught in the classroom.

This project addresses two educational objectives:

1. **Concept Reinforcement** — Provides interactive examples of drug dosage calculations and IV flow rate formulas that mirror textbook exercises, helping students practice and internalize mathematical nursing concepts.

2. **Reference Accessibility** — Offers a searchable compilation of commonly discussed OTC medications and vital signs ranges, serving as a portable study reference similar to pocket nursing guides.

The application operates entirely offline after initial installation, making it convenient for studying in various environments including libraries, dormitories, or areas with limited connectivity.

**Important:** This is a learning reinforcement tool, not a clinical resource. All content reflects standard nursing textbook material and is intended to support classroom instruction, not replace it.

---

## Features

### 🧭 Navigation
- Simple navigation bar for easy access to different sections
- Smooth scrolling between study modules
- Color-coded sections for quick identification

### 👻 Ghost Persistence (Demo Auth)
- Email is treated as pilot identity (username/session ID), not strict inbox-auth login
- No password and no signup screen
- Enter email once and the device is locally sealed for auto-bypass on next launches
- Built-in cooldown and typo-domain checks (e.g. gmal.com) to reduce bounce backs
- Best-effort email logging (local always, Supabase when online)

### 📈 Offline Usage Analytics Queue
- Meaningful events only: session_start, session_end, feature_open, feature_use, result_generated, copy_reference, help_opened, error_shown
- Local queue first (`nursepath_usage_queue_v1`) so events survive dead zones/offline shifts
- Batch sync to Supabase when internet returns
- Session boundaries with session IDs and duration tracking
- Consent-controlled tracking toggle on the auth overlay

### 💉 IV Flow Rate Practice Calculator
- Demonstrates **mL/hr** calculations for infusion scenarios
- Shows **gtt/min** (drops per minute) formula applications
- Supports standard drop factors: 10, 15, 20, and 60 gtt/mL
- Helps students verify their manual calculation practice

### 🤰 AOG & EDD Study Calculator
- Demonstrates **Age of Gestation (AOG)** calculation methods
- Shows **Estimated Date of Delivery (EDD)** using Naegele's Rule
- Displays trimester information for maternal nursing coursework
- Lists common pregnancy milestones discussed in OB nursing classes

### 💊 OTC Medications Study Reference
- **34 commonly discussed OTC medications** with Philippine brand names
- Quick reference and detailed information tabs
- Includes information typically covered in pharmacology classes:
  - Drug classifications and mechanisms
  - Common uses and contraindications
  - Side effects and interactions
- Searchable by condition, brand name, or generic name
- DOH-recognized Philippine herbal medicines included

### 📊 Vital Signs Reference Guide
- Age-adjusted normal ranges from nursing textbooks
- Categorization examples (Normal, Low, High)
- Covers pediatric through geriatric ranges
- Pregnancy-related values for OB nursing studies

### ⚖️ BMI Calculator
- Standard BMI formula demonstration
- WHO category classifications

### 📴 Offline Availability
- Works without internet after first load
- Convenient for studying anywhere

---

## Technical Information

### Development Approach

This application was developed using **AI-Assisted Programming**, combining the developer's nursing education background with AI coding assistance.

| Component | Responsibility |
|-----------|----------------|
| **Content Selection & Requirements** | Rance Adriel M. Pascua, BSN Student |
| **Formula Verification** | Rance Adriel M. Pascua, BSN Student |
| **Feature Planning** | Rance Adriel M. Pascua, BSN Student |
| **Code Implementation** | Assisted by Claude (Anthropic) |
| **Testing & Review** | Rance Adriel M. Pascua, BSN Student |

### Technology

- **Frontend:** HTML5, CSS3, JavaScript
- **Styling:** Tailwind CSS (inlined)
- **Authentication:** Ghost Persistence (local device seal)
- **Analytics:** Local usage queue + Supabase batch insert (best effort)
- **Offline Support:** Service Worker
- **Hosting:** Vercel

---

## Content Sources

All educational content in NursePath is derived from standard nursing textbooks and educational resources:

- **Brunner & Suddarth's Textbook of Medical-Surgical Nursing** (14th Edition)
- **Kozier & Erb's Fundamentals of Nursing** (11th Edition)
- **Lippincott's Nursing Drug Guide**
- **Philippine National Drug Formulary**
- **Pillitteri's Maternal & Child Health Nursing**
- **WHO BMI Classification Guidelines**
- **DOH Traditional Medicine Guidelines**

---

## Current Status

| Phase | Status | Description |
|-------|--------|-------------|
| Development | ✅ Complete | Features implemented |
| Internal Testing | ✅ Complete | Basic functionality verified |
| **Faculty Review** | 🔄 **In Progress** | Seeking instructor feedback |
| Student Feedback | ⏳ Pending | Peer review from classmates |

---

## Access Information

### Login Method

Users start the pilot by entering an email once.

1. Enter a valid email on the login screen.
2. Tap Get Started.
3. The app stores `nursepath_user` on the device and opens immediately.
4. On next launches, `nursepath_user` auto-bypasses the auth overlay.

Internet is optional for pilot entry. If online, the app also attempts to log the email to Supabase.

### Supabase Configuration Required (Demo)

For Ghost Persistence pilot mode, Supabase is used for logging only.

1. Keep project URL and anon key configured in the app.
2. Run the SQL setup below to create logging tables + insert policies.
3. Confirm RLS is enabled and insert policy exists for `anon` and `authenticated`.

### Supabase SQL Setup (Run In Order)

Run this full script in Supabase SQL Editor:

```sql
-- 1) Email auth log table (best-effort login identity log)
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
on public.auth_email_log
for insert
to anon, authenticated
with check (true);

-- 2) Usage events table (offline queue flush target)
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
on public.usage_events
for insert
to anon, authenticated
with check (true);

-- 3) Helpful indexes for pilot reporting
create index if not exists usage_events_timestamp_idx on public.usage_events (timestamp desc);
create index if not exists usage_events_feature_action_idx on public.usage_events (feature, action);
create index if not exists usage_events_user_email_idx on public.usage_events (user_email);
create index if not exists usage_events_session_id_idx on public.usage_events (session_id);

create index if not exists auth_email_log_timestamp_idx on public.auth_email_log (timestamp desc);
create index if not exists auth_email_log_email_idx on public.auth_email_log (email);
```

### Supabase Verification Queries

After running setup, run these checks:

```sql
-- tables exist
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('auth_email_log', 'usage_events');

-- RLS enabled
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('auth_email_log', 'usage_events');

-- policies exist
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('auth_email_log', 'usage_events');
```

### Pilot Reporting Queries (Starter)

```sql
-- Top features used
select feature, action, count(*) as events
from public.usage_events
group by feature, action
order by events desc;

-- Average session duration (ms)
select avg(duration_ms)::bigint as avg_session_ms
from public.usage_events
where feature = 'session'
  and action = 'session_end'
  and duration_ms is not null;

-- Distinct users seen
select count(distinct user_email) as users
from public.usage_events
where user_email is not null;
```

### Bounce-Back Mitigation

If Supabase warns about bounced emails, do the following:

1. Validate email format before accepting pilot entry.
2. Block obvious typo domains (already implemented in app).
3. Avoid repeated tests to fake addresses.
4. If you re-enable magic links later, configure custom SMTP for production.

### What To Watch Out For

1. Open insert policy (`with check (true)`) is acceptable for pilot telemetry, but do not use this as-is for production without tighter controls.
2. Keep payloads small: store counts/status/category, not raw patient values.
3. Local queue is intentionally capped; very old events may be dropped if the queue exceeds the limit.
4. If Supabase is down, app still works and queues events locally until next successful flush.
5. Retention: periodically archive or delete old telemetry records.

### Optional: Central Email Attempt Logs (Supabase)

The app stores sign-in email attempts in local browser storage and queues failed sends for retry when internet returns. This is already covered by the SQL setup block above (`auth_email_log` table + policy).

### Emergency Reset Backdoor

If a user typed the wrong email and the device is sealed, tap the NursePath header logo 5 times to clear local pilot identity and reload.

### Formal Testing Requirement

For formal testing, participants must actively check the usage-tracking consent checkbox before they can tap Get Started.

---

## Future Considerations

### Current Phase: Faculty Review
- Present to College of Nursing faculty
- Gather feedback on educational accuracy
- Improve based on instructor suggestions

### Potential Next Steps (Subject to Faculty Guidance)
- Share with classmates as a study resource
- Add more topics based on curriculum needs
- Refine content based on feedback

---

## Contact Information

**Developer:** Rance Adriel M. Pascua  
**Program:** Bachelor of Science in Nursing  
**Institution:** Universidad de Dagupan  
**Email:** adrielrancepascua@gmail.com  
**Academic Year:** 2025-2026

---

## Usage Terms

This application is a student academic project. See the [LICENSE](LICENSE.txt) file for terms of use.

**Summary:** This is a student-developed educational tool provided for academic review. The content reflects standard nursing textbook material and is intended as a study aid only.

---

<br>

# ⚠️ IMPORTANT NOTICE

<table>
<tr>
<td>

### 📚 EDUCATIONAL TOOL ONLY

**This application is a STUDY AID developed as an academic project.**

- This is **NOT** a clinical reference tool
- This is **NOT** intended for use in patient care settings
- This is **NOT** a substitute for textbooks or instructor guidance

### 📖 INTENDED PURPOSE

This application is designed for:
- Practicing calculation concepts learned in class
- Reviewing medication information from pharmacology coursework
- Studying vital signs ranges from nursing textbooks
- Reinforcing classroom learning through interactive examples

### ✅ APPROPRIATE USE

- ✅ Use as a personal study companion
- ✅ Practice calculations before exams
- ✅ Review concepts discussed in lecture
- ✅ Always refer to your textbooks and instructors as primary sources

### 👩‍🏫 STUDENT RESPONSIBILITY

As with any study tool, students are responsible for:
- Verifying information against assigned textbooks
- Following instructor guidance in all academic matters
- Using official institutional resources for coursework

*"This tool supports your learning—your textbooks and instructors are your primary guides."*

</td>
</tr>
</table>

---

<p align="center">
  <em>© 2025-2026 Rance Adriel Pascua</em><br>
  <em>BSN Student Project | Universidad de Dagupan | For Academic Review</em>
</p>


