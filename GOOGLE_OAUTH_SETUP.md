# Google OAuth setup (NursePath student app)

NursePath uses **Supabase Auth → Google** as the primary sign-in path. Any Google account works — there is no school-domain (`hd` / `@cdd.edu.ph`) filter. An optional email form remains as a device-local rollback.

## One-time dashboard setup

1. **Google Cloud Console**
   - Create (or reuse) an OAuth 2.0 Client ID (**Web application**).
   - Authorized JavaScript origins:
     - `https://block9nurseapp.vercel.app`
   - Authorized redirect URIs (must be the Supabase callback, **not** the Vercel URL):
     - `https://oobrhmnvbxiqdbpjnnbn.supabase.co/auth/v1/callback`

2. **Supabase Auth**
   - Authentication → **Sign In / Providers** → **Google** → enable.
   - Paste the Google **Client ID** and **Client Secret** exactly (no trailing spaces/newlines).
   - Authentication → **URL Configuration**:
     - Site URL: `https://block9nurseapp.vercel.app`
     - Redirect URLs include: `https://block9nurseapp.vercel.app` and `https://block9nurseapp.vercel.app/**`
   - Do **not** use Authentication → **OAuth Apps** for this. That page is for making Supabase itself an OAuth server.

3. **App behavior**
   - Sign-in button calls `signInWithOAuth({ provider: 'google' })` with account picker (`prompt=select_account`).
   - After Google returns a session, NursePath seals that email on-device for offline use.

## Offline behavior

- First Google sign-in must be online.
- After success, identity is sealed on-device (`nursepath_user` + session cache) so the PWA shell and tools keep working offline.
- Token refresh failures while offline do **not** force logout.

## Troubleshooting: `Unable to exchange external code`

If Google consent succeeds but you bounce back to NursePath still signed out, with a URL like:

`?error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code...`

Supabase could not trade Google’s auth code for tokens. Fix this checklist in order:

1. Google Cloud → **APIs & Services** → **Credentials** → your **Web** OAuth client.
2. Confirm **Authorized redirect URIs** contains exactly:
   `https://oobrhmnvbxiqdbpjnnbn.supabase.co/auth/v1/callback`
   - Wrong: `https://block9nurseapp.vercel.app/...`
   - Wrong: missing `/auth/v1/callback`
3. Confirm application type is **Web application** (not Desktop / iOS / Android).
4. In Supabase → **Sign In / Providers** → **Google**:
   - Re-copy **Client ID** and **Client Secret** from that same Google OAuth client.
   - Save again.
5. If you regenerated the secret in Google Cloud, the old secret in Supabase will fail until you paste the new one.
6. Hard-refresh NursePath and try **Continue with Google** again.

## Rollback

The email form remains behind **Use email instead** if Google Auth is temporarily unavailable.
