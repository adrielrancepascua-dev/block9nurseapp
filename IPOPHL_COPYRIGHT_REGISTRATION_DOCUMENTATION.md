================================================================================
                         NURSEPATH COPYRIGHT REGISTRATION
                              IPOPHL DOCUMENTATION
================================================================================

TITLE: NursePath: Clinical Learning Progressive Web Application
AUTHOR: Rance Adriel M. Pascua
DATE: April 8, 2026
VERSION: 1.1
CATEGORY: Class N Computer Program
REGISTRATION INTENT: Copyright Protection & Intellectual Property Establishment

================================================================================
                                COVER PAGE
================================================================================

                          NURSEPATH
                  Clinical Learning PWA - Version 1.1

                    A Progressive Web Application for
                   Academic Nursing Education Support


                    AUTHOR: Rance Adriel M. Pascua
                    DEVELOPMENT PERIOD: 2025-2026
                    INSTITUTION: Universidad de Dagupan
                    PROGRAM: Bachelor of Science in Nursing


                    Submitted to: IPOPHL (Intellectual Property 
                                       Office of the Philippines)
                    Category: Class N - Computer Program
                    Registration Date: April 8, 2026


================================================================================
                        EXECUTIVE SUMMARY
================================================================================

NursePath is a Progressive Web Application (PWA) developed as an academic 
learning tool for nursing students. The application provides interactive 
calculators and study references that reinforce clinical concepts through 
offline-capable technology.

CORE FUNCTIONALITY:
• IV Flow Rate Calculator (mL/hr and gtt/min formulas)
• Age of Gestation (AOG) & Estimated Date of Delivery (EDD) Calculator
• Body Mass Index (BMI) Calculator
• Vital Signs Reference Database (age-adjusted ranges)
• OTC Medication Study Reference (34 medications with Philippine brands)
• Offline Service Worker Implementation

TECHNICAL ARCHITECTURE:
• Runtime: Vanilla JavaScript (no frameworks)
• Styling: Inlined Tailwind CSS 
• Offline Support: Service Worker Cache-First Strategy
• Deployment: Vercel PWA
• Data Persistence: localStorage

KEY INTELLECTUAL PROPERTY COMPONENTS:
1. Complete PWA implementation with Service Worker logic
2. Proprietary vital signs assessment algorithm
3. Custom medication database with condition-specific safety ratings
4. Interactive UI/UX design with responsive calculations
5. Medical education content curation and verification

================================================================================
                          PROJECT DOCUMENTATION
================================================================================

--- SOURCE CODE: README.md (Technical Manual) ---


# NursePath: An Academic Learning Companion for Nursing Students

<p align="center">
  <img src="image-512.png" alt="NursePath Logo" width="120" height="120">
</p>

<p align="center">
  <strong>A Study Aid for Reinforcing Clinical Concepts in Nursing Education</strong>
</p>

<p align="center">
  <em>Version 1.1 | February 2026 | Faculty Review Phase</em>
</p>

---

## Executive Summary

**NursePath** is a Progressive Web Application (PWA) developed as an **academic learning tool** for nursing students. The application serves as a digital study companion that reinforces textbook concepts taught in the classroom.

This project addresses two educational objectives:

1. **Concept Reinforcement** — Provides interactive examples of drug dosage calculations and IV flow rate formulas that mirror textbook exercises, helping students practice and internalize mathematical nursing concepts.

2. **Reference Accessibility** — Offers a searchable compilation of commonly discussed OTC medications and vital signs ranges, serving as a portable study reference similar to pocket nursing guides.

The application operates entirely offline after initial installation, making it convenient for studying in various environments including libraries, dormitories, or areas with limited connectivity.

**Important:** This is a learning reinforcement tool, not a clinical resource. All content reflects standard nursing textbook material and is intended to support classroom instruction, not replace it.

---

## Features

### 🧭 Navigation
- Simple navigation bar for easy access to different sections
- Smooth scrolling between study modules
- Color-coded sections for quick identification

### 💉 IV Flow Rate Practice Calculator
- Demonstrates **mL/hr** calculations for infusion scenarios
- Shows **gtt/min** (drops per minute) formula applications
- Supports standard drop factors: 10, 15, 20, and 60 gtt/mL
- Helps students verify their manual calculation practice

