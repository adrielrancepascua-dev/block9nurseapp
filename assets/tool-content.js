/**
 * Single content source for NursePath tool teaching.
 *
 * Each tool has one ordered list of sections. Sections flagged `pocket: true`
 * form the short Guide shown in Duty mode; the full list is the Study lesson.
 * Keeping one list prevents the Guide and the lesson from drifting apart.
 *
 * Exposed on window.NursePathToolContent
 */
(function (global) {
  'use strict';

  const CONTENT = {
    vitals: {
      title: 'Vital Signs',
      subtitle: 'Read a set of numbers as one pattern, not four separate boxes.',
      sections: [
        {
          heading: 'What this is for',
          body: 'Vital signs tell you whether the body is stable, compensating, or losing ground. NursePath compares what you enter against age, pregnancy, and comorbidity aware reference patterns, then shows you the findings. You decide what to recheck and what to report.'
        },
        {
          heading: 'The five core signs',
          body: 'Blood pressure: perfusion pressure to organs.\nHeart rate: pump demand and compensation.\nRespiratory rate: oxygenation and work of breathing.\nTemperature: infection, environment, endocrine clues.\nMany wards also require SpO2 and pain. Know your unit\u2019s required set.'
        },
        {
          heading: 'Adult resting reference bands',
          pocket: true,
          type: 'formula',
          body: 'BP: around 120/80 or below is the usual teaching ideal.\nHR: about 60 to 100 bpm at rest.\nRR: about 12 to 20 breaths per minute.\nTemp: about 36.5 to 37.5 C by oral route.\nChildren and OB patients are not small adults. Use the age aware bands.'
        },
        {
          heading: 'Reading a compensation pattern',
          pocket: true,
          body: 'The classic early shock pattern is falling BP with rising HR and rising RR. The body is working to hold perfusion. Read the whole pattern before you fixate on one abnormal number.'
        },
        {
          heading: 'Context changes the story',
          body: 'Pregnancy: baseline BP can differ, and preeclampsia red flags matter.\nAsthma or COPD: RR and work of breathing may be the lead finding.\nCKD or known hypertension: compare against the patient\u2019s usual, not only a textbook ideal.\nAge: neonates and older adults have different expected bands.'
        },
        {
          heading: 'How to use the result',
          pocket: true,
          body: 'Enter the vitals, add age, pregnancy, and conditions when relevant, then read the priority and findings. Ask yourself three questions: what would I recheck, what would I report, and what else do I need such as SpO2, urine output, or mentation.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'One snapshot is not the whole patient, and trends beat single values. Confirm anything that changes care with your Clinical Instructor and ward protocol.'
        }
      ]
    },

    iv: {
      title: 'IV Flow Rate',
      subtitle: 'Turn an order into mL/hr and gtt/min without panicking at the bedside.',
      sections: [
        {
          heading: 'What the order is asking',
          body: 'An IV fluid order gives you a volume, a time, and an implied delivery method: a pump or a gravity drip. Your job is to convert that into a rate the device can actually deliver, then confirm the tubing drop factor if you are counting drops.'
        },
        {
          heading: 'Volumetric rate',
          pocket: true,
          type: 'formula',
          body: 'mL/hr = Volume (mL) \u00f7 Time (hours)\n\nIf the time is in minutes, convert first: hours = minutes \u00f7 60.'
        },
        {
          heading: 'Gravity drip rate',
          pocket: true,
          type: 'formula',
          body: 'gtt/min = (mL/hr \u00f7 60) \u00d7 Drop factor (gtt/mL)\n\nCombined form: gtt/min = (Volume \u00d7 Drop factor) \u00f7 Time in minutes.'
        },
        {
          heading: 'Drop factors',
          pocket: true,
          body: 'Macrodrip sets are commonly 10, 15, or 20 gtt/mL. Microdrip is 60 gtt/mL and is often used for pediatric or carefully titrated infusions. Never assume: the number printed on the set governs a gravity drip.'
        },
        {
          heading: 'Worked example',
          pocket: true,
          type: 'example',
          body: 'Order: 1000 mL over 8 hours with a drop factor of 15.\nStep 1: 1000 \u00f7 8 = 125 mL/hr.\nStep 2: (125 \u00f7 60) \u00d7 15 = 31.25, which rounds to 31 gtt/min.'
        },
        {
          heading: 'Rounding and safety habits',
          body: 'Know whether your instructor wants whole drops or pump decimals. Confirm the fluid type, any additives, and patient identity before you trust the math. On a pump you usually program mL/hr, but you still need gtt/min for gravity setups and exams.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'A wrong drop factor gives a wrong drip even when your algebra is perfect. Recheck the set, the order, and the patient.'
        }
      ]
    },

    bmi: {
      title: 'BMI and Body Metrics',
      subtitle: 'A screening number with clear math and clear limits.',
      sections: [
        {
          heading: 'What this is for',
          body: 'BMI is a quick weight for height screening value. It helps with categorizing, documentation, and health teaching conversations. It is not a verdict on health and it does not replace clinical judgment.'
        },
        {
          heading: 'The formula',
          pocket: true,
          type: 'formula',
          body: 'BMI = weight (kg) \u00f7 height (m) squared\n\nConvert height first: metres = centimetres \u00f7 100.\nSo 170 cm becomes 1.70 m.'
        },
        {
          heading: 'WHO adult categories',
          pocket: true,
          type: 'formula',
          body: 'Underweight: below 18.5\nNormal: 18.5 to 24.9\nOverweight: 25 to 29.9\nObese: 30 and above\nSome references subdivide the obesity classes. Follow your lecture notes.'
        },
        {
          heading: 'Worked example',
          pocket: true,
          type: 'example',
          body: '70 kg at 170 cm\nBMI = 70 \u00f7 (1.70 \u00d7 1.70) = 70 \u00f7 2.89, which is about 24.2.\nThat lands in the normal band.'
        },
        {
          heading: 'When BMI misleads',
          body: 'High muscle mass can read as overweight. Edema, ascites, and pregnancy change weight without the same fat mass meaning. Older adults and some populations need different clinical framing. Always pair BMI with the rest of your assessment.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'Watch your units. A decimal slip in height gets squared, so it becomes a large BMI error.'
        }
      ]
    },

    aog: {
      title: 'AOG and EDD',
      subtitle: 'Date the pregnancy the way lectures expect, then respect the chart.',
      sections: [
        {
          heading: 'Language first',
          body: 'LMP is the first day of the last menstrual period. AOG is age of gestation, meaning how far along the pregnancy is. EDD or EDC is the estimated date of delivery. Unless a better dating source is documented, you are estimating from menstrual history.'
        },
        {
          heading: 'Naegele\u2019s rule',
          pocket: true,
          type: 'formula',
          body: 'EDD = LMP + 7 days \u2212 3 months + 1 year\n\nTeaching shortcut: EDD is about LMP + 280 days, or roughly 40 weeks.\nThis assumes a 28 day cycle with ovulation near day 14, and real cycles vary.'
        },
        {
          heading: 'Trimester frame',
          pocket: true,
          type: 'formula',
          body: 'First trimester: weeks 1 to 12\nSecond trimester: weeks 13 to 26\nThird trimester: weeks 27 to 40 and beyond\nPost term is usually discussed after 42 weeks. Follow local OB protocol.'
        },
        {
          heading: 'How AOG is reported',
          body: 'AOG is usually written as weeks plus days, for example 28 weeks and 3 days. Check whether your worksheet wants completed weeks only. Matching the chart matters more than clever math.'
        },
        {
          heading: 'When LMP dating is weak',
          body: 'An uncertain LMP, irregular cycles, recent hormonal contraception, or lactation all make LMP dating unreliable. Early ultrasound dating often overrides the arithmetic, so read what the prenatal record uses as the official EDD.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'Always state your dating source, either by LMP or by ultrasound. Never mix the two silently in an answer or a chart note.'
        }
      ]
    },

    peds: {
      title: 'Pediatric Dosing',
      subtitle: 'mg/kg for practice. Clark and Young for the classic exam question.',
      sections: [
        {
          heading: 'The modern standard',
          body: 'Most real pediatric orders are weight based in mg/kg, and some specialty drugs use body surface area. You calculate the dose, check the concentration you will draw up, and respect the maximum single and daily dose from the drug reference.'
        },
        {
          heading: 'Weight based dose',
          pocket: true,
          type: 'formula',
          body: 'Dose (mg) = weight (kg) \u00d7 ordered mg/kg\n\nThen: volume to draw = Dose (mg) \u00f7 concentration (mg/mL)'
        },
        {
          heading: 'Clark\u2019s rule',
          pocket: true,
          type: 'formula',
          body: 'Child dose = (weight in lb \u00f7 150) \u00d7 adult dose\n\nConvert kilograms to pounds by multiplying by about 2.2.\nExample: 10 kg is about 22 lb, so with a 500 mg adult dose you get (22 \u00f7 150) \u00d7 500, about 73 mg.'
        },
        {
          heading: 'Young\u2019s rule',
          pocket: true,
          type: 'formula',
          body: 'Child dose = [age \u00f7 (age + 12)] \u00d7 adult dose\n\nExample: age 3 with a 500 mg adult dose gives (3 \u00f7 15) \u00d7 500 = 100 mg.'
        },
        {
          heading: 'Keeping the three straight',
          body: 'Weight based dosing needs the weight and the ordered mg/kg. Clark needs the weight in pounds and the adult dose. Young needs the age in years and the adult dose. On an exam, identify which rule the question wants before you compute anything.'
        },
        {
          heading: 'Safety mindset',
          body: 'If the weight based result and the classic rules disagree widely, do not average them. Use the ordered method with the drug reference. Clark and Young are teaching tools; mg/kg with a maximum dose is the practice lane.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'Never prepare a pediatric dose you cannot defend with the weight, the order, and the concentration. Check decimal points twice, because a tenfold error is a classic and serious mistake.'
        }
      ]
    },

    apgar: {
      title: 'APGAR Score',
      subtitle: 'Score the transition at 1 and 5 minutes. Components first, total second.',
      sections: [
        {
          heading: 'What this is for',
          body: 'APGAR describes a newborn\u2019s condition at specific moments after birth and gives the team a shared shorthand for how the baby is transitioning. It does not set the first steps of resuscitation, because airway, breathing, and circulation still lead.'
        },
        {
          heading: 'The five letters',
          pocket: true,
          type: 'formula',
          body: 'A: Appearance, meaning colour\nP: Pulse, meaning heart rate\nG: Grimace, meaning reflex irritability\nA: Activity, meaning muscle tone\nR: Respiration\nEach scores 0, 1, or 2, for a total of 0 to 10.'
        },
        {
          heading: 'Quick scoring',
          pocket: true,
          body: 'Appearance: blue or pale 0, acrocyanosis 1, completely pink 2.\nPulse: absent 0, under 100 is 1, 100 or more is 2.\nGrimace: no response 0, grimace 1, cry or cough or sneeze 2.\nActivity: limp 0, some flexion 1, active motion 2.\nRespiration: absent 0, slow or irregular 1, good cry 2.'
        },
        {
          heading: 'Timing',
          body: 'Standard teaching is to score at 1 minute and again at 5 minutes. If the 5 minute score is low, many protocols continue scoring at intervals. Follow your delivery room algorithm.'
        },
        {
          heading: 'Teaching bands',
          pocket: true,
          type: 'formula',
          body: '0 to 3: severely depressed\n4 to 6: moderately depressed\n7 to 10: reassuring\nStill document every component, because a total of 8 can hide very different pictures.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'Never delay needed resuscitation to finish a tidy scorecard. Score alongside care, and know who documents on your unit.'
        }
      ]
    },

    gcs: {
      title: 'Glasgow Coma Scale',
      subtitle: 'Describe consciousness with E, V, and M. Never hide behind one number.',
      sections: [
        {
          heading: 'Why GCS exists',
          body: 'GCS gives clinicians a shared language for level of consciousness. Two nurses should hear E2 V2 M4 and picture a similar patient. That only works when you report the components rather than saying GCS 8 and stopping there.'
        },
        {
          heading: 'The three subscales',
          pocket: true,
          type: 'formula',
          body: 'Eye opening (E): 1 to 4\nVerbal response (V): 1 to 5\nMotor response (M): 1 to 6\nTotal = E + V + M, giving 3 to 15 when everything is testable.'
        },
        {
          heading: 'Teaching severity bands',
          pocket: true,
          type: 'formula',
          body: 'Mild: 13 to 15\nModerate: 9 to 12\nSevere: 8 or below\nThese bands are teaching aids. Trends and components carry more meaning than the label.'
        },
        {
          heading: 'How to score without guessing',
          pocket: true,
          body: 'Record the best response. Apply painful stimulus the way your skills lab taught, and only when needed. If an eye is swollen shut or the patient is intubated, record what cannot be assessed using your local convention rather than inventing a score.'
        },
        {
          heading: 'Worked example',
          type: 'example',
          body: 'The patient opens eyes to speech (E3), holds a confused conversation (V4), and localises pain (M5).\nTotal is 3 + 4 + 5 = 12, which is the moderate band, but you write E3 V4 M5.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'GCS is not a full neurological exam. Pupils, focal deficits, glucose, substances, and seizure activity still matter. Reassess and trend.'
        }
      ]
    },

    braden: {
      title: 'Braden Scale',
      subtitle: 'A lower score means higher risk. Use the subscales to aim prevention.',
      sections: [
        {
          heading: 'What this is for',
          body: 'Braden estimates the risk of pressure injury so prevention can start early. It is a risk screen, not a wound assessment, and it does not replace turning, skin checks, nutrition, and moisture management.'
        },
        {
          heading: 'The six subscales',
          pocket: true,
          type: 'formula',
          body: 'Sensory perception\nMoisture\nActivity\nMobility\nNutrition\nFriction and shear\nMost subscales score 1 to 4, while friction and shear scores 1 to 3. Totals usually run 6 to 23.'
        },
        {
          heading: 'The rule to remember',
          pocket: true,
          type: 'formula',
          body: 'A lower total means higher risk.\n\nCut off values for at risk interventions vary slightly by hospital policy, so learn the one your ward uses.'
        },
        {
          heading: 'Thinking past the total',
          pocket: true,
          body: 'Do not stop at the number. If moisture is the lowest subscale, your prevention plan should address incontinence care and linen changes. If mobility is lowest, focus on repositioning and support surfaces.'
        },
        {
          heading: 'Reassessment',
          body: 'Risk changes after surgery, sedation, fever, diarrhoea, or declining intake. Braden is not a one time admission sticker, so reassess on the schedule your protocol sets.'
        },
        {
          heading: 'Remember',
          pocket: true,
          type: 'caveat',
          body: 'A reassuring Braden score never makes skin assessment optional. Look at the skin, document what you see, and act on both.'
        }
      ]
    },

    ron: {
      title: 'Rule of Nines',
      subtitle: 'Estimate adult burn TBSA quickly, and remember children are mapped differently.',
      sections: [
        {
          heading: 'Why TBSA matters',
          body: 'Total body surface area burned guides fluid resuscitation teaching, referral decisions, and how urgent the injury looks at a glance. Rule of Nines is a rapid adult estimate that formal burn charts later refine.'
        },
        {
          heading: 'Adult map',
          pocket: true,
          type: 'formula',
          body: 'Head and neck: 9 percent\nEach arm: 9 percent\nAnterior trunk: 18 percent\nPosterior trunk: 18 percent\nEach leg: 18 percent\nPerineum: 1 percent\nTotal: 100 percent'
        },
        {
          heading: 'Half regions',
          pocket: true,
          body: 'When only part of a region is burned, use a fraction of it. Half of one arm is about 4.5 percent. Stay consistent with the way your skills lab rounds.'
        },
        {
          heading: 'Worked example',
          pocket: true,
          type: 'example',
          body: 'An entire right arm plus the entire anterior trunk\n= 9 percent + 18 percent = 27 percent TBSA'
        },
        {
          heading: 'Pediatric caution',
          pocket: true,
          body: 'Children have proportionally larger heads and different limb percentages, so the adult map does not transfer to a toddler. Use the pediatric burn chart your course provides.'
        },
        {
          heading: 'Remember',
          type: 'caveat',
          body: 'TBSA is only one piece of the picture. Burn depth, airway involvement, circumferential burns, and comorbidity all change urgency. Follow the referral criteria from your lecture.'
        }
      ]
    }
  };

  function getTool(toolId) {
    return CONTENT[toolId] || null;
  }

  /** Short pocket reference shown as the Guide in Duty mode. */
  function getPocketSections(toolId) {
    const tool = getTool(toolId);
    if (!tool) return [];
    const pocket = (tool.sections || []).filter((s) => s.pocket);
    return pocket.length ? pocket : (tool.sections || []);
  }

  /** Full instructor-style lesson shown in Study mode. */
  function getLessonSections(toolId) {
    const tool = getTool(toolId);
    return tool ? (tool.sections || []) : [];
  }

  function listToolIds() {
    return Object.keys(CONTENT);
  }

  global.NursePathToolContent = {
    CONTENT,
    getTool,
    getPocketSections,
    getLessonSections,
    listToolIds
  };
})(typeof window !== 'undefined' ? window : self);
