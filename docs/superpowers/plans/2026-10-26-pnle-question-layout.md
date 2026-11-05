# PNLE inline explanations implementation

**Approved design:** Inline explanations in pnle-question-layouts.html, selected by the user before implementation.

**Scope:** Compact metadata toolbar, topic label, question-position bar, readable options, explicit answer-state labels, inline original rationales, and a reserved action area above the floating navigation. Preserve answer checking, exact-match SATA scoring, question content, storage and session flow.

- [x] Add browser regressions for answer labels/contrast and Next clearance.
- [x] Update question presentation and feedback labels; retain original scoring calls.
- [x] Add scoped theme-aware question styles and safe action positioning.
- [x] Synchronize root/frontend and verify Normal, Hard, SATA, mobile, dark theme and keyboard behavior.

Verified in Chrome: Normal incorrect/correct feedback, original rationales, deterministic existing Hard SATA scoring, selected accessibility states, readable text in light/dark, Next above navigation, scrolling every answer on 320x568 and 390x844 screens, mode switching, offline reload and settings regressions. Static review found no introduced important issues. Initial sticky action placement could cover explanations; replaced with a reserved scrollport and separate absolute action row and added geometry regressions. Existing unrelated session-teardown const error remains unchanged.