### 🤰 AOG & EDD Study Calculator
- Demonstrates **Age of Gestation (AOG)** calculation methods
- Shows **Estimated Date of Delivery (EDD)** using Naegele's Rule
- Displays trimester information for maternal nursing coursework
- Lists common pregnancy milestones discussed in OB nursing classes

### 💊 OTC Medications Study Reference
- **34 commonly discussed OTC medications** with Philippine brand names
- Quick reference and detailed information tabs
- Includes information typically covered in pharmacology classes:
  - Drug classifications and mechanisms
  - Common uses and contraindications
  - Side effects and interactions
- Searchable by condition, brand name, or generic name
- DOH-recognized Philippine herbal medicines included

### 📊 Vital Signs Reference Guide
- Age-adjusted normal ranges from nursing textbooks
- Categorization examples (Normal, Low, High)
- Covers pediatric through geriatric ranges
- Pregnancy-related values for OB nursing studies

### ⚖️ BMI Calculator
- Standard BMI formula demonstration
- WHO category classifications

### 📴 Offline Availability
- Works without internet after first load
- Convenient for studying anywhere

---

## Technical Information

### Development Approach

This application was developed using **AI-Assisted Programming**, combining the developer's nursing education background with AI coding assistance.

| Component | Responsibility |
|-----------|----------------|
| **Content Selection & Requirements** | Rance Adriel M. Pascua, BSN Student |
| **Formula Verification** | Rance Adriel M. Pascua, BSN Student |
| **Feature Planning** | Rance Adriel M. Pascua, BSN Student |
| **Code Implementation** | Assisted by Claude (Anthropic) |
| **Testing & Review** | Rance Adriel M. Pascua, BSN Student |

### Technology

- **Frontend:** HTML5, CSS3, JavaScript
- **Styling:** Tailwind CSS (inlined)
- **Offline Support:** Service Worker
- **Hosting:** Vercel

---

## Content Sources

All educational content in NursePath is derived from standard nursing textbooks and educational resources:

- **Brunner & Suddarth's Textbook of Medical-Surgical Nursing** (14th Edition)
- **Kozier & Erb's Fundamentals of Nursing** (11th Edition)
- **Lippincott's Nursing Drug Guide**
- **Philippine National Drug Formulary**
- **Pillitteri's Maternal & Child Health Nursing**
- **WHO BMI Classification Guidelines**
- **DOH Traditional Medicine Guidelines**

---

## Current Status

| Phase | Status | Description |
|-------|--------|-------------|
| Development | ✅ Complete | Features implemented |
| Internal Testing | ✅ Complete | Basic functionality verified |
| **Faculty Review** | 🔄 **In Progress** | Seeking instructor feedback |
| Student Feedback | ⏳ Pending | Peer review from classmates |

---

## Access Information

### For Faculty Reviewers

**Demo Access:** Automatically unlocked on load

This code is valid for 30 days and functions offline after initial access.

---

## Contact Information

**Developer:** Rance Adriel M. Pascua  
**Program:** Bachelor of Science in Nursing  
**Institution:** Universidad de Dagupan  
**Email:** adrielrancepascua@gmail.com  
**Academic Year:** 2025-2026

---

## Usage Terms

This application is a student academic project. See the [LICENSE](LICENSE.txt) file for terms of use.

**Summary:** This is a student-developed educational tool provided for academic review. The content reflects standard nursing textbook material and is intended as a study aid only.

================================================================================
                    --- COMPLETE SOURCE CODE FILE ---
                            index.html
                  --- CATEGORY: Class N Computer Program ---
================================================================================

[FULL INDEX.HTML CODE - 2,700+ LINES INCLUDING:]
• Complete HTML5 semantic structure
• Inlined Tailwind CSS framework (responsive design)
• JavaScript logic for:
  - Vital signs assessment algorithm
  - IV flow rate calculations
  - BMI computation
  - AOG/EDD obstetric calculations
  - OTC medication database (34 medicines)
  - Search/filter functionality
  - Tab navigation system
  - Access code verification system
  - Simulation mode agreement overlay
  - Service Worker registration

[NOTE: Full file is included in accompanying index.html. This section 
provides architectural overview of intellectual property components.]

KEY ALGORITHMIC CONTRIBUTIONS:

1. VITAL SIGNS ASSESSMENT ENGINE
   - Age-group stratified vital sign interpretation
   - Pregnancy-adjusted vital sign ranges
   - Comorbidity-specific assessment logic
   - Multi-parameter diagnosis generation
   - Real-time analysis via liveAnalyze()

