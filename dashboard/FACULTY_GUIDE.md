# NursePath — Faculty dashboard guide

This document is for **nursing faculty and program staff** who review pilot usage from the NursePath student PWA. The dashboard is a separate web app that reads aggregated events from **Supabase** (typically the `usage_events` table).

---

## 1. What this dashboard is for

- View **how often** students open features, session counts, and rough **time in app**.
- **Filter** and inspect individual events for pilot QA.
- **Export** raw events to CSV for grading, IRB documentation, or archival reports.

It does **not** replace your learning management system or gradebook unless you choose to import exports manually.

---

## 2. Before you log in

### Environment variables (hosting or local)

The dashboard needs a Supabase project that receives events from the PWA:

| Variable | Purpose |
|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `VITE_ADMIN_PASSWORD` | Password you share only with authorized faculty |

Create `.env.local` in the dashboard project root for local runs (see `README.md`). On **Vercel** or similar, set the same names in the project settings and redeploy.

**Security**

- Never commit `.env.local` or real keys to git.
- Change the default dev password (`admin`) before any shared or production URL goes live.
- The dashboard uses the **anon** key; access is gated by your **RLS policies** and the dashboard password. Ensure `usage_events` has appropriate `SELECT` policies for the anon role if charts stay empty (see main PWA README SQL section).

---

## 3. Signing in

1. Open your deployed dashboard URL (or `npm run dev` locally).
2. Enter the **admin password** configured in `VITE_ADMIN_PASSWORD`.
3. The session is stored in the browser until you **log out** or clear site data.

If login works but all metrics are zero, verify Supabase URL/key, table name, and RLS `SELECT` policy.

---

## 4. Pages and how to use them

### Overview

- **Summary metrics** — Unique users (by email when present), sessions, feature usage, average session duration.
- **Charts** — Recent daily trend and distribution of top features.

Use this page for a **quick health check** of the pilot (“Are students actually using the tool this week?”).

### Analytics

- **Time range** and filters (feature, user search).
- **Event list** with deduplication options to reduce noise.

Use this when you need **examples of behavior** or to debug a specific date range.

### Users

- **Per-user (or session) rollups** — How many sessions, last active, features touched.

Use this to identify **heavy vs light** participation or inactive accounts.

### Export

- Downloads a **CSV** of `usage_events` (large exports may be capped; see `README.md` known limitations).

Use this for **offline analysis**, sharing with a statistician, or records retention.

---

## 5. Interpreting the data

- **feature** / **action** fields describe what happened (e.g. opening a module vs running a calculation). Exact strings match what the PWA emits.
- **user_email** may be empty for some sessions; **session_id** still groups activity.
- **meta** is JSON; the export includes it for context (counts, categories—**not** raw patient data if students followed instructions).
- **timestamp** is server or client time depending on insert path; use ranges, not single-second precision, for research reporting.

---

## 6. Operational checklist

1. Confirm PWA and dashboard point to the **same** Supabase project.
2. Run or verify SQL from the **main NursePath README** (`usage_events`, indexes, RLS).
3. Set a **strong** `VITE_ADMIN_PASSWORD` on production.
4. After a pilot wave, **download exports** before trimming old rows if you use retention limits.

---

## 7. Support and code

- Developer setup, scripts, and stack: **`README.md`** in this repository.
- PWA behavior, consent, and student-facing flow: **block9nurseapp** repository (`USER_GUIDE.md` and root `README.md`).
