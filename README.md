# NursePath: A Digital Clinical Companion for Student Nurses

<p align="center">
  <img src="image-512.png" alt="NursePath Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Empowering Student Nurses with Evidence-Based Clinical Decision Support</strong>
</p>

<p align="center">
  <em>Version 1.0 | January 2026 | Faculty Validation Phase</em>
</p>

---

## Executive Summary

**NursePath** is a Progressive Web Application (PWA) designed as a clinical decision-support tool for student nurses during hospital rotations. The application addresses two critical challenges in nursing education:

1. **Medication Safety** — Provides standardized drug dosage calculations and IV flow rate computations to reduce the risk of medication errors at the bedside.

2. **Clinical Efficiency** — Offers instant access to vital signs interpretation, clinical calculators, and medication references, enabling students to make informed decisions quickly during patient care.

The application operates entirely offline after initial installation, making it suitable for use in hospital environments with unreliable connectivity, including basement wards and areas with restricted network access.

---

## Core Features

### 💉 IV Flow Rate Calculator
- Computes **mL/hr** for infusion pump settings
- Calculates **gtt/min** (drops per minute) for gravity drip sets
- Supports standard drop factors: 10, 15, 20, and 60 gtt/mL
- Input validation prevents calculation errors

### 💊 Drug Dosage Calculator
- Weight-based dosage calculations (mg/kg)
- Supports common medication concentration formats
- Cross-references with standard pediatric and adult dosing guidelines
- Includes local Philippine brand name references

### 📊 Vital Signs Analyzer
- Age-adjusted interpretation of vital signs
- Categorizes readings as Normal, Low, High, or Critical
- Provides priority-based clinical considerations
- Supports pediatric through geriatric age groups

### ⚖️ Body Mass Index (BMI) Calculator
- Standard BMI computation with clinical classification
- WHO category interpretation (Underweight, Normal, Overweight, Obese)

### 📴 Offline-First Architecture
- **100% functional without internet connection** after first load
- Service Worker technology caches all application resources
- Ideal for hospital basements, remote clinical sites, and areas with poor connectivity
- Automatic background updates when connection is available

---

## Technical Disclosure

### Development Methodology

This application was developed using **Human-in-the-Loop AI-Assisted Programming**, a collaborative development approach that combines human clinical expertise with AI technical capabilities.

| Component | Responsibility |
|-----------|----------------|
| **Clinical Logic & Medical Formulas** | [Rance Adriel M. Pascua], BSN Student |
| **User Experience Requirements** | [Rance Adriel M. Pascua], BSN Student |
| **Feature Specifications** | [Rance Adriel M. Pascua], BSN Student |
| **Technical Implementation** | Assisted by Claude 4.5 (Anthropic) |
| **Code Review & Validation** | [Rance Adriel M. Pascua], BSN Student |

### Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Inlined Tailwind CSS (no external dependencies)
- **Icons:** Inline SVG (no CDN requirements)
- **Offline Support:** Service Worker with Cache-First Strategy
- **Deployment:** Vercel (Static Site Hosting)

---

## Safety & Validation

### Formula Sources

All clinical calculations and medical formulas implemented in NursePath are derived from authoritative nursing textbooks and established clinical standards:

- **Brunner & Suddarth's Textbook of Medical-Surgical Nursing** (14th Edition)
- **Kozier & Erb's Fundamentals of Nursing** (11th Edition)
- **Lippincott's Nursing Drug Guide**
- **Philippine National Drug Formulary** (for local brand references)

### Current Validation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Development | ✅ Complete | Core features implemented and tested |
| Internal Testing | ✅ Complete | Developer testing with sample scenarios |
| **Faculty Validation** | 🔄 **In Progress** | Awaiting clinical instructor review |
| Field Testing | ⏳ Pending | Student beta testing in clinical settings |
| Institutional Approval | ⏳ Pending | College of Nursing endorsement |

### Quality Assurance

- All mathematical formulas have been cross-verified against textbook examples
- Input validation prevents out-of-range values
- Clinical guardrails flag potentially dangerous calculations
- Prominent disclaimers remind users to verify with clinical instructors

---

## Access Information

### For Faculty Reviewers

**Demo Access Code:** `NP-DEAN-2026`

This code grants access for evaluation purposes. The access remains valid for 30 days and functions offline after initial authentication.

### Deployment URL

The application will be deployed at a secure URL provided separately for faculty review.

---

## Project Roadmap

### Phase 1: Faculty Validation (Current)
- Present to College of Nursing Dean
- Gather feedback from clinical instructors
- Refine calculations based on faculty input

### Phase 2: Controlled Beta Testing
- Limited deployment to select nursing students
- Supervised use during clinical rotations
- Incident reporting and feedback collection

### Phase 3: Institutional Integration
- Formal approval from College of Nursing
- Integration with existing clinical education programs
- Expanded feature set based on validated needs

---

## Contact Information

**Developer:** [Rance Adriel M. Pascua]  
**Program:** Bachelor of Science in Nursing  
**Institution:** [Universidad de Dagupan]  
**Email:** [adrielrancepascua@gmail.com]  
**Academic Year:** 2025-2026

---

## License

This software is released under a **Restrictive Proprietary License**. See the [LICENSE](LICENSE) file for complete terms.

**Summary:** This application and its clinical logic are the intellectual property of the developer and are provided for evaluation purposes only. Unauthorized distribution, modification, or commercial use is prohibited.

---

<br>

# ⚠️ MEDICAL DISCLAIMER

<table>
<tr>
<td>

### 🚨 NOT FOR CLINICAL USE

**This application is an EDUCATIONAL PROTOTYPE intended for academic evaluation only.**

- ❌ **Do NOT** use this application to make actual clinical decisions
- ❌ **Do NOT** administer medications based solely on this application's calculations
- ❌ **Do NOT** substitute this tool for professional clinical judgment

### ✅ REQUIRED ACTIONS

- ✅ **ALWAYS** verify all calculations manually before use
- ✅ **ALWAYS** consult with your Clinical Instructor before acting on any information
- ✅ **ALWAYS** follow your institution's established protocols and procedures
- ✅ **ALWAYS** use approved institutional resources for patient care decisions

### 📋 INTENDED USE

This application is designed exclusively for:
- Educational demonstration to nursing faculty
- Academic evaluation of clinical decision-support concepts
- Learning tool for understanding drug calculations (under supervision)

**The developer assumes no liability for any clinical decisions made using this application.**

*"When in doubt, ask your Clinical Instructor."*

</td>
</tr>
</table>

---

<p align="center">
  <em>© 2026 [Your Name]. All Rights Reserved.</em><br>
  <em>Developed for the College of Nursing | For Academic Evaluation Only</em>
</p>
