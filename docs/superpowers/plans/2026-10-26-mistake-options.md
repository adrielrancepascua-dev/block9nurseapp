# Mistakes: explanation review or retake

User-approved flow: restore the Mistakes landing page and offer Review explanations (read-only) and Retake mistakes (existing quiz). Reading must not change answers, daily counts, mastery, or mistake records.

- [x] Restore landing navigation for tab, question toolbar, and practice-home entry points.
- [x] Add a separate read-only explanation renderer with correct answers, original explanations, previous/next controls, and a return to Mistakes.
- [x] Retain existing quiz scoring and two-day clearing rules for Retake mistakes.
- [x] Mirror frontend files and verify storage invariance during review, empty states, retake behavior, themes, and mobile clearance.

Verified: eight unit tests; browser checks compare saved mistake/progress/daily-count records before and after reading, then complete retake through existing scoring. Narrow 320px choice cards and reading pagination fit and clear floating navigation. Static read-only review found no important introduced issues.