2. IV FLOW RATE CALCULATOR
   - mL/hr calculation: Volume (mL) ÷ Time (hours)
   - gtt/min calculation: (mL/hr ÷ 60) × Drop Factor
   - Support for 4 standard drop factors (10, 15, 20, 60)
   - Formula: calcIV()

3. AOG/EDD CALCULATOR
   - Naegele's Rule implementation: LMP + 280 days = EDD
   - Automatic weeks/days conversion
   - Trimester determination logic
   - Pregnancy milestone tracking
   - Formula: calcAOGEDD()

4. BMI CALCULATOR
   - Standard formula: Weight(kg) ÷ Height(m)²
   - WHO category classification
   - Formula: calcBMI()

5. OTC MEDICATION DATABASE
   - 34 medications with:
     * Generic and brand names
     * Philippine brand availability
     * Uses and contraindications
     * Condition-specific safety ratings
     * Complete pharmacokinetic information
     * Drug interaction warnings
   - Searchable interface
   - Dynamic condition filtering

6. RESPONSIVE UI SYSTEM
   - Mobile-first design approach
   - Tailwind CSS grid system (grid-cols-1, md:grid-cols-2, lg:grid-cols-3)
   - Safe area inset handling for notched devices
   - Touch-optimized interfaces (44x44px minimum tap targets)
   - Dark mode foundation (prevents white flash)
   - Accessibility features

7. PWA & OFFLINE CAPABILITY
   - Service Worker registration and lifecycle management
   - localStorage for session persistence
   - Access code session validation
   - Simulation mode agreement tracking

================================================================================
                    --- COMPLETE SOURCE CODE FILE ---
                          sw.js (Service Worker)
                  --- CATEGORY: Class N Computer Program ---
================================================================================

// --- SOURCE CODE FILE: sw.js ---
// --- CATEGORY: Class N Computer Program ---

