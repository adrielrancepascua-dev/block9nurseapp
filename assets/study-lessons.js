/**
 * Instructor-style Study lessons for NursePath (educational / simulation only).
 * Exposed on window.NursePathStudyLessons
 */
(function (global) {
  'use strict';

  const LESSONS = {
    vitals: {
      title: 'Vital Signs — Lesson',
      subtitle: 'How to think about a set of numbers like a nurse, not a machine.',
      sections: [
        {
          heading: 'What your CI wants you to understand',
          body: 'Vital signs are a pattern, not four separate boxes. You are looking for whether the body is compensating, decompensating, or stable — then deciding what to recheck, report, or escalate. NursePath shows simulation findings to train that habit. It does not diagnose or give real orders.'
        },
        {
          heading: 'The five core signs (teaching frame)',
          body: 'Blood pressure — perfusion pressure to organs.\nHeart rate — pump demand / compensation.\nRespiratory rate — oxygen / acid-base work of breathing.\nTemperature — infection, environment, endocrine clues.\n(Often paired with SpO₂ and pain on the ward — know your unit’s required set.)'
        },
        {
          heading: 'Adult resting “ballpark” ranges (memorize the idea)',
          body: 'BP: roughly <120/<80 ideal; hypotension and hypertension both matter by context.\nHR: ~60–100 bpm at rest for many adults.\nRR: ~12–20 breaths/min.\nTemp: ~36.5–37.5°C oral teaching band (route matters).\nAlways use age-, pregnancy-, and comorbidity-aware ranges in practice — children and OB patients are not “small adults.”'
        },
        {
          heading: 'How to read a shocking pattern',
          body: 'Classic early shock teaching pattern: low/falling BP + rising HR + rising RR. The body is trying to keep perfusion. Do not fixate on a single “abnormal” number if the whole pattern is screaming compensation.'
        },
        {
          heading: 'Context changes the story',
          body: 'Pregnancy: baseline BP can look different; know preeclampsia red flags from your OB module.\nCOPD/asthma: RR and work of breathing may be the lead finding.\nCKD / hypertension history: interpret BP trends against the patient’s usual, not only a textbook ideal.\nAge: neonates and elders have different expected bands.'
        },
        {
          heading: 'How to use the Duty tool after this lesson',
          body: '1) Enter BP, temp, HR, RR.\n2) Add age / pregnancy / conditions when relevant.\n3) Simulate.\n4) Read priority + findings.\n5) Ask yourself: What would I recheck? What would I report to CI? What else do I need (SpO₂, urine output, mentation)?'
        },
        {
          heading: 'Instructor caveats',
          body: 'One snapshot ≠ the whole patient. Trends beat single values. Simulation language is for learning — verify everything with faculty, ward protocol, and approved textbooks before real clinical decisions.'
        }
      ]
    },
    iv: {
      title: 'IV Flow Rate — Lesson',
      subtitle: 'Turn an order into mL/hr and gtt/min without panicking at the bedside.',
      sections: [
        {
          heading: 'What the order is really asking',
          body: 'An IV fluid order has volume, time, and an implied delivery method (pump vs gravity drip). Your job in computation drills is to convert that into a rate the pump or drip chamber can deliver — then double-check the tubing drop factor if you are counting drops.'
        },
        {
          heading: 'Formula 1 — volumetric rate',
          type: 'formula',
          body: 'mL/hr = Volume (mL) ÷ Time (hours)\n\nIf time is given in minutes: hours = minutes ÷ 60.'
        },
        {
          heading: 'Formula 2 — gravity drip rate',
          type: 'formula',
          body: 'gtt/min = (mL/hr ÷ 60) × Drop factor (gtt/mL)\n\nOr combined: gtt/min = (Volume × Drop factor) ÷ Time in minutes.'
        },
        {
          heading: 'Drop factors you must recognize',
          body: 'Macrodrip sets: commonly 10, 15, or 20 gtt/mL — check the package.\nMicrodrip: 60 gtt/mL — often peds / carefully titrated meds.\nNever assume. The number on the IV set is law for gravity drips.'
        },
        {
          heading: 'Worked example (say it out loud)',
          type: 'example',
          body: 'Order: 1000 mL NSS over 8 hours. DF = 15.\nStep A: 1000 ÷ 8 = 125 mL/hr.\nStep B: (125 ÷ 60) × 15 = 31.25 → round to 31 gtt/min (follow your school’s rounding rule).'
        },
        {
          heading: 'Rounding & safety habits',
          body: 'Know whether your CI wants whole drops or pump decimals.\nConfirm fluid type, additives, and patient ID before you celebrate the math.\nIf using a pump, mL/hr is usually the number you program — still understand gtt/min for gravity backup and exams.'
        },
        {
          heading: 'Instructor caveats',
          body: 'Wrong drop factor = wrong drip even if your algebra is perfect. Recheck the set. Recheck the order. Recheck the patient.'
        }
      ]
    },
    bmi: {
      title: 'BMI & Body Metrics — Lesson',
      subtitle: 'A screening number with clear math — and clear limits.',
      sections: [
        {
          heading: 'What BMI is for',
          body: 'BMI is a quick weight-for-height screening tool. It helps categorize adults for teaching, documentation, and health counseling conversations. It is not a diagnosis of “health” or “unhealth,” and it does not replace clinical judgment.'
        },
        {
          heading: 'The formula',
          type: 'formula',
          body: 'BMI = weight (kg) ÷ [height (m)]²\n\nHeight (m) = height (cm) ÷ 100\nExample: 170 cm → 1.70 m'
        },
        {
          heading: 'WHO adult categories (memorize bands)',
          body: 'Underweight: < 18.5\nNormal: 18.5–24.9\nOverweight: 25–29.9\nObese: ≥ 30\n(Some references subdivide obesity classes — follow your lecture notes.)'
        },
        {
          heading: 'Worked example',
          type: 'example',
          body: '70 kg, 170 cm\nBMI = 70 ÷ (1.70 × 1.70) = 70 ÷ 2.89 ≈ 24.2 → Normal'
        },
        {
          heading: 'When BMI misleads',
          body: 'Athletes / high muscle mass may look “overweight” on BMI alone.\nEdema, ascites, pregnancy change weight without the same fat-mass meaning.\nOlder adults and some ethnic groups may need different clinical framing.\nAlways pair BMI with the patient’s story and other assessments.'
        },
        {
          heading: 'Instructor caveats',
          body: 'Document units carefully (kg vs lb, cm vs m). A decimal slip in height squares into a large BMI error.'
        }
      ]
    },
    aog: {
      title: 'AOG & EDD — Lesson',
      subtitle: 'Date the pregnancy the way lectures and exams expect — then respect ultrasound.',
      sections: [
        {
          heading: 'Language first',
          body: 'LMP — first day of the last menstrual period.\nAOG — age of gestation (how far along).\nEDD / EDC — estimated date of delivery / confinement.\nYou are estimating from menstrual history unless a better dating source is documented.'
        },
        {
          heading: 'Naegele’s rule',
          type: 'formula',
          body: 'EDD = LMP + 7 days − 3 months + 1 year\n\nTeaching shortcut: EDD ≈ LMP + 280 days (≈ 40 weeks)\nAssumes a ~28-day cycle with ovulation ~day 14 — real cycles vary.'
        },
        {
          heading: 'Trimester teaching frame',
          body: '1st trimester: weeks 1–12\n2nd trimester: weeks 13–26\n3rd trimester: weeks 27–40+\nPost-term framing often discussed after 42 weeks — follow local OB protocol and faculty guidance.'
        },
        {
          heading: 'How AOG is talked about',
          body: 'Often reported as weeks + days (e.g., 28 weeks 3 days). Know whether your tool or worksheet wants completed weeks only. Consistency with the chart matters more than clever math.'
        },
        {
          heading: 'When LMP dating is weak',
          body: 'Uncertain LMP, irregular cycles, recent hormonal contraception, or lactation can make LMP dating unreliable. Early ultrasound dating frequently overrides pure Naegele math — read what the prenatal record uses as the official EDD.'
        },
        {
          heading: 'Instructor caveats',
          body: 'Always state your dating source: “by LMP” vs “by ultrasound.” Never silently mix them on an exam answer or chart note.'
        }
      ]
    },
    peds: {
      title: 'Pediatric Dosing — Lesson',
      subtitle: 'mg/kg for practice. Clark & Young for the classic exam brain.',
      sections: [
        {
          heading: 'The modern clinical standard',
          body: 'Most real pediatric orders are weight-based: mg/kg (sometimes mg/m² for specialty drugs). You calculate the dose, then check the concentration you will draw up, and respect maximum single/daily dose from the monograph / hospital guide.'
        },
        {
          heading: 'mg/kg formula',
          type: 'formula',
          body: 'Dose (mg) = weight (kg) × ordered mg/kg\n\nThen: volume to draw = Dose (mg) ÷ concentration (mg/mL)'
        },
        {
          heading: 'Clark’s Rule (classic)',
          type: 'formula',
          body: 'Child dose = (weight in lb ÷ 150) × adult dose\n\nConvert: lb ≈ kg × 2.2\nExample: 10 kg ≈ 22 lb; adult 500 mg → (22÷150)×500 ≈ 73 mg'
        },
        {
          heading: 'Young’s Rule (classic)',
          type: 'formula',
          body: 'Child dose = [age ÷ (age + 12)] × adult dose\n\nExample: age 3, adult 500 mg → [3÷15]×500 = 100 mg'
        },
        {
          heading: 'How to study these without mixing them up',
          body: 'mg/kg needs weight + ordered mg/kg (clinical style).\nClark needs weight in pounds + adult dose.\nYoung needs age in years + adult dose.\nOn exams, circle which rule the question asked before you compute.'
        },
        {
          heading: 'Safety mindset',
          body: 'If mg/kg and Clark/Young disagree widely, do not “average” them for real care — use the ordered method + drug reference. Clark/Young are teaching/exam tools; mg/kg + max dose is the practice lane.'
        },
        {
          heading: 'Instructor caveats',
          body: 'Never give a pediatric dose you cannot defend with weight, order, and concentration. Double-check decimal points — a 10× error is a classic tragedy pattern.'
        }
      ]
    },
    apgar: {
      title: 'APGAR Score — Lesson',
      subtitle: 'Score the transition at 1 and 5 minutes — components first, total second.',
      sections: [
        {
          heading: 'What APGAR is (and is not)',
          body: 'APGAR describes newborn condition at specific moments after birth. It helps communicate how the baby is transitioning. It does not decide the first steps of resuscitation — airway, breathing, and circulation priorities still lead.'
        },
        {
          heading: 'The letters',
          body: 'A — Appearance (color)\nP — Pulse (heart rate)\nG — Grimace (reflex irritability)\nA — Activity (muscle tone)\nR — Respiration\nEach scored 0, 1, or 2. Total 0–10.'
        },
        {
          heading: 'Quick scoring memory',
          body: 'Appearance: blue/pale 0 · acrocyanosis 1 · completely pink 2\nPulse: absent 0 · <100 1 · ≥100 2\nGrimace: no response 0 · grimace 1 · cry/cough/sneeze 2\nActivity: limp 0 · some flexion 1 · active motion 2\nRespiration: absent 0 · slow/irregular 1 · good/crying 2'
        },
        {
          heading: 'Timing',
          body: 'Standard teaching: score at 1 minute and 5 minutes. If the 5-minute score is low, many protocols continue at intervals — follow your delivery-room algorithm and faculty guidance.'
        },
        {
          heading: 'Teaching bands for the total',
          body: '0–3: severely depressed\n4–6: moderately depressed\n7–10: reassuring\nStill document each component. A total of 8 can hide different clinical pictures.'
        },
        {
          heading: 'Instructor caveats',
          body: 'Do not delay needed resuscitation to finish a pretty scorecard. Score in parallel with care. Know who documents on your unit.'
        }
      ]
    },
    gcs: {
      title: 'Glasgow Coma Scale — Lesson',
      subtitle: 'Describe consciousness with E, V, and M — never hide behind a single number.',
      sections: [
        {
          heading: 'Why GCS exists',
          body: 'GCS gives a shared language for level of consciousness after injury or illness. Two nurses should be able to hear “E2 V2 M4” and picture a similar patient. That only works if you report components, not only “GCS 8.”'
        },
        {
          heading: 'The three subscales',
          body: 'Eye opening (E): 1–4\nVerbal response (V): 1–5\nMotor response (M): 1–6\nTotal = E + V + M (3–15 if all testable)'
        },
        {
          heading: 'Teaching severity bands',
          body: 'Mild: 13–15\nModerate: 9–12\nSevere: ≤ 8\nBands are teaching aids — trends and components matter more than the label alone.'
        },
        {
          heading: 'How to score without guessing',
          body: 'Use the best response.\nApply painful stimulus the way your skills lab taught (and only when needed).\nIf an eye is swollen shut or the patient is intubated, record what you cannot assess (e.g., V = T for tube) per local convention — do not invent a fake verbal score.'
        },
        {
          heading: 'Worked example',
          type: 'example',
          body: 'Opens eyes to speech (E3), confused conversation (V4), localizes pain (M5)\nTotal = 3+4+5 = 12 → moderate band, but write E3V4M5.'
        },
        {
          heading: 'Instructor caveats',
          body: 'GCS is not a full neuro exam. Pupils, focal deficits, glucose, drugs/alcohol, and seizure activity still matter. Reassess and trend.'
        }
      ]
    },
    braden: {
      title: 'Braden Scale — Lesson',
      subtitle: 'Lower score, higher pressure-injury risk — use subscales to target prevention.',
      sections: [
        {
          heading: 'What Braden is for',
          body: 'Braden estimates risk of pressure injury so you can start prevention early. It is a risk tool, not a wound assessment and not a substitute for turning, skin checks, nutrition, and moisture management.'
        },
        {
          heading: 'Six subscales',
          body: 'Sensory perception\nMoisture\nActivity\nMobility\nNutrition\nFriction & shear\nMost subscales score 1–4; friction/shear is typically 1–3. Total usually 6–23.'
        },
        {
          heading: 'The big rule',
          type: 'formula',
          body: 'Lower total = higher risk.\n\nKnow the cutoffs your hospital or lecture uses for “at risk” interventions — they can vary slightly by policy.'
        },
        {
          heading: 'How to think like a CI',
          body: 'Do not only memorize the total. If moisture is the lowest subscale, your prevention talk should include incontinence care and linen changes. If mobility is lowest, focus on repositioning and support surfaces.'
        },
        {
          heading: 'Reassessment',
          body: 'Risk changes after surgery, sedation, fever, diarrhea, or declining intake. Braden is not a one-time admission sticker — reassess per protocol.'
        },
        {
          heading: 'Instructor caveats',
          body: 'A reassuring Braden does not make skin assessment optional. Look at the skin. Document what you see. Act on both score and eyes.'
        }
      ]
    },
    ron: {
      title: 'Rule of Nines — Lesson',
      subtitle: 'Estimate adult burn TBSA fast — then remember kids are mapped differently.',
      sections: [
        {
          heading: 'Why TBSA matters',
          body: 'Total body surface area burned guides fluid resuscitation teaching, referral decisions, and how serious the injury looks at a glance. Rule of Nines is a rapid adult estimate — charted burn tools may refine it.'
        },
        {
          heading: 'Adult map (memorize)',
          type: 'formula',
          body: 'Head & neck: 9%\nEach arm: 9%\nAnterior trunk: 18%\nPosterior trunk: 18%\nEach leg: 18%\nPerineum / genitalia: 1%\nTotal: 100%'
        },
        {
          heading: 'Half regions',
          body: 'If only part of a region is burned, use a fraction (commonly half). Example: half of one arm ≈ 4.5%. Be consistent with how your skills lab rounds.'
        },
        {
          heading: 'Worked example',
          type: 'example',
          body: 'Entire right arm + entire anterior trunk\n= 9% + 18% = 27% TBSA'
        },
        {
          heading: 'Pediatrics warning',
          body: 'Children have proportionally larger heads and different limb percentages. Do not blindly apply adult Rule of Nines to a toddler. Use the pediatric burn chart your course provides.'
        },
        {
          heading: 'Instructor caveats',
          body: 'TBSA estimate is only one piece — depth (superficial vs partial vs full thickness), airway, circumference, and comorbidity change urgency. Follow burn-center referral criteria from your lecture.'
        }
      ]
    }
  };

  function getLesson(toolId) {
    return LESSONS[toolId] || null;
  }

  function listLessonIds() {
    return Object.keys(LESSONS);
  }

  global.NursePathStudyLessons = {
    LESSONS,
    getLesson,
    listLessonIds
  };
})(typeof window !== 'undefined' ? window : self);
