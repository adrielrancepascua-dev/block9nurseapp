# NursePath Faculty Dashboard

Professional admin dashboard for nursing faculty to analyze usage data from the NursePath simulation tool.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
# Create .env.local with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_ADMIN_PASSWORD=your_faculty_password   # optional; defaults to admin in dev

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📊 Features

### Overview
- **Key Metrics:** Unique users, total sessions, feature uses, avg session duration
- **Daily Usage Chart:** 30-day trend visualization
- **Top Features:** Pie and bar charts of most-used features

### Analytics
- **Filterable Event Log:** Date range, feature, and user search filters
- **Top 5 Features:** Quick summary of most-used features
- **Smart Deduplication:** Filters obvious duplicates for cleaner data
- **Real-time Search:** Filter and find specific events

### Users
- **User Metrics:** Sessions per user, total time, last active, features used
- **Anonymous Sessions:** "Ghost" users tracked via session_id
- **Aggregate Stats:** Total users, avg sessions, avg time per user
- **Live Updates:** Realtime refresh plus timed polling keeps tables current

### Export
- **CSV Download:** Full raw export of usage_events table
- **Audit Trail:** Includes all events for record-keeping
- **Meta Support:** JSON metadata parsed for context

## 🔐 Authentication

The dashboard uses a single password gate. For local development the default password is `admin` unless you set `VITE_ADMIN_PASSWORD` in `.env.local` or in your host’s environment (e.g. Vercel). **Do not ship the default password in production** — always set a strong `VITE_ADMIN_PASSWORD` for pilot or live deployments.

The session token is stored locally so the same device stays signed in until you log out.

Important: the dashboard reads from `public.usage_events` using the Supabase anon key. If your table has rows but charts are empty, add a `for select using (true)` RLS policy for `anon, authenticated` on `public.usage_events`.

## 📦 Tech Stack

- **React 18** + TypeScript
- **Vite** for fast builds
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Supabase JS Client** for database access and realtime change subscriptions

## 🎨 Design

- Dark mode (slate-950 base)
- Responsive layout (sidebar on desktop, mobile nav drawer)
- Accessible form controls and focus states
- Professional nursing/healthcare color scheme (cyan accents)

## 🔌 Environment Setup

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Or pass `SUPABASE_URL` and `SUPABASE_ANON_KEY` to window object before app loads.

## 📂 Project Structure

```
dashboard/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.tsx
│   │   └── Metric.tsx
│   ├── pages/            # Page components
│   │   ├── Overview.tsx
│   │   ├── Analytics.tsx
│   │   ├── Users.tsx
│   │   └── Export.tsx
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client & utilities
│   │   ├── utils.ts      # Helper functions
│   │   └── hooks.ts      # Custom hooks
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Tailwind styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 📝 Data Model

**usage_events table columns:**
- `id`: UUID primary key
- `event_id`: Unique event identifier
- `user_email`: User email or null for ghost/anonymous
- `session_id`: Session grouping
- `feature`: Feature name (vitals, calculator, etc.)
- `action`: Action type (submit, view, etc.)
- `meta`: JSON metadata (stringify before insert)
- `timestamp`: ISO timestamp
- `online`: Boolean online status
- `duration_ms`: Duration in milliseconds

## 🐛 Known Limitations

- Demo uses simple password auth (upgrade to Supabase Auth for production)
- Large datasets (100k+ events) may be slow; consider server-side aggregation
- Mobile drawer navigation is basic; consider full responsive redesign for mobile-first UX
- CSV export limited to 100k most recent events

## 🔄 Future Enhancements

- Supabase Auth integration with role-based access
- Real-time updates using Supabase subscriptions
- Custom date range picker for flexibility
- Advanced filtering (session duration ranges, feature combinations)
- Cohort analysis (new vs returning users)
- Export to multiple formats (JSON, Excel, PDF reports)
- Dark/light mode toggle
