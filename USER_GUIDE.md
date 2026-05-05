# NursePath — User guide (students & pilot participants)

NursePath is a **Progressive Web App (PWA)** for nursing education: calculators, OTC reference, and vital-sign study material. It is **not** for real patient care—only for classroom and self-study practice.

---

## 1. Install or open the app

**Option A — Use in the browser**  
Open your program’s NursePath link (for example the deployed site your instructor shared). Bookmark it if you like.

**Option B — Install as an app (recommended for offline study)**

- **Android (Chrome):** Menu (⋮) → *Install app* or *Add to Home screen*.
- **iPhone/iPad (Safari):** Share → *Add to Home Screen*.
- **Windows / Mac (Chrome or Edge):** Install icon in the address bar, or menu → *Install NursePath* / *Apps* → *Install this site as an app*.

After the first successful load, core content can work **offline** thanks to the service worker.

---

## 2. First-time access (pilot gate)

When you first open NursePath (or after a full reset), you see **NursePath Pilot Access**.

1. **Usage tracking consent** — Check *I consent to anonymous usage tracking for academic pilot evaluation* if your program requires it. Without this box checked, you cannot submit the form (formal pilot/testing).
2. **Email** — Enter the address your program asked for (often a school domain). The app may also accept entry with only an **invite code** when your instructor enables that.
3. **Invite code (optional)** — If you were given a code, enter it in *Invite code*.
4. Tap **Enter Pilot Workspace**.

The app **remembers this device** so you are not asked every time. Internet helps log activity but is **not** required to stay “logged in” locally.

---

## 3. Simulation mode agreement

You may see **Simulation Mode** with a short checklist. Read it and tap **I Understand — Enter Simulation Mode**.  
This acknowledgment is stored for a limited time (about 24 hours), then you may be asked again.

---

## 4. Short onboarding

A one-time **NursePath** intro screen can appear. Tap **Get Started** to enter the main app.

---

## 5. What you can do inside the app

Use the navigation to move between sections (exact labels match what you see on screen). Typical areas include:

- **Vital signs** — Age-related reference ranges for study.
- **Calculators** — IV flow rate, BMI, AOG/EDD, and related practice.
- **OTC reference** — Searchable notes on common OTC products (academic context).
- **Help / disclaimers** — Read the in-app notices; your textbook and instructors remain the authority.

Many **results** are recorded for pilot analytics only when you use explicit actions (for example **Simulate** / **Calculate**), not on every keystroke.

---

## 6. Offline use

- After at least one online load, you can often open the installed PWA or the same URL **without network**.
- Usage events may **queue on the device** and sync when you are online again (if consent and configuration allow).

---

## 7. Sign out, reset, and troubleshooting

- **Logout** — Use the in-app logout control when you want to clear the session on this device.
- **Faculty Reset** — If your build shows **Faculty Reset**, it clears local pilot state (useful for shared devices or wrong account).
- **Wrong email sealed on this device** — Tap the **NursePath header logo five times** to trigger an emergency clear and reload (see the main README for details).
- **Simulation gate keeps returning** — Accept the simulation agreement again; it expires after the stored duration.

---

## 8. Privacy and pilot data (plain language)

- Pilot builds may send **anonymous or limited-identify usage events** (features used, session length, etc.) to a backend when online, depending on your program’s setup.
- Do **not** enter real patient identifiers into any study tool.
- For technical and policy detail, see the project **README** and your instructor’s handout.

---

## 9. If something fails

- Confirm **consent** is checked if the pilot gate says tracking is required.
- Check **email format** and any **cooldown** message if you tapped enter too quickly.
- Try **closing all NursePath tabs** and reopening, or reinstalling the PWA after a reset.

For faculty and administrators: deployment, Supabase tables, and dashboard access are documented in the repository **README** and the separate **Faculty Dashboard** repository.
