# Mismatch report

Access date: 2026-09-30. Thresholds, scoring, and `assets/clinical-calculators.js` were not edited.

Fetch status:

| File | Status |
|---|---|
| docs/sources/aha-2025-guideline-landing.md | FAILED |
| docs/sources/jacc-2025-hypertension.md | FAILED |
| docs/sources/aha-2017-top-things.md | FETCHED |
| docs/sources/aap-2017-flynn-pediatric-bp.md | FAILED |
| docs/sources/aafp-2018-pediatric-bp-summary.md | PARTIAL |
| docs/sources/rcp-news2-2017.md | FETCHED |
| docs/sources/aap-nrp-2025-guidelines.md | PARTIAL |
| docs/sources/bmj-pmc449823-burns.md | FAILED |
| docs/sources/cdc-child-teen-bmi-categories.md | FETCHED |
| docs/sources/who-obesity-and-overweight.md | FETCHED |
| docs/sources/who-adult-bmi-classification.md | FETCHED |

The 2025 guideline text did not open, so this report cannot say whether the 2025 category cutoffs changed from 2017. The comparison below uses only the fetched 2017 summary table.

## Vital signs: adult blood pressure

| Current value | Source value | Source file + table/section | Location in our code | Match? |
|---|---|---|---|---|
| In range when not crisis, stage 2, stage 1, elevated, or low. A reading such as 110/70 falls here. | Normal: <120 mm Hg and <80 mm Hg | aha-2017-top-things.md, Categories of BP in Adults | js/script-4.js liveAnalyze, in-range branch after the low-BP check | Partial. 110/70 matches Normal. The 2017 table has no separate low-BP row, so our in-range floor is not in that table. |
| Elevated: systolic ≥120 and diastolic <80 | Elevated: 120–129 mm Hg and <80 mm Hg | aha-2017-top-things.md, Categories of BP in Adults | js/script-4.js, elevated branch | Match for 120–129 with diastolic <80. Our branch has no upper systolic cap of 129 because higher systolic values are already caught as stage 1, stage 2, or crisis. |
| Stage 1: systolic ≥130 or diastolic ≥80 | Stage 1: 130–139 mm Hg or 80–89 mm Hg | aha-2017-top-things.md, Categories of BP in Adults | js/script-4.js, stage 1 branch | Match for those ranges. Higher values leave this branch for stage 2 or crisis. |
| Stage 2: systolic ≥140 or diastolic ≥90 | Stage 2: ≥140 mm Hg or ≥90 mm Hg | aha-2017-top-things.md, Categories of BP in Adults | js/script-4.js, stage 2 branch | Match, except our code checks crisis (≥180 or ≥120) first, so those readings are not labeled stage 2. |
| Crisis: systolic ≥180 or diastolic ≥120 | NOT FOUND | 2025 pages failed. The 2017 summary mentions hypertensive crisis with no mm Hg value. | js/script-4.js, crisis branch | TODO |
| Low: systolic <90 or diastolic <60 | NOT FOUND | 2017 summary table has no hypotension row. 2025 full text failed. | js/script-4.js, low-BP branch | TODO |
| Did 2025 change the 2017 category cutoffs? | NOT FOUND | aha-2025-guideline-landing.md and jacc-2025-hypertension.md | — | TODO. Cannot answer until the 2025 text is fetched. |

## Vital signs: heart rate, respiratory rate, temperature

No primary source in the requested set states these adult bands. Marked TODO. NEWS2 is beside them for comparison only and is not a replacement.

| Current value | NEWS2 Chart 1 (comparison only) | Source file | Location in our code | Match? |
|---|---|---|---|---|
| Heart rate: >120 marked tachycardia; >100 tachycardia; <50 bradycardia; 50–100 labeled in range. The unused bounds in code are 60 and 100 (`hrLow` / `hrHigh`), and bradycardia starts at `hrLow - 10`. | Pulse score 0 is 51–90. ≤40 is 3; 41–50 is 1; 91–110 is 1; 111–130 is 2; ≥131 is 3. | rcp-news2-2017.md, Chart 1 | js/script-4.js adult HR branches (`hrLow = 60`, `hrHigh = 100`) | TODO. Not the same bands. |
| Respiratory rate: >30 severe; >20 tachypnea; <12 bradypnea; 12–20 in range. Adult bounds `rrLow = 12`, `rrHigh = 20`. | Respiration score 0 is 12–20. ≤8 is 3; 9–11 is 1; 21–24 is 2; ≥25 is 3. | rcp-news2-2017.md, Chart 1 | js/script-4.js adult RR branches | TODO. The 12–20 score-0 row matches our in-range row. The abnormal cuts do not. |
| Temperature: ≥39.5 high fever; ≥38 fever; ≥37.5 low-grade; <35 hypothermia; 35.0 to <37.5 in range. | ≤35.0 is 3; 35.1–36.0 is 1; 36.1–38.0 is 0; 38.1–39.0 is 1; ≥39.1 is 2. | rcp-news2-2017.md, Chart 1 | js/script-4.js temperature branches | TODO. Not the same bands. |

## Pregnancy BP wording

| Current value | Source value | Source file + section | Location in our code | Match? |
|---|---|---|---|---|
| Pregnancy plus systolic ≥140 or diastolic ≥90 adds 1 severity point and shows preeclampsiaScreen: “Pregnancy with an elevated BP pattern: discuss preeclampsia screening with your instructor.” | NOT FOUND | 2025 pregnancy section was not retrieved. The 2017 summary names pregnant women as a special group and gives no BP numbers. | js/script-4.js lines that test `pregnant === 'yes'` with `sys >= 140` or `dia >= 90`; assets/interpretation-content.js `preeclampsiaScreen` | TODO: cite |

