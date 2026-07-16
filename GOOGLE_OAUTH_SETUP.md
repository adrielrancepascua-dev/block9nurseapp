# Google OAuth setup (NursePath student app)

NursePath now uses **Supabase Auth → Google** as the primary sign-in path. Email domain gating (`@cdd.edu.ph`) remains as a rollback.

## One-time dashboard setup

1. **Google Cloud Console**
   - Create (or reuse) an OAuth 2.0 Client ID (Web application).
   - Authorized JavaScript origins: your app origin (e.g. `https://block9nurseapp.vercel.app`).
   - Authorized redirect URIs: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`

2. **Supabase Auth**
   - Authentication → Providers → **Google** → enable.
   - Paste the Google Client ID and Client Secret.
   - Authentication → URL Configuration → add Site URL and Redirect URLs for the NursePath origin.

3. **Workspace domain**
   - If UdD student emails are Google Workspace accounts on `cdd.edu.ph`, the app already sends `hd=cdd.edu.ph` and rejects non-allowlisted domains after sign-in.
   - If students only have `@cdd.edu.ph` mailboxes without Google accounts, keep using **Use school email instead** until Workspace is confirmed.

## Offline behavior

- First Google sign-in must be online.
- After success, identity is sealed on-device (`nursepath_user` + session cache) so the PWA shell and tools keep working offline.
- Token refresh failures while offline do **not** force logout.

## Rollback

The email form remains behind **Use school email instead** until OAuth has survived real cohort use.
