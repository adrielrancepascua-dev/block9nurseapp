# Block 9 Nurse — Student Nurse Clinical Companion

Lightweight offline-capable PWA and Android package for student nurses. Includes vital-signs assessment, diagnosis suggestions, IV flow calculator, BMI calculator, and an OTC medication reference with Philippine brands.

## Files
- `index.html` — main app (rename `nurse_app.html` → `index.html` before publishing)
- `manifest.json` — Web App Manifest
- `sw.js` — Service Worker (offline support)
- `image-192.png`, `image-512.png` — app icons
- `screenshot-narrow.png`, `screenshot-wide.png` — screenshots for stores
- `_redirects` — Netlify SPA redirect rule

## Quick local test (no install)
1. Open `index.html` in a browser (Chrome recommended).
2. You can test functions (vitals, IV, BMI, OTC search) directly.

## Installing the Android APK
1. Download the signed APK (from PWABuilder release or this repo's Releases).
2. On Android: enable `Install unknown apps` for your file manager or browser.
3. Open the APK and install.
4. Test offline by disabling Wi‑Fi and re-opening the app.

## Publish to GitHub (recommended)
1. Create a new GitHub repo (e.g., `Block9NurseApp`).
2. Put the files above into a folder and rename `nurse_app.html` → `index.html`.
3. From PowerShell in that folder:

```powershell
git init
git add .
git commit -m "Initial publish: Block 9 Nurse app PWA"
git branch -M main
git remote add origin https://github.com/your-username/Block9NurseApp.git
git push -u origin main
```

4. Create a Release and upload the signed APK as an asset to share a direct download link.

## Netlify
- If you prefer Netlify, drag & drop the same files to your site deploy area. Keep `_redirects` present so SPA routing works.

## Notes
- The app is provided for educational use only and is NOT a substitute for clinical judgement.
- If you plan to distribute via Google Play, use the signed AAB/APK and follow Play Store policies.

## License
This project is licensed under the MIT License — see `LICENSE`.
