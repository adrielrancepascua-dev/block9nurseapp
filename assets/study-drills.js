/**
 * Multi-question Study quizzes for NursePath. Educational reference only.
 * Exposed on window.NursePathStudyDrills
 */
(function (global) {
  'use strict';

  const QUIZZES = {
    vitals: {
      title: 'Vital Signs quiz',
      questions: [
        {
          prompt: 'Adult, not pregnant, no known comorbidity. BP 88/54, HR 128, RR 28, Temp 36.8°C. Which priority pattern fits best?',
          choices: [
            'Reassuring resting pattern',
            'Hypoperfusion / shock-pattern vitals',
            'Isolated fever pattern',
            'Isolated hypertensive urgency pattern'
          ],
          correctIndex: 1,
          explain: 'Low BP + tachycardia + tachypnea is a compensation / shock-pattern picture. Temp is not the driver.'
        },
        {
          prompt: 'Why does NursePath ask for age, pregnancy, and conditions with vitals?',
          choices: [
            'To calculate billing',
            'Because reference patterns change with context',
            'Because RR is irrelevant for adults',
            'Because BMI replaces vital signs'
          ],
          correctIndex: 1,
          explain: 'Expected bands and interpretation shift with age, pregnancy, and comorbidity, so context changes the story.'
        },
        {
          prompt: 'Which habit would your CI most likely praise?',
          choices: [
            'Treat one abnormal number in isolation every time',
            'Ignore trends if the latest value looks “okay”',
            'Read the whole pattern, then decide what to recheck or report',
            'Skip reassessment once a label appears'
          ],
          correctIndex: 2,
          explain: 'Pattern + next action (recheck/report) beats single-number tunnel vision.'
        }
      ]
    },
    iv: {
      title: 'IV Flow Rate quiz',
      questions: [
        {
          prompt: '1000 mL over 8 hours, drop factor 15. Nearest whole gtt/min?',
          choices: ['21', '31', '42', '125'],
          correctIndex: 1,
          explain: '125 mL/hr; (125÷60)×15 ≈ 31 gtt/min.'
        },
        {
          prompt: 'What is mL/hr for 500 mL over 4 hours?',
          choices: ['75 mL/hr', '100 mL/hr', '125 mL/hr', '250 mL/hr'],
          correctIndex: 2,
          explain: '500 ÷ 4 = 125 mL/hr.'
        },
        {
          prompt: 'Microdrip tubing is commonly which drop factor?',
          choices: ['10 gtt/mL', '15 gtt/mL', '20 gtt/mL', '60 gtt/mL'],
          correctIndex: 3,
          explain: 'Microdrip is typically 60 gtt/mL, but always verify the package.'
        },
        {
          prompt: 'You calculated gtt/min perfectly but used DF 20 when the set says 15. What happened?',
          choices: [
            'Nothing, because drop factor is optional',
            'The drip will be wrong despite correct algebra',
            'Only mL/hr is affected',
            'Young’s Rule fixes it'
          ],
          correctIndex: 1,
          explain: 'Wrong drop factor → wrong gravity rate even if the formula steps look clean.'
        }
      ]
    },
    bmi: {
      title: 'BMI quiz',
      questions: [
        {
          prompt: '70 kg, 170 cm. WHO adult category?',
          choices: ['Underweight', 'Normal', 'Overweight', 'Obese'],
          correctIndex: 1,
          explain: 'BMI ≈ 24.2 → Normal (18.5–24.9).'
        },
        {
          prompt: 'BMI formula is:',
          choices: [
            'kg × m²',
            'kg ÷ m²',
            'lb ÷ inches',
            'kg ÷ cm'
          ],
          correctIndex: 1,
          explain: 'BMI = kg ÷ m² (convert cm → m first).'
        },
        {
          prompt: 'BMI 27 in an adult is classified as:',
          choices: ['Underweight', 'Normal', 'Overweight', 'Obese'],
          correctIndex: 2,
          explain: '25–29.9 = Overweight on standard WHO adult bands.'
        }
      ]
    },
    aog: {
      title: 'AOG and EDD quiz',
      questions: [
        {
          prompt: 'Naegele’s rule is best summarized as:',
          choices: [
            'LMP + 7 days − 3 months + 1 year',
            'LMP − 7 days + 3 months',
            'LMP + 9 months with no day change',
            'Quickening + 20 weeks'
          ],
          correctIndex: 0,
          explain: 'Classic Naegele: +7 days, −3 months, +1 year (≈ +280 days).'
        },
        {
          prompt: 'AOG means:',
          choices: [
            'Average obstetric glucose',
            'Age of gestation',
            'Active oxytocin group',
            'Annual obstetric goal'
          ],
          correctIndex: 1,
          explain: 'AOG = age of gestation.'
        },
        {
          prompt: 'If early ultrasound dating disagrees with LMP math, what should you do in documentation thinking?',
          choices: [
            'Always keep LMP silently',
            'Average the two dates',
            'Use the chart’s official dating source and state it',
            'Switch to Clark’s Rule'
          ],
          correctIndex: 2,
          explain: 'Ultrasound often overrides an uncertain LMP, so state which source you are using.'
        }
      ]
    },
    peds: {
      title: 'Pediatric Dosing quiz',
      questions: [
        {
          prompt: 'Age 3 years, adult dose 500 mg. Young’s Rule child dose?',
          choices: ['50 mg', '75 mg', '100 mg', '150 mg'],
          correctIndex: 2,
          explain: '[3÷(3+12)]×500 = 100 mg.'
        },
        {
          prompt: 'Which is the preferred clinical-style approach?',
          choices: [
            'Always Young’s Rule only',
            'mg/kg (+ monograph max) from the order',
            'Average Clark and Young',
            'Adult dose ÷ 2 for all children'
          ],
          correctIndex: 1,
          explain: 'Modern practice is weight-based mg/kg with safety caps from the reference.'
        },
        {
          prompt: 'Clark’s Rule uses weight in:',
          choices: ['Kilograms only', 'Pounds', 'Grams', 'Stone'],
          correctIndex: 1,
          explain: 'Clark’s = (lb ÷ 150) × adult dose. Convert kg→lb if needed (×2.2).'
        },
        {
          prompt: '10 kg child, adult dose 500 mg. Approximate Clark’s dose?',
          choices: ['33 mg', '73 mg', '100 mg', '250 mg'],
          correctIndex: 1,
          explain: '10 kg ≈ 22 lb; (22÷150)×500 ≈ 73 mg.'
        }
      ]
    },
    apgar: {
      title: 'APGAR quiz',
      questions: [
        {
          prompt: '1 minute: acrocyanosis, HR 90, grimace to suction, some flexion, weak cry. Total?',
          choices: ['4', '6', '8', '10'],
          correctIndex: 1,
          explain: '1+1+1+1+1 = 6.'
        },
        {
          prompt: 'APGAR “P” stands for:',
          choices: ['Perfusion', 'Pulse', 'Pinkness', 'Pain'],
          correctIndex: 1,
          explain: 'P = Pulse (heart rate).'
        },
        {
          prompt: 'Which statement is most accurate?',
          choices: [
            'APGAR replaces resuscitation priorities',
            'Only the total matters; components are optional',
            'Score at timed intervals and still prioritize ABCs',
            'APGAR is only done at discharge'
          ],
          correctIndex: 2,
          explain: 'Timed scores communicate transition; resuscitation priorities still lead.'
        }
      ]
    },
    gcs: {
      title: 'GCS quiz',
      questions: [
        {
          prompt: 'Eyes to speech, confused verbal, localizes pain. E+V+M?',
          choices: ['E3 V4 M5 = 12', 'E4 V5 M6 = 15', 'E2 V2 M4 = 8', 'E3 V5 M6 = 14'],
          correctIndex: 0,
          explain: 'E3 + V4 + M5 = 12. Report components.'
        },
        {
          prompt: 'Severe GCS teaching band is commonly:',
          choices: ['13–15', '9–12', '≤ 8', 'Exactly 10'],
          correctIndex: 2,
          explain: 'Severe is often taught as ≤ 8.'
        },
        {
          prompt: 'Best documentation habit?',
          choices: [
            'Write only “GCS 11”',
            'Write components (and note untestable parts)',
            'Skip motor if eyes are closed',
            'Invent a verbal score if intubated'
          ],
          correctIndex: 1,
          explain: 'Components (+ local convention for tube/edema) beat a naked total.'
        }
      ]
    },
    braden: {
      title: 'Braden quiz',
      questions: [
        {
          prompt: 'About Braden totals:',
          choices: [
            'Higher total = higher risk',
            'Lower total = higher risk',
            'Only nutrition matters',
            'It replaces skin assessment'
          ],
          correctIndex: 1,
          explain: 'Lower score → higher pressure-injury risk.'
        },
        {
          prompt: 'Friction & shear is important because:',
          choices: [
            'It measures fever',
            'Sliding/dragging forces contribute to skin injury risk',
            'It replaces mobility scoring',
            'It is scored 0–10'
          ],
          correctIndex: 1,
          explain: 'Friction/shear captures mechanical skin stress from sliding and dragging.'
        },
        {
          prompt: 'Best CI-style use of a low moisture subscale?',
          choices: [
            'Ignore it if total is “okay”',
            'Target moisture management in your prevention plan',
            'Only increase protein shakes',
            'Stop turning schedules'
          ],
          correctIndex: 1,
          explain: 'Use the lowest subscales to aim prevention, not only the total.'
        }
      ]
    },
    ron: {
      title: 'Rule of Nines quiz',
      questions: [
        {
          prompt: 'Adult: entire right arm + entire anterior trunk. TBSA?',
          choices: ['9%', '18%', '27%', '36%'],
          correctIndex: 2,
          explain: '9% + 18% = 27%.'
        },
        {
          prompt: 'Adult head & neck in Rule of Nines is:',
          choices: ['1%', '9%', '18%', '36%'],
          correctIndex: 1,
          explain: 'Head & neck = 9% on the adult map.'
        },
        {
          prompt: 'Why not use adult Rule of Nines blindly on a toddler?',
          choices: [
            'Toddlers cannot be burned',
            'Pediatric body proportions differ (e.g., larger head %)',
            'TBSA is never used in pediatrics',
            'Drop factor replaces TBSA'
          ],
          correctIndex: 1,
          explain: 'Children need pediatric burn charting, because their proportions are not adult nines.'
        }
      ]
    }
  };

  const STATS_KEY = 'np_quiz_stats_v2';

  function getQuiz(toolId) {
    return QUIZZES[toolId] || null;
  }

  function readStats() {
    try {
      const raw = global.localStorage && localStorage.getItem(STATS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeStats(all) {
    try {
      if (global.localStorage) localStorage.setItem(STATS_KEY, JSON.stringify(all || {}));
    } catch (e) { /* ignore */ }
  }

  function getToolStats(toolId) {
    const s = readStats()[toolId] || {};
    return {
      attempts: s.attempts || 0,
      bestScore: s.bestScore || 0,
      lastScore: s.lastScore || 0,
      lastTotal: s.lastTotal || 0,
      perfectRuns: s.perfectRuns || 0
    };
  }

  function recordQuizResult(toolId, score, total) {
    const all = readStats();
    const prev = all[toolId] || {};
    const next = {
      attempts: (prev.attempts || 0) + 1,
      bestScore: Math.max(prev.bestScore || 0, score),
      lastScore: score,
      lastTotal: total,
      perfectRuns: (prev.perfectRuns || 0) + (score === total ? 1 : 0)
    };
    all[toolId] = next;
    writeStats(all);
    return next;
  }

  // Back-compat alias used by older single-drill UI
  function getDrill(toolId) {
    const quiz = getQuiz(toolId);
    if (!quiz || !quiz.questions || !quiz.questions.length) return null;
    const q = quiz.questions[0];
    return {
      title: quiz.title,
      prompt: q.prompt,
      choices: q.choices,
      correctIndex: q.correctIndex,
      explain: q.explain
    };
  }

  global.NursePathStudyDrills = {
    QUIZZES,
    getQuiz,
    getDrill,
    getToolStats,
    recordQuizResult,
    STATS_KEY
  };
})(typeof window !== 'undefined' ? window : self);
