/**
 * NursePath clinical calculator helpers. Educational reference only.
 * Exposed on window.NursePathCalculators for offline use.
 */
(function (global) {
  'use strict';

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  /** Pediatric dosing: mg/kg plus Clark's and Young's rules for board-exam reference. */
  function pediatricDose(opts) {
    const weightKg = Number(opts.weightKg);
    const mgPerKg = Number(opts.mgPerKg);
    const adultDoseMg = Number(opts.adultDoseMg);
    const ageYears = Number(opts.ageYears);
    const maxDoseMg = opts.maxDoseMg != null ? Number(opts.maxDoseMg) : null;

    const result = {
      weightBasedMg: null,
      clarksMg: null,
      youngsMg: null,
      notes: []
    };

    if (Number.isFinite(weightKg) && weightKg > 0 && Number.isFinite(mgPerKg) && mgPerKg > 0) {
      let dose = weightKg * mgPerKg;
      if (Number.isFinite(maxDoseMg) && maxDoseMg > 0) {
        dose = Math.min(dose, maxDoseMg);
        result.notes.push('Capped at maximum single dose when provided.');
      }
      result.weightBasedMg = Math.round(dose * 10) / 10;
    }

    if (Number.isFinite(weightKg) && weightKg > 0 && Number.isFinite(adultDoseMg) && adultDoseMg > 0) {
      // Clark's Rule: (weight_lb / 150) × adult dose. Convert kg → lb.
      const weightLb = weightKg * 2.2;
      result.clarksMg = Math.round(((weightLb / 150) * adultDoseMg) * 10) / 10;
      result.notes.push("Clark's Rule uses weight in pounds ÷ 150 × adult dose.");
    }

    if (Number.isFinite(ageYears) && ageYears > 0 && Number.isFinite(adultDoseMg) && adultDoseMg > 0) {
      // Young's Rule: [age / (age + 12)] × adult dose
      result.youngsMg = Math.round(((ageYears / (ageYears + 12)) * adultDoseMg) * 10) / 10;
      result.notes.push("Young's Rule: age ÷ (age + 12) × adult dose.");
    }

    result.notes.push('Educational reference only. Verify with CI, protocol, and product monograph.');
    return result;
  }

  /** APGAR: Appearance, Pulse, Grimace, Activity, Respiration, each scored 0 to 2. */
  function apgarScore(scores) {
    const keys = ['appearance', 'pulse', 'grimace', 'activity', 'respiration'];
    let total = 0;
    const detail = {};
    keys.forEach((k) => {
      const v = clamp(Number(scores[k]) || 0, 0, 2);
      detail[k] = v;
      total += v;
    });
    let interpretation = 'Severely depressed. Resuscitation priorities lead.';
    if (total >= 7) interpretation = 'Reassuring. Continue routine observation.';
    else if (total >= 4) interpretation = 'Moderately depressed. Stimulation and airway support are indicated.';
    return { total, detail, interpretation };
  }

  /** Soft nursing-attention cue for GCS bands (watch/report/trend — not orders). */
  function gcsAttention(total) {
    if (total >= 13) {
      return 'Report E/V/M and trend serial scores. GCS is not a full neuro exam: pupils, glucose, and focal signs still matter.';
    }
    if (total >= 9) {
      return 'Document E/V/M, trend closely, and escalate a falling score to your instructor or team. Reassess rather than trusting one snapshot.';
    }
    return 'Severe band: report components now and escalate per unit pathway. Think airway protection and frequent reassessment; confirm next steps with your Clinical Instructor.';
  }

  /** Glasgow Coma Scale: Eye 1–4, Verbal 1–5, Motor 1–6. */
  function gcsScore(eye, verbal, motor) {
    const e = clamp(Number(eye) || 1, 1, 4);
    const v = clamp(Number(verbal) || 1, 1, 5);
    const m = clamp(Number(motor) || 1, 1, 6);
    const total = e + v + m;
    let severity = 'Severe (≤8)';
    if (total >= 13) severity = 'Mild (13–15)';
    else if (total >= 9) severity = 'Moderate (9–12)';
    return { eye: e, verbal: v, motor: m, total, severity, attention: gcsAttention(total) };
  }

  const BRADEN_SUBSCALE_LABELS = {
    sensory: 'sensory perception',
    moisture: 'moisture',
    activity: 'activity',
    mobility: 'mobility',
    nutrition: 'nutrition',
    friction: 'friction/shear'
  };

  const BRADEN_SUBSCALE_FOCUS = {
    sensory: 'Protect pressure areas the patient cannot report well, and keep skin checks thorough.',
    moisture: 'Aim prevention at dryness, incontinence care, and timely linen changes.',
    activity: 'Think offloading for chair or bed time, and safe progressive mobility when allowed.',
    mobility: 'Prioritize repositioning rhythm and support surfaces in your prevention thinking.',
    nutrition: 'Flag intake and nutrition support as part of risk discussion with the team.',
    friction: 'Watch shear during transfers, boosts, and linen handling.'
  };

  /** Soft nursing-attention cue for Braden risk + weakest subscales. */
  function bradenAttention(total, detail) {
    const entries = Object.keys(BRADEN_SUBSCALE_LABELS).map((k) => ({ key: k, value: detail[k] }));
    const minVal = Math.min(...entries.map((e) => e.value));
    const weakest = entries.filter((e) => e.value === minVal);
    const weakLabels = weakest.map((e) => BRADEN_SUBSCALE_LABELS[e.key]).join(', ');
    const focusKey = weakest[0] && weakest[0].key;
    const focus = (focusKey && BRADEN_SUBSCALE_FOCUS[focusKey]) || 'Use the lowest subscales to aim prevention.';

    let bandCue = 'Very high risk: prioritize prevention thinking and escalate skin concerns early with your instructor or team.';
    if (total >= 19) {
      bandCue = 'Low total risk still needs routine skin assessment. Reassess when mobility, moisture, or intake changes.';
    } else if (total >= 15) {
      bandCue = 'Mild risk: start prevention thinking early rather than waiting for skin breakdown.';
    } else if (total >= 13) {
      bandCue = 'Moderate risk: keep prevention active and reassess on your unit schedule.';
    } else if (total >= 10) {
      bandCue = 'High risk: strengthen prevention focus and report skin changes promptly.';
    }

    return `${bandCue} Weakest: ${weakLabels}. ${focus}`;
  }

  /** Braden Scale: 6 subscales totalling 6 to 23. A lower total means higher risk. */
  function bradenScore(subscores) {
    const keys = [
      'sensory',
      'moisture',
      'activity',
      'mobility',
      'nutrition',
      'friction'
    ];
    const ranges = {
      sensory: [1, 4],
      moisture: [1, 4],
      activity: [1, 4],
      mobility: [1, 4],
      nutrition: [1, 4],
      friction: [1, 3]
    };
    let total = 0;
    const detail = {};
    keys.forEach((k) => {
      const [min, max] = ranges[k];
      const v = clamp(Number(subscores[k]) || min, min, max);
      detail[k] = v;
      total += v;
    });
    let risk = 'Very High Risk (≤9)';
    if (total >= 19) risk = 'No / Low Risk (19–23)';
    else if (total >= 15) risk = 'Mild Risk (15–18)';
    else if (total >= 13) risk = 'Moderate Risk (13–14)';
    else if (total >= 10) risk = 'High Risk (10–12)';
    return { total, detail, risk, attention: bradenAttention(total, detail) };
  }

  /**
   * Rule of Nines TBSA (%). Adult proportions.
   * Regions use fraction of the classic nine (e.g. half of an arm = 4.5).
   */
  const RULE_OF_NINES_REGIONS = [
    { id: 'head', label: 'Head & Neck', full: 9 },
    { id: 'chest', label: 'Anterior Trunk', full: 18 },
    { id: 'back', label: 'Posterior Trunk', full: 18 },
    { id: 'arm_l', label: 'Left Arm', full: 9 },
    { id: 'arm_r', label: 'Right Arm', full: 9 },
    { id: 'leg_l', label: 'Left Leg', full: 18 },
    { id: 'leg_r', label: 'Right Leg', full: 18 },
    { id: 'perineum', label: 'Perineum / Genitalia', full: 1 }
  ];

  function ruleOfNines(selectedFractions) {
    let tbsa = 0;
    const breakdown = [];
    RULE_OF_NINES_REGIONS.forEach((region) => {
      const frac = clamp(Number(selectedFractions[region.id]) || 0, 0, 1);
      const pct = Math.round(region.full * frac * 10) / 10;
      if (pct > 0) {
        breakdown.push({ id: region.id, label: region.label, percent: pct });
      }
      tbsa += pct;
    });
    tbsa = Math.round(tbsa * 10) / 10;
    let note = 'Minor burn territory in many teaching frameworks (<10% adult)';
    if (tbsa >= 25) note = 'Major burn territory for an adult, at 25% or more.';
    else if (tbsa >= 10) note = 'Moderate burn territory for an adult, at 10 to 24%.';
    return { tbsa, breakdown, note, regions: RULE_OF_NINES_REGIONS };
  }

  /** Levenshtein distance for OTC fuzzy fallback. */
  function levenshtein(a, b) {
    const s = String(a || '');
    const t = String(b || '');
    if (s === t) return 0;
    if (!s.length) return t.length;
    if (!t.length) return s.length;
    const prev = new Array(t.length + 1);
    const curr = new Array(t.length + 1);
    for (let j = 0; j <= t.length; j++) prev[j] = j;
    for (let i = 1; i <= s.length; i++) {
      curr[0] = i;
      for (let j = 1; j <= t.length; j++) {
        const cost = s.charCodeAt(i - 1) === t.charCodeAt(j - 1) ? 0 : 1;
        curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      }
      for (let j = 0; j <= t.length; j++) prev[j] = curr[j];
    }
    return prev[t.length];
  }

  function fuzzyDrugFallback(query, database, maxDist) {
    const q = String(query || '').toLowerCase().trim();
    const limit = maxDist == null ? 2 : maxDist;
    if (!q || !Array.isArray(database)) return [];
    return database
      .map((item) => {
        const name = String(item.name || '').toLowerCase();
        const brands = (item.ph_brands || []).map((b) => String(b).toLowerCase());
        let dist = levenshtein(q, name);
        brands.forEach((b) => {
          dist = Math.min(dist, levenshtein(q, b));
        });
        return { item, dist };
      })
      .filter((r) => r.dist <= limit)
      .sort((a, b) => a.dist - b.dist)
      .map((r) => r.item);
  }

  global.NursePathCalculators = {
    pediatricDose,
    apgarScore,
    gcsScore,
    bradenScore,
    ruleOfNines,
    RULE_OF_NINES_REGIONS,
    levenshtein,
    fuzzyDrugFallback
  };
})(typeof window !== 'undefined' ? window : self);