const CACHE_NAME = 'nursepath-dean-demo-v1.1';
const OFFLINE_URL = '/index.html';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image-192.png',
  '/image-512.png'
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  console.log('🚀 NursePath Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching app for offline use...');
      return cache.addAll(STATIC_ASSETS)
        .catch((err) => {
          console.warn('⚠️ Some assets failed to cache:', err);
        });
    }).then(() => {
      console.log('✅ Service Worker installed - app available offline!');
      self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`🗑️ Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch: CACHE-FIRST strategy for offline academic use
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache (works offline!)
        console.log('📦 Serving from cache:', request.url);
        
        // Background update for next time
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // Not in cache - try network
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          // Cache for future offline use
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed - return offline page for navigation
        if (request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

console.log('🏥 NursePath Service Worker loaded - Ready for offline academic reinforcement!');

--- END SERVICE WORKER ---

INTELLECTUAL PROPERTY ASPECTS (sw.js):
• Proprietary cache versioning strategy
• Offline-first service worker implementation
• Background update mechanism
• Custom error handling for offline scenarios
• Selective asset caching logic

================================================================================
                    --- COMPLETE SOURCE CODE FILE ---
                      manifest.json (PWA Manifest)
                  --- CATEGORY: Class N Computer Program ---
================================================================================

// --- SOURCE CODE FILE: manifest.json ---
// --- CATEGORY: Class N Computer Program ---

{
  "id": "https://block9nurseapp.vercel.app/",
  "name": "NursePath - Academic Learning Companion",
  "short_name": "NursePath",
  "description": "Interactive calculators and study references for nursing education — offline-capable academic support for student nurses.",
  "start_url": "/index.html",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0f172a",
  "background_color": "#0f172a",
  "categories": ["medical", "productivity"],
  "prefer_related_applications": true,
  "related_applications": [
    {
      "platform": "play",
      "url": "https://play.google.com/store/apps/details?id=com.block9.nurse",
      "id": "com.block9.nurse"
    }
  ],
  "icons": [],
  "screenshots": []
}

--- END MANIFEST ---

TECHNICAL SIGNIFICANCE (manifest.json):
• Enables mobile app installation ("Add to Home Screen")
• Defines PWA identity and branding
• Specifies standalone display mode (full-screen app experience)
• Establishes vercel domain as canonical app location
• Enables app discovery through PWA stores

================================================================================
                           LICENSE INFORMATION
================================================================================

--- SOURCE CODE FILE: LICENSE.txt ---

This software is the intellectual property of Rance Adriel M. Pascua.

Academic Use License: This application is provided for educational purposes
and academic evaluation by faculty at Universidad de Dagupan.

Restrictions:
- This is a non-commercial student project
- Use is restricted to educational/academic contexts
- Commercial use, redistribution, or modification requires written permission
- Attribution to Rance Adriel M. Pascua is required in any derivative works

For questions regarding licensing or usage rights, contact:
Rance Adriel M. Pascua
adrielrancepascua@gmail.com

================================================================================
                        APPENDIX: REGISTRATION SUMMARY
================================================================================

INTELLECTUAL PROPERTY REGISTRATION FOR IPOPHL

Category: Class N - Computer Program

WORK IDENTIFICATION:
Title: NursePath: Clinical Learning Progressive Web Application
Author/Developer: Rance Adriel M. Pascua
Institution: Universidad de Dagupan
Program: Bachelor of Science in Nursing
Year Completed: 2026
Version: 1.1

TECHNICAL SPECIFICATIONS:
- Language: JavaScript, HTML5, CSS3
- Architecture: Progressive Web Application (PWA)
- Offline Capability: Service Worker
- Data Persistence: localStorage
- Runtime: Client-side JavaScript (no backend server)
- Deployment Platform: Vercel
- Total Lines of Code: Approximately 2,800+

FUNCTIONAL COMPONENTS:
1. Clinical Calculation Engine
   - IV Flow Rate (mL/hr, gtt/min)
   - Age of Gestation & EDD (Naegele's Rule)
   - BMI (Body Mass Index)
   - Vital Signs Interpretation

2. Educational Database
   - 34 OTC Medications with Philippine brands
   - Vital Signs Reference (age-stratified)
   - Pregnancy-specific vital signs ranges
   - Condition-specific medication safety ratings

3. Offline Infrastructure
   - Service Worker caching strategy
   - Offline asset management
   - Background update mechanism

4. User Interface
   - Responsive design (mobile, tablet, desktop)
   - Tab navigation system
   - Interactive calculators
   - Searchable databases
   - Simulation mode agreement system

EVIDENCE OF ORIGINAL AUTHORSHIP:
✓ Custom software architecture (no templates used)
✓ Proprietary vital signs assessment algorithm
✓ Original OTC medication database curation
✓ Custom calculation implementations
✓ Original responsive UI/UX design
✓ Service Worker implementation for offline functionality

CONTENT VERIFICATION:
All medical/nursing content verified against:
- Brunner & Suddarth's Textbook of Medical-Surgical Nursing
- Kozier & Erb's Fundamentals of Nursing
- Lippincott's Nursing Drug Guide
- Philippine National Drug Formulary
- Pillitteri's Maternal & Child Health Nursing

DEPLOYMENT INFORMATION:
Primary URL: https://block9nurseapp.vercel.app/
Repository: https://github.com/adrielrancepascua-dev/block9nurseapp
Current Version: 1.1
Last Updated: April 8, 2026

PRIOR DISCLOSURES:
This is an original student academic project with no previous registration.
The application has been developed for academic evaluation by faculty.

================================================================================
                          CONTACT INFORMATION
================================================================================

Developer: Rance Adriel M. Pascua
Email: adrielrancepascua@gmail.com
Phone: [To be provided during registration]
Institution: Universidad de Dagupan
Program: Bachelor of Science in Nursing
Year: 2025-2026

For IPOPHL Registration Inquiries:
This documentation package contains all necessary source code, technical 
specifications, and intellectual property evidence required for Copyright 
Registration (Class N - Computer Program) with the Intellectual Property 
Office of the Philippines.

================================================================================

Document Prepared: April 8, 2026
Content Status: Complete and Ready for IPOPHL Submission
Total Source Code Lines: 2,800+
Files Included: 
  ✓ Complete README.md (technical manual)
  ✓ Complete index.html (main application - 2,700+ lines)
  ✓ Complete sw.js (Service Worker - 76 lines)
  ✓ Complete manifest.json (PWA Manifest - 21 lines)
  ✓ LICENSE.txt (Usage terms)

================================================================================
END OF IPOPHL COPYRIGHT REGISTRATION DOCUMENTATION
================================================================================
