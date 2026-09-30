# Mismatch report

Access date: 2026-09-30. After the sources below opened, these values were updated to match them. Heart rate, respiratory rate, temperature, low blood pressure, APGAR, and the Rule of Nines region percentages were not changed, because those numbers are still missing from the fetched pages. Pediatric percentile tables, Lund-Browder, and NEWS2 scoring were not built.

Fetch status:

| File | Status |
|---|---|
| docs/sources/aha-2025-guideline-landing.md | FETCHED (Circulation full text of the same article ID; the heart.org landing page is still 403) |
| docs/sources/jacc-2025-hypertension.md | FAILED (doi 10.1016/j.jacc.2025.07.010) |
| docs/sources/aha-2017-top-things.md | FETCHED |
| docs/sources/aap-2017-flynn-pediatric-bp.md | FETCHED (article-split HTML of the same DOI) |
| docs/sources/aafp-2018-pediatric-bp-summary.md | PARTIAL (summary only; Table 3 is in the Flynn file) |
| docs/sources/rcp-news2-2017.md | FETCHED |
| docs/sources/aap-nrp-2025-guidelines.md | PARTIAL (Circulation Part 5 opened; APGAR table still absent) |
| docs/sources/bmj-pmc449823-burns.md | PARTIAL (HTML opened; figure percentages not in the text) |
| docs/sources/cdc-child-teen-bmi-categories.md | FETCHED |
| docs/sources/who-obesity-and-overweight.md | FETCHED |
| docs/sources/who-adult-bmi-classification.md | FETCHED |

The 2025 Circulation text is now in `aha-2025-guideline-landing.md`. Table 4 uses the same four category cuts as the 2017 summary. The requested JACC DOI is still blocked.

## Vital signs: adult blood pressure

| Current value | Source value | Source file + table/section | Location in our code | Match? |
|---|---|---|---|---|
| In range when not crisis, stage 2, stage 1, elevated, or low. A reading such as 110/70 falls here. | Normal: <120 mm Hg and <80 mm Hg | aha-2025-guideline-landing.md, Table 4. Same row in aha-2017-top-things.md | js/script-4.js liveAnalyze, in-range branch after the low-BP check | Partial. 110/70 matches Normal. Neither table has a low-BP row, so our in-range floor is not in those tables. |
| Elevated: systolic ≥120 and diastolic <80 | Elevated: 120 to 129 mm Hg and <80 mm Hg | aha-2025-guideline-landing.md, Table 4 | js/script-4.js, elevated branch | Match for 120–129 with diastolic <80. |
| Stage 1: systolic ≥130 or diastolic ≥80 | Stage 1: 130 to 139 mm Hg or 80 to 89 mm Hg | aha-2025-guideline-landing.md, Table 4 | js/script-4.js, stage 1 branch | Match for those ranges. |
| Stage 2: systolic ≥140 or diastolic ≥90 | Stage 2: ≥140 mm Hg or ≥90 mm Hg | aha-2025-guideline-landing.md, Table 4 | js/script-4.js, stage 2 branch | Match, except crisis is checked first, so those readings are not labeled stage 2. |
| Severe hypertension: systolic >180 or diastolic >120. A reading of exactly 180 or exactly 120 stays in stage 2. The label is “Severe hypertension pattern.” The action says emergency status also needs target organ damage, which this tool does not assess. | Severe hypertension and hypertensive emergency: >180/120 mm Hg. Emergency also requires acute target organ damage. | aha-2025-guideline-landing.md, section 6.2 | js/script-4.js, severe-hypertension branch; assets/interpretation-content.js `pattern.bpCrisis` and `action.bpCrisis` | Updated to the source cut and wording. |
| Low: systolic <90 or diastolic <60 | NOT FOUND | aha-2025-guideline-landing.md, Table 4 and a search of that text | js/script-4.js, low-BP branch | TODO |
| Did 2025 change the 2017 category cutoffs? | No. Table 4 matches the 2017 summary rows and says it is adapted from Whelton et al. | aha-2025-guideline-landing.md, Table 4; aha-2017-top-things.md | — | Category cuts match. Crisis and low BP were not rows in either category table. |

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
| Pregnancy plus systolic ≥140 or diastolic ≥90 still adds 1 severity point. The context line is the hypertension-in-pregnancy threshold, and it says preeclampsia also needs proteinuria or an end-organ finding. At ≥160 or ≥110 the line is severe-range hypertension, verify within 15 minutes. | ACOG, as printed in the 2025 guideline: hypertension in pregnancy is SBP ≥140 or DBP ≥90 on 2 occasions at least 4 hours apart. Severe-range is sustained ≥160 or ≥110, verified in 15 minutes. Table 24 preeclampsia also requires proteinuria or a listed end-organ finding. | aha-2025-guideline-landing.md, section 5.5 and Table 24 | js/script-4.js pregnancy context; assets/interpretation-content.js `pregnancyHypertension` and `pregnancySevere` | Updated. The tool still does not collect the second reading, the 4-hour gap, or proteinuria. |

## APGAR

