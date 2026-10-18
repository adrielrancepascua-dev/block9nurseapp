# MedSurg exam-style Hard items (UDD midterm pattern)

Reference: MedSurg I Midterms Quiz (Soriano / UDD). **Unofficial** — verify against CI and handouts.

## Two tiers

1. **Standalone (Q1–25 style):** NCLEX-style single best answer, SATA, priority/first, delegation, calculation, therapeutic communication, labs/ABG.
2. **Case unit (Q26–50 style):** One patient timeline (Maria Santos) with nurse’s notes at 2200, 2300, 0000, …; each block adds data and 2–5 questions.

## Case arc

Stable → early warning → crisis → rescue → recovery → discharge teaching. Early items: trends; later: priorities, evaluation, teaching.

## Distractor patterns

- Right topic, wrong priority (oral iron in shock).
- Opposite-direction traps (diuretic for hypokalemia).
- Almost-right ABG wording (uncompensated vs partially vs fully compensated).
- Dangerous options (KCl IV push, bicarb without assessment).
- Calculation traps (common math errors in answer set).
- Student statements: best = nuanced; wrong = absolute.

## Generator fields

| Field | Use |
|--------|-----|
| `format` | `single` or `sata` |
| `correctIndices` | SATA: all correct option indexes |
| `choices` / `reasons` | 4 or 5 options |
| `caseId` | e.g. `maria-santos-2026` |
| `caseSegment` | e.g. `2200` |
| `caseNarrative` | Nurse’s notes block shown above stem |
| `examStyle` | `true` for midterm-style Hard bank |
| `level` | always `hard` for this track |
| Pilot bank | Legacy `level: hard` recall items are demoted to **normal** at build time; **Hard** in Study = `examStyle` items only |

## Authoring batches

Add items in `tools/pnle_midterm_hard.py`, then `python3 tools/generate_pnle_bank.py`.
