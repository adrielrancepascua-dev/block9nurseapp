# NursePath Supabase Hardening Steps

This runbook is prepared for project oobrhmnvbxiqdbpjnnbn.

## 1) What I can and cannot do from here

- I cannot sign into your Supabase dashboard account for you.
- I cannot complete GitHub OAuth login on your behalf.
- I already prepared a one-run SQL script in SUPABASE_HARDENING.sql.

## 2) Dashboard settings to configure now

Open:
https://supabase.com/dashboard/project/oobrhmnvbxiqdbpjnnbn

Then apply these settings in order.

1. Authentication > URL Configuration
- Site URL: set exact production URL only.
- Redirect URLs: keep only trusted URLs.
- Remove broad wildcards and unknown domains.

2. Authentication > Providers > Email
- Confirm email: ON.
- If possible, disable self signup and use Invite only.

3. Authentication > Password Security
- Set minimum password length to at least 10.
- Enable complexity checks if available.

4. Authentication > Rate Limits
- Reduce signup and signin limits from default to stricter values.
- Keep OTP and magic link send limits tight.

5. Authentication > Bot Detection
- Turn CAPTCHA ON.
- Add provider keys (Cloudflare Turnstile or hCaptcha).

6. Authentication > Sessions
- Set shorter JWT lifetime if acceptable for your UX.
- Keep refresh token behavior enabled.

7. Project Settings > API
- Verify only publishable key is used in frontend.
- Never expose service role key in frontend.

## 3) Run SQL hardening script

1. Open SQL Editor in Supabase.
2. Create New query.
3. Open SUPABASE_HARDENING.sql from this project.
4. Copy and paste full content.
5. Click Run.

Expected result:
- Function public.is_cdd_user exists.
- RLS enabled on all public tables.
- Owner/domain policies created for tables with owner columns.
- Private storage buckets get per-user folder policies.
- Audit queries show remaining gaps.

## 4) Validate after running

1. Sign in with cdd.edu.ph user.
- Should authenticate and access own rows only.

2. Sign in with non-cdd.edu.ph user.
- Should fail policy checks for protected data.

3. Verify cross-user access is blocked.
- User A cannot read User B rows.

4. Verify storage paths are isolated.
- Users can access only auth.uid()/... path in private buckets.

## 5) Important note about your GitHub login

Your GitHub login is for Supabase dashboard admin access.
It does not automatically make your app use GitHub OAuth for end users.

If you want app users to sign in with GitHub, configure Authentication > Providers > GitHub and update app auth flow accordingly.
