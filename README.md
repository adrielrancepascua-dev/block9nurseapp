# NursePath - Student Nurse Clinical Companion

**NursePath** is an offline-first Progressive Web App (PWA) built by nursing students, for nursing students. It provides instant vital signs interpretation, clinical calculators, and medication reference during clinical rotations—even when hospital Wi-Fi isn't available.

## 🌟 Why NursePath?

During clinical duties, nursing students face a common challenge: **accessing critical medical references when connectivity is unreliable**. Whether it's weak hospital Wi-Fi, no cell signal, or devices in Airplane Mode, NursePath works everywhere.

## ✨ Key Features

- **📊 Vital Signs Analysis** - Age-adjusted vital sign interpretation with priority-based diagnosis
- **💧 IV Flow Rate Calculator** - Automatic mL/hr and gtt/min conversion
- **⚖️ BMI Calculator** - Instant body mass index with clinical categories
- **💊 OTC Medication Database** - 8 medications with Philippine brand names
- **📱 100% Offline** - No internet required after first load
- **🚀 Auto-Updates** - PWA auto-updates when deployed
- **🎯 Clinical Guardrails** - Built-in logic for clinical reasoning

## 🏥 Early Tester Program

**Limited to 200 student testers**
- ✅ One-time payment: ₱200
- ✅ Lifetime access
- ✅ All future updates included
- ✅ Direct feedback on features

**[Join the Program](https://nursepathdapp.com)**

## 🛠️ Tech Stack

- Vanilla HTML5, CSS3, JavaScript
- Inlined Tailwind CSS (~500 lines) - **zero CDN dependencies**
- Inline SVG icons - **no Font Awesome CDN**
- Service Worker for offline caching
- Netlify hosting with auto-deploy

## 📂 Files

- `index.html` — Main app (1150+ lines, fully self-contained)
- `manifest.json` — PWA metadata
- `sw.js` — Service Worker for offline support
- `landing.html` — Marketing website & early tester info
- `image-*.png` — App icons
- `screenshot-*.png` — App screenshots

## 📲 How to Access

**Option 1: Web App (Recommended)**
1. Visit: https://plsworkk.netlify.app
2. **iOS:** Tap Share → Add to Home Screen
3. **Android:** Tap Menu (⋮) → Add to Home Screen
4. Test offline in Airplane Mode

**Option 2: Landing Page**
Visit: https://nursepathdapp.com for program details

## 🛡️ Disclaimer

**Educational Use Only.** NursePath is a study aid for student nurses, NOT a clinical tool. Always verify calculations, consult licensed professionals, and follow your institution's protocols.

## 🚀 Performance

- Initial load: ~80KB (fully self-contained)
- Offline load: Instant (fully cached)
- No external dependencies
- Auto-updates through service worker

## 📄 License

MIT License - see LICENSE file

---

**Built by student nurses, for student nurses**  
*Because reliable tools shouldn't depend on Wi-Fi signals.*
