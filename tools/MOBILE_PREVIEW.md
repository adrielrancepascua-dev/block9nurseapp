# Phone UI preview without Google/Supabase access

From the repository root, run:

```powershell
node tools/mobile-preview.cjs
```

Forward port **3001** using your existing Dev Tunnels workflow. Open its HTTPS address in Chrome or Safari on your phone. Keep the command and tunnel running. Accept the existing simulation agreement and choose Standard or PNLE.

The launcher serves the latest local files with a temporary preview bootstrap. It uses `preview@example.invalid` as a local test identity, disables usage consent, and blocks outgoing backend connections with a response security policy. It does not log in to Supabase or grant access to backend data. App authentication files are unchanged.

Use a fresh tunnel address for this preview so an old service worker cannot intercept it. Changes appear after refreshing. Service workers are deliberately disabled in this server: this tests UI and local interactions, not real Google sign-in, cloud sync, updates or offline installation.

To select another port: `node tools/mobile-preview.cjs 3002`. Stop with Ctrl+C. Use the normal production URL for real sign-in. Research feature planning is separate from this testing helper.
