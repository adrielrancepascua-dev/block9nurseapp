# Block 9 Nurse — Student Nurse Clinical Companion 🏥

**Block 9 Nurse** is an offline-first Progressive Web App (PWA) designed to assist nursing students at Universidad de Dagupan during clinical rotations. It bridges the gap between complex medical references and the fast-paced, low-connectivity environment of a hospital ward.

## 🌟 Why I built this
During clinical duties, I noticed that students often struggle to access vital signs interpretation and medication logic when hospital Wi-Fi is unavailable or cell signals are weak. I built this tool to provide **instant, offline reliability** so we can focus on patient care instead of searching for data.

## ✨ Key Features
- **Offline-First Logic:** Once installed on a phone, the app works without internet, ensuring 24/7 access in the ward.
- **Nursing Calculators:** Quick IV flow rate, BMI, and vital signs assessment tools.
- **Localized OTC Reference:** Searchable database featuring Philippine brands (e.g., Biogesic, Neozep) and nursing considerations.
- **Clinical Guardrails:** Built-in logic to assist in clinical reasoning during simulations and study.

## 🛠️ Tech Stack
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **PWA Architecture:** Service Workers for offline caching and Manifest for "Add to Home Screen" functionality.
- **Deployment:** Hosted on Netlify with automated build triggers.

## 📂 File Structure
- `index.html` — Main application and UI logic.
- `manifest.json` — Configuration for home screen installation.
- `sw.js` — Service Worker ensuring offline persistence.
- `LICENSE` — Licensed under the MIT License for open-source transparency.

## 📲 How to Use
### Option 1: Web / PWA (Recommended)
1. Open the [Live Demo Link](https://plsworkk.netlify.app/) in Safari (iOS) or Chrome (Android).
2. Tap the **Share** button (iOS) or **Menu** (Android).
3. Select **"Add to Home Screen"**.
4. Launch from your home screen and test in Airplane Mode.

### Option 2: Android APK
- Download the signed APK from the [Releases](https://github.com/adrielrancepascua-dev/block9nurseapp/releases/tag/v1.0) section.
- Enable `Install unknown apps` on your device to install.

## 🛡️ Disclaimer
**For Educational Use Only.** This app is intended as a study and simulation aid for nursing students. It is NOT a substitute for professional clinical judgment or official hospital protocols. Always verify calculations manually before making clinical decisions.

---
*Created with ☕ and no sleep by [Rance Adriel Pascua], BSN Student @ Universidad de Dagupan*