| Current value | Source value | Source file | Location in our code | Match? |
|---|---|---|---|---|
| Each of appearance, pulse, grimace, activity, respiration is scored 0 to 2. | NOT FOUND | aap-nrp-2025-guidelines.md. Circulation Part 5 opened. The component table is not in it. | assets/clinical-calculators.js `apgarScore`; component wording in assets/tool-content.js `apgar` | TODO |
| Total ≥7: “Reassuring. Continue routine observation.” Total ≥4: “Moderately depressed. Stimulation and airway support are indicated.” Otherwise: “Severely depressed. Resuscitation priorities lead.” | NOT FOUND | Same. The page assesses breathing and muscle tone and does not use these bands. | assets/clinical-calculators.js `apgarScore` | TODO |
| Component cues: blue/pale 0, acrocyanosis 1, pink 2; pulse absent 0, under 100 is 1, 100 or more is 2; and the grimace, activity, and respiration lines in the learn text. | NOT FOUND | Same | assets/tool-content.js `apgar` | TODO |

## Rule of Nines

| Current value | Source value | Source file | Location in our code | Match? |
|---|---|---|---|---|
| Head and neck 9; each arm 9; anterior trunk 18; posterior trunk 18; each leg 18; perineum 1 | NOT FOUND as numbers. The page says the Wallace rule divides the adult body into areas of 9% and is not accurate in children. The drawing is Figure 1 and is not transcribed. | bmj-pmc449823-burns.md | assets/clinical-calculators.js `RULE_OF_NINES_REGIONS`; assets/tool-content.js Rule of Nines body | TODO until the figure cells are read. The “areas of 9%” sentence is consistent with a nines map and does not prove 18 or 1. |
| Note: at or below 15% is below the adult formal-resuscitation threshold; above 15% warrants formal fluid resuscitation. The learn text also states the child cut above 10%. Region percentages were not changed. | Formal resuscitation: more than 15% TBSA in adults and more than 10% in children. Palmar surface roughly 0.8%. | bmj-pmc449823-burns.md | assets/clinical-calculators.js `ruleOfNines` note; assets/tool-content.js Rule of Nines | Updated. The 10 / 25 teaching notes are gone. Region percentages remain TODO until the figure cells are read. |
| Lund-Browder | Named as the age-adjusted chart (Figure 2). Age rows NOT FOUND in the text. | bmj-pmc449823-burns.md | — | Not built, as requested |

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

Not implemented as percentile tables. Age under 12 still echoes BP, heart rate, and respiratory rate. Age 12 now echoes blood pressure and does not receive an adult category, because Table 3 uses height percentiles until age 13. Heart rate and respiratory rate at age 12 still use this tool’s adult bands. Those bands have no pediatric source in this set.

Flynn Table 3 is in `aap-2017-flynn-pediatric-bp.md`. Ages 1 to <13 use height-specific percentiles. Ages ≥13 use <120/<80, 120/<80 to 129/<80, 130/80 to 139/89, and ≥140/90. Tables 4 and 5 require height percentile, which this app does not collect. No pediatric BP tool was added. The page says the guideline expires 5 years after the 2017 publication unless reaffirmed.

## action.* and pregnancy lines

`action.bpCrisis`, `pregnancyHypertension`, and `pregnancySevere` now cite the 2025 guideline sections above. The other action lines still do not appear in a fetched source. They stay `TODO: cite`.

| id | Text | Support in a fetched source |
|---|---|---|
| action.bpCrisis | Blood pressure is above 180/120 mm Hg. Tell your instructor. Emergency status also needs acute target organ damage, which this tool does not assess. | aha-2025-guideline-landing.md section 6.2 |
| action.bpStage2 | Monitor blood pressure every 15 minutes and observe for headache, chest pain, or neurologic changes. | None. TODO: cite |
| action.bpStage1 | Repeat the BP after a brief rest and compare it against earlier readings. | None. TODO: cite |
| action.bpLow | Assess perfusion indicators such as mental status, skin signs, and capillary refill, then reassess vitals promptly. | None. TODO: cite |
| action.feverHigh | Increase monitoring frequency and evaluate for fever-associated tachycardia or tachypnea. | None. TODO: cite |
| action.hypothermia | Prioritize warming measures and recheck temperature. | None. TODO: cite |
| action.hrMarked | Assess for pain, fever, anxiety, or dehydration. | None. TODO: cite |
| action.hrBrady | Reassess perfusion and symptoms, verify reading quality, and repeat the heart rate. | None. TODO: cite |
| action.rrSevere | Reassess airway and breathing immediately, and check oxygenation if available. | None. TODO: cite |
| action.rrLow | Observe the depth and effort of breathing, then repeat the respiratory assessment. | None. TODO: cite |
| pregnancyHypertension | Pregnancy with BP at or above 140/90 mm Hg meets the hypertension-in-pregnancy threshold. Preeclampsia also needs proteinuria or an end-organ finding. | aha-2025-guideline-landing.md section 5.5 and Table 24 |
| pregnancySevere | Pregnancy with BP at or above 160/110 mm Hg is severe-range hypertension. Verify within 15 minutes. | aha-2025-guideline-landing.md section 5.5 |

NEWS2 Chart 2 describes aggregate-score responses (ward-based, urgent, emergency). Those sentences are not the `action.*` lines above, and NEWS2 is comparison only.
