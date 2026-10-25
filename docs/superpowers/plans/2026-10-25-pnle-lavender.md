# Approved PNLE lavender layout implementation

**Goal:** Implement the reviewed lavender preview in the existing PNLE interface.

**Scope:** Presentation only: home layout, difficulty selector, topic cards and floating Practice/Mistakes/Progress navigation. Preserve question pools, scoring, mastery, review gates, storage, authentication and existing mode switching.

- [x] Add a focused navigation-state regression test.
- [x] Implement real-data home markup and shared active navigation state.
- [x] Add scoped lavender tokens and responsive floating navigation with reduced-motion support.
- [x] Mirror edited student files and cache the new stylesheet.
- [x] Verify browser interactions, normal/hard practice, answer feedback, mistakes/progress, themes, narrow screens and content clearance.

Reference: approved pnle-lavender-preview.html in this chat's visualization directory. Use existing real logo and actual user progress rather than preview samples.

Verification: seven unit tests pass. Real Chrome verified Normal and Hard answer feedback, mistake review, progress navigation, header switching, light/dark rendering, offline cache, and content clearance. Static review found no important regressions; the shared action-button alignment conflict was corrected and browser-tested. Existing session-teardown error in script-3.js remains outside scope.