## APGAR

| Current value | Source value | Source file | Location in our code | Match? |
|---|---|---|---|---|
| Each of appearance, pulse, grimace, activity, respiration is scored 0 to 2. | NOT FOUND | aap-nrp-2025-guidelines.md. Part 5 DOI returned 403. | assets/clinical-calculators.js `apgarScore`; component wording in assets/tool-content.js `apgar` | TODO |
| Total ≥7: “Reassuring. Continue routine observation.” Total ≥4: “Moderately depressed. Stimulation and airway support are indicated.” Otherwise: “Severely depressed. Resuscitation priorities lead.” | NOT FOUND | Same. The NRP 9th edition textbook text is not on the fetched page. | assets/clinical-calculators.js `apgarScore` | TODO |
| Component cues: blue/pale 0, acrocyanosis 1, pink 2; pulse absent 0, under 100 is 1, 100 or more is 2; and the grimace, activity, and respiration lines in the learn text. | NOT FOUND | Same | assets/tool-content.js `apgar` | TODO |

## Rule of Nines

| Current value | Source value | Source file | Location in our code | Match? |
|---|---|---|---|---|
| Head and neck 9; each arm 9; anterior trunk 18; posterior trunk 18; each leg 18; perineum 1 | NOT FOUND | bmj-pmc449823-burns.md. Full text did not open. | assets/clinical-calculators.js `RULE_OF_NINES_REGIONS`; same percentages in assets/tool-content.js Rule of Nines body | TODO |
| Notes at <10, 10 to 24, and ≥25 percent | NOT FOUND | Same | assets/clinical-calculators.js `ruleOfNines` | TODO |
| Lund-Browder | Not implemented. Source table NOT FOUND. | bmj-pmc449823-burns.md | — | Not built, as requested |

## Adult BMI

| Current value | Source value | Source file + section | Location in our code | Match? |
|---|---|---|---|---|
| Underweight <18.5 | BMI <18.5: underweight | who-adult-bmi-classification.md | assets/ui-helpers.js `bmi < 18.5`; assets/interpretation-content.js `bmi.meaningScale` | Match |
| Normal Weight 18.5–24.9 | BMI 18.5-24.9: normal weight | who-adult-bmi-classification.md | assets/ui-helpers.js `bmi < 25` after the underweight check | Match |
| Overweight 25–29.9 | BMI ≥25.0: overweight. Fact sheet: overweight is a BMI greater than or equal to 25. | who-adult-bmi-classification.md; who-obesity-and-overweight.md | assets/ui-helpers.js `bmi < 30` | Match |
| Obese ≥30 | BMI ≥30.0: obesity. Fact sheet: obesity is a BMI greater than or equal to 30. | both WHO files | assets/ui-helpers.js `else` branch | Match |
| Asia-Pacific cutoffs | NOT FOUND on either who.int page | who-obesity-and-overweight.md; who-adult-bmi-classification.md | Not in code | The fetched pages do not give Asia-Pacific cutoffs. |
| Thinness <17.0 | BMI <17.0: thinness | who-adult-bmi-classification.md | Not in code | Not used. No change made. |

## Child BMI

Not implemented. CDC categories are saved in cdc-child-teen-bmi-categories.md (underweight <5th, healthy weight 5th to <85th, overweight 85th to <95th, obesity ≥95th, severe obesity ≥120% of the 95th or ≥35 kg/m2). No code change.

## Pediatric BP

Not implemented. Age under 12 echoes BP, heart rate, and respiratory rate and does not apply adult bands (`js/script-4.js`, `pediatric` branch, `isChild` fixed false). The Flynn percentile table was not on the opened AAFP summary and the Pediatrics article did not open. No pediatric BP tool was added.

## action.* and preeclampsiaScreen

None of these sentences appear in a fetched source. They stay `TODO: cite`.

| id | Text | Support in a fetched source |
|---|---|---|
| action.bpCrisis | Recheck BP manually within 5 minutes and escalate to the clinical instructor immediately. | None. TODO: cite |
| action.bpStage2 | Monitor blood pressure every 15 minutes and observe for headache, chest pain, or neurologic changes. | None. TODO: cite |
| action.bpStage1 | Repeat the BP after a brief rest and compare it against earlier readings. | None. TODO: cite |
| action.bpLow | Assess perfusion indicators such as mental status, skin signs, and capillary refill, then reassess vitals promptly. | None. TODO: cite |
| action.feverHigh | Increase monitoring frequency and evaluate for fever-associated tachycardia or tachypnea. | None. TODO: cite |
| action.hypothermia | Prioritize warming measures and recheck temperature. | None. TODO: cite |
| action.hrMarked | Assess for pain, fever, anxiety, or dehydration. | None. TODO: cite |
| action.hrBrady | Reassess perfusion and symptoms, verify reading quality, and repeat the heart rate. | None. TODO: cite |
| action.rrSevere | Reassess airway and breathing immediately, and check oxygenation if available. | None. TODO: cite |
| action.rrLow | Observe the depth and effort of breathing, then repeat the respiratory assessment. | None. TODO: cite |
| preeclampsiaScreen | Pregnancy with an elevated BP pattern: discuss preeclampsia screening with your instructor. | None. The 2025 pregnancy section was not retrieved. TODO: cite |

NEWS2 Chart 2 describes aggregate-score responses (ward-based, urgent, emergency). Those sentences are not the `action.*` lines above, and NEWS2 is comparison only.
