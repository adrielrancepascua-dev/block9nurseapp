/**
 * In-depth tool guides for NursePath (educational / simulation only).
 * Exposed on window.NursePathToolGuides
 */
(function (global) {
  'use strict';

  const GUIDES = {
    vitals: {
      title: 'Vital Signs Simulation — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Compare entered vitals against age-, pregnancy-, and comorbidity-aware reference patterns in simulation. It shows findings for you to interpret — it does not diagnose or order care.'
        },
        {
          heading: 'How to use it',
          body: '1) Enter BP, temp, pulse, RR.\n2) Add age / pregnancy / known conditions when relevant.\n3) Tap Simulate Vital Signs.\n4) Read priority + findings, then decide what you would recheck or report.'
        },
        {
          heading: 'How to read the output',
          body: 'Priority summarizes urgency of the pattern in sim language.\nClinical Interpretation lists the strongest physiologic findings first.\nNursing Considerations are study prompts for simulation — not real orders.'
        },
        {
          heading: 'Remember',
          body: 'Always verify with your instructor, ward protocol, and approved textbooks. Trends matter more than a single snapshot.'
        }
      ]
    },
    iv: {
      title: 'IV Flow Rate — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Convert an IV order into mL/hr and drops per minute (gtt/min) using the tubing drop factor.'
        },
        {
          heading: 'Formulas',
          body: 'mL/hr = Volume (mL) ÷ Time (hours)\n\ngtt/min = (mL/hr ÷ 60) × Drop factor (gtt/mL)'
        },
        {
          heading: 'Drop factors',
          body: 'Macro drip: commonly 10, 15, or 20 gtt/mL (blood/colloids/standard sets).\nMicro drip: 60 gtt/mL — often used for pediatric or medication infusions.\nAlways match the drop factor printed on the IV set.'
        },
        {
          heading: 'Example',
          body: '1000 mL over 8 hours, DF 15:\nmL/hr = 1000 ÷ 8 = 125 mL/hr\ngtt/min = (125 ÷ 60) × 15 ≈ 31 gtt/min'
        },
        {
          heading: 'Remember',
          body: 'Confirm the doctor’s order, fluid type, and actual tubing drop factor before you trust any calculated rate.'
        }
      ]
    },
    bmi: {
      title: 'BMI & Body Metrics — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Quick WHO adult BMI category from weight (kg) and height (cm). Useful for screening notes — not a diagnosis.'
        },
        {
          heading: 'Formula',
          body: 'BMI = weight (kg) ÷ [height (m)]²\nHeight in meters = cm ÷ 100'
        },
        {
          heading: 'WHO adult categories',
          body: 'Underweight: < 18.5\nNormal: 18.5–24.9\nOverweight: 25–29.9\nObese: ≥ 30'
        },
        {
          heading: 'Example',
          body: '70 kg, 170 cm → height = 1.70 m\nBMI = 70 ÷ (1.70²) = 70 ÷ 2.89 ≈ 24.2 → Normal'
        },
        {
          heading: 'Remember',
          body: 'BMI does not replace clinical judgment (edema, pregnancy, athletes, older adults, etc.).'
        }
      ]
    },
    aog: {
      title: 'AOG & EDD — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Estimate Age of Gestation (AOG) and Estimated Date of Delivery (EDD) from Last Menstrual Period (LMP) using Naegele’s rule.'
        },
        {
          heading: 'Naegele’s rule',
          body: 'EDD = LMP + 7 days − 3 months + 1 year\n(Equivalent teaching shortcut: LMP + 280 days ≈ 40 weeks)'
        },
        {
          heading: 'Trimesters (teaching frame)',
          body: '1st: weeks 1–12\n2nd: weeks 13–26\n3rd: weeks 27–40+\nPost-term framing often begins after 42 weeks — follow local OB protocol.'
        },
        {
          heading: 'Remember',
          body: 'Ultrasound / obstetric dating can override LMP math. Confirm the dating source on the chart.'
        }
      ]
    },
    peds: {
      title: 'Pediatric Dosing — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Compare three educational ways to think about a child’s dose: modern weight-based mg/kg, plus classic board-exam formulas (Clark’s and Young’s).'
        },
        {
          heading: 'Prefer in practice: mg/kg',
          body: 'Dose (mg) = weight (kg) × ordered mg/kg\nThen check the product monograph for maximum single/daily dose and the concentration you will draw up.'
        },
        {
          heading: 'Clark’s Rule (classic exam formula)',
          body: 'Clark’s Rule uses pounds:\nChild dose = (weight in lb ÷ 150) × adult dose\n\nConvert kg → lb: lb ≈ kg × 2.2\nExample: 10 kg ≈ 22 lb; adult 500 mg → (22÷150)×500 ≈ 73 mg'
        },
        {
          heading: 'Young’s Rule (classic exam formula)',
          body: 'Child dose = [age ÷ (age + 12)] × adult dose\nExample: age 3, adult 500 mg → [3÷15]×500 = 100 mg'
        },
        {
          heading: 'How to use this screen',
          body: '1) Enter weight (and age if using Young’s).\n2) Enter mg/kg for the clinical-style estimate.\n3) Enter adult dose if you want Clark/Young cross-checks.\n4) Optional max dose caps the mg/kg result when provided.'
        },
        {
          heading: 'Remember',
          body: 'mg/kg (+ monograph limits) is the modern clinical standard. Clark/Young are mainly for exam-style reasoning. Always verify with CI and the drug label.'
        }
      ]
    },
    apgar: {
      title: 'APGAR Score — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Score newborn transition at 1 minute and 5 minutes. Each domain is 0, 1, or 2. Total ranges 0–10.'
        },
        {
          heading: 'The letters',
          body: 'A — Appearance (color)\nP — Pulse (heart rate)\nG — Grimace (reflex irritability)\nA — Activity (muscle tone)\nR — Respiration'
        },
        {
          heading: 'Totals (teaching bands)',
          body: '0–3: severely depressed\n4–6: moderately depressed\n7–10: reassuring\nAlways document the component scores and timing (1 min / 5 min).'
        },
        {
          heading: 'Remember',
          body: 'APGAR describes condition at a moment in time; it does not replace resuscitation priorities (airway, breathing, circulation).'
        }
      ]
    },
    gcs: {
      title: 'Glasgow Coma Scale — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Describe level of consciousness using Eye (E), Verbal (V), and Motor (M) responses. Report components, not only the total.'
        },
        {
          heading: 'Scoring ranges',
          body: 'Eye: 1–4\nVerbal: 1–5\nMotor: 1–6\nTotal: 3–15 (E+V+M)'
        },
        {
          heading: 'Severity bands (teaching)',
          body: 'Mild: 13–15\nModerate: 9–12\nSevere: ≤ 8\nExample documentation: E4V5M6 = 15'
        },
        {
          heading: 'Remember',
          body: 'Trend vs previous GCS and airway protection matter. Intubated patients may need modified verbal scoring per protocol.'
        }
      ]
    },
    braden: {
      title: 'Braden Scale — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Estimate pressure-injury risk using six subscales. Lower total = higher risk (range 6–23).'
        },
        {
          heading: 'Subscales',
          body: 'Sensory perception (1–4)\nMoisture (1–4)\nActivity (1–4)\nMobility (1–4)\nNutrition (1–4)\nFriction & shear (1–3)'
        },
        {
          heading: 'Risk framing (common teaching cutoffs)',
          body: '≤9 very high\n10–12 high\n13–14 moderate\n15–18 mild\n19–23 generally lower risk\nFollow your hospital’s Braden policy for interventions.'
        },
        {
          heading: 'Remember',
          body: 'Identify which subscale is pulling the score down — that guides prevention focus (moisture, mobility, nutrition, etc.).'
        }
      ]
    },
    ron: {
      title: 'Rule of Nines — Guide',
      sections: [
        {
          heading: 'What this is for',
          body: 'Estimate burn Total Body Surface Area (TBSA %) using adult Rule of Nines. Tap regions: Off → Half → Full.'
        },
        {
          heading: 'Adult map',
          body: 'Head & neck: 9%\nEach arm: 9%\nAnterior trunk: 18%\nPosterior trunk: 18%\nEach leg: 18%\nPerineum / genitalia: 1%'
        },
        {
          heading: 'Half regions',
          body: 'Selecting half of a region uses half of that region’s percent (example: half of one arm ≈ 4.5%).'
        },
        {
          heading: 'Remember',
          body: 'Pediatric proportions differ from adult Rule of Nines. Confirm with CI / burn chart used on your ward.'
        }
      ]
    }
  };

  function getGuide(toolId) {
    return GUIDES[toolId] || null;
  }

  function listGuideIds() {
    return Object.keys(GUIDES);
  }

  global.NursePathToolGuides = {
    GUIDES,
    getGuide,
    listGuideIds
  };
})(typeof window !== 'undefined' ? window : self);
