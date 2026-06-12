// Shared simulation logic for the NursePath vital signs workflow.

(function () {
const vitalSignsReference = {
    ageGroups: {
        infant: { name: 'Infant (0-1y)', range: [0, 1], pulse: { min: 100, max: 160 }, rr: { min: 30, max: 60 }, bpSys: { min: 70, max: 90 }, bpDia: { min: 45, max: 55 } },
        toddler: { name: 'Toddler (1-3y)', range: [1, 3], pulse: { min: 90, max: 150 }, rr: { min: 24, max: 40 }, bpSys: { min: 80, max: 100 }, bpDia: { min: 55, max: 65 } },
        preschool: { name: 'Preschool (3-6y)', range: [3, 6], pulse: { min: 80, max: 120 }, rr: { min: 22, max: 34 }, bpSys: { min: 85, max: 110 }, bpDia: { min: 60, max: 70 } },
        schoolAge: { name: 'School Age (6-12y)', range: [6, 12], pulse: { min: 70, max: 110 }, rr: { min: 18, max: 30 }, bpSys: { min: 90, max: 110 }, bpDia: { min: 60, max: 75 } },
        adolescent: { name: 'Adolescent (12-18y)', range: [12, 18], pulse: { min: 60, max: 100 }, rr: { min: 12, max: 20 }, bpSys: { min: 100, max: 130 }, bpDia: { min: 65, max: 85 } },
        adult: { name: 'Adult (18+y)', range: [18, 120], pulse: { min: 60, max: 100 }, rr: { min: 12, max: 20 }, bpSys: { min: 110, max: 120 }, bpDia: { min: 70, max: 80 } },
        elderly: { name: 'Elderly (65+y)', range: [65, 120], pulse: { min: 55, max: 100 }, rr: { min: 12, max: 22 }, bpSys: { min: 130, max: 150 }, bpDia: { min: 70, max: 90 } },
    },
    pregnancy: {
        notes: 'Pregnant women typically have 15-20% increased cardiac output and blood volume',
        pulseIncrease: 10,
        systolicIncrease: 0,
        diastolicDecrease: 5,
        respiratoryIncrease: 1,
        normalBP: { sys: [110, 135], dia: [70, 85] },
        gestationalHypertension: { sys: 140, dia: 90 },
        preeclampsia: { sys: 160, dia: 110 },
    },
    comorbidities: {
        hypertension: {
            name: 'Hypertension',
            systolicTarget: 140,
            diastolicTarget: 90,
            severity: 'ELEVATED',
            notes: 'Persistent elevation; aim for <130/80 if tolerated',
        },
        diabetes: {
            name: 'Diabetes',
            systolicTarget: 140,
            diastolicTarget: 90,
            fever: 'Monitor for DKA (fever + tachycardia + tachypnea)',
            notes: 'May have reduced fever response; check glucose',
        },
        asthma: {
            name: 'Asthma',
            rrAlert: 25,
            notes: 'Increased RR may indicate asthma exacerbation; listen for wheeze',
        },
        copd: {
            name: 'COPD',
            rrAlert: 25,
            notes: 'Chronic baseline elevation; major change concerning; watch for exacerbation',
        },
        ckd: {
            name: 'Chronic Kidney Disease',
            systolicTarget: 130,
            diastolicTarget: 80,
            notes: 'Stricter BP control needed; avoid NSAIDs; monitor fluid balance',
        },
    },
};

const diagnosisDatabase = {
    fever: { symptoms: 'High temperature (>38°C)', meds: ['Ref: Acetaminophen (500-1000mg)', 'Ref: Ibuprofen (200-400mg with food)'], actions: 'In simulation, monitor for dehydration signs, document fluid intake, consider cooling measures if >40°C. Verify protocol with CI.' },
    hypothermia: { symptoms: 'Low temperature (<35°C)', meds: ['Ref: Passive rewarming measures'], actions: 'Simulation note: Indicates critical hypothermia; follow institutional thermal regulation protocols. Priority: Faculty notification required.' },
    hypertensiveCrisis: { symptoms: 'BP ≥180/120', meds: ['No OTC intervention indicated'], actions: 'Simulation note: In a clinical setting, this represents a hypertensive emergency. Priority: Instructor notification required for simulation guidance.' },
    hypertension: { symptoms: 'BP 140-179 systolic or 90-119 diastolic', meds: ['Ref: Lifestyle modifications (sodium reduction, rest)'], actions: 'In simulation, recheck BP in 5-10 min. Document associated symptoms (headache, chest pain, SOB). Consult textbook for staging.' },
    tachycardia: { symptoms: 'Heart rate >100 BPM', meds: ['Ref: Non-pharmacological interventions (positioning, environment)'], actions: 'In simulation, assess for contributing factors (pain, anxiety, fever). Document rhythm characteristics.' },
    bradycardia: { symptoms: 'Heart rate <60 BPM (abnormal)', meds: ['Ref: Monitor and document'], actions: 'Academic note: May be physiologic in athletes. In simulation, document associated symptoms (dizziness, weakness).' },
    tachypnea: { symptoms: 'Respiratory rate >20/min', meds: ['Ref: Supplemental O2 if SpO2 <94%', 'Ref: Anxiety reduction techniques'], actions: 'In simulation, assess for underlying causes (anxiety, pain, infection). Document oxygen saturation if available.' },
    hypoxia: { symptoms: 'SpO2 <94% (if measured)', meds: ['Ref: Oxygen therapy per protocol'], actions: 'In simulation, elevate HOB, ensure airway patency. Document SpO2 trend. Consult CI for intervention guidance.' },
};

function getAgeGroup(age) {
    if (age < 1) return vitalSignsReference.ageGroups.infant;
    if (age < 3) return vitalSignsReference.ageGroups.toddler;
    if (age < 6) return vitalSignsReference.ageGroups.preschool;
    if (age < 12) return vitalSignsReference.ageGroups.schoolAge;
    if (age < 18) return vitalSignsReference.ageGroups.adolescent;
    if (age >= 65) return vitalSignsReference.ageGroups.elderly;
    return vitalSignsReference.ageGroups.adult;
}

function generateDiagnosis(sys, dia, temp, hr, rr, age, pregnancies, pregnant, conditions) {
    let diagnosis = [];
    let priority = 'STABLE';
    let color = 'text-slate-400';
    let recommendations = [];
    let contextNotes = [];

    const isPregnant = pregnant === 'yes';
    const ageGroup = getAgeGroup(age);
    const hasComorbidity = conditions !== 'none';
    const comorbidityData = hasComorbidity ? vitalSignsReference.comorbidities[conditions] : null;

    contextNotes.push(`Patient: ${ageGroup.name}${isPregnant ? ' | PREGNANT (' + pregnancies + ' previous)' : ''}`);
    if (hasComorbidity) contextNotes.push(`Known condition: ${comorbidityData.name}`);

    let hrTarget = { min: ageGroup.pulse.min, max: ageGroup.pulse.max };
    let rrTarget = { min: ageGroup.rr.min, max: ageGroup.rr.max };
    let bpSysTarget = { min: ageGroup.bpSys.min, max: ageGroup.bpSys.max };
    let bpDiaTarget = { min: ageGroup.bpDia.min, max: ageGroup.bpDia.max };

    if (isPregnant) {
        hrTarget.max += vitalSignsReference.pregnancy.pulseIncrease;
        bpSysTarget.min = vitalSignsReference.pregnancy.normalBP.sys[0];
        bpSysTarget.max = vitalSignsReference.pregnancy.normalBP.sys[1];
        bpDiaTarget.min = vitalSignsReference.pregnancy.normalBP.dia[0];
        bpDiaTarget.max = vitalSignsReference.pregnancy.normalBP.dia[1];
    }

    if (dia > 0 && dia < 40) {
        diagnosis.push({ name: 'SIM ALERT: Severe Low Diastolic (DBP <40)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: Diastolic <40 mmHg suggests severe hypoperfusion in simulation. Priority: Faculty/Instructor notification required for guidance.');
    } else if (dia > 0 && dia < 60) {
        diagnosis.push({ name: 'Low Diastolic Pressure (DBP <60)', severity: 'MONITOR', icon: 'fa-arrow-down' });
        if (priority === 'STABLE') priority = 'ELEVATED';
        contextNotes.push('Simulation Finding: Diastolic reading is below reference range. In a clinical setting, this suggests monitoring for orthostatic symptoms.');
    }

    if (sys > 0 && sys < 70) {
        diagnosis.push({ name: 'SIM ALERT: Severe Hypotension (SBP <70)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: SBP <70 mmHg represents severe hypotension in simulation. In a clinical setting, this indicates hemodynamic instability. Priority: Faculty notification required.');
    } else if (sys > 0 && sys < bpSysTarget.min) {
        diagnosis.push({ name: `SIM ALERT: Hypotension (Below ${ageGroup.name} Range)`, severity: 'CRITICAL', icon: 'fa-arrow-down' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push(`Simulation Finding: Systolic ${sys} is below reference for ${ageGroup.name} (normal: ${bpSysTarget.min}-${bpSysTarget.max}). Consult textbook for age-specific interventions.`);
    } else if (sys >= 180 || (dia && dia >= 120)) {
        diagnosis.push({ name: 'SIM ALERT: Hypertensive Crisis Pattern (SBP ≥180/DBP ≥120)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        recommendations.push(diagnosisDatabase.hypertensiveCrisis);
    } else if (isPregnant && sys >= vitalSignsReference.pregnancy.preeclampsia.sys) {
        diagnosis.push({ name: 'SIM ALERT: Preeclampsia Pattern (BP ≥160/110)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: In simulation, severely elevated BP in pregnancy suggests preeclampsia pattern. Assess for proteinuria, edema, headache. Priority: Instructor notification required.');
    } else if (isPregnant && sys >= vitalSignsReference.pregnancy.gestationalHypertension.sys) {
        diagnosis.push({ name: 'Gestational Hypertension Pattern (SBP ≥140/DBP ≥90)', severity: 'ELEVATED', icon: 'fa-arrow-up' });
        priority = 'ELEVATED';
        color = 'text-orange-500';
        contextNotes.push('Simulation Finding: In a clinical setting, this pattern requires monitoring for progression to preeclampsia.');
    } else if (sys >= 160 || (dia && dia >= 100)) {
        diagnosis.push({ name: 'Severe Hypertension Pattern (SBP 160-179 or DBP 100-109)', severity: 'ELEVATED', icon: 'fa-arrow-up' });
        priority = priority === 'CRITICAL' ? 'CRITICAL' : 'ELEVATED';
        color = 'text-orange-500';
        if (!isPregnant) recommendations.push(diagnosisDatabase.hypertension);
    } else if (sys >= 140 || (dia && dia >= 90)) {
        diagnosis.push({ name: 'Hypertension Pattern (SBP 140-159 or DBP 90-99)', severity: 'ELEVATED', icon: 'fa-arrow-up' });
        priority = priority === 'CRITICAL' ? 'CRITICAL' : 'ELEVATED';
        color = 'text-orange-500';
        if (!isPregnant) recommendations.push(diagnosisDatabase.hypertension);
    } else if (sys >= bpSysTarget.max) {
        diagnosis.push({ name: `Mildly Elevated BP (Above ${ageGroup.name} Reference)`, severity: 'MONITOR', icon: 'fa-arrow-up-long' });
        contextNotes.push(`Simulation Finding: Systolic ${sys} is slightly above reference for ${ageGroup.name} (normal: ${bpSysTarget.min}-${bpSysTarget.max}).`);
    }

    if (temp > 0) {
        if (temp <= 28) {
            diagnosis.push({ name: 'SIM ALERT: Severe Hypothermia (≤28°C)', severity: 'CRITICAL', icon: 'fa-snowflake' });
            priority = 'CRITICAL';
            color = 'text-blue-500';
            contextNotes.push('Simulation Note: Temperature ≤28°C indicates critical hypothermia pattern. In simulation, this requires immediate faculty-led intervention per institutional thermal regulation protocols.');
        } else if (temp <= 35.0) {
            diagnosis.push({ name: 'SIM ALERT: Hypothermia (28-35°C)', severity: 'CRITICAL', icon: 'fa-snowflake' });
            priority = 'CRITICAL';
            color = 'text-blue-400';
            recommendations.push(diagnosisDatabase.hypothermia);
        } else if (temp >= 40.5) {
            diagnosis.push({ name: 'SIM ALERT: Severe Hyperthermia (≥40.5°C)', severity: 'CRITICAL', icon: 'fa-fire' });
            priority = 'CRITICAL';
            color = 'text-red-500';
            contextNotes.push('Simulation Note: Temperature ≥40.5°C suggests heat stroke pattern. In a clinical setting, this requires immediate cooling interventions. Priority: Instructor notification required.');
        } else if (temp >= 40.0) {
            diagnosis.push({ name: 'SIM ALERT: Very High Fever (40.0-40.4°C)', severity: 'CRITICAL', icon: 'fa-fire' });
            priority = 'CRITICAL';
            color = 'text-red-500';
            recommendations.push(diagnosisDatabase.fever);
        } else {
            let feverThreshold = 38.0;
            if (age < 3) feverThreshold = 38.5;
            if (age >= 65) feverThreshold = 37.5;

            if (temp >= 39.5) {
                diagnosis.push({ name: 'High Fever Pattern (39.5-39.9°C)', severity: 'CRITICAL', icon: 'fa-fire' });
                color = 'text-red-500';
                recommendations.push(diagnosisDatabase.fever);
                if (conditions === 'diabetes') contextNotes.push('Academic Note: Diabetic patient with fever pattern - in simulation, monitor for DKA signs and infection indicators.');
            } else if (temp >= 38.5) {
                diagnosis.push({ name: 'Moderate Fever Pattern (38.5-39.4°C)', severity: 'MONITOR', icon: 'fa-fire' });
                color = 'text-orange-500';
                recommendations.push(diagnosisDatabase.fever);
            } else if (temp >= feverThreshold) {
                diagnosis.push({ name: `Mild Fever Pattern (${feverThreshold}-38.4°C)`, severity: 'MONITOR', icon: 'fa-thermometer' });
                recommendations.push(diagnosisDatabase.fever);
            }
        }
    }

    if (hr > 0 && hr < 30) {
        diagnosis.push({ name: 'SIM ALERT: Severe Bradycardia (HR <30)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: HR <30 indicates severe bradycardia pattern. In simulation, assess consciousness & pulse quality. Priority: Faculty notification required.');
    } else if (hr > 200) {
        diagnosis.push({ name: 'SIM ALERT: Severe Tachycardia (HR >200)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: HR >200 indicates severe tachycardia pattern. In a clinical setting, this suggests arrhythmia, sepsis, or shock. Priority: Instructor notification required.');
    } else if (hr > 0 && hr < hrTarget.min) {
        diagnosis.push({ name: `Bradycardia Pattern (Below ${ageGroup.name} Reference: HR ${hr})`, severity: 'MONITOR', icon: 'fa-heart' });
        contextNotes.push(`Simulation Finding: HR ${hr} is below reference for ${ageGroup.name} (normal: ${hrTarget.min}-${hrTarget.max}). Consult textbook for assessment criteria.`);
        recommendations.push(diagnosisDatabase.bradycardia);
    } else if (hr > hrTarget.max && hr <= hrTarget.max + 20) {
        let note = `Mild Tachycardia Pattern (HR ${hr})`;
        if (isPregnant) note += ' (within pregnancy range)';
        if (temp >= 38.0) note += ' (fever-related)';
        diagnosis.push({ name: note, severity: 'MONITOR', icon: 'fa-heart' });
        contextNotes.push(`Simulation Finding: HR ${hr} is slightly above reference for ${ageGroup.name} (normal: ${hrTarget.min}-${hrTarget.max}).`);
    } else if (hr > hrTarget.max + 20 && hr <= hrTarget.max + 40) {
        let note = `Tachycardia Pattern (HR ${hr})`;
        if (temp >= 38.0) note += ' (fever-related)';
        diagnosis.push({ name: note, severity: 'MONITOR', icon: 'fa-heart' });
        contextNotes.push(`Simulation Finding: HR ${hr} exceeds reference for ${ageGroup.name} (normal: ${hrTarget.min}-${hrTarget.max}).`);
        recommendations.push(diagnosisDatabase.tachycardia);
    } else if (hr > hrTarget.max + 40) {
        diagnosis.push({ name: `SIM ALERT: Severe Tachycardia (HR ${hr})`, severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = priority === 'STABLE' ? 'CRITICAL' : priority;
        color = 'text-red-500';
        contextNotes.push(`Ref Note: HR ${hr} is significantly elevated. In a clinical setting, this suggests shock, sepsis, or severe underlying condition.`);
    }

    if (rr > 0 && rr < 8) {
        diagnosis.push({ name: 'SIM ALERT: Severe Respiratory Depression (RR <8)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Simulation Note: RR <8 indicates severe respiratory depression pattern. In simulation, this represents respiratory failure risk requiring immediate faculty-led intervention.');
    } else if (rr > 50) {
        diagnosis.push({ name: 'SIM ALERT: Severe Tachypnea (RR >50)', severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = 'CRITICAL';
        color = 'text-red-500';
        contextNotes.push('Ref Note: RR >50 indicates severe respiratory distress pattern. Priority: Faculty/Instructor notification required for simulation guidance.');
    } else if (rr > 0 && rr < rrTarget.min) {
        diagnosis.push({ name: `Bradypnea Pattern (Below ${ageGroup.name} Reference: RR ${rr})`, severity: 'MONITOR', icon: 'fa-wind' });
        contextNotes.push(`Simulation Finding: RR ${rr} is below reference for ${ageGroup.name} (normal: ${rrTarget.min}-${rrTarget.max}).`);
    } else if (rr > rrTarget.max && rr <= rrTarget.max + 5) {
        let note = `Mild Tachypnea Pattern (RR ${rr})`;
        if (conditions === 'asthma' || conditions === 'copd') note += ' (monitor for exacerbation)';
        diagnosis.push({ name: note, severity: 'MONITOR', icon: 'fa-wind' });
        contextNotes.push(`Simulation Finding: RR ${rr} is slightly above reference for ${ageGroup.name} (normal: ${rrTarget.min}-${rrTarget.max}).`);
    } else if (rr > rrTarget.max + 5 && rr <= rrTarget.max + 15) {
        let note = `Tachypnea Pattern (RR ${rr})`;
        if (conditions === 'asthma' || conditions === 'copd') note += ' (exacerbation indicator)';
        diagnosis.push({ name: note, severity: 'MONITOR', icon: 'fa-wind' });
        contextNotes.push(`Simulation Finding: RR ${rr} exceeds reference for ${ageGroup.name} (normal: ${rrTarget.min}-${rrTarget.max}).`);
        recommendations.push(diagnosisDatabase.tachypnea);
    } else if (rr > rrTarget.max + 15) {
        let note = `SIM ALERT: Severe Tachypnea (RR ${rr})`;
        if (conditions === 'asthma' || conditions === 'copd') note += ' (EXACERBATION PATTERN)';
        diagnosis.push({ name: note, severity: 'CRITICAL', icon: 'fa-exclamation-triangle' });
        priority = priority === 'STABLE' ? 'CRITICAL' : priority;
        color = 'text-red-500';
        contextNotes.push(`Ref Note: RR ${rr} is significantly elevated. In a clinical setting, this suggests respiratory distress or hypoxia.`);
    }

    if (hasComorbidity) {
        if (conditions === 'ckd' && sys > vitalSignsReference.comorbidities.ckd.systolicTarget) {
            contextNotes.push('Academic Note: CKD patient - in simulation, strict BP control is emphasized. Current reading exceeds textbook target. Ref: Avoid NSAIDs in CKD.');
        }
        if (conditions === 'asthma' && rr > 25) {
            contextNotes.push('Academic Note: Asthma patient with elevated RR - in simulation, auscultate for wheeze. This pattern may indicate exacerbation.');
        }
        if (conditions === 'copd' && rr > 25) {
            contextNotes.push('Academic Note: COPD patient - RR elevated. In simulation, compare to patient\'s baseline. Consider COPD exacerbation pattern.');
        }
    }

    return { diagnosis, priority, color, recommendations, contextNotes };
}

window.NursePathClinical = window.NursePathClinical || {};
window.NursePathClinical.vitalSignsReference = vitalSignsReference;
window.NursePathClinical.diagnosisDatabase = diagnosisDatabase;
window.NursePathClinical.getAgeGroup = getAgeGroup;
window.NursePathClinical.generateDiagnosis = generateDiagnosis;
})();
