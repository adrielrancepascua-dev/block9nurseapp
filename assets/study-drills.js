/**
 * Offline micro-drills for NursePath Study mode (educational / simulation only).
 * Exposed on window.NursePathStudyDrills
 */
(function (global) {
  'use strict';

  const DRILLS = {
    vitals: {
      title: 'Vital Signs — Case',
      prompt: 'Adult, not pregnant, no known comorbidity. BP 88/54, HR 128, RR 28, Temp 36.8°C. Which priority pattern fits best in simulation language?',
      choices: [
        'Reassuring — all values within typical adult resting ranges',
        'Concerning hypoperfusion / shock-pattern vitals — escalate thinking',
        'Isolated fever pattern — focus only on temperature',
        'Hypertensive urgency pattern — focus only on BP'
      ],
      correctIndex: 1,
      explain: 'Low BP + tachycardia + tachypnea suggests a shock / hypoperfusion pattern in sim. Temp is not driving this picture.'
    },
    iv: {
      title: 'IV Flow Rate — Case',
      prompt: 'Order: 1000 mL over 8 hours. Tubing drop factor = 15 gtt/mL. What is the nearest whole gtt/min?',
      choices: ['21 gtt/min', '31 gtt/min', '42 gtt/min', '125 gtt/min'],
      correctIndex: 1,
      explain: 'mL/hr = 1000 ÷ 8 = 125. gtt/min = (125 ÷ 60) × 15 ≈ 31.25 → 31 gtt/min.'
    },
    bmi: {
      title: 'BMI — Case',
      prompt: 'Weight 70 kg, height 170 cm. Which WHO adult category is correct?',
      choices: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      correctIndex: 1,
      explain: 'Height = 1.70 m. BMI = 70 ÷ (1.70²) = 70 ÷ 2.89 ≈ 24.2 → Normal (18.5–24.9).'
    },
    aog: {
      title: 'AOG & EDD — Case',
      prompt: 'Using Naegele’s teaching shortcut, EDD is closest to which idea?',
      choices: [
        'LMP + 7 days − 3 months + 1 year (≈ LMP + 280 days)',
        'LMP + 9 calendar months exactly, no day adjustment',
        'LMP − 7 days + 3 months',
        'Quickening date + 20 weeks'
      ],
      correctIndex: 0,
      explain: 'Classic Naegele: LMP + 7 days − 3 months + 1 year (assumes ~28-day cycles). Ultrasound dating can override.'
    },
    peds: {
      title: 'Pediatric Dosing — Case',
      prompt: 'Child is 3 years old. Adult dose = 500 mg. Using Young’s Rule, what is the child dose?',
      choices: ['50 mg', '75 mg', '100 mg', '150 mg'],
      correctIndex: 2,
      explain: 'Young’s = [age ÷ (age + 12)] × adult = [3 ÷ 15] × 500 = 100 mg. Prefer mg/kg + monograph limits in real practice.'
    },
    apgar: {
      title: 'APGAR — Case',
      prompt: 'At 1 minute: blue extremities only, HR 90, grimaces to suction, some flexion, weak/irregular cry. Best total?',
      choices: ['4', '6', '8', '10'],
      correctIndex: 1,
      explain: 'A1 (acrocyanosis) + P1 (HR <100) + G1 (grimace) + A1 (some flexion) + R1 (weak cry) = 6.'
    },
    gcs: {
      title: 'GCS — Case',
      prompt: 'Eyes open to speech, confused conversation, localizes pain. What is E+V+M?',
      choices: ['E3 V4 M5 = 12', 'E4 V5 M6 = 15', 'E2 V2 M4 = 8', 'E3 V5 M6 = 14'],
      correctIndex: 0,
      explain: 'E3 (to speech) + V4 (confused) + M5 (localizes) = 12. Always report components, not only the total.'
    },
    braden: {
      title: 'Braden — Case',
      prompt: 'Which statement about Braden totals is correct for teaching?',
      choices: [
        'Higher total = higher pressure-injury risk',
        'Lower total = higher pressure-injury risk',
        'Only the Mobility subscale matters',
        'Braden replaces skin assessment'
      ],
      correctIndex: 1,
      explain: 'Braden ranges 6–23. Lower scores mean higher risk. It guides prevention thinking — it does not replace assessment.'
    },
    ron: {
      title: 'Rule of Nines — Case',
      prompt: 'Adult burn: entire right arm + entire anterior trunk. Approximate TBSA?',
      choices: ['9%', '18%', '27%', '36%'],
      correctIndex: 2,
      explain: 'Arm = 9%, anterior trunk = 18% → 27% TBSA (adult teaching map). Pediatric proportions differ.'
    }
  };

  const STATS_KEY = 'np_drill_stats_v1';

  function getDrill(toolId) {
    return DRILLS[toolId] || null;
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
    } catch (e) { /* ignore quota / private mode */ }
  }

  function getToolStats(toolId) {
    const all = readStats();
    const s = all[toolId] || {};
    return {
      attempts: s.attempts || 0,
      correct: s.correct || 0,
      streak: s.streak || 0,
      bestStreak: s.bestStreak || 0,
      lastCorrect: !!s.lastCorrect
    };
  }

  function recordAttempt(toolId, isCorrect) {
    const all = readStats();
    const prev = all[toolId] || {};
    const streak = isCorrect ? (prev.streak || 0) + 1 : 0;
    const next = {
      attempts: (prev.attempts || 0) + 1,
      correct: (prev.correct || 0) + (isCorrect ? 1 : 0),
      streak: streak,
      bestStreak: Math.max(prev.bestStreak || 0, streak),
      lastCorrect: !!isCorrect
    };
    all[toolId] = next;
    writeStats(all);
    return next;
  }

  global.NursePathStudyDrills = {
    DRILLS,
    getDrill,
    getToolStats,
    recordAttempt,
    STATS_KEY
  };
})(typeof window !== 'undefined' ? window : self);
