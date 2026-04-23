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

### 👻 Ghost Persistence (Demo Auth)
- Email is treated as pilot identity (username/session ID), not strict inbox-auth login
- No password and no signup screen
- Enter email once and the device is locally sealed for auto-bypass on next launches
- Built-in cooldown and typo-domain checks (e.g. gmal.com) to reduce bounce backs
- Best-effort email logging (local always, Supabase when online)

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
- **Authentication:** Supabase Email OTP (Magic Link)
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

### Login Method

Users start the pilot by entering an email once.

1. Enter a valid email on the login screen.
2. Tap Get Started.
3. The app stores `nursepath_user` on the device and opens immediately.
4. On next launches, `nursepath_user` auto-bypasses the auth overlay.

Internet is optional for pilot entry. If online, the app also attempts to log the email to Supabase.

### Supabase Configuration Required

In Supabase Dashboard, verify the following:

1. Authentication > URL Configuration
2. Site URL is set to your deployed NursePath URL
3. Redirect URLs include your deployed URL and local dev URL
4. Authentication > Providers > Email is enabled
5. Authentication > Settings aligns with your policy:
  - Self-service allowed: students can request their own magic links
  - Invite-only: only pre-created users can log in

### Bounce-Back Mitigation

If Supabase warns about bounced emails, do the following:

1. Validate email format before accepting pilot entry.
2. Block obvious typo domains (already implemented in app).
3. Avoid repeated tests to fake addresses.
4. If you re-enable magic links later, configure custom SMTP for production.

### Optional: Central Email Attempt Logs (Supabase)

The app stores sign-in email attempts in local browser storage and queues failed sends for retry when internet returns.

To store logs centrally in Supabase, create this table and policy:

```sql
create table if not exists public.auth_email_log (
  id bigint generated by default as identity primary key,
  email text not null,
  status text not null,
  reason text,
  timestamp timestamptz not null default now()
);

alter table public.auth_email_log enable row level security;

create policy "allow anon insert auth_email_log"
on public.auth_email_log
for insert
to anon, authenticated
with check (true);
```

### Emergency Reset Backdoor

If a user typed the wrong email and the device is sealed, tap the NursePath header logo 5 times to clear local pilot identity and reload.

Fallback if you cannot access your school inbox

If your student account does not have an active mailbox, Ghost Persistence still allows pilot entry because email inbox access is not required for demo auth. Options:

- Contact your school's IT department and ask them to enable your mailbox or forward mail to your personal account. Use this template subject/body when emailing IT:

  Subject: Enable student email account

  Body: Hello IT,

  Can you please enable email for my student account (student@cdd.edu.ph)?

  Full name:
  Student ID:

  Thank you,

- Ask your instructor to whitelist your personal email or create a user entry for you in the system so you can sign in while IT resolves the mailbox.
- As a temporary testing step (development only), an instructor or admin can still review local/Supabase email logs to verify participant identities.

---

## Future Considerations

### Current Phase: Faculty Review
- Present to College of Nursing faculty
- Gather feedback on educational accuracy
- Improve based on instructor suggestions

### Potential Next Steps (Subject to Faculty Guidance)
- Share with classmates as a study resource
- Add more topics based on curriculum needs
- Refine content based on feedback

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

---

<br>

# ⚠️ IMPORTANT NOTICE

<table>
<tr>
<td>

### 📚 EDUCATIONAL TOOL ONLY

**This application is a STUDY AID developed as an academic project.**

- This is **NOT** a clinical reference tool
- This is **NOT** intended for use in patient care settings
- This is **NOT** a substitute for textbooks or instructor guidance

### 📖 INTENDED PURPOSE

This application is designed for:
- Practicing calculation concepts learned in class
- Reviewing medication information from pharmacology coursework
- Studying vital signs ranges from nursing textbooks
- Reinforcing classroom learning through interactive examples

### ✅ APPROPRIATE USE

- ✅ Use as a personal study companion
- ✅ Practice calculations before exams
- ✅ Review concepts discussed in lecture
- ✅ Always refer to your textbooks and instructors as primary sources

### 👩‍🏫 STUDENT RESPONSIBILITY

As with any study tool, students are responsible for:
- Verifying information against assigned textbooks
- Following instructor guidance in all academic matters
- Using official institutional resources for coursework

*"This tool supports your learning—your textbooks and instructors are your primary guides."*

</td>
</tr>
</table>

---

<p align="center">
  <em>© 2025-2026 Rance Adriel Pascua</em><br>
  <em>BSN Student Project | Universidad de Dagupan | For Academic Review</em>
</p>


