# Google OAuth setup (NursePath student app)

NursePath uses **Supabase Auth → Google** as the primary sign-in path. Any Google account works — there is no school-domain (`hd` / `@cdd.edu.ph`) filter. An optional email form remains as a device-local rollback.

## One-time dashboard setup

1. **Google Cloud Console**
   - Create (or reuse) an OAuth 2.0 Client ID (Web application).
   - Authorized JavaScript origins: your app origin (e.g. `https://block9nurseapp.vercel.app`).
   - Authorized redirect URIs: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`

2. **Supabase Auth**
   - Authentication → Providers → **Google** → enable.
   - Paste the Google Client ID and Client Secret.
   - Authentication → URL Configuration → add Site URL and Redirect URLs for the NursePath origin.
   - Do **not** require a hosted domain restriction unless you intentionally want one later.

3. **App behavior**
   - Sign-in button calls `signInWithOAuth({ provider: 'google' })` with account picker only (`prompt=select_account`).
   - After Google returns a session, NursePath seals that email on-device for offline use.

## Offline behavior

- First Google sign-in must be online.
- After success, identity is sealed on-device (`nursepath_user` + session cache) so the PWA shell and tools keep working offline.
- Token refresh failures while offline do **not** force logout.

## Rollback

The email form remains behind **Use email instead** if Google Auth is temporarily unavailable.
