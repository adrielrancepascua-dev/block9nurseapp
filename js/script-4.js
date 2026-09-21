        // ============= VITAL SIGNS REFERENCE DATABASE =============
        const vitalSignsReference = {
            ageGroups: {
                infant: { name: "Infant (0-1y)", range: [0, 1], pulse: { min: 100, max: 160 }, rr: { min: 30, max: 60 }, bpSys: { min: 70, max: 90 }, bpDia: { min: 45, max: 55 } },
                toddler: { name: "Toddler (1-3y)", range: [1, 3], pulse: { min: 90, max: 150 }, rr: { min: 24, max: 40 }, bpSys: { min: 80, max: 100 }, bpDia: { min: 55, max: 65 } },
                preschool: { name: "Preschool (3-6y)", range: [3, 6], pulse: { min: 80, max: 120 }, rr: { min: 22, max: 34 }, bpSys: { min: 85, max: 110 }, bpDia: { min: 60, max: 70 } },
                schoolAge: { name: "School Age (6-12y)", range: [6, 12], pulse: { min: 70, max: 110 }, rr: { min: 18, max: 30 }, bpSys: { min: 90, max: 110 }, bpDia: { min: 60, max: 75 } },
                adolescent: { name: "Adolescent (12-18y)", range: [12, 18], pulse: { min: 60, max: 100 }, rr: { min: 12, max: 20 }, bpSys: { min: 100, max: 130 }, bpDia: { min: 65, max: 85 } },
                adult: { name: "Adult (18+y)", range: [18, 120], pulse: { min: 60, max: 100 }, rr: { min: 12, max: 20 }, bpSys: { min: 110, max: 120 }, bpDia: { min: 70, max: 80 } },
                elderly: { name: "Elderly (65+y)", range: [65, 120], pulse: { min: 55, max: 100 }, rr: { min: 12, max: 22 }, bpSys: { min: 130, max: 150 }, bpDia: { min: 70, max: 90 } }
            },
            pregnancy: {
                notes: "Pregnant women typically have 15-20% increased cardiac output and blood volume",
                pulseIncrease: 10, // BPM increase during pregnancy
                systolicIncrease: 0, // Usually stays same or slightly lower
                diastolicDecrease: 5, // Often drops slightly
                respiratoryIncrease: 1, // Slight increase
                normalBP: { sys: [110, 135], dia: [70, 85] },
                gestationalHypertension: { sys: 140, dia: 90 }, // ≥140/90
                preeclampsia: { sys: 160, dia: 110 } // ≥160/110
            },
            comorbidities: {
                hypertension: {
                    name: "Hypertension",
                    systolicTarget: 140,
                    diastolicTarget: 90,
                    severity: "ELEVATED",
                    notes: "Persistent elevation; aim for <130/80 if tolerated"
                },
                diabetes: {
                    name: "Diabetes",
                    systolicTarget: 140,
                    diastolicTarget: 90,
                    fever: "Monitor for DKA (fever + tachycardia + tachypnea)",
                    notes: "May have reduced fever response; check glucose"
                },
                asthma: {
                    name: "Asthma",
                    rrAlert: 25,
                    notes: "Increased RR may indicate asthma exacerbation; listen for wheeze"
                },
                copd: {
                    name: "COPD",
                    rrAlert: 25,
                    notes: "Chronic baseline elevation; major change concerning; watch for exacerbation"
                },
                ckd: {
                    name: "Chronic Kidney Disease",
                    systolicTarget: 130,
                    diastolicTarget: 80,
                    notes: "Stricter BP control needed; avoid NSAIDs; monitor fluid balance"
                }
            }
        };

        // ============= REFERENCE PATTERN DATABASE =============
        const diagnosisDatabase = {
            fever: { symptoms: "High temperature (>38°C)", meds: ["Ref: Acetaminophen (500-1000mg)", "Ref: Ibuprofen (200-400mg with food)"], actions: "Monitor for dehydration signs, document fluid intake, and note cooling measures if above 40°C." },
            hypothermia: { symptoms: "Low temperature (<35°C)", meds: ["Ref: Passive rewarming measures"], actions: "Critical hypothermia pattern. Follow your institution's thermal regulation protocol and report immediately." },
            hypertensiveCrisis: { symptoms: "BP ≥180/120", meds: ["No OTC intervention indicated"], actions: "This pattern is described as a hypertensive emergency. Report immediately." },
            hypertension: { symptoms: "BP 140-179 systolic or 90-119 diastolic", meds: ["Ref: Lifestyle modifications (sodium reduction, rest)"], actions: "Recheck BP in 5 to 10 minutes and document associated symptoms such as headache, chest pain, or shortness of breath." },
            tachycardia: { symptoms: "Heart rate >100 BPM", meds: ["Ref: Non-pharmacological interventions (positioning, environment)"], actions: "Assess for contributing factors such as pain, anxiety, or fever, and document rhythm characteristics." },
            bradycardia: { symptoms: "Heart rate <60 BPM (abnormal)", meds: ["Ref: Monitor and document"], actions: "May be physiologic in athletes. Document associated symptoms such as dizziness or weakness." },
            tachypnea: { symptoms: "Respiratory rate >20/min", meds: ["Ref: Supplemental O2 if SpO2 <94%", "Ref: Anxiety reduction techniques"], actions: "Assess for underlying causes such as anxiety, pain, or infection, and document oxygen saturation if available." },
            hypoxia: { symptoms: "SpO2 <94% (if measured)", meds: ["Ref: Oxygen therapy per protocol"], actions: "Note head-of-bed position and airway patency, and document the SpO2 trend." }
        };

        function trackUsageSafe(feature, action, meta = {}, options = {}) {
            // OPTIMIZATION: Safe fallback in case trackUsageEvent is undefined
            if (typeof window.trackUsageEvent === 'function') {
                window.trackUsageEvent(feature, action, meta, options);
            }
        }

        function requestTelemetryFlush() {
            if (navigator.onLine && typeof window.flushUsageEvents === 'function') {
                void window.flushUsageEvents();
            }
        }

        // Helper: Get age group from age
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
            let priority = "STABLE";
            let color = "text-slate-400";
            let recommendations = [];
            let contextNotes = [];

            // ===== PATIENT PROFILE SETUP =====
            const isPregnant = pregnant === 'yes';
            const ageGroup = getAgeGroup(age);
            const hasComorbidity = conditions !== 'none';
            const comorbidityData = hasComorbidity ? vitalSignsReference.comorbidities[conditions] : null;

            // Add patient context
            contextNotes.push(`📋 Patient: ${ageGroup.name}${isPregnant ? ' | PREGNANT (' + pregnancies + ' previous)' : ''}`);
            if (hasComorbidity) contextNotes.push(`⚠️ Known condition: ${comorbidityData.name}`);

            // Adjust vital sign targets based on pregnancy
            let hrTarget = { min: ageGroup.pulse.min, max: ageGroup.pulse.max };
            let rrTarget = { min: ageGroup.rr.min, max: ageGroup.rr.max };
            let bpSysTarget = { min: ageGroup.bpSys.min, max: ageGroup.bpSys.max };
            let bpDiaTarget = { min: ageGroup.bpDia.min, max: ageGroup.bpDia.max };

            if (isPregnant) {
                hrTarget.max += vitalSignsReference.pregnancy.pulseIncrease; // Allow +10 BPM
                bpSysTarget.min = vitalSignsReference.pregnancy.normalBP.sys[0];
                bpSysTarget.max = vitalSignsReference.pregnancy.normalBP.sys[1];
                bpDiaTarget.min = vitalSignsReference.pregnancy.normalBP.dia[0];
                bpDiaTarget.max = vitalSignsReference.pregnancy.normalBP.dia[1];
            }

            // ===== BP ASSESSMENT =====
            // Check for critically low diastolic first
            if (dia > 0 && dia < 40) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Low Diastolic (DBP <40)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("Diastolic below 40 mmHg suggests severe hypoperfusion. Report promptly.");
            } else if (dia > 0 && dia < 60) {
                diagnosis.push({ name: "Low Diastolic Pressure (DBP <60)", severity: "MONITOR", icon: "fa-arrow-down" });
                if (priority === "STABLE") priority = "ELEVATED";
                contextNotes.push(`Diastolic ${dia} mmHg is below the reference range, which is associated with orthostatic symptoms.`);
            }
            
            // Systolic checks
            if (sys > 0 && sys < 70) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Hypotension (SBP <70)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("Systolic below 70 mmHg represents severe hypotension and indicates hemodynamic instability. Report immediately.");
            } else if (sys > 0 && sys < bpSysTarget.min) {
                diagnosis.push({ name: `⚠️ SIM ALERT: Hypotension (Below ${ageGroup.name} Range)`, severity: "CRITICAL", icon: "fa-arrow-down" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push(`Systolic ${sys} is below the reference for ${ageGroup.name} (usual ${bpSysTarget.min} to ${bpSysTarget.max}).`);
            } else if (sys >= 180 || (dia && dia >= 120)) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Hypertensive Crisis Pattern (SBP ≥180/DBP ≥120)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                recommendations.push(diagnosisDatabase.hypertensiveCrisis);
            } else if (isPregnant && sys >= vitalSignsReference.pregnancy.preeclampsia.sys) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Preeclampsia Pattern (BP ≥160/110)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("Severely elevated BP in pregnancy fits a preeclampsia pattern. Assess for proteinuria, edema, and headache, and report promptly.");
            } else if (isPregnant && sys >= vitalSignsReference.pregnancy.gestationalHypertension.sys) {
                diagnosis.push({ name: "Gestational Hypertension Pattern (SBP ≥140/DBP ≥90)", severity: "ELEVATED", icon: "fa-arrow-up" });
                priority = "ELEVATED";
                color = "text-orange-500";
                contextNotes.push("This pattern is monitored for progression to preeclampsia.");
            } else if (sys >= 160 || (dia && dia >= 100)) {
                diagnosis.push({ name: "Severe Hypertension Pattern (SBP 160-179 or DBP 100-109)", severity: "ELEVATED", icon: "fa-arrow-up" });
                priority = priority === "CRITICAL" ? "CRITICAL" : "ELEVATED";
                color = "text-orange-500";
                if (!isPregnant) recommendations.push(diagnosisDatabase.hypertension);
            } else if (sys >= 140 || (dia && dia >= 90)) {
                diagnosis.push({ name: "Hypertension Pattern (SBP 140-159 or DBP 90-99)", severity: "ELEVATED", icon: "fa-arrow-up" });
                priority = priority === "CRITICAL" ? "CRITICAL" : "ELEVATED";
                color = "text-orange-500";
                if (!isPregnant) recommendations.push(diagnosisDatabase.hypertension);
            } else if (sys >= bpSysTarget.max) {
                diagnosis.push({ name: `Mildly Elevated BP (Above ${ageGroup.name} Reference)`, severity: "MONITOR", icon: "fa-arrow-up-long" });
                contextNotes.push(`Systolic ${sys} is slightly above the reference for ${ageGroup.name} (usual ${bpSysTarget.min} to ${bpSysTarget.max}).`);
            }

            // ===== TEMPERATURE ASSESSMENT =====
            if (temp > 0) {
                if (temp <= 28) {
                    diagnosis.push({ name: "⚠️ SIM ALERT: Severe Hypothermia (≤28°C)", severity: "CRITICAL", icon: "fa-snowflake" });
                    priority = "CRITICAL";
                    color = "text-blue-500";
                    contextNotes.push("Temperature at or below 28°C indicates a critical hypothermia pattern. Follow your institution's thermal regulation protocol and report immediately.");
                } else if (temp <= 35.0) {
                    diagnosis.push({ name: "⚠️ SIM ALERT: Hypothermia (28-35°C)", severity: "CRITICAL", icon: "fa-snowflake" });
                    priority = "CRITICAL";
                    color = "text-blue-400";
                    recommendations.push(diagnosisDatabase.hypothermia);
                } else if (temp >= 40.5) {
                    diagnosis.push({ name: "⚠️ SIM ALERT: Severe Hyperthermia (≥40.5°C)", severity: "CRITICAL", icon: "fa-fire" });
                    priority = "CRITICAL";
                    color = "text-red-500";
                    contextNotes.push("Temperature at or above 40.5°C suggests a heat stroke pattern, which calls for immediate cooling measures. Report immediately.");
                } else if (temp >= 40.0) {
                    diagnosis.push({ name: "⚠️ SIM ALERT: Very High Fever (40.0-40.4°C)", severity: "CRITICAL", icon: "fa-fire" });
                    priority = "CRITICAL";
                    color = "text-red-500";
                    recommendations.push(diagnosisDatabase.fever);
                } else {
                    // Age-adjusted fever thresholds
                    let feverThreshold = 38.0;
                    if (age < 3) feverThreshold = 38.5;
                    if (age >= 65) feverThreshold = 37.5;

                    if (temp >= 39.5) {
                        diagnosis.push({ name: "High Fever Pattern (39.5-39.9°C)", severity: "CRITICAL", icon: "fa-fire" });
                        color = "text-red-500";
                        recommendations.push(diagnosisDatabase.fever);
                        if (conditions === 'diabetes') contextNotes.push("Diabetic patient with a fever pattern. Monitor for DKA signs and infection indicators.");
                    } else if (temp >= 38.5) {
                        diagnosis.push({ name: "Moderate Fever Pattern (38.5-39.4°C)", severity: "MONITOR", icon: "fa-fire" });
                        color = "text-orange-500";
                        recommendations.push(diagnosisDatabase.fever);
                    } else if (temp >= feverThreshold) {
                        diagnosis.push({ name: `Mild Fever Pattern (${feverThreshold}-38.4°C)`, severity: "MONITOR", icon: "fa-thermometer" });
                        recommendations.push(diagnosisDatabase.fever);
                    }
                }
            }

            // ===== HEART RATE ASSESSMENT (Age-Group Adjusted) =====
            if (hr > 0 && hr < 30) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Bradycardia (HR <30)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("HR below 30 indicates a severe bradycardia pattern. Assess consciousness and pulse quality, and report immediately.");
            } else if (hr > 200) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Tachycardia (HR >200)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("HR above 200 indicates a severe tachycardia pattern associated with arrhythmia, sepsis, or shock. Report immediately.");
            } else if (hr > 0 && hr < hrTarget.min) {
                diagnosis.push({ name: `Bradycardia Pattern (Below ${ageGroup.name} Reference: HR ${hr})`, severity: "MONITOR", icon: "fa-heart" });
                contextNotes.push(`HR ${hr} is below the reference for ${ageGroup.name} (usual ${hrTarget.min} to ${hrTarget.max}).`);
                recommendations.push(diagnosisDatabase.bradycardia);
            } else if (hr > hrTarget.max && hr <= hrTarget.max + 20) {
                let note = `Mild Tachycardia Pattern (HR ${hr})`;
                if (isPregnant) note += " (within pregnancy range)";
                if (temp >= 38.0) note += " (fever-related)";
                diagnosis.push({ name: note, severity: "MONITOR", icon: "fa-heart" });
                contextNotes.push(`HR ${hr} is slightly above the reference for ${ageGroup.name} (usual ${hrTarget.min} to ${hrTarget.max}).`);
            } else if (hr > hrTarget.max + 20 && hr <= hrTarget.max + 40) {
                let note = `Tachycardia Pattern (HR ${hr})`;
                if (temp >= 38.0) note += " (fever-related)";
                diagnosis.push({ name: note, severity: "MONITOR", icon: "fa-heart" });
                contextNotes.push(`HR ${hr} exceeds the reference for ${ageGroup.name} (usual ${hrTarget.min} to ${hrTarget.max}).`);
                recommendations.push(diagnosisDatabase.tachycardia);
            } else if (hr > hrTarget.max + 40) {
                diagnosis.push({ name: `⚠️ SIM ALERT: Severe Tachycardia (HR ${hr})`, severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = priority === "STABLE" ? "CRITICAL" : priority;
                color = "text-red-500";
                contextNotes.push(`HR ${hr} is significantly elevated, a pattern associated with shock, sepsis, or a severe underlying condition.`);
            }

            // ===== RESPIRATORY RATE ASSESSMENT (Age-Group Adjusted) =====
            if (rr > 0 && rr < 8) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Respiratory Depression (RR <8)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("RR below 8 indicates a severe respiratory depression pattern with respiratory failure risk. Report immediately.");
            } else if (rr > 50) {
                diagnosis.push({ name: "⚠️ SIM ALERT: Severe Tachypnea (RR >50)", severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = "CRITICAL";
                color = "text-red-500";
                contextNotes.push("RR above 50 indicates a severe respiratory distress pattern. Report immediately.");
            } else if (rr > 0 && rr < rrTarget.min) {
                diagnosis.push({ name: `Bradypnea Pattern (Below ${ageGroup.name} Reference: RR ${rr})`, severity: "MONITOR", icon: "fa-wind" });
                contextNotes.push(`RR ${rr} is below the reference for ${ageGroup.name} (usual ${rrTarget.min} to ${rrTarget.max}).`);
            } else if (rr > rrTarget.max && rr <= rrTarget.max + 5) {
                let note = `Mild Tachypnea Pattern (RR ${rr})`;
                if (conditions === 'asthma' || conditions === 'copd') note += " (monitor for exacerbation)";
                diagnosis.push({ name: note, severity: "MONITOR", icon: "fa-wind" });
                contextNotes.push(`RR ${rr} is slightly above the reference for ${ageGroup.name} (usual ${rrTarget.min} to ${rrTarget.max}).`);
            } else if (rr > rrTarget.max + 5 && rr <= rrTarget.max + 15) {
                let note = `Tachypnea Pattern (RR ${rr})`;
                if (conditions === 'asthma' || conditions === 'copd') note += " (exacerbation indicator)";
                diagnosis.push({ name: note, severity: "MONITOR", icon: "fa-wind" });
                contextNotes.push(`RR ${rr} exceeds the reference for ${ageGroup.name} (usual ${rrTarget.min} to ${rrTarget.max}).`);
                recommendations.push(diagnosisDatabase.tachypnea);
            } else if (rr > rrTarget.max + 15) {
                let note = `⚠️ SIM ALERT: Severe Tachypnea (RR ${rr})`;
                if (conditions === 'asthma' || conditions === 'copd') note += " (EXACERBATION PATTERN)";
                diagnosis.push({ name: note, severity: "CRITICAL", icon: "fa-exclamation-triangle" });
                priority = priority === "STABLE" ? "CRITICAL" : priority;
                color = "text-red-500";
                contextNotes.push(`RR ${rr} is significantly elevated, a pattern associated with respiratory distress or hypoxia.`);
            }

            // ===== COMORBIDITY-SPECIFIC CHECKS =====
            if (hasComorbidity) {
                if (conditions === 'ckd' && sys > vitalSignsReference.comorbidities.ckd.systolicTarget) {
                    contextNotes.push("CKD patient. Stricter BP control is emphasized and this reading exceeds the usual target. NSAIDs are generally avoided in CKD.");
                }
                if (conditions === 'asthma' && rr > 25) {
                    contextNotes.push("Asthma patient with elevated RR. Auscultate for wheeze, since this pattern can indicate exacerbation.");
                }
                if (conditions === 'copd' && rr > 25) {
                    contextNotes.push("COPD patient with elevated RR. Compare against the patient's baseline and consider an exacerbation pattern.");
                }
            }

            return { diagnosis, priority, color, recommendations, contextNotes };
        }

        function liveAnalyze() {
            // Interpretation grouped into priority, actions, and patient context.
            const sys = parseInt(document.getElementById('sys').value);
            const dia = parseInt(document.getElementById('dia').value);
            const temp = parseFloat(document.getElementById('temp').value);
            const hr = parseInt(document.getElementById('hr').value);
            const rr = parseInt(document.getElementById('rr').value);
            const age = parseInt(document.getElementById('age').value);
            const pregnancies = parseInt(document.getElementById('pregnancies').value);
            const pregnant = document.getElementById('pregnant').value;
            const conditions = document.getElementById('conditions').value;
            const box = document.getElementById('dx-box');
            const badge = document.getElementById('status-badge');

            if (!sys && !temp && !hr && !rr) {
                box.innerHTML = `<div class="flex flex-col items-center space-y-2">
                    <svg class="inline text-3xl text-slate-600 opacity-50" width="1.3em" height="1.3em" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18"/></svg>
                    <p class="text-sm text-slate-500">Enter all vital signs to generate the findings.</p>
                </div>`;
                badge.innerText = "Enter Vitals";
                badge.className = "px-4 py-2 bg-slate-700 rounded-full text-xs font-mono text-slate-400 font-bold";
                return { ok: false, reason: 'missing_inputs' };
            }

            const abnormalFindings = [];
            const interpretations = [];
            const actions = [];
            const context = [];
            let severityScore = 0;

            const isChild = age > 0 && age < 12;
            const isOlderAdult = age >= 65;
            const hasComorbidity = conditions && conditions !== 'none';

            // Blood pressure interpretation
            if (sys >= 180 || dia >= 120) {
                interpretations.push(`Hypertensive crisis pattern (${sys}/${dia} mmHg)`);
                abnormalFindings.push('critical_bp');
                severityScore += 4;
                actions.push("Recheck BP manually within 5 minutes and escalate to the clinical instructor immediately.");
            } else if (sys >= 140 || dia >= 90) {
                interpretations.push(`Stage 2 hypertension pattern (${sys}/${dia} mmHg)`);
                abnormalFindings.push('stage2_bp');
                severityScore += 3;
                actions.push("Monitor blood pressure every 15 minutes and observe for headache, chest pain, or neurologic changes.");
            } else if (sys >= 130 || dia >= 80) {
                interpretations.push(`Stage 1 hypertension pattern (${sys}/${dia} mmHg)`);
                abnormalFindings.push('stage1_bp');
                severityScore += 2;
                actions.push("Repeat the BP after a brief rest and compare it against earlier readings.");
            } else if (sys >= 120 && dia < 80) {
                interpretations.push(`Elevated blood pressure pattern (${sys}/${dia} mmHg)`);
                abnormalFindings.push('elevated_bp');
                severityScore += 1;
            } else if (sys < 90 || dia < 60) {
                interpretations.push(`Hypotension pattern (${sys}/${dia} mmHg)`);
                abnormalFindings.push('low_bp');
                severityScore += 2;
                actions.push("Assess perfusion indicators such as mental status, skin signs, and capillary refill, then reassess vitals promptly.");
            } else {
                interpretations.push(`Blood pressure within reference range (${sys}/${dia} mmHg)`);
            }

            // Temperature interpretation
            if (temp >= 39.5) {
                interpretations.push(`High fever pattern (${temp.toFixed(1)}°C)`);
                abnormalFindings.push('high_fever');
                severityScore += 3;
                actions.push("Increase monitoring frequency and evaluate for fever-associated tachycardia or tachypnea trends.");
            } else if (temp >= 38.0) {
                interpretations.push(`Fever pattern (${temp.toFixed(1)}°C)`);
                abnormalFindings.push('fever');
                severityScore += 2;
            } else if (temp >= 37.5) {
                interpretations.push(`Low-grade fever pattern (${temp.toFixed(1)}°C)`);
                abnormalFindings.push('low_fever');
                severityScore += 1;
            } else if (temp < 35.0) {
                interpretations.push(`Hypothermia pattern (${temp.toFixed(1)}°C)`);
                abnormalFindings.push('hypothermia');
                severityScore += 3;
                actions.push("Prioritize warming measures and reassess the core vital trends.");
            } else {
                interpretations.push(`Temperature within reference range (${temp.toFixed(1)}°C)`);
            }

            // Heart rate interpretation, simplified against age-adjusted bands
            const hrLow = isChild ? 70 : 60;
            const hrHigh = isChild ? 120 : 100;
            if (hr > hrHigh + 20) {
                interpretations.push(`Marked tachycardia pattern (HR ${hr} bpm)`);
                abnormalFindings.push('severe_tachy');
                severityScore += 3;
                actions.push("Assess for contributing causes such as pain, fever, anxiety, or dehydration, and trend the HR closely.");
            } else if (hr > hrHigh) {
                interpretations.push(`Tachycardia pattern (HR ${hr} bpm)`);
                abnormalFindings.push('tachy');
                severityScore += 2;
            } else if (hr < hrLow - 10) {
                interpretations.push(`Bradycardia pattern (HR ${hr} bpm)`);
                abnormalFindings.push('brady');
                severityScore += 2;
                actions.push("Reassess perfusion and symptoms, verify reading quality, and repeat the HR.");
            } else {
                interpretations.push(`Heart rate within expected range for age (HR ${hr} bpm)`);
            }

            // Respiratory rate interpretation, simplified against age-adjusted bands
            const rrLow = isChild ? 18 : 12;
            const rrHigh = isChild ? 30 : 20;
            if (rr > rrHigh + 10) {
                interpretations.push(`Severe tachypnea pattern (RR ${rr}/min)`);
                abnormalFindings.push('severe_tachypnea');
                severityScore += 3;
                actions.push("Reassess airway and breathing immediately, and check oxygenation if available.");
            } else if (rr > rrHigh) {
                interpretations.push(`Tachypnea pattern (RR ${rr}/min)`);
                abnormalFindings.push('tachypnea');
                severityScore += 2;
            } else if (rr < rrLow) {
                interpretations.push(`Bradypnea pattern (RR ${rr}/min)`);
                abnormalFindings.push('bradypnea');
                severityScore += 2;
                actions.push("Observe the depth and effort of breathing, then repeat the respiratory assessment.");
            } else {
                interpretations.push(`Respiratory rate within expected range for age (RR ${rr}/min)`);
            }

            // Combined pattern interpretation
            if ((hr > hrHigh || hr > 100) && temp >= 38.0) {
                interpretations.push("Tachycardia with fever pattern (possible systemic stress response)");
                severityScore += 1;
            }
            if ((rr > rrHigh || rr > 20) && temp >= 38.0) {
                interpretations.push("Tachypnea with fever pattern (watch for increasing work of breathing)");
                severityScore += 1;
            }

            // Patient factor context
            if (age > 0) {
                context.push(isChild ? "Pediatric age group: compare trends with age-appropriate reference ranges." : "Adult reference ranges applied for baseline interpretation.");
            }
            if (isOlderAdult) {
                context.push("Older adult factor: atypical presentation may occur, so trending and reassessment are important.");
                severityScore += 1;
            }
            if (pregnant === 'yes') {
                context.push("Pregnancy factor: monitor maternal trends closely and correlate with the gestational context.");
                if (!Number.isNaN(pregnancies) && pregnancies > 0) {
                    context.push(`Obstetric history noted: G${pregnancies}.`);
                }
                if (sys >= 140 || dia >= 90) {
                    context.push("Pregnancy with an elevated BP pattern: discuss preeclampsia screening with your instructor.");
                    severityScore += 1;
                }
            }
            if (hasComorbidity) {
                context.push(`Known condition context: ${conditions.toUpperCase()} may shift target priorities and reassessment frequency.`);
                severityScore += 1;
            }

            // Assign priority level and style
            const priorityLevels = [
                { key: "Normal / Green", icon: "🟢", textClass: "text-green-300", bgClass: "bg-green-900/30", borderClass: "border-green-600/60" },
                { key: "Mild Concern / Yellow", icon: "🟡", textClass: "text-yellow-300", bgClass: "bg-yellow-900/30", borderClass: "border-yellow-600/60" },
                { key: "Moderate Concern / Orange", icon: "🟠", textClass: "text-orange-300", bgClass: "bg-orange-900/30", borderClass: "border-orange-600/60" },
                { key: "High Priority / Red", icon: "🔴", textClass: "text-red-300", bgClass: "bg-red-900/30", borderClass: "border-red-600/60" },
                { key: "Emergency / Critical", icon: "🚨", textClass: "text-red-200", bgClass: "bg-red-950/50", borderClass: "border-red-500" }
            ];

            let priorityIndex = 0;
            if (severityScore >= 10 || abnormalFindings.includes('critical_bp') || abnormalFindings.includes('severe_tachypnea')) priorityIndex = 4;
            else if (severityScore >= 7) priorityIndex = 3;
            else if (severityScore >= 4) priorityIndex = 2;
            else if (severityScore >= 1) priorityIndex = 1;

            const chosenPriority = priorityLevels[priorityIndex];

            // Keep action list concise and relevant (2-4 items)
            const uniqueActions = [...new Set(actions)];
            if (uniqueActions.length < 2) {
                uniqueActions.push("Reassess the full vital signs within 15 to 30 minutes and compare the trend.");
                uniqueActions.push("Report significant trend changes to your clinical instructor during scenario debrief.");
            }
            const finalActions = uniqueActions.slice(0, 4);

            // Build interpretation list with strongest findings first
            const criticalInterpretations = interpretations.filter(item =>
                item.includes("crisis") || item.includes("Stage 2") || item.includes("Severe") || item.includes("Marked")
            );
            const baselineInterpretations = interpretations.filter(item => !criticalInterpretations.includes(item));
            const finalInterpretations = [...criticalInterpretations, ...baselineInterpretations].slice(0, 5);

            let html = `<div class="w-full space-y-4 text-left not-italic">
                <div class="rounded-lg border ${chosenPriority.borderClass} ${chosenPriority.bgClass} p-3">
                    <p class="text-xs uppercase tracking-wide text-slate-300">Overall Priority Level</p>
                    <p class="font-bold ${chosenPriority.textClass} text-sm mt-1">${chosenPriority.icon} ${chosenPriority.key}</p>
                </div>

                <div class="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                    <p class="font-semibold text-slate-200 text-sm mb-2">Clinical Interpretation</p>
                    <ul class="np-bullets text-xs text-slate-200">`;
            finalInterpretations.forEach(item => {
                html += `<li>${item}</li>`;
            });
            html += `</ul></div>

                <div class="bg-slate-800/40 border border-slate-700 rounded-lg p-3">
                    <p class="font-semibold text-slate-200 text-sm mb-2">Nursing Considerations / Actions</p>
                    <ul class="np-bullets text-xs text-cyan-200">`;
            finalActions.forEach(item => {
                html += `<li>${item}</li>`;
            });
            html += `</ul></div>`;

            if (context.length > 0) {
                html += `<div class="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-3">
                    <p class="font-semibold text-indigo-200 text-sm mb-2">Patient Context</p>
                    <ul class="np-bullets text-xs text-indigo-100">`;
                context.slice(0, 4).forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += `</ul></div>`;
            }

            html += `<div class="bg-amber-900/20 border border-amber-700/50 rounded-lg p-2">
                    <p class="text-[10px] text-amber-300 italic">Reference findings for study. Confirm anything that affects care with your Clinical Instructor.</p>
                </div>
            </div>`;

            box.innerHTML = html;
            box.className = "p-4 bg-slate-700/20 rounded-xl border border-blue-500/40 min-h-[120px] flex items-start text-sm";

            badge.innerText = `${chosenPriority.icon} ${chosenPriority.key}`;
            badge.className = `px-4 py-2 rounded-full text-xs font-bold font-mono ${chosenPriority.textClass} bg-slate-800 border ${chosenPriority.borderClass} shadow-lg`;

            const learnWrap = document.getElementById('vitals-learn');
            const learnMeaning = document.getElementById('vitals-learn-meaning');
            if (learnWrap) learnWrap.style.display = 'grid';
            if (learnMeaning) {
                const topFinding = finalInterpretations[0] || 'No dominant finding yet';
                learnMeaning.textContent = `Priority ${chosenPriority.key}. Lead finding: ${topFinding}`;
            }

            return {
                ok: true,
                priority: chosenPriority.key,
                findings_count: finalInterpretations.length,
                recommendation_count: finalActions.length,
                has_comorbidity: conditions !== 'none',
                pregnant
            };
        }

        // Manual trigger for the same live analysis output, while keeping analytics behavior unchanged.
        function simulateVitalSigns() {
            const status = document.getElementById('vitals-record-status');

            // OPTIMIZATION: Track feature_open if not already tracked
            if (!hasTrackedVitalsOpen) {
                hasTrackedVitalsOpen = true;
                trackUsageSafe('vitals', 'feature_open', {
                    trigger: 'simulate_button'
                }, { minIntervalMs: 5000, rateKey: 'vitals_feature_open' });
            }

            const summary = liveAnalyze();
            if (!summary || !summary.ok) {
                if (status) status.textContent = 'Enter the required vital signs first, then tap Analyze Vital Signs.';
                trackUsageSafe('vitals', 'error_shown', { reason: 'simulate_missing_required_inputs' }, { minIntervalMs: 2000, rateKey: 'simulate_missing_required_inputs' });
                return;
            }

            // OPTIMIZATION: Track button-triggered result_generated with source distinction
            trackUsageSafe('vitals', 'result_generated', {
                source: 'simulate_button',
                priority: summary.priority,
                findings_count: summary.findings_count,
                recommendation_count: summary.recommendation_count,
                has_comorbidity: summary.has_comorbidity,
                pregnant: summary.pregnant
            }, { minIntervalMs: 250, rateKey: `simulate_btn_${Date.now()}` });

            trackUsageSafe('vitals', 'feature_use', {
                action: 'simulate_button_pressed'
            }, { minIntervalMs: 250, rateKey: `simulate_press_${Date.now()}` });

            if (status) {
                status.textContent = '';
            }

            requestTelemetryFlush();
        }

        // ============= TAB SWITCHING FUNCTION =============
        function switchMainTab(tab, opts) {
            const skipHistory = !!(opts && opts.skipHistory);
            trackUsageSafe('navigation', 'feature_open', { tab }, { minIntervalMs: 700, rateKey: `tab_${tab}` });

            // Hide all tab contents
            document.getElementById('content-tools').classList.add('hidden');
            document.getElementById('content-otc').classList.add('hidden');
            const contentLabs = document.getElementById('content-labs');
            if (contentLabs) contentLabs.classList.add('hidden');
            
            // Remove active state from all tab buttons
            document.getElementById('tab-tools').classList.remove('active', 'bg-cyan-900/50', 'border-cyan-500/50', 'text-cyan-400');
            document.getElementById('tab-tools').classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            document.getElementById('tab-otc').classList.remove('active', 'bg-amber-900/50', 'border-amber-500/50', 'text-amber-400');
            document.getElementById('tab-otc').classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            const tabLabs = document.getElementById('tab-labs');
            if (tabLabs) {
                tabLabs.classList.remove('active', 'text-emerald-400');
                tabLabs.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            }
            
            // Show selected tab content and activate button
            if (tab === 'tools') {
                document.getElementById('content-tools').classList.remove('hidden');
                document.getElementById('tab-tools').classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                document.getElementById('tab-tools').classList.add('active', 'bg-cyan-900/50', 'border-cyan-500/50', 'text-cyan-400');
                if (typeof backToToolsHub === 'function') backToToolsHub({ skipHistory: true });
                if (!skipHistory) pushNursePathState({ view: 'hub', tab: 'tools' });
            } else if (tab === 'otc') {
                document.getElementById('content-otc').classList.remove('hidden');
                document.getElementById('tab-otc').classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                document.getElementById('tab-otc').classList.add('active', 'bg-amber-900/50', 'border-amber-500/50', 'text-amber-400');
                // Reset to initial preview count and re-render OTC list when switching to tab
                if (typeof hideOTCDetail === 'function') hideOTCDetail({ skipHistory: true });
                otcVisibleCount = OTC_INCREMENT;
                renderOTCList('');
                if (!skipHistory) pushNursePathState({ view: 'otc', tab: 'otc' });
            } else if (tab === 'labs') {
                if (contentLabs) contentLabs.classList.remove('hidden');
                if (tabLabs) {
                    tabLabs.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                    tabLabs.classList.add('active', 'text-emerald-400');
                }
                if (typeof resetLabView === 'function') resetLabView();
                else if (typeof initLabRanges === 'function') initLabRanges();
                if (!skipHistory) pushNursePathState({ view: 'labs', tab: 'labs' });
            }
            
            // Scroll to top of content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ============= AOG & EDD CALCULATOR =============

        const CLINICAL_TOOL_PANELS = {
            vitals: 'tool-panel-vitals',
            iv: 'tool-panel-iv',
            bmi: 'tool-panel-bmi',
            aog: 'tool-panel-aog',
            peds: 'tool-panel-peds',
            apgar: 'tool-panel-apgar',
            gcs: 'tool-panel-gcs',
            braden: 'tool-panel-braden',
            ron: 'tool-panel-ron'
        };

        // Phone/system Back should return to hub/list instead of leaving the PWA.
        function pushNursePathState(state) {
            try {
                const next = Object.assign({ np: 1 }, state || {});
                const cur = window.history.state;
                if (
                    cur &&
                    cur.np === 1 &&
                    cur.view === next.view &&
                    cur.tab === next.tab &&
                    cur.toolId === next.toolId &&
                    cur.otcId === next.otcId &&
                    cur.labId === next.labId &&
                    cur.overlay === next.overlay
                ) {
                    return;
                }
                window.history.pushState(next, '');
            } catch (e) { /* ignore */ }
        }

        function replaceNursePathState(state) {
            try {
                window.history.replaceState(Object.assign({ np: 1 }, state || {}), '');
            } catch (e) { /* ignore */ }
        }

        function clearMainTabButtons() {
            const tabTools = document.getElementById('tab-tools');
            const tabOtc = document.getElementById('tab-otc');
            const tabLabs = document.getElementById('tab-labs');
            if (tabTools) {
                tabTools.classList.remove('active', 'bg-cyan-900/50', 'border-cyan-500/50', 'text-cyan-400');
                tabTools.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            }
            if (tabOtc) {
                tabOtc.classList.remove('active', 'bg-amber-900/50', 'border-amber-500/50', 'text-amber-400');
                tabOtc.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            }
            if (tabLabs) {
                tabLabs.classList.remove('active', 'text-emerald-400');
                tabLabs.classList.add('bg-slate-800', 'border-slate-700', 'text-slate-300');
            }
        }

        function hideAllMainTabs() {
            const tools = document.getElementById('content-tools');
            const otc = document.getElementById('content-otc');
            const labs = document.getElementById('content-labs');
            if (tools) tools.classList.add('hidden');
            if (otc) otc.classList.add('hidden');
            if (labs) labs.classList.add('hidden');
        }

        function ensureToolsTabVisible() {
            hideAllMainTabs();
            clearMainTabButtons();
            const tools = document.getElementById('content-tools');
            const tabTools = document.getElementById('tab-tools');
            if (tools) tools.classList.remove('hidden');
            if (tabTools) {
                tabTools.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                tabTools.classList.add('active', 'bg-cyan-900/50', 'border-cyan-500/50', 'text-cyan-400');
            }
        }

        function ensureOtcTabVisible() {
            hideAllMainTabs();
            clearMainTabButtons();
            const otc = document.getElementById('content-otc');
            const tabOtc = document.getElementById('tab-otc');
            if (otc) otc.classList.remove('hidden');
            if (tabOtc) {
                tabOtc.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                tabOtc.classList.add('active', 'bg-amber-900/50', 'border-amber-500/50', 'text-amber-400');
            }
        }

        function ensureLabsTabVisible() {
            hideAllMainTabs();
            clearMainTabButtons();
            const labs = document.getElementById('content-labs');
            const tabLabs = document.getElementById('tab-labs');
            if (labs) labs.classList.remove('hidden');
            if (tabLabs) {
                tabLabs.classList.remove('bg-slate-800', 'border-slate-700', 'text-slate-300');
                tabLabs.classList.add('active', 'text-emerald-400');
            }
        }

        let currentClinicalToolId = null;
        const HUB_MODE_KEY = 'np_hub_mode_v1';
        let currentHubMode = 'duty';
        let currentStudyToolId = null;
        let currentStudyTab = 'lesson';
        let studyQuizState = null;

        function escapeGuideHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        }

        function readHubMode() {
            try {
                return localStorage.getItem(HUB_MODE_KEY) === 'study' ? 'study' : 'duty';
            } catch (e) {
                return 'duty';
            }
        }

        function persistHubMode(mode) {
            try {
                localStorage.setItem(HUB_MODE_KEY, mode);
            } catch (e) { /* ignore */ }
        }

        function applyHubMode(mode, opts) {
            const next = mode === 'study' ? 'study' : 'duty';
            currentHubMode = next;
            const hub = document.getElementById('tools-hub');
            if (hub) hub.setAttribute('data-hub-mode', next);
            const dutyBtn = document.getElementById('hubDutyBtn');
            const studyBtn = document.getElementById('hubStudyBtn');
            if (dutyBtn) dutyBtn.classList.toggle('is-active', next === 'duty');
            if (studyBtn) studyBtn.classList.toggle('is-active', next === 'study');
            const title = document.getElementById('toolsHubTitle');
            const blurb = document.getElementById('toolsHubBlurb');
            if (title) title.textContent = next === 'study' ? 'Study Classroom' : 'Clinical Tools';
            if (blurb) {
                blurb.textContent = next === 'study'
                    ? 'Study mode: pick a topic for an instructor-style lesson and quiz. Fully offline.'
                    : 'Duty mode: fast calculators for ward pocket use. OTC lives in the OTC tab.';
            }
            document.querySelectorAll('.tool-hub-desc').forEach((el) => {
                const duty = el.getAttribute('data-duty-desc');
                const study = el.getAttribute('data-study-desc');
                if (next === 'study' && study) el.textContent = study;
                else if (duty) el.textContent = duty;
            });
            if (!(opts && opts.silent)) {
                persistHubMode(next);
                trackUsageSafe('navigation', 'feature_use', { hub_mode: next }, { minIntervalMs: 500, rateKey: `hub_mode_${next}` });
            }
        }

        function setHubMode(mode) {
            applyHubMode(mode);
        }

        function openHubTool(toolId) {
            if (currentHubMode === 'study') openStudyTool(toolId);
            else openClinicalTool(toolId);
        }

        function openClinicalTool(toolId, opts) {
            const hub = document.getElementById('tools-hub');
            const detail = document.getElementById('tools-detail');
            const study = document.getElementById('study-detail');
            if (!hub || !detail) return;
            currentClinicalToolId = toolId;
            currentStudyToolId = null;
            hub.classList.add('hidden');
            if (study) study.classList.add('hidden');
            detail.classList.remove('hidden');
            Object.values(CLINICAL_TOOL_PANELS).forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('is-active');
            });
            const panelId = CLINICAL_TOOL_PANELS[toolId];
            const panel = panelId ? document.getElementById(panelId) : null;
            if (panel) panel.classList.add('is-active');
            trackUsageSafe('navigation', 'feature_open', { tool: toolId, hub_mode: 'duty' }, { minIntervalMs: 700, rateKey: `tool_${toolId}` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (toolId === 'apgar') initApgarInputs();
            if (toolId === 'braden') initBradenInputs();
            if (toolId === 'gcs') initGcsInputs();
            if (toolId === 'ron') initRuleOfNines();
            if (!(opts && opts.skipHistory)) {
                pushNursePathState({ view: 'duty', tab: 'tools', toolId: toolId });
            }
        }

        function renderStudyLesson(toolId) {
            const panel = document.getElementById('studyPanelLesson');
            const content = window.NursePathToolContent;
            const sections = content ? content.getLessonSections(toolId) : [];
            if (!panel) return;
            if (!sections.length) {
                panel.innerHTML = '<p class="study-lesson-body">Lesson coming soon for this topic.</p>';
                return;
            }
            panel.innerHTML = sections.map((section) => {
                const heading = escapeGuideHtml(section.heading || '');
                const body = escapeGuideHtml(section.body || '');
                let bodyHtml;
                if (section.type === 'formula') bodyHtml = `<div class="study-lesson-formula">${body}</div>`;
                else if (section.type === 'example') bodyHtml = `<div class="study-lesson-example">${body}</div>`;
                else bodyHtml = `<div class="study-lesson-body">${body}</div>`;
                return `<section class="study-lesson-section"><h3>${heading}</h3>${bodyHtml}</section>`;
            }).join('');
        }

        function startStudyQuiz(toolId) {
            const drills = window.NursePathStudyDrills;
            const quiz = drills && drills.getQuiz(toolId);
            const questions = quiz && quiz.questions ? quiz.questions.slice() : [];
            studyQuizState = {
                toolId: toolId,
                questions: questions,
                index: 0,
                score: 0,
                answered: false,
                finished: false
            };
            renderStudyQuiz();
        }

        function renderStudyQuiz() {
            const panel = document.getElementById('studyPanelQuiz');
            if (!panel || !studyQuizState) return;
            const { questions, index, finished, score } = studyQuizState;
            if (!questions.length) {
                panel.innerHTML = '<p class="study-quiz-prompt">Quiz coming soon for this topic.</p>';
                return;
            }
            if (finished) {
                const drills = window.NursePathStudyDrills;
                const stats = drills ? drills.getToolStats(studyQuizState.toolId) : {};
                panel.innerHTML = `
                    <div class="study-quiz-summary">
                        <p>Quiz complete</p>
                        <div class="score">${score} / ${questions.length}</div>
                        <p>Best on this device: ${stats.bestScore || score}/${questions.length} · Attempts: ${stats.attempts || 1}</p>
                        <div class="study-quiz-nav">
                            <button type="button" class="primary" onclick="retakeStudyQuiz()">Retake quiz</button>
                            <button type="button" onclick="setStudyTab('lesson')">Back to lesson</button>
                        </div>
                    </div>`;
                return;
            }
            const q = questions[index];
            const choices = (q.choices || []).map((label, idx) => {
                return `<button type="button" class="study-quiz-choice" data-idx="${idx}" onclick="submitStudyQuizAnswer(${idx})">${escapeGuideHtml(label)}</button>`;
            }).join('');
            panel.innerHTML = `
                <div class="study-quiz-progress">Question <em>${index + 1}</em> of ${questions.length}</div>
                <p class="study-quiz-prompt">${escapeGuideHtml(q.prompt)}</p>
                <div class="study-quiz-choices">${choices}</div>
                <div class="study-quiz-feedback" id="studyQuizFeedback"></div>
                <div class="study-quiz-nav" id="studyQuizNav" style="display:none;">
                    <button type="button" class="primary" id="studyQuizNextBtn" onclick="advanceStudyQuiz()">Next</button>
                </div>`;
        }

        function submitStudyQuizAnswer(choiceIndex) {
            if (!studyQuizState || studyQuizState.answered || studyQuizState.finished) return;
            const q = studyQuizState.questions[studyQuizState.index];
            if (!q) return;
            studyQuizState.answered = true;
            const isCorrect = Number(choiceIndex) === Number(q.correctIndex);
            if (isCorrect) studyQuizState.score += 1;
            const panel = document.getElementById('studyPanelQuiz');
            const feedback = document.getElementById('studyQuizFeedback');
            const nav = document.getElementById('studyQuizNav');
            const nextBtn = document.getElementById('studyQuizNextBtn');
            if (panel) {
                panel.querySelectorAll('.study-quiz-choice').forEach((btn) => {
                    const idx = Number(btn.getAttribute('data-idx'));
                    btn.disabled = true;
                    if (idx === q.correctIndex) btn.classList.add('is-correct');
                    else if (idx === Number(choiceIndex) && !isCorrect) btn.classList.add('is-wrong');
                });
            }
            if (feedback) {
                feedback.className = `study-quiz-feedback open ${isCorrect ? 'is-correct' : 'is-wrong'}`;
                feedback.innerHTML = `<strong>${isCorrect ? 'Correct' : 'Not quite'}</strong> ${escapeGuideHtml(q.explain || '')}`;
            }
            if (nav) nav.style.display = 'flex';
            if (nextBtn) {
                const last = studyQuizState.index >= studyQuizState.questions.length - 1;
                nextBtn.textContent = last ? 'See results' : 'Next question';
            }
            trackUsageSafe('study_quiz', 'feature_use', {
                tool: studyQuizState.toolId,
                q: studyQuizState.index,
                correct: isCorrect
            }, { minIntervalMs: 300, rateKey: `quiz_q_${studyQuizState.toolId}_${studyQuizState.index}` });
        }

        function advanceStudyQuiz() {
            if (!studyQuizState || !studyQuizState.answered) return;
            if (studyQuizState.index >= studyQuizState.questions.length - 1) {
                studyQuizState.finished = true;
                const drills = window.NursePathStudyDrills;
                if (drills) {
                    drills.recordQuizResult(studyQuizState.toolId, studyQuizState.score, studyQuizState.questions.length);
                }
                trackUsageSafe('study_quiz', 'result_generated', {
                    tool: studyQuizState.toolId,
                    score: studyQuizState.score,
                    total: studyQuizState.questions.length
                }, { minIntervalMs: 400, rateKey: `quiz_done_${studyQuizState.toolId}` });
                renderStudyQuiz();
                return;
            }
            studyQuizState.index += 1;
            studyQuizState.answered = false;
            renderStudyQuiz();
        }

        function retakeStudyQuiz() {
            if (!currentStudyToolId) return;
            startStudyQuiz(currentStudyToolId);
        }

        function setStudyTab(tab) {
            currentStudyTab = tab === 'quiz' ? 'quiz' : 'lesson';
            const lessonBtn = document.getElementById('studyTabLesson');
            const quizBtn = document.getElementById('studyTabQuiz');
            const lessonPanel = document.getElementById('studyPanelLesson');
            const quizPanel = document.getElementById('studyPanelQuiz');
            if (lessonBtn) lessonBtn.classList.toggle('is-active', currentStudyTab === 'lesson');
            if (quizBtn) quizBtn.classList.toggle('is-active', currentStudyTab === 'quiz');
            if (lessonPanel) lessonPanel.classList.toggle('is-active', currentStudyTab === 'lesson');
            if (quizPanel) quizPanel.classList.toggle('is-active', currentStudyTab === 'quiz');
            if (currentStudyTab === 'quiz' && currentStudyToolId) {
                if (!studyQuizState || studyQuizState.toolId !== currentStudyToolId) {
                    startStudyQuiz(currentStudyToolId);
                }
            }
        }

        function openStudyTool(toolId, opts) {
            const hub = document.getElementById('tools-hub');
            const detail = document.getElementById('tools-detail');
            const study = document.getElementById('study-detail');
            if (!hub || !study) return;
            currentStudyToolId = toolId;
            currentClinicalToolId = toolId;
            hub.classList.add('hidden');
            if (detail) detail.classList.add('hidden');
            study.classList.remove('hidden');
            const content = window.NursePathToolContent;
            const tool = content && content.getTool(toolId);
            const titleEl = document.getElementById('studyClassTitle');
            const subEl = document.getElementById('studyClassSubtitle');
            if (titleEl) titleEl.textContent = (tool && tool.title) || 'Study';
            if (subEl) subEl.textContent = (tool && tool.subtitle) || 'Lesson and quiz';
            renderStudyLesson(toolId);
            studyQuizState = null;
            setStudyTab('lesson');
            trackUsageSafe('navigation', 'feature_open', { tool: toolId, hub_mode: 'study' }, { minIntervalMs: 700, rateKey: `study_${toolId}` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (!(opts && opts.skipHistory)) {
                pushNursePathState({ view: 'study', tab: 'tools', toolId: toolId });
            }
        }

        function backToToolsHub(opts) {
            const hub = document.getElementById('tools-hub');
            const detail = document.getElementById('tools-detail');
            const study = document.getElementById('study-detail');
            currentClinicalToolId = null;
            currentStudyToolId = null;
            studyQuizState = null;
            closeToolGuide({ skipHistory: true });
            if (hub) hub.classList.remove('hidden');
            if (detail) detail.classList.add('hidden');
            if (study) study.classList.add('hidden');
            Object.values(CLINICAL_TOOL_PANELS).forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('is-active');
            });
            if (!(opts && opts.skipHistory)) {
                const cur = window.history.state;
                if (cur && cur.np === 1 && (cur.view === 'duty' || cur.view === 'study' || cur.overlay)) {
                    window.history.back();
                    return;
                }
                replaceNursePathState({ view: 'hub', tab: 'tools' });
            }
        }

        // Sections carry an explicit type so the Guide and the lesson render alike.
        function renderGuideSection(section) {
            const heading = (section && section.heading) || '';
            const body = (section && section.body) || '';
            const type = (section && section.type) || '';
            let bodyHtml;
            if (type === 'example') {
                bodyHtml = `<div class="tool-guide-example">${escapeGuideHtml(body)}</div>`;
            } else if (type === 'caveat') {
                bodyHtml = `<div class="tool-guide-caveat">${escapeGuideHtml(body)}</div>`;
            } else if (type === 'formula') {
                bodyHtml = `<div class="tool-guide-formula">${escapeGuideHtml(body)}</div>`;
            } else {
                bodyHtml = `<p>${escapeGuideHtml(body)}</p>`;
            }
            return `<section class="tool-guide-section"><h4>${escapeGuideHtml(heading)}</h4>${bodyHtml}</section>`;
        }

        function openToolGuide(opts) {
            const content = window.NursePathToolContent;
            const overlay = document.getElementById('toolGuideOverlay');
            const titleEl = document.getElementById('toolGuideTitle');
            const bodyEl = document.getElementById('toolGuideBody');
            if (!overlay || !titleEl || !bodyEl) return;
            const tool = content && currentClinicalToolId ? content.getTool(currentClinicalToolId) : null;
            if (!tool) {
                titleEl.textContent = 'Guide unavailable';
                bodyEl.innerHTML = '<section class="tool-guide-section"><p>No guide is available for this tool yet.</p></section>';
            } else {
                titleEl.textContent = `${tool.title}: pocket guide`;
                bodyEl.innerHTML = content.getPocketSections(currentClinicalToolId).map(renderGuideSection).join('');
            }
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            trackUsageSafe('navigation', 'feature_open', { tool: currentClinicalToolId, view: 'guide' }, { minIntervalMs: 700, rateKey: `guide_${currentClinicalToolId || 'none'}` });
            if (!(opts && opts.skipHistory)) {
                pushNursePathState({
                    view: currentStudyToolId ? 'study' : 'duty',
                    tab: 'tools',
                    toolId: currentClinicalToolId,
                    overlay: 'guide'
                });
            }
        }

        function closeToolGuide(opts) {
            const overlay = document.getElementById('toolGuideOverlay');
            if (overlay) overlay.classList.remove('open');
            document.body.style.overflow = '';
            if (!(opts && opts.skipHistory)) {
                const cur = window.history.state;
                if (cur && cur.np === 1 && cur.overlay === 'guide') {
                    window.history.back();
                }
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeToolGuide();
            }
        });

        window.addEventListener('popstate', (event) => {
            // Prefer the popped entry's state; history.state can lag behind it.
            const state = event && 'state' in event ? event.state : window.history.state;
            const guideEl = document.getElementById('toolGuideOverlay');
            if (guideEl) guideEl.classList.remove('open');
            document.body.style.overflow = '';

            if (!state || state.np !== 1 || state.view === 'hub' || !state.view) {
                ensureToolsTabVisible();
                backToToolsHub({ skipHistory: true });
                return;
            }

            if (state.view === 'otc' || state.view === 'otc-detail') {
                ensureOtcTabVisible();
                if (state.view === 'otc-detail' && state.otcId && Array.isArray(window.otcDatabase)) {
                    const item = window.otcDatabase.find((med) => med && med.id === state.otcId);
                    if (item && typeof showOTCDetail === 'function') {
                        showOTCDetail(item, { skipHistory: true });
                        return;
                    }
                }
                if (typeof hideOTCDetail === 'function') hideOTCDetail({ skipHistory: true });
                return;
            }

            if (state.view === 'labs' || state.view === 'labs-detail') {
                ensureLabsTabVisible();
                if (state.view === 'labs-detail' && state.labId && Array.isArray(window.labDatabase)) {
                    const item = window.labDatabase.find((lab) => lab && lab.id === state.labId);
                    if (item && typeof showLabDetail === 'function') {
                        showLabDetail(item, { skipHistory: true });
                        return;
                    }
                }
                if (typeof hideLabDetail === 'function') hideLabDetail({ skipHistory: true });
                return;
            }

            ensureToolsTabVisible();
            if (state.view === 'study' && state.toolId) {
                openStudyTool(state.toolId, { skipHistory: true });
            } else if (state.view === 'duty' && state.toolId) {
                openClinicalTool(state.toolId, { skipHistory: true });
            } else {
                backToToolsHub({ skipHistory: true });
            }

            if (state.overlay === 'guide') {
                openToolGuide({ skipHistory: true });
            }
        });

        // Seed history so the first in-app Back has a hub state to land on.
        replaceNursePathState({ view: 'hub', tab: 'tools' });

        // Restore hub mode on load
        applyHubMode(readHubMode(), { silent: true });

        function calcPediatricDose() {
            const calc = window.NursePathCalculators;
            if (!calc) return;
            const result = calc.pediatricDose({
                weightKg: document.getElementById('peds-weight').value,
                ageYears: document.getElementById('peds-age').value,
                mgPerKg: document.getElementById('peds-mgkg').value,
                adultDoseMg: document.getElementById('peds-adult').value,
                maxDoseMg: document.getElementById('peds-max').value
            });
            document.getElementById('peds-weight-result').textContent = result.weightBasedMg != null ? `${result.weightBasedMg} mg` : '--';
            document.getElementById('peds-clarks-result').textContent = result.clarksMg != null ? `${result.clarksMg} mg` : '--';
            document.getElementById('peds-youngs-result').textContent = result.youngsMg != null ? `${result.youngsMg} mg` : '--';
            document.getElementById('peds-notes').textContent = (result.notes || []).join(' ');
            const pedsMeaning = document.getElementById('peds-learn-meaning');
            if (pedsMeaning) {
                if (result.weightBasedMg != null) {
                    pedsMeaning.textContent = `Prefer mg/kg for practice (${result.weightBasedMg} mg). Clark/Young are exam-style cross-checks.`;
                } else {
                    pedsMeaning.textContent = 'Enter weight + mg/kg (and adult dose for Clark/Young).';
                }
            }
            trackUsageSafe('peds_dose', 'result_generated', { has_value: result.weightBasedMg != null }, { minIntervalMs: 1500, rateKey: 'peds_dose' });
        }

        const APGAR_RUBRIC = [
            {
                id: 'appearance',
                letter: 'A',
                name: 'Appearance (Color)',
                hint: 'Skin color of the newborn',
                options: [
                    { value: 2, label: 'Completely pink', desc: 'Entire body pink, good perfusion.' },
                    { value: 1, label: 'Acrocyanosis', desc: 'Body pink with blue hands and feet, common at 1 minute.' },
                    { value: 0, label: 'Blue / pale', desc: 'Central cyanosis or pallor, needs support.' }
                ]
            },
            {
                id: 'pulse',
                letter: 'P',
                name: 'Pulse (Heart rate)',
                hint: 'Count apical HR for 1 full minute when possible',
                options: [
                    { value: 2, label: '> 100 bpm', desc: 'Strong HR above 100.' },
                    { value: 1, label: '< 100 bpm', desc: 'HR present but under 100.' },
                    { value: 0, label: 'Absent', desc: 'No detectable heartbeat.' }
                ]
            },
            {
                id: 'grimace',
                letter: 'G',
                name: 'Grimace (Reflex irritability)',
                hint: 'Response to suction or mild stimulus',
                options: [
                    { value: 2, label: 'Cry / sneeze / cough', desc: 'Vigorous response to stimulus.' },
                    { value: 1, label: 'Grimace only', desc: 'Facial grimace without strong cry.' },
                    { value: 0, label: 'No response', desc: 'No reflex to stimulus.' }
                ]
            },
            {
                id: 'activity',
                letter: 'A',
                name: 'Activity (Muscle tone)',
                hint: 'Watch flexion and movement',
                options: [
                    { value: 2, label: 'Active motion', desc: 'Well-flexed with active movement.' },
                    { value: 1, label: 'Some flexion', desc: 'Some flexion of extremities.' },
                    { value: 0, label: 'Limp / flaccid', desc: 'No tone, a floppy newborn.' }
                ]
            },
            {
                id: 'respiration',
                letter: 'R',
                name: 'Respiration',
                hint: 'Effort and cry quality',
                options: [
                    { value: 2, label: 'Good cry / strong effort', desc: 'Strong cry, good respiratory effort.' },
                    { value: 1, label: 'Slow / irregular / weak cry', desc: 'Weak, gasping, or irregular respirations.' },
                    { value: 0, label: 'Absent', desc: 'No breathing effort.' }
                ]
            }
        ];

        const BRADEN_RUBRIC = [
            {
                id: 'sensory',
                name: 'Sensory Perception',
                hint: 'Ability to respond meaningfully to pressure-related discomfort',
                options: [
                    { value: 4, label: 'No impairment', desc: 'Feels and reports pain/discomfort normally.' },
                    { value: 3, label: 'Slightly limited', desc: 'Responds to verbal commands; cannot always communicate discomfort.' },
                    { value: 2, label: 'Very limited', desc: 'Responds only to pain; cannot communicate discomfort well.' },
                    { value: 1, label: 'Completely limited', desc: 'Unresponsive or limited ability to feel pain over most of body.' }
                ]
            },
            {
                id: 'moisture',
                name: 'Moisture',
                hint: 'Degree to which skin is exposed to moisture',
                options: [
                    { value: 4, label: 'Rarely moist', desc: 'Skin usually dry; linen changed routinely.' },
                    { value: 3, label: 'Occasionally moist', desc: 'Extra linen change about once a day.' },
                    { value: 2, label: 'Very moist', desc: 'Often damp; linen changed at least once per shift.' },
                    { value: 1, label: 'Constantly moist', desc: 'Skin almost always moist from perspiration/urine, etc.' }
                ]
            },
            {
                id: 'activity',
                name: 'Activity',
                hint: 'Degree of physical activity',
                options: [
                    { value: 4, label: 'Walks frequently', desc: 'Walks outside room at least twice a day.' },
                    { value: 3, label: 'Walks occasionally', desc: 'Walks short distances with/without help; spends most of shift in bed/chair.' },
                    { value: 2, label: 'Chairfast', desc: 'Ability to walk severely limited; cannot bear own weight.' },
                    { value: 1, label: 'Bedfast', desc: 'Confined to bed.' }
                ]
            },
            {
                id: 'mobility',
                name: 'Mobility',
                hint: 'Ability to change and control body position',
                options: [
                    { value: 4, label: 'No limitations', desc: 'Makes major and frequent position changes independently.' },
                    { value: 3, label: 'Slightly limited', desc: 'Makes frequent though slight changes independently.' },
                    { value: 2, label: 'Very limited', desc: 'Makes occasional slight changes; unable to make frequent major changes alone.' },
                    { value: 1, label: 'Completely immobile', desc: 'Does not make even slight position changes without assistance.' }
                ]
            },
            {
                id: 'nutrition',
                name: 'Nutrition',
                hint: 'Usual food intake pattern',
                options: [
                    { value: 4, label: 'Excellent', desc: 'Eats most of every meal; never refuses; eats protein sources.' },
                    { value: 3, label: 'Adequate', desc: 'Eats over half of most meals; occasional supplement.' },
                    { value: 2, label: 'Probably inadequate', desc: 'Rarely eats a complete meal; only about 1/2 of food offered.' },
                    { value: 1, label: 'Very poor', desc: 'Never finishes a meal; little protein; NPO / clear liquids often.' }
                ]
            },
            {
                id: 'friction',
                name: 'Friction & Shear',
                hint: 'Scored 1–3 only',
                options: [
                    { value: 3, label: 'No apparent problem', desc: 'Moves in bed/chair independently; sufficient muscle strength.' },
                    { value: 2, label: 'Potential problem', desc: 'Moves feebly or requires minimum assistance; skin may slide against sheets.' },
                    { value: 1, label: 'Problem', desc: 'Requires moderate to max assist; frequent sliding / friction.' }
                ]
            }
        ];

        const GCS_RUBRIC = [
            {
                id: 'eye',
                key: 'eye',
                name: 'Eye Opening (E)',
                hint: 'Best eye response',
                options: [
                    { value: 4, label: 'Spontaneous', desc: 'Opens eyes on own.' },
                    { value: 3, label: 'To speech', desc: 'Opens to voice.' },
                    { value: 2, label: 'To pain', desc: 'Opens only to pain.' },
                    { value: 1, label: 'None', desc: 'No eye opening.' }
                ]
            },
            {
                id: 'verbal',
                key: 'verbal',
                name: 'Verbal Response (V)',
                hint: 'Best verbal response',
                options: [
                    { value: 5, label: 'Oriented', desc: 'Knows person/place/time.' },
                    { value: 4, label: 'Confused', desc: 'Converses but confused.' },
                    { value: 3, label: 'Inappropriate words', desc: 'Random words, no conversation.' },
                    { value: 2, label: 'Incomprehensible sounds', desc: 'Moaning / groaning only.' },
                    { value: 1, label: 'None', desc: 'No verbal response.' }
                ]
            },
            {
                id: 'motor',
                key: 'motor',
                name: 'Motor Response (M)',
                hint: 'Best motor response',
                options: [
                    { value: 6, label: 'Obeys commands', desc: 'Follows instructions.' },
                    { value: 5, label: 'Localizes pain', desc: 'Purposeful movement toward pain.' },
                    { value: 4, label: 'Withdraws from pain', desc: 'Pulls away from pain.' },
                    { value: 3, label: 'Abnormal flexion', desc: 'Decorticate posturing.' },
                    { value: 2, label: 'Extension', desc: 'Decerebrate posturing.' },
                    { value: 1, label: 'None', desc: 'No motor response.' }
                ]
            }
        ];

        const apgarState = {};
        const bradenState = {};
        const gcsState = { eye: null, verbal: null, motor: null };

        function renderScoreOptions(host, rubric, stateObj, onChange) {
            if (!host) return;
            host.innerHTML = rubric.map((item) => {
                const selected = stateObj[item.id];
                const optionsHtml = item.options.map((opt) => {
                    const isSel = Number(selected) === Number(opt.value);
                    return `<button type="button" class="score-option${isSel ? ' is-selected' : ''}" data-id="${item.id}" data-value="${opt.value}">
                        <span class="score-option-num">${opt.value}</span>
                        <span class="score-option-text"><span class="score-option-label">${opt.label}</span><span class="score-option-desc">${opt.desc}</span></span>
                    </button>`;
                }).join('');
                const letter = item.letter ? `<span class="score-criterion-letter">${item.letter}</span>` : '';
                return `<section class="score-criterion" data-criterion="${item.id}">
                    <div class="score-criterion-head">
                        <div>${letter}<div class="score-criterion-name">${item.name}</div></div>
                        <div class="score-criterion-hint">${item.hint || ''}</div>
                    </div>
                    <div class="score-options">${optionsHtml}</div>
                </section>`;
            }).join('');

            host.querySelectorAll('.score-option').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const value = Number(btn.getAttribute('data-value'));
                    stateObj[id] = value;
                    renderScoreOptions(host, rubric, stateObj, onChange);
                    onChange();
                });
            });
        }

        function initApgarInputs() {
            const host = document.getElementById('apgar-inputs');
            if (!host) return;
            if (!Object.keys(apgarState).length) {
                APGAR_RUBRIC.forEach((r) => { apgarState[r.id] = null; });
            }
            renderScoreOptions(host, APGAR_RUBRIC, apgarState, calcApgar);
            calcApgar();
        }

        function calcApgar() {
            const calc = window.NursePathCalculators;
            if (!calc) return;
            const complete = APGAR_RUBRIC.every((r) => apgarState[r.id] != null);
            const totalEl = document.getElementById('apgar-total');
            const interpEl = document.getElementById('apgar-interp');
            if (!complete) {
                if (totalEl) totalEl.textContent = '--';
                if (interpEl) interpEl.textContent = 'Select all five domains to score.';
                return;
            }
            const result = calc.apgarScore(apgarState);
            if (totalEl) totalEl.textContent = String(result.total);
            if (interpEl) interpEl.textContent = result.interpretation;
            const meaning = document.getElementById('apgar-learn-meaning');
            if (meaning) meaning.textContent = `Total ${result.total} of 10. ${result.interpretation}`;
            trackUsageSafe('apgar', 'result_generated', { total: result.total }, { minIntervalMs: 1500, rateKey: 'apgar' });
        }

        function initGcsInputs() {
            const host = document.getElementById('gcs-inputs');
            if (!host) return;
            // Map rubric ids to gcsState keys
            const mapped = GCS_RUBRIC.map((r) => ({ ...r, id: r.key }));
            renderScoreOptions(host, mapped, gcsState, calcGCS);
            calcGCS();
        }

        function calcGCS() {
            const calc = window.NursePathCalculators;
            if (!calc) return;
            const eyeChip = document.getElementById('gcs-chip-eye');
            const verbalChip = document.getElementById('gcs-chip-verbal');
            const motorChip = document.getElementById('gcs-chip-motor');
            if (eyeChip) eyeChip.textContent = gcsState.eye != null ? `E${gcsState.eye}` : 'E—';
            if (verbalChip) verbalChip.textContent = gcsState.verbal != null ? `V${gcsState.verbal}` : 'V—';
            if (motorChip) motorChip.textContent = gcsState.motor != null ? `M${gcsState.motor}` : 'M—';

            const totalEl = document.getElementById('gcs-total');
            const sevEl = document.getElementById('gcs-severity');
            const attentionEl = document.getElementById('gcs-learn-attention');
            if (gcsState.eye == null || gcsState.verbal == null || gcsState.motor == null) {
                if (totalEl) totalEl.textContent = '--';
                if (sevEl) sevEl.textContent = 'Select Eye, Verbal, and Motor.';
                if (attentionEl) attentionEl.textContent = 'Score Eye, Verbal, and Motor for a watch/report cue. Soft guidance only; confirm with your Clinical Instructor.';
                return;
            }
            const result = calc.gcsScore(gcsState.eye, gcsState.verbal, gcsState.motor);
            if (totalEl) totalEl.textContent = `${result.total}`;
            if (sevEl) sevEl.textContent = `${result.severity} · Report as E${result.eye}V${result.verbal}M${result.motor}`;
            const meaning = document.getElementById('gcs-learn-meaning');
            if (meaning) meaning.textContent = `${result.severity} · Document E${result.eye}V${result.verbal}M${result.motor}`;
            if (attentionEl) attentionEl.textContent = result.attention || '';
            trackUsageSafe('gcs', 'result_generated', { total: result.total }, { minIntervalMs: 1500, rateKey: 'gcs' });
        }

        function initBradenInputs() {
            const host = document.getElementById('braden-inputs');
            if (!host) return;
            if (!Object.keys(bradenState).length) {
                BRADEN_RUBRIC.forEach((r) => { bradenState[r.id] = null; });
            }
            renderScoreOptions(host, BRADEN_RUBRIC, bradenState, calcBraden);
            calcBraden();
        }

        function calcBraden() {
            const calc = window.NursePathCalculators;
            if (!calc) return;
            const complete = BRADEN_RUBRIC.every((r) => bradenState[r.id] != null);
            const totalEl = document.getElementById('braden-total');
            const riskEl = document.getElementById('braden-risk');
            const attentionEl = document.getElementById('braden-learn-attention');
            if (!complete) {
                if (totalEl) totalEl.textContent = '--';
                if (riskEl) riskEl.textContent = 'Score all six subscales.';
                if (attentionEl) attentionEl.textContent = 'Score all six subscales for risk-band and prevention-focus cues. Soft guidance only; confirm with your Clinical Instructor.';
                return;
            }
            const result = calc.bradenScore(bradenState);
            if (totalEl) totalEl.textContent = String(result.total);
            if (riskEl) riskEl.textContent = result.risk;
            const meaning = document.getElementById('braden-learn-meaning');
            if (meaning) meaning.textContent = `Total ${result.total} of 23. ${result.risk}`;
            if (attentionEl) attentionEl.textContent = result.attention || '';
            trackUsageSafe('braden', 'result_generated', { total: result.total }, { minIntervalMs: 1500, rateKey: 'braden' });
        }

        const ronSelection = {};

        function initRuleOfNines() {
            const calc = window.NursePathCalculators;
            const host = document.getElementById('ron-grid');
            if (!calc || !host) return;
            if (host.dataset.ready === '1') {
                renderRuleOfNines();
                return;
            }
            host.innerHTML = calc.RULE_OF_NINES_REGIONS.map((region) => `
                <button type="button" class="ron-region" data-region="${region.id}" onclick="cycleRonRegion('${region.id}')">
                    <div class="text-sm font-bold text-slate-100">${region.label}</div>
                    <div class="text-[11px] text-slate-400">Full = ${region.full}%</div>
                    <div class="text-xs text-orange-300 mt-1" data-state>Off</div>
                </button>`).join('');
            host.dataset.ready = '1';
            renderRuleOfNines();
        }

        function cycleRonRegion(regionId) {
            const current = ronSelection[regionId] || 0;
            const next = current === 0 ? 0.5 : (current === 0.5 ? 1 : 0);
            if (next === 0) delete ronSelection[regionId];
            else ronSelection[regionId] = next;
            renderRuleOfNines();
        }

        function renderRuleOfNines() {
            const calc = window.NursePathCalculators;
            if (!calc) return;
            const result = calc.ruleOfNines(ronSelection);
            document.getElementById('ron-tbsa').textContent = `${result.tbsa}%`;
            document.getElementById('ron-note').textContent = result.note;
            document.getElementById('ron-breakdown').textContent = result.breakdown.length
                ? result.breakdown.map((b) => `${b.label}: ${b.percent}%`).join(' · ')
                : 'No regions selected';
            const ronMeaning = document.getElementById('ron-learn-meaning');
            if (ronMeaning) ronMeaning.textContent = result.tbsa > 0 ? `${result.tbsa}% TBSA. ${result.note}` : 'Adult Rule of Nines TBSA estimate for teaching.';
            document.querySelectorAll('#ron-grid .ron-region').forEach((btn) => {
                const id = btn.getAttribute('data-region');
                const frac = ronSelection[id] || 0;
                btn.classList.toggle('is-half', frac === 0.5);
                btn.classList.toggle('is-full', frac === 1);
                const state = btn.querySelector('[data-state]');
                if (state) state.textContent = frac === 1 ? 'Full' : (frac === 0.5 ? 'Half' : 'Off');
            });
            trackUsageSafe('rule_of_nines', 'feature_use', { tbsa: result.tbsa }, { minIntervalMs: 2000, rateKey: 'ron_update' });
        }

        function resetRuleOfNines() {
            Object.keys(ronSelection).forEach((k) => delete ronSelection[k]);
            renderRuleOfNines();
        }

        window.openClinicalTool = openClinicalTool;
        window.openHubTool = openHubTool;
        window.backToToolsHub = backToToolsHub;
        window.openToolGuide = openToolGuide;
        window.closeToolGuide = closeToolGuide;
        window.setHubMode = setHubMode;
        window.setStudyTab = setStudyTab;
        window.submitStudyQuizAnswer = submitStudyQuizAnswer;
        window.advanceStudyQuiz = advanceStudyQuiz;
        window.retakeStudyQuiz = retakeStudyQuiz;
        window.pushNursePathState = pushNursePathState;
        window.replaceNursePathState = replaceNursePathState;
        window.calcPediatricDose = calcPediatricDose;
        window.calcApgar = calcApgar;
        window.calcGCS = calcGCS;
        window.initGcsInputs = initGcsInputs;
        window.calcBraden = calcBraden;
        window.cycleRonRegion = cycleRonRegion;
        window.resetRuleOfNines = resetRuleOfNines;


        // Initialize calc date to today
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('calc-date').value = today;
        });

        // Calculators stay button-driven so each result is an explicit, logged action.

        // ------------------ OTC Medicines Data + Search ------------------
        const otcDatabase = [
            {
                id: 'acetaminophen',
                name: 'Acetaminophen',
                ph_brands: ['Biogesic', 'Tempra', 'Calpol', 'Tylenol', 'Panadol'],
                uses: 'Fever, mild to moderate pain relief (headache, myalgia)',
                origin: 'Synthetic analgesic discovered in the late 19th century',
                whenToGive: 'For fever >38°C or pain as needed; follow dosing limits (max 4g/day)',
                contraindications: 'Severe hepatic impairment, chronic alcohol use; check liver function if repeated dosing',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['fever','pain','analgesic'],
                // Additional Information (only shown in OTC Reference Directory when tab is clicked)
                additionalInfo: {
                    genericNames: ['Paracetamol', 'APAP', 'N-acetyl-p-aminophenol'],
                    drugClass: 'Analgesic, Antipyretic (Non-opioid)',
                    usesExpanded: 'Fever reduction (antipyretic), mild to moderate pain relief including headache, toothache, muscle aches, backache, menstrual cramps, arthritis pain, post-vaccination fever, and post-operative pain management',
                    mechanismOfAction: 'Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis. Unlike NSAIDs, it has minimal peripheral anti-inflammatory activity. Also activates descending serotonergic pathways and may interact with the endocannabinoid system for pain modulation.',
                    originExpanded: 'First synthesized in 1877 by Harmon Northrop Morse. Clinically used since 1893. Became widely available after 1950s when it was found to be safer than phenacetin. Named "paracetamol" from para-acetylaminophenol.',
                    pharmacokinetics: 'Absorption: Rapid oral absorption (30-60 min to peak). Bioavailability: 63-89%. Distribution: Widely distributed, crosses blood-brain barrier. Metabolism: Hepatic via glucuronidation (60%), sulfation (35%), and CYP2E1 oxidation (5% - produces toxic NAPQI metabolite). Half-life: 1.5-3 hours. Excretion: Renal (90% as metabolites).',
                    dosing: 'Adults: 500-1000mg every 4-6 hours (max 4g/day, or 3g/day for chronic use or elderly). Pediatric: 10-15mg/kg/dose every 4-6 hours (max 75mg/kg/day, not exceeding 4g). Reduce dose in hepatic impairment.',
                    whenToGiveExpanded: 'Administer for fever >38°C (100.4°F) or pain as needed. Can be given with or without food. For consistent fever control, give at regular intervals rather than PRN. Preferred analgesic in patients where NSAIDs are contraindicated (renal disease, GI bleeding risk, aspirin-sensitive asthma).',
                    sideEffects: 'Common: Generally well-tolerated at therapeutic doses. Rare: Skin rash, hypersensitivity reactions. Serious (overdose): Hepatotoxicity (nausea, vomiting, RUQ pain within 24 hours, followed by liver failure at 72-96 hours), acute kidney injury. Chronic use: Potential nephrotoxicity.',
                    contraindicationsExpanded: 'Absolute: Severe hepatic impairment, active liver disease, known hypersensitivity. Relative: Chronic alcohol use (>3 drinks/day), malnutrition, glutathione depletion, G6PD deficiency, concurrent use of hepatotoxic drugs or CYP2E1 inducers.',
                    drugInteractions: 'Warfarin: May increase INR with chronic use. Alcohol: Increased hepatotoxicity risk. Isoniazid, rifampin, phenytoin, carbamazepine: CYP450 inducers increase toxic metabolite formation. Metoclopramide: Increases absorption rate. Cholestyramine: Decreases absorption.',
                    nursingConsiderations: '1) Assess pain level before and 30-60 min after administration using appropriate pain scale. 2) Monitor liver function tests if prolonged use. 3) Check for acetaminophen in combination products to avoid inadvertent overdose. 4) Teach patient about maximum daily dose and hidden sources in OTC products. 5) For overdose: N-acetylcysteine (NAC) is the antidote - most effective within 8-10 hours.',
                    patientEducation: 'Do not exceed 4g/day from ALL sources combined. Read labels of cold/flu medications as many contain acetaminophen. Avoid alcohol while taking this medication. Seek immediate medical attention if you experience nausea, vomiting, loss of appetite, or yellowing of skin/eyes. Safe for pregnancy (Category B) when used as directed.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'SAFE (preferred analgesic)', liver_disease: '⚠️ CONTRAINDICATED' }
                }
            },
            {
                id: 'ibuprofen',
                name: 'Ibuprofen',
                ph_brands: ['Advil', 'Motrin', 'Medicol Advance', 'Midol', 'Brufen'],
                uses: 'Pain, inflammation, fever',
                origin: 'A widely used NSAID introduced in the 1960s',
                whenToGive: 'For inflammatory pain or fever; give with food to reduce GI upset',
                contraindications: 'Active peptic ulcer disease, severe renal impairment, hypersensitivity to NSAIDs',
                conditionSafety: { hypertension: 'CAUTION', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED' },
                tags: ['pain','fever','inflammation','nsaid'],
                additionalInfo: {
                    genericNames: ['Ibuprofen', '2-(4-isobutylphenyl)propionic acid'],
                    drugClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID), Propionic Acid Derivative',
                    usesExpanded: 'Mild to moderate pain (headache, dental pain, menstrual cramps, muscle aches), inflammatory conditions (arthritis, tendinitis, bursitis), fever reduction, primary dysmenorrhea, patent ductus arteriosus closure in neonates (IV form)',
                    mechanismOfAction: 'Non-selective inhibition of cyclooxygenase (COX-1 and COX-2) enzymes, blocking prostaglandin synthesis. This reduces inflammation, pain, and fever. COX-1 inhibition causes GI and platelet side effects; COX-2 inhibition provides anti-inflammatory effects.',
                    originExpanded: 'Developed by Stewart Adams and John Nicholson at Boots UK in 1961. First used for rheumatoid arthritis in 1969. Became available OTC in the US in 1984. Named from iso-butyl-propanoic-phenolic acid.',
                    pharmacokinetics: 'Absorption: Rapid and complete (80-100% bioavailability). Peak: 1-2 hours. Distribution: 99% protein-bound. Metabolism: Hepatic via CYP2C9 to inactive metabolites. Half-life: 2-4 hours. Excretion: Renal (90% as metabolites). Food delays absorption but does not reduce extent.',
                    dosing: 'Adults: 200-400mg every 4-6 hours (max 1200mg/day OTC, 3200mg/day prescription). Pediatric (6mo+): 5-10mg/kg every 6-8 hours (max 40mg/kg/day). Take with food or milk. Reduce dose in renal impairment.',
                    whenToGiveExpanded: 'For inflammatory pain, fever, or conditions requiring anti-inflammatory effect. Always give with food, milk, or antacid to minimize GI irritation. Best for inflammatory conditions vs acetaminophen. Use lowest effective dose for shortest duration.',
                    sideEffects: 'Common: GI upset, nausea, dyspepsia, abdominal pain, diarrhea, constipation, headache, dizziness. Serious: GI bleeding/ulceration, cardiovascular events (MI, stroke), renal impairment, hypersensitivity reactions, Stevens-Johnson syndrome, aseptic meningitis.',
                    contraindicationsExpanded: 'Absolute: Active GI bleeding, history of NSAID-induced asthma/urticaria/angioedema, third trimester pregnancy, severe heart failure, post-CABG surgery. Relative: History of peptic ulcer, renal impairment, hypertension, heart failure, concurrent anticoagulants, elderly patients.',
                    drugInteractions: 'Anticoagulants (warfarin): Increased bleeding risk. Aspirin: Reduced cardioprotective effect, increased GI risk. ACE inhibitors/ARBs: Reduced antihypertensive effect, increased renal risk. Lithium: Increased lithium levels. Methotrexate: Increased toxicity. Diuretics: Reduced efficacy.',
                    nursingConsiderations: '1) Assess pain level and location before and 1 hour after administration. 2) Monitor for GI bleeding (dark stools, hematemesis). 3) Check renal function and BP in long-term use. 4) Assess for signs of cardiovascular events. 5) Educate about taking with food. 6) Monitor for allergic reactions especially in aspirin-sensitive patients.',
                    patientEducation: 'Take with food or milk to prevent stomach upset. Do not lie down for 30 minutes after taking. Avoid alcohol. Report black/tarry stools, persistent stomach pain, or unusual bleeding. Do not exceed recommended dose. Inform healthcare provider before surgery. Avoid if pregnant (especially third trimester).',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - can elevate BP', diabetes: 'SAFE', asthma: 'CAUTION - risk of bronchospasm in aspirin-sensitive', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED', pregnancy: '⚠️ CONTRAINDICATED in 3rd trimester', gi_disease: 'CAUTION' }
                }
            },
            {
                id: 'diphenhydramine',
                name: 'Diphenhydramine',
                ph_brands: ['Benadryl', 'Allergia', 'Unisom SleepGels', 'ZzzQuil', 'Sleepwell'],
                uses: 'Allergic reactions, urticaria, short-term insomnia',
                origin: 'First-generation antihistamine introduced in the 1940s',
                whenToGive: 'For mild allergic symptoms; caution with sedation',
                contraindications: 'Elderly (falls), glaucoma, urinary retention, MAOI use',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['allergy','antihistamine','sleep','sedating'],
                additionalInfo: {
                    genericNames: ['Diphenhydramine HCl', 'Diphenhydramine Citrate'],
                    drugClass: 'First-Generation Antihistamine (H1-receptor antagonist), Sedating Antihistamine, Anticholinergic',
                    usesExpanded: 'Allergic rhinitis, allergic conjunctivitis, urticaria (hives), pruritus, anaphylaxis (adjunct), motion sickness, short-term insomnia, common cold symptoms, antitussive, drug-induced extrapyramidal symptoms, mild Parkinsonism',
                    mechanismOfAction: 'Competitively blocks H1-histamine receptors, preventing histamine-mediated allergic responses. Crosses blood-brain barrier causing CNS depression (sedation). Also has anticholinergic (muscarinic) blocking activity and local anesthetic properties.',
                    originExpanded: 'Discovered by George Rieveschl at the University of Cincinnati in 1943. First antihistamine approved by the FDA in 1946. Marketed as Benadryl. Became one of the most widely used OTC medications worldwide.',
                    pharmacokinetics: 'Absorption: Well absorbed orally (40-60% bioavailability due to first-pass metabolism). Onset: 15-30 minutes. Peak: 1-4 hours. Distribution: Widely distributed, crosses BBB and placenta. Metabolism: Hepatic via CYP2D6. Half-life: 2.4-9.3 hours (longer in elderly). Excretion: Renal.',
                    dosing: 'Adults: 25-50mg every 4-6 hours (max 300mg/day). For sleep: 25-50mg at bedtime. Pediatric (6-12y): 12.5-25mg every 4-6 hours (max 150mg/day). Children 2-6y: 6.25mg every 4-6 hours. Not recommended <2 years.',
                    whenToGiveExpanded: 'For acute allergic reactions, hives, or itching. For sleep: take 30 minutes before bedtime. For motion sickness: take 30 minutes before travel. Avoid in activities requiring alertness. Consider non-sedating antihistamines (cetirizine, loratadine) for daytime allergies.',
                    sideEffects: 'Common: Drowsiness, sedation, dry mouth, urinary retention, constipation, blurred vision, thickened bronchial secretions, dizziness. Serious: Paradoxical excitation (especially in children), seizures (overdose), anticholinergic toxicity, hypersensitivity reactions.',
                    contraindicationsExpanded: 'Absolute: Neonates/premature infants, breastfeeding (can cause irritability/sedation in infants), MAOI use within 14 days, acute asthma attack. Relative: Elderly (fall risk, confusion), narrow-angle glaucoma, prostatic hypertrophy, GI/GU obstruction, hyperthyroidism, cardiovascular disease.',
                    drugInteractions: 'CNS depressants (alcohol, benzodiazepines, opioids): Additive sedation. MAOIs: Prolonged and intensified anticholinergic effects. Anticholinergics: Additive effects. CYP2D6 inhibitors: Increased diphenhydramine levels. May mask ototoxicity of aminoglycosides.',
                    nursingConsiderations: '1) Assess allergy symptoms before and after administration. 2) Monitor for excessive sedation, especially in elderly. 3) Assess fall risk and implement safety measures. 4) Monitor for anticholinergic effects (dry mouth, urinary retention, constipation). 5) Caution patient about driving/operating machinery. 6) Not recommended for chronic insomnia.',
                    patientEducation: 'Causes drowsiness - avoid driving or operating machinery. Avoid alcohol and other sedatives. May cause dry mouth - sip water or suck hard candy. Report difficulty urinating or severe constipation. Not for long-term sleep use - can cause tolerance. Keep away from children due to overdose risk.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION - may thicken secretions', copd: 'CAUTION - anticholinergic effects', ckd: 'SAFE', pregnancy: 'Category B - consult provider', elderly: '⚠️ AVOID - Beers Criteria' }
                }
            },
            {
                id: 'omeprazole',
                name: 'Omeprazole',
                ph_brands: ['Losec', 'Prilosec', 'Omepron', 'Gastroloc', 'Zegerid'],
                uses: 'Gastroesophageal reflux disease, peptic ulcer disease',
                origin: 'Proton pump inhibitor introduced in the late 1980s',
                whenToGive: 'For symptomatic heartburn or diagnosed reflux; usually once daily before meals',
                contraindications: 'Known hypersensitivity; caution long-term (B12, Mg, C.diff risk)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['reflux','heartburn','acid','ppi'],
                additionalInfo: {
                    genericNames: ['Omeprazole', 'Omeprazole Magnesium'],
                    drugClass: 'Proton Pump Inhibitor (PPI), Gastric Acid Secretion Inhibitor',
                    usesExpanded: 'GERD (erosive and non-erosive), peptic ulcer disease (gastric and duodenal), H. pylori eradication (with antibiotics), Zollinger-Ellison syndrome, stress ulcer prophylaxis, NSAID-induced ulcer prevention, dyspepsia',
                    mechanismOfAction: 'Irreversibly inhibits the hydrogen-potassium ATPase (proton pump) in gastric parietal cells. This is the final step of acid secretion, resulting in profound and prolonged suppression of gastric acid production (up to 90% reduction). Requires activation in acidic environment.',
                    originExpanded: 'Developed by AstraZeneca (then Hässle) in Sweden. First PPI approved by FDA in 1989. Revolutionary treatment for acid-related disorders. Named from OME (oxygen-methyl-ethyl) and PRAZOLE (common PPI suffix).',
                    pharmacokinetics: 'Absorption: Rapid but variable (30-40% bioavailability, increased to 60% with repeated doses). Peak: 0.5-3.5 hours. Distribution: 95% protein-bound. Metabolism: Extensive hepatic via CYP2C19 and CYP3A4. Half-life: 0.5-1 hour (but effect lasts 24 hours due to irreversible binding). Excretion: 80% renal, 20% fecal.',
                    dosing: 'GERD: 20mg once daily for 4-8 weeks. Peptic ulcer: 20-40mg once daily for 4-8 weeks. H. pylori: 20mg twice daily with antibiotics for 10-14 days. Maintenance: 10-20mg daily. Take 30-60 minutes before breakfast on empty stomach.',
                    whenToGiveExpanded: 'Administer 30-60 minutes before the first meal of the day for maximum efficacy. Swallow capsules whole - do not crush or chew. For patients with difficulty swallowing, can open capsule and mix granules with applesauce. OTC use limited to 14 days; see physician if symptoms persist.',
                    sideEffects: 'Common: Headache, diarrhea, abdominal pain, nausea, flatulence, dizziness. Long-term: Vitamin B12 deficiency, hypomagnesemia, increased fracture risk (hip, wrist, spine), C. difficile infection, community-acquired pneumonia, fundic gland polyps.',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to PPIs or benzimidazoles, concurrent rilpivirine use. Relative: Osteoporosis (long-term use), hepatic impairment (dose adjustment), pregnancy (use only if clearly needed), patients at risk for B12 or magnesium deficiency.',
                    drugInteractions: 'Clopidogrel: Reduced antiplatelet effect (CYP2C19 interaction) - avoid combination. Methotrexate: Increased levels. Digoxin: Increased absorption. Warfarin: May increase INR. Ketoconazole, itraconazole, iron: Reduced absorption due to decreased gastric acid. CYP2C19 substrates: Potential interactions.',
                    nursingConsiderations: '1) Assess GI symptoms before and during therapy. 2) Monitor for signs of C. difficile (watery diarrhea, abdominal pain). 3) Monitor magnesium levels in long-term use. 4) Educate about proper timing (before meals). 5) Monitor for bone fractures in long-term elderly patients. 6) Check B12 levels periodically in chronic use.',
                    patientEducation: 'Take 30-60 minutes before breakfast. Swallow whole - do not crush or chew. Complete full course even if feeling better. Report persistent diarrhea, bone pain, or muscle cramps/spasms. Not for immediate heartburn relief - use antacids for quick relief. Limit OTC use to 14 days; consult physician for ongoing symptoms.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Category C - use if benefit outweighs risk', osteoporosis: 'CAUTION - long-term use increases fracture risk' }
                }
            },
            {
                id: 'dextromethorphan',
                name: 'Dextromethorphan',
                ph_brands: ['Robitussin DM', 'Delsym', 'Tuseran', 'Benadryl DM', 'NyQuil'],
                uses: 'Non-productive cough suppression',
                origin: 'Synthetic cough suppressant used since mid-20th century',
                whenToGive: 'For dry cough disrupting rest; avoid in productive cough',
                contraindications: 'MAOI use, some serotonergic meds (risk of serotonin syndrome)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['cough','antitussive','dry cough'],
                additionalInfo: {
                    genericNames: ['Dextromethorphan HBr', 'Dextromethorphan Polistirex', 'DXM', 'DM'],
                    drugClass: 'Antitussive (Cough Suppressant), Non-opioid, NMDA Receptor Antagonist',
                    usesExpanded: 'Temporary relief of non-productive (dry) cough due to common cold, flu, or inhaled irritants. Also being studied for pseudobulbar affect (combination with quinidine), neuropathic pain, and as an adjunct in opioid withdrawal.',
                    mechanismOfAction: 'Acts centrally on the cough center in the medulla oblongata by elevating cough threshold. Unlike codeine, it has minimal opioid activity. Also acts as an NMDA receptor antagonist and sigma-1 receptor agonist, contributing to its dissociative effects at high doses.',
                    originExpanded: 'Developed in the 1950s by the US Navy and CIA as a non-addictive alternative to codeine for cough suppression. FDA approved in 1958. Became the most widely used cough suppressant globally. "Dextro" indicates it is the right-handed isomer of levomethorphan.',
                    pharmacokinetics: 'Absorption: Rapidly absorbed orally. Onset: 15-30 minutes. Peak: 2-3 hours (immediate-release), 6 hours (extended-release). Metabolism: Extensive hepatic via CYP2D6 to active metabolite dextrorphan. Half-life: 3-6 hours (up to 24 hours in CYP2D6 poor metabolizers). Excretion: Renal.',
                    dosing: 'Adults & children >12y: 10-20mg every 4 hours or 30mg every 6-8 hours (max 120mg/day). Extended-release: 60mg every 12 hours. Children 6-12y: 5-10mg every 4 hours or 15mg every 6-8 hours. Not recommended <4 years.',
                    whenToGiveExpanded: 'For dry, hacking cough that disrupts sleep or daily activities. NOT for productive cough (with mucus) as suppressing the cough reflex can lead to mucus accumulation. Best used at bedtime if cough is disrupting sleep. Increase fluid intake to help loosen secretions.',
                    sideEffects: 'Common: Dizziness, drowsiness, nausea, stomach upset. High doses: Confusion, excitability, nervousness, restlessness, slurred speech, hallucinations, dissociative effects. Serious: Serotonin syndrome (with serotonergic drugs), respiratory depression (massive overdose).',
                    contraindicationsExpanded: 'Absolute: MAOI use within 14 days (can cause fatal serotonin syndrome), hypersensitivity. Relative: Chronic cough (smokers, asthma, emphysema - needs evaluation), productive cough, concurrent serotonergic medications (SSRIs, SNRIs), CYP2D6 poor metabolizers, history of substance abuse.',
                    drugInteractions: 'MAOIs: LIFE-THREATENING - can cause serotonin syndrome, hyperpyrexia, death. SSRIs/SNRIs: Increased risk of serotonin syndrome. CYP2D6 inhibitors (quinidine, fluoxetine, paroxetine): Increased DXM levels. Alcohol/CNS depressants: Additive effects. Haloperidol: Increased sedation.',
                    nursingConsiderations: '1) Assess cough characteristics - only for non-productive cough. 2) Monitor respiratory status. 3) Check medication list for MAOIs and serotonergic drugs. 4) Educate about abuse potential, especially in adolescents. 5) Monitor for signs of serotonin syndrome (agitation, hyperthermia, tachycardia). 6) Assess effectiveness - if cough persists >7 days, refer to physician.',
                    patientEducation: 'Do not use for productive cough (with phlegm). Do not exceed recommended dose - high doses can cause serious side effects. Avoid alcohol. Do not take with MAOIs or antidepressants without consulting provider. If cough persists more than 7 days, worsens, or is accompanied by fever, see a doctor. Keep out of reach of teenagers (abuse potential).',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'CAUTION - check sugar content in syrups', asthma: 'CAUTION - evaluate underlying cause', copd: 'CAUTION - evaluate underlying cause', ckd: 'SAFE', pregnancy: 'Category C - use only if clearly needed' }
                }
            },
            {
                id: 'psyllium',
                name: 'Psyllium Husk',
                ph_brands: ['Metamucil', 'Fiberall', 'Konsyl', 'Fiberlax', 'Reguloid'],
                uses: 'Bulk-forming laxative for constipation',
                origin: 'Plant-derived fiber used as a laxative',
                whenToGive: 'For mild constipation; ensure adequate fluid intake',
                contraindications: 'Obstruction of GI tract, difficulty swallowing',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['constipation','laxative','fiber'],
                additionalInfo: {
                    genericNames: ['Psyllium Husk', 'Psyllium Hydrophilic Mucilloid', 'Ispaghula Husk', 'Plantago ovata'],
                    drugClass: 'Bulk-Forming Laxative, Dietary Fiber Supplement, Antidiarrheal (paradoxically)',
                    usesExpanded: 'Chronic constipation, irritable bowel syndrome (IBS), adjunct in diabetes (reduces postprandial glucose), hypercholesterolemia (LDL reduction), hemorrhoids, anal fissures, post-surgical bowel regulation, diverticular disease maintenance',
                    mechanismOfAction: 'Absorbs water in the intestine to form a viscous gel that increases stool bulk and moisture content. The increased bulk stimulates peristalsis and facilitates easier bowel movements. Also binds bile acids, promoting cholesterol excretion and LDL reduction.',
                    originExpanded: 'Derived from the seed husks of Plantago ovata, a plant native to India and Pakistan (known as Isabgol). Used in traditional Ayurvedic medicine for centuries. Introduced to Western medicine in the early 20th century. India remains the largest producer.',
                    pharmacokinetics: 'Absorption: Not systemically absorbed - works locally in GI tract. Onset: 12-72 hours for laxative effect. The fiber passes through the GI tract intact, adding bulk to stool. No hepatic metabolism or renal excretion - eliminated in feces.',
                    dosing: 'Adults: 1 rounded teaspoon (approximately 3.4g) in 8 oz of liquid, 1-3 times daily. Start low and increase gradually. For cholesterol: 10.2g/day in divided doses with meals. Pediatric (6-12y): Half adult dose. Must be taken with adequate fluid (at least 8 oz per dose).',
                    whenToGiveExpanded: 'For constipation relief or prevention. Take with a full glass of water or other liquid IMMEDIATELY - do not let it sit as it will gel. Best taken with meals when used for cholesterol lowering. May take 1-3 days for full effect. Can be used daily for long-term bowel regulation.',
                    sideEffects: 'Common: Bloating, flatulence, abdominal cramping (usually temporary as body adjusts). If taken without adequate fluid: Esophageal/bowel obstruction (serious), choking. Rare: Allergic reactions (especially in healthcare workers with occupational exposure).',
                    contraindicationsExpanded: 'Absolute: GI obstruction, fecal impaction, difficulty swallowing (dysphagia), esophageal stricture. Relative: Intestinal adhesions, acute abdominal pain, nausea/vomiting of unknown cause. Patients should be able to drink adequate fluids.',
                    drugInteractions: 'May decrease absorption of: Lithium, warfarin, carbamazepine, digoxin, nitrofurantoin, salicylates - take medications 1 hour before or 2-4 hours after psyllium. May alter insulin requirements in diabetics (improves glycemic control).',
                    nursingConsiderations: '1) Ensure patient can swallow normally and drink adequate fluids. 2) Mix dose immediately before administration - do not let it thicken. 3) Monitor for choking, especially in elderly. 4) Assess bowel pattern and stool consistency. 5) Encourage adequate daily fluid intake (6-8 glasses). 6) May take 1-3 days for effect - educate patient.',
                    patientEducation: 'Always mix with at least 8 oz of liquid and drink immediately. Follow with another glass of water. Do not take dry powder - choking hazard. Start with low dose and increase gradually to reduce bloating. May take 1-3 days to work. Take other medications 1 hour before or 2-4 hours after. Increase overall fluid and fiber intake for best results.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'BENEFICIAL - may improve glycemic control', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', hyperlipidemia: 'BENEFICIAL - lowers LDL', ibs: 'BENEFICIAL' }
                }
            },
            {
                id: 'loperamide',
                name: 'Loperamide',
                ph_brands: ['Imodium', 'Diatabs', 'Loperam', 'Entestop', 'Kaopectate'],
                uses: 'Symptomatic relief of diarrhea',
                origin: 'Synthetic opioid receptor agonist acting on gut motility',
                whenToGive: 'For acute non-bloody diarrhea without fever; follow age/dose guidance',
                contraindications: 'Bloody diarrhea, high fever, suspected C. difficile, pediatric limits',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['diarrhea','antidiarrheal'],
                additionalInfo: {
                    genericNames: ['Loperamide HCl', 'Loperamide Hydrochloride'],
                    drugClass: 'Antidiarrheal, Peripheral Opioid Receptor Agonist (μ-receptor)',
                    usesExpanded: 'Acute nonspecific diarrhea, travelers diarrhea, chronic diarrhea from inflammatory bowel disease, diarrhea associated with ileostomy, reduction of fecal volume from ileostomies',
                    mechanismOfAction: 'Acts on μ-opioid receptors in the intestinal wall to slow intestinal motility, increase transit time, and enhance water and electrolyte absorption. Does not cross blood-brain barrier significantly at therapeutic doses, so no CNS opioid effects (no analgesia, euphoria, or respiratory depression).',
                    originExpanded: 'Developed by Janssen Pharmaceutica in 1969. FDA approved in 1976 as prescription, switched to OTC in 1988. Designed to have potent peripheral opioid effects without CNS penetration. One of the most widely used antidiarrheals worldwide.',
                    pharmacokinetics: 'Absorption: ~40% absorbed orally. Peak: 2.5-5 hours. Distribution: Highly bound to intestinal wall (local effect). Does not significantly cross BBB. Metabolism: Extensive hepatic via CYP3A4 and CYP2C8 with significant first-pass effect. Half-life: 9-14 hours. Excretion: Mainly fecal.',
                    dosing: 'Acute diarrhea - Adults: 4mg initially, then 2mg after each loose stool (max 16mg/day OTC, 8 mg/day self-treatment limit). Children 6-12y: 2mg initially, then 1mg after loose stool (max 6mg/day). Not recommended <6 years (OTC). Limit self-treatment to 2 days.',
                    whenToGiveExpanded: 'For acute diarrhea without blood, high fever, or signs of bacterial infection. NOT for diarrhea associated with antibiotics (possible C. difficile), dysentery, or invasive bacteria. Use with ORS for dehydration prevention. Discontinue if no improvement in 48 hours or if abdominal distension occurs.',
                    sideEffects: 'Common: Constipation, abdominal cramps, nausea, dizziness, drowsiness, dry mouth. Serious (overdose/abuse): Cardiac arrhythmias (QT prolongation, torsades de pointes), cardiac arrest, paralytic ileus, toxic megacolon, CNS depression.',
                    contraindicationsExpanded: 'Absolute: Bloody diarrhea (dysentery), high fever (>38.5°C/101.3°F), suspected C. difficile or bacterial enterocolitis, acute ulcerative colitis, children <6 years (OTC). Relative: Hepatic impairment (reduced metabolism), acute inflammatory bowel disease.',
                    drugInteractions: 'P-glycoprotein inhibitors (quinidine, ritonavir): Can increase CNS penetration causing opioid effects. CYP3A4 inhibitors: Increased loperamide levels. QT-prolonging drugs: Additive cardiac risk. Opioids: Additive constipation.',
                    nursingConsiderations: '1) Assess stool characteristics - contraindicated if bloody or with fever. 2) Monitor for dehydration and electrolyte imbalance. 3) Encourage oral rehydration alongside medication. 4) Monitor for abdominal distension or decreased bowel sounds (ileus). 5) Educate about 48-hour self-treatment limit. 6) Watch for signs of cardiac issues with high doses.',
                    patientEducation: 'Do NOT use if diarrhea is bloody, has mucus, or you have high fever - see a doctor instead. Stop use and seek medical help if diarrhea lasts more than 2 days. Drink plenty of clear fluids to prevent dehydration. Take only as directed - do not exceed recommended dose. Stop taking if constipation, bloating, or abdominal distension occurs.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Category C - use only if needed', ibd: 'CAUTION - may trigger toxic megacolon in acute flares' }
                }
            },
            {
                id: 'ginger',
                name: 'Ginger / Peppermint',
                ph_brands: ['Ginger Capsules', 'Peppermint Oil Caps', 'Gin Gin', 'Altoids', 'Gravol Ginger'],
                uses: 'Nausea relief, mild digestive upset',
                origin: 'Herbal remedies used historically across cultures',
                whenToGive: 'For mild nausea and indigestion; non-pharmacologic first-line',
                contraindications: 'None common; caution with anticoagulants in high doses',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['nausea','digestive','herbal','natural'],
                additionalInfo: {
                    genericNames: ['Zingiber officinale (Ginger)', 'Mentha piperita (Peppermint)', 'Ginger Root Extract', 'Peppermint Oil'],
                    drugClass: 'Herbal Antiemetic, Carminative, Digestive Aid',
                    usesExpanded: 'GINGER: Nausea and vomiting (pregnancy morning sickness, chemotherapy-induced, postoperative), motion sickness, dyspepsia, anti-inflammatory (arthritis). PEPPERMINT: IBS symptoms, dyspepsia, tension headache (topical), nasal congestion, nausea.',
                    mechanismOfAction: 'GINGER: Contains gingerols and shogaols that block serotonin receptors (5-HT3) in the GI tract and may affect the vestibular system. Anti-inflammatory via inhibition of prostaglandin synthesis. PEPPERMINT: Menthol relaxes GI smooth muscle (calcium channel blocking), activates cold receptors (TRPM8) providing cooling sensation.',
                    originExpanded: 'GINGER: Native to Southeast Asia, used in Traditional Chinese Medicine and Ayurveda for over 3,000 years. PEPPERMINT: Hybrid of watermint and spearmint, native to Europe. Used since ancient Egyptian, Greek, and Roman times for digestive complaints.',
                    pharmacokinetics: 'GINGER: Gingerols absorbed in GI tract, metabolized hepatically. Half-life: 1-3 hours. PEPPERMINT: Menthol rapidly absorbed, metabolized by glucuronidation. Enteric-coated capsules bypass stomach to release in intestines (for IBS).',
                    dosing: 'GINGER: 250mg 4 times daily or 500-1000mg daily for nausea. For pregnancy: 250mg 4 times daily. PEPPERMINT: Oil capsules 0.2-0.4mL (enteric-coated) 3 times daily for IBS. Tea: 1 teaspoon dried leaves in hot water. Topical: diluted oil for headache.',
                    whenToGiveExpanded: 'For mild nausea without serious underlying cause. GINGER: Start 1 day before travel for motion sickness. Safe first-line for pregnancy nausea. PEPPERMINT: Take IBS capsules 30-60 minutes before meals. Not for GERD (relaxes LES). Can suck peppermint candy for mild nausea.',
                    sideEffects: 'GINGER: Generally well tolerated. May cause heartburn, mouth irritation, or diarrhea in high doses. Theoretical bleeding risk at very high doses. PEPPERMINT: Heartburn (relaxes LES), perianal burning (enteric coating dissolves early), allergic reactions. Topical: skin irritation.',
                    contraindicationsExpanded: 'GINGER: Caution with anticoagulants (theoretical bleeding risk), gallstones (may increase bile flow). PEPPERMINT: GERD (worsens reflux), hiatal hernia, severe liver disease, gallbladder disease, infants/young children (menthol can cause breathing problems).',
                    drugInteractions: 'GINGER: Anticoagulants/antiplatelets (warfarin, aspirin): theoretical increased bleeding risk. Antidiabetics: may lower blood sugar. PEPPERMINT: Drugs metabolized by CYP3A4: may increase levels. Antacids/PPIs: may dissolve enteric coating prematurely.',
                    nursingConsiderations: '1) Assess severity of nausea - rule out serious causes. 2) For pregnancy nausea, ginger is first-line non-pharmacologic option. 3) Monitor for heartburn with peppermint use. 4) Ensure enteric-coated peppermint capsules are swallowed whole. 5) Assess for contraindications (GERD, gallbladder disease). 6) Educate about realistic expectations - mild to moderate relief.',
                    patientEducation: 'GINGER: Can be taken as tea, capsules, candies, or fresh. Start before travel for motion sickness. Generally safe in pregnancy at recommended doses. PEPPERMINT: Do not chew enteric-coated capsules. Avoid if you have heartburn or reflux. Keep peppermint oil away from face of infants. These are for mild symptoms - see doctor if persistent.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'GINGER - monitor blood sugar', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'GINGER - SAFE for morning sickness', gerd: 'PEPPERMINT - AVOID' }
                }
            },
            {
                id: 'cetirizine',
                name: 'Cetirizine',
                ph_brands: ['Zyrtec', 'Virlix', 'Allerkid', 'Reactine', 'Alerid'],
                uses: 'Allergic rhinitis, urticaria, seasonal allergies, itching',
                origin: 'Second-generation antihistamine developed in the 1980s with less sedation',
                whenToGive: 'For allergic symptoms; once daily dosing; may cause mild drowsiness',
                contraindications: 'Severe renal impairment (dose adjustment needed), hypersensitivity to hydroxyzine',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['allergy','antihistamine','rhinitis','urticaria'],
                additionalInfo: {
                    genericNames: ['Cetirizine HCl', 'Cetirizine Dihydrochloride', 'Levocetirizine (active enantiomer)'],
                    drugClass: 'Second-Generation Antihistamine (H1-receptor antagonist), Low-Sedating Antihistamine',
                    usesExpanded: 'Seasonal allergic rhinitis (hay fever), perennial allergic rhinitis, chronic idiopathic urticaria (hives), allergic conjunctivitis, pruritus (itching) from various causes, atopic dermatitis (adjunct)',
                    mechanismOfAction: 'Selective peripheral H1-receptor antagonist. Stabilizes mast cells and inhibits histamine release. Unlike first-generation antihistamines, it has poor CNS penetration due to P-glycoprotein efflux, resulting in less sedation. Has anti-inflammatory effects beyond antihistamine activity.',
                    originExpanded: 'Developed by UCB Pharma in Belgium. Active metabolite of hydroxyzine. FDA approved in 1995. Became OTC in 2007. Represents advancement over first-generation antihistamines with better safety profile and once-daily dosing.',
                    pharmacokinetics: 'Absorption: Rapid and extensive (>70% bioavailability). Onset: 1 hour. Peak: 1-2 hours. Duration: 24 hours. Distribution: 93% protein-bound, minimal CNS penetration. Metabolism: Minimal hepatic (limited CYP involvement). Half-life: 8-9 hours (prolonged in renal impairment). Excretion: 70% renal unchanged.',
                    dosing: 'Adults & children >6y: 5-10mg once daily. Children 2-6y: 2.5mg once or twice daily (max 5mg/day). Children 6mo-2y: 2.5mg once daily. Renal impairment: Reduce dose by 50%. Hemodialysis: 5mg after dialysis.',
                    whenToGiveExpanded: 'Can be taken with or without food. Once daily dosing (morning or evening). For seasonal allergies, may start before pollen season. Works best when taken regularly rather than PRN. May cause mild drowsiness - if affected, take at bedtime.',
                    sideEffects: 'Common: Drowsiness (more than loratadine but less than first-gen), headache, dry mouth, fatigue, pharyngitis. Rare: GI upset, dizziness. Very rare: Hypersensitivity reactions, elevated liver enzymes, urinary retention, tremor, confusion (elderly).',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to cetirizine, hydroxyzine, or levocetirizine. Relative: Severe renal impairment (CrCl <10 mL/min), end-stage renal disease on dialysis (dose adjustment required), caution in elderly, hepatic impairment.',
                    drugInteractions: 'CNS depressants (alcohol, benzodiazepines): Additive sedation. Theophylline: May slightly decrease cetirizine clearance. Generally fewer drug interactions than first-generation antihistamines due to minimal CYP450 metabolism.',
                    nursingConsiderations: '1) Assess allergy symptoms before and after treatment. 2) Check renal function - dose adjustment needed in impairment. 3) Monitor for drowsiness, especially initially. 4) Assess effectiveness - switch to different antihistamine if inadequate response. 5) Educate about once-daily dosing for compliance. 6) Review for CNS depressant interactions.',
                    patientEducation: 'Take once daily at the same time. May cause drowsiness - avoid driving until you know how it affects you. Avoid alcohol. Can be taken with or without food. For best results during allergy season, take daily rather than as needed. Do not double dose if missed - take next dose at regular time. Safe for long-term use.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE - may help allergic asthma', copd: 'SAFE', ckd: 'DOSE ADJUSTMENT REQUIRED', pregnancy: 'Category B - relatively safe', elderly: 'CAUTION - increased sensitivity' }
                }
            },
            {
                id: 'loratadine',
                name: 'Loratadine',
                ph_brands: ['Claritin', 'Allerta', 'Clarityne', 'Alavert', 'Loratadine Generics'],
                uses: 'Allergic rhinitis, chronic urticaria, hay fever',
                origin: 'Non-sedating second-generation antihistamine introduced in 1988',
                whenToGive: 'For allergic symptoms; once daily; minimal sedation compared to first-gen',
                contraindications: 'Severe hepatic impairment; caution with CYP3A4 inhibitors',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['allergy','antihistamine','rhinitis','non-sedating'],
                additionalInfo: {
                    genericNames: ['Loratadine', 'Desloratadine (active metabolite)'],
                    drugClass: 'Second-Generation Antihistamine (H1-receptor antagonist), Non-Sedating Antihistamine',
                    usesExpanded: 'Seasonal allergic rhinitis (hay fever), perennial allergic rhinitis, chronic idiopathic urticaria (hives), allergic conjunctivitis, allergic skin reactions. Desloratadine (Clarinex) is the active metabolite with similar uses.',
                    mechanismOfAction: 'Selective peripheral H1-receptor antagonist with minimal CNS penetration (does not cross blood-brain barrier readily). Prevents histamine from binding to receptors, blocking allergic response. Does not significantly affect serotonin, dopamine, or muscarinic receptors.',
                    originExpanded: 'Developed by Schering-Plough. FDA approved in 1993 as prescription, became OTC in 2002. One of the first truly non-sedating antihistamines. Generic versions widely available since 2002.',
                    pharmacokinetics: 'Absorption: Rapidly absorbed, food delays absorption but does not affect extent. Onset: 1-3 hours. Peak: 1.5 hours (loratadine), 3-4 hours (desloratadine metabolite). Distribution: 97-99% protein-bound. Metabolism: Extensive hepatic via CYP3A4 and CYP2D6 to active metabolite desloratadine. Half-life: 8-14 hours (loratadine), 17-24 hours (desloratadine). Excretion: Renal and fecal.',
                    dosing: 'Adults & children >6y: 10mg once daily. Children 2-6y: 5mg once daily (syrup). Can be taken with or without food. No dose adjustment needed for renal impairment. Reduce frequency in severe hepatic impairment.',
                    whenToGiveExpanded: 'Once daily at any time. For seasonal allergies, can start before allergy season begins. Food does not affect absorption. Truly non-sedating in most patients - preferred for daytime use when alertness is required.',
                    sideEffects: 'Common (generally well tolerated): Headache, dry mouth, fatigue, somnolence (rare). Children: Nervousness, hyperkinesia, abdominal pain. Rare: Tachycardia, palpitations. Very rare: Liver function abnormalities, hypersensitivity.',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to loratadine or desloratadine. Relative: Severe hepatic impairment (reduce dose/frequency), caution with drugs that inhibit CYP3A4 (ketoconazole, erythromycin).',
                    drugInteractions: 'CYP3A4 inhibitors (ketoconazole, erythromycin, cimetidine): Increased loratadine levels (usually not clinically significant). Alcohol: No significant interaction (unlike first-gen antihistamines). Generally very few clinically significant interactions.',
                    nursingConsiderations: '1) Assess allergy symptoms before and during therapy. 2) Check liver function if hepatic impairment suspected. 3) Preferred antihistamine for patients requiring alertness. 4) Can be used during pregnancy if antihistamine needed (Category B). 5) Monitor for adequate symptom relief. 6) Educate about consistent daily dosing for best effect.',
                    patientEducation: 'Take once daily - works for 24 hours. Does not usually cause drowsiness, but avoid alcohol. Safe to drive and operate machinery for most people. Can be taken with or without food. For best results, take daily during allergy season rather than as needed. If symptoms not controlled, consult healthcare provider about alternatives.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Category B - preferred antihistamine if needed', hepatic_impairment: 'CAUTION - reduce dose' }
                }
            },
            {
                id: 'mefenamic-acid',
                name: 'Mefenamic Acid',
                ph_brands: ['Ponstan', 'Dolfenal', 'Ponstel', 'Mefran', 'Mefenamic'],
                uses: 'Dysmenorrhea, mild to moderate pain, dental pain, headache',
                origin: 'NSAID introduced in the 1960s, particularly effective for menstrual pain',
                whenToGive: 'For pain relief especially dysmenorrhea; take with food; short-term use only',
                contraindications: 'Active peptic ulcer, renal impairment, aspirin-sensitive asthma, third trimester pregnancy',
                conditionSafety: { hypertension: 'CAUTION', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED' },
                tags: ['pain','dysmenorrhea','nsaid','menstrual'],
                additionalInfo: {
                    genericNames: ['Mefenamic Acid', 'Mefenamic'],
                    drugClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID), Fenamate Class, Anthranilic Acid Derivative',
                    usesExpanded: 'Primary dysmenorrhea (menstrual cramps - particularly effective), mild to moderate pain, rheumatoid arthritis, osteoarthritis, dental pain, headache, postoperative pain, menorrhagia (heavy menstrual bleeding)',
                    mechanismOfAction: 'Inhibits cyclooxygenase (COX-1 and COX-2), reducing prostaglandin synthesis. Particularly effective for menstrual pain because prostaglandins play a major role in uterine contractions. Also has central analgesic effects and may antagonize prostaglandin receptors directly.',
                    originExpanded: 'Developed by Parke-Davis and introduced in 1967. One of the fenamate class NSAIDs. Became popular for dysmenorrhea due to superior efficacy compared to other NSAIDs for menstrual pain.',
                    pharmacokinetics: 'Absorption: Rapidly absorbed. Peak: 2-4 hours. Distribution: Highly protein-bound (>90%). Metabolism: Hepatic via glucuronidation and oxidation (CYP2C9) to 3-hydroxymethyl and 3-carboxyl metabolites. Half-life: 2-4 hours. Excretion: 52% renal, 20% fecal.',
                    dosing: 'Adults: 500mg initially, then 250mg every 6 hours as needed. Maximum: 1000mg/day (short-term) or 1500mg/day for menstrual pain for up to 3 days. Take with food. Not recommended for children <14 years. Limit use to 7 days maximum.',
                    whenToGiveExpanded: 'For dysmenorrhea, start at onset of menstruation or pain - most effective when started early. Always take with food to reduce GI irritation. For short-term use only (maximum 7 days). Not for chronic pain management.',
                    sideEffects: 'Common: GI upset (diarrhea more common than with other NSAIDs), nausea, abdominal pain, dyspepsia, dizziness, headache. Serious: GI bleeding/ulceration, hemolytic anemia (rare, with prolonged use), renal impairment, hepatotoxicity, severe skin reactions.',
                    contraindicationsExpanded: 'Absolute: Active peptic ulcer or GI bleeding, severe renal impairment, history of NSAID-induced asthma/urticaria, third trimester pregnancy, inflammatory bowel disease. Relative: History of GI disease, hypertension, heart failure, concurrent anticoagulants, first/second trimester pregnancy.',
                    drugInteractions: 'Anticoagulants (warfarin): Increased bleeding risk. Aspirin: Reduced efficacy, increased GI risk. Lithium: Increased levels. Methotrexate: Increased toxicity. Antihypertensives (ACE inhibitors, diuretics): Reduced efficacy. Other NSAIDs: Avoid combination.',
                    nursingConsiderations: '1) Assess pain level and menstrual history. 2) Ensure taken with food. 3) Monitor for GI bleeding (dark stools). 4) Limit use to 7 days maximum. 5) Monitor renal function in prolonged use. 6) Educate about early dosing for dysmenorrhea. 7) Watch for diarrhea (more common with mefenamic acid).',
                    patientEducation: 'Take with food or milk. Start taking at the first sign of menstrual pain for best effect. Do not use for more than 7 days. Stop and seek medical attention if you experience severe stomach pain, black stools, or vomiting blood. Avoid during third trimester of pregnancy. Report any rash immediately.',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - may elevate BP', diabetes: 'SAFE', asthma: 'CAUTION - risk of bronchospasm if aspirin-sensitive', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED', pregnancy: '⚠️ CONTRAINDICATED in 3rd trimester', gi_disease: 'CAUTION' }
                }
            },
            {
                id: 'antacid',
                name: 'Aluminum/Magnesium Hydroxide',
                ph_brands: ['Kremil-S', 'Maalox', 'Mylanta', 'Gaviscon', 'Gelusil'],
                uses: 'Heartburn, acid indigestion, upset stomach, GERD symptoms',
                origin: 'Classic antacid combination neutralizing gastric acid',
                whenToGive: 'For acute heartburn or indigestion; take 1-3 hours after meals and at bedtime',
                contraindications: 'Severe renal impairment (magnesium toxicity risk), hypophosphatemia',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['heartburn','antacid','indigestion','reflux'],
                additionalInfo: {
                    genericNames: ['Aluminum Hydroxide/Magnesium Hydroxide', 'Al(OH)3/Mg(OH)2', 'Magaldrate', 'Hydrotalcite'],
                    drugClass: 'Antacid, Acid Neutralizer',
                    usesExpanded: 'Symptomatic relief of heartburn, acid indigestion, sour stomach, GERD symptoms, peptic ulcer disease (symptom relief), stress ulcer prophylaxis, phosphate binding in chronic kidney disease (aluminum hydroxide alone)',
                    mechanismOfAction: 'Directly neutralizes gastric acid (HCl) through chemical reaction, raising gastric pH. Aluminum hydroxide produces AlCl3 + water. Magnesium hydroxide produces MgCl2 + water. The combination balances constipating effect of aluminum with laxative effect of magnesium. Also may stimulate prostaglandin production and enhance mucosal defense.',
                    originExpanded: 'Aluminum and magnesium compounds have been used as antacids since the early 20th century. The combination product was developed to minimize individual side effects (aluminum causes constipation, magnesium causes diarrhea).',
                    pharmacokinetics: 'Absorption: Minimal systemic absorption (10-30% of magnesium, minimal aluminum). Onset: Immediate (5-15 minutes). Duration: 20-60 minutes (empty stomach), up to 3 hours (after meals). Metabolism: Not significantly metabolized. Excretion: Primarily fecal; absorbed magnesium excreted renally.',
                    dosing: 'Adults: 10-20 mL (liquid) or 1-2 tablets chewed thoroughly, 1-3 hours after meals and at bedtime. May repeat every 4-6 hours as needed. Maximum varies by product (check label). Pediatric: Consult physician for appropriate dosing.',
                    whenToGiveExpanded: 'For immediate relief of heartburn or indigestion. Most effective when taken 1-3 hours after meals (when acid secretion peaks) and at bedtime. Chew tablets thoroughly before swallowing. Shake liquid well. Not for prevention - use PPIs or H2 blockers for that.',
                    sideEffects: 'Aluminum: Constipation, hypophosphatemia (chronic use), aluminum accumulation (renal failure). Magnesium: Diarrhea, hypermagnesemia (renal failure). Combination: Usually balanced bowel effects. Others: Chalky taste, belching, nausea.',
                    contraindicationsExpanded: 'Absolute: Severe renal impairment (magnesium accumulation risk). Relative: Hypophosphatemia, dehydration, bowel obstruction, appendicitis symptoms. Chronic use in CKD patients requires monitoring.',
                    drugInteractions: 'Decreases absorption of many drugs (take 2 hours apart): Tetracyclines, fluoroquinolones, ketoconazole, itraconazole, iron supplements, digoxin, H2 blockers, bisphosphonates. Aluminum binds phosphate (useful in hyperphosphatemia of CKD).',
                    nursingConsiderations: '1) Assess heartburn symptoms - rule out cardiac causes if atypical. 2) Shake liquid preparations well. 3) Instruct to chew tablets thoroughly. 4) Monitor for rebound acid hypersecretion with overuse. 5) Check for drug interactions - separate dosing by 2 hours. 6) Monitor phosphate levels in chronic use. 7) Assess renal function before recommending magnesium-containing products.',
                    patientEducation: 'Chew tablets completely before swallowing. Works fast but effect is short-lived. Take 1-3 hours after meals for best effect. Separate from other medications by 2 hours. If needed daily for more than 2 weeks, see a doctor. May cause constipation (aluminum) or diarrhea (magnesium) - combination products balance this.',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - check sodium content', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION/AVOID - hypermagnesemia risk', hypophosphatemia: 'AVOID aluminum-containing' }
                }
            },
            {
                id: 'ranitidine',
                name: 'Famotidine',
                ph_brands: ['Pepcid', 'Famocid', 'Quamatel', 'Famotidine Generics', 'Pepcid AC'],
                uses: 'Peptic ulcer, GERD, heartburn, acid reflux',
                origin: 'H2-receptor antagonist; famotidine replaced ranitidine after NDMA concerns',
                whenToGive: 'For heartburn prevention; take 15-60 minutes before meals that cause symptoms',
                contraindications: 'Severe renal impairment (dose adjustment); hypersensitivity to H2 blockers',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['heartburn','h2blocker','reflux','ulcer'],
                additionalInfo: {
                    genericNames: ['Famotidine'],
                    drugClass: 'Histamine H2-Receptor Antagonist (H2 Blocker), Antisecretory Agent',
                    usesExpanded: 'GERD (heartburn, acid reflux), peptic ulcer disease (gastric and duodenal), erosive esophagitis, Zollinger-Ellison syndrome, stress ulcer prophylaxis, prevention of aspiration pneumonia (preoperative), heartburn prevention before eating trigger foods',
                    mechanismOfAction: 'Competitively blocks histamine H2 receptors on gastric parietal cells, inhibiting histamine-stimulated gastric acid secretion. Reduces both basal and stimulated acid secretion by 60-70%. Less potent than PPIs but faster onset for acute relief.',
                    originExpanded: 'Developed by Yamanouchi (now Astellas) and Merck. FDA approved in 1986. Became preferred H2 blocker after ranitidine was withdrawn in 2020 due to NDMA (probable carcinogen) contamination concerns. Most potent H2 blocker by weight.',
                    pharmacokinetics: 'Absorption: Rapidly absorbed (40-45% bioavailability). Onset: 1 hour. Peak: 1-3 hours. Duration: 10-12 hours. Distribution: 15-20% protein-bound. Metabolism: Minimal hepatic metabolism (no significant CYP450 involvement). Half-life: 2.5-3.5 hours (prolonged in renal impairment). Excretion: 65-70% renal unchanged.',
                    dosing: 'Heartburn prevention: 10-20mg 15-60 minutes before eating. GERD: 20mg twice daily for up to 6 weeks. Peptic ulcer: 20-40mg at bedtime or 20mg twice daily. Renal impairment (CrCl <50): Reduce dose by 50% or extend interval. Pediatric: 0.5mg/kg/dose.',
                    whenToGiveExpanded: 'For heartburn prevention, take 15-60 minutes before eating foods that trigger symptoms. For active ulcer or GERD, take regularly as prescribed. Can be taken with or without food. For nighttime heartburn, take at bedtime.',
                    sideEffects: 'Common (generally well-tolerated): Headache, dizziness, constipation, diarrhea. Uncommon: Dry mouth, fatigue, rash. Rare: Thrombocytopenia, confusion (elderly), elevated liver enzymes, QT prolongation (IV high doses).',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to famotidine or other H2 blockers. Relative: Severe renal impairment (dose adjustment needed), hepatic impairment, phenylketonuria (some formulations contain aspartame), elderly (increased risk of confusion).',
                    drugInteractions: 'Minimal drug interactions (advantage over cimetidine). May reduce absorption of drugs requiring acid environment: Ketoconazole, itraconazole, atazanavir, iron, vitamin B12. Does not significantly affect CYP450 enzymes.',
                    nursingConsiderations: '1) Assess heartburn/ulcer symptoms. 2) Check renal function - dose adjustment needed. 3) Monitor for symptom improvement. 4) Preferred H2 blocker in pregnancy if needed. 5) Educate about timing relative to meals. 6) If symptoms persist beyond 2 weeks of OTC use, refer to physician.',
                    patientEducation: 'Take 15-60 minutes before eating foods that cause heartburn. Can be taken at bedtime for nighttime symptoms. Works longer than antacids but takes longer to start working. If using OTC for more than 2 weeks, consult a doctor. Safer alternative to ranitidine (which was recalled).',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'DOSE ADJUSTMENT REQUIRED', pregnancy: 'Category B - safe', elderly: 'CAUTION - monitor for confusion' }
                }
            },
            {
                id: 'guaifenesin',
                name: 'Guaifenesin',
                ph_brands: ['Robitussin', 'Mucinex', 'Guaifenesin Expectorant', 'Solmux', 'Benadryl Expectorant'],
                uses: 'Productive cough with thick mucus, chest congestion, expectorant',
                origin: 'Expectorant derived from guaiac tree, used since 16th century',
                whenToGive: 'For productive cough to thin mucus; increase fluid intake for best effect',
                contraindications: 'Persistent cough with excessive mucus; avoid in children <4 years',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['cough','expectorant','congestion','mucus'],
                additionalInfo: {
                    genericNames: ['Guaifenesin', 'Glyceryl Guaiacolate', 'Guaiphenesin'],
                    drugClass: 'Expectorant, Mucolytic',
                    usesExpanded: 'Relief of chest congestion and productive cough associated with common cold, bronchitis, flu, and other respiratory infections. Helps loosen and thin mucus/phlegm in airways, making coughs more productive.',
                    mechanismOfAction: 'Increases respiratory tract fluid secretions by reducing mucus viscosity and surface tension. Stimulates secretion from bronchial glands and increases mucociliary clearance. Makes mucus thinner and less sticky, facilitating expectoration.',
                    originExpanded: 'Derived from guaiacum tree bark, used by indigenous peoples of the Caribbean. Synthesized form developed in the early 20th century. FDA approved in 1952. Only FDA-approved expectorant for OTC use.',
                    pharmacokinetics: 'Absorption: Rapidly and well absorbed from GI tract. Onset: 15-30 minutes. Peak: 1-2 hours. Duration: 4-6 hours (immediate-release), 12 hours (extended-release). Metabolism: Hepatic via oxidation and glucuronidation. Half-life: ~1 hour. Excretion: Primarily renal as metabolites.',
                    dosing: 'Adults & children ≥12y: 200-400mg every 4 hours (max 2.4g/day) or extended-release 600-1200mg every 12 hours. Children 6-12y: 100-200mg every 4 hours (max 1.2g/day). Children 4-6y: 50-100mg every 4 hours. Not for <4 years. Take with full glass of water.',
                    whenToGiveExpanded: 'For coughs with thick, sticky mucus that is difficult to cough up. Always take with plenty of water (at least 8 oz) to help thin secretions. Continue adequate fluid intake throughout the day. Most effective when used regularly while congested.',
                    sideEffects: 'Common: Nausea, vomiting, stomach upset, dizziness, headache, drowsiness. Rare: Skin rash, urticaria. Very rare: Kidney stones (at very high doses with inadequate hydration). Generally well tolerated.',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to guaifenesin. Relative: Persistent cough from smoking, asthma, chronic bronchitis, or emphysema (needs evaluation). Not for dry, non-productive cough. Children under 4 years (safety not established).',
                    drugInteractions: 'Generally few significant interactions. May interfere with certain laboratory tests: Can cause false-positive for 5-HIAA (serotonin metabolite) and VMA (catecholamine metabolite). Notify lab if taking guaifenesin before these tests.',
                    nursingConsiderations: '1) Assess cough character - confirm productive cough with thick secretions. 2) Encourage adequate fluid intake (8+ glasses daily). 3) Monitor effectiveness - should make cough more productive. 4) If cough persists >7 days or returns, refer to physician. 5) Assess for underlying conditions in chronic cough.',
                    patientEducation: 'Drink plenty of fluids (water, juice) while taking this medication - at least 8 glasses per day. This helps the medication work better. Take with a full glass of water. Do not take for more than 7 days without consulting a doctor. If cough is accompanied by fever, rash, or persistent headache, see a healthcare provider.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'CAUTION - check sugar content in syrups', asthma: 'SAFE - but evaluate underlying cause', copd: 'SAFE - but evaluate underlying cause', ckd: 'SAFE', pregnancy: 'Category C - appears safe but use only if needed' }
                }
            },
            {
                id: 'phenylephrine',
                name: 'Phenylephrine',
                ph_brands: ['Neozep', 'Bioflu', 'Decolgen', 'Sinutab', 'Sudafed PE'],
                uses: 'Nasal congestion, sinus pressure, common cold symptoms',
                origin: 'Sympathomimetic decongestant replacing pseudoephedrine in many formulations',
                whenToGive: 'For nasal congestion relief; short-term use only (3-5 days max)',
                contraindications: 'Severe hypertension, MAOIs, narrow-angle glaucoma, severe coronary artery disease',
                conditionSafety: { hypertension: '⚠️ CONTRAINDICATED', diabetes: 'CAUTION', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['decongestant','cold','sinus','congestion'],
                additionalInfo: {
                    genericNames: ['Phenylephrine HCl', 'Phenylephrine Hydrochloride', 'Neo-Synephrine (nasal)'],
                    drugClass: 'Sympathomimetic Amine, Alpha-1 Adrenergic Agonist, Nasal Decongestant',
                    usesExpanded: 'Nasal and sinus congestion from common cold, hay fever, upper respiratory allergies, sinusitis. Also used as ophthalmic mydriatic (eye drops) and as vasopressor (IV form) for hypotension.',
                    mechanismOfAction: 'Selective alpha-1 adrenergic receptor agonist. Causes vasoconstriction of blood vessels in nasal mucosa, reducing swelling/edema and congestion. Unlike pseudoephedrine, has minimal beta-adrenergic activity so less stimulant effect.',
                    originExpanded: 'Synthesized in 1910. Became common replacement for pseudoephedrine (PSE) in OTC products after 2006 Combat Methamphetamine Epidemic Act restricted PSE sales. FDA review in 2023 questioned oral efficacy at standard doses.',
                    pharmacokinetics: 'Absorption: Poorly absorbed orally (~38%), extensive first-pass metabolism. Bioavailability: Only ~3% reaches systemic circulation. Onset: 15-30 minutes. Duration: 4-6 hours. Metabolism: Extensive hepatic and intestinal by MAO. Half-life: 2-3 hours. Excretion: Renal.',
                    dosing: 'Adults & children ≥12y: 10mg every 4 hours (max 60mg/day). Children 6-12y: 5mg every 4 hours (max 30mg/day). Nasal spray: 2-3 sprays each nostril every 4 hours. Do not use nasal spray >3 days (rebound congestion). Not recommended <6 years.',
                    whenToGiveExpanded: 'For temporary relief of nasal congestion. Use for shortest time possible (3-5 days oral, 3 days nasal). Take with food if stomach upset occurs. Note: Recent FDA review questions whether oral phenylephrine is effective at current OTC doses.',
                    sideEffects: 'Common: Restlessness, insomnia, headache, dizziness, increased blood pressure, tachycardia. Nasal spray: Burning, stinging, sneezing, rebound congestion (rhinitis medicamentosa). Rare: Palpitations, arrhythmias.',
                    contraindicationsExpanded: 'Absolute: Severe hypertension, severe coronary artery disease, MAOI use within 14 days, narrow-angle glaucoma. Relative: Hypertension, hyperthyroidism, diabetes mellitus, prostatic hypertrophy, cardiovascular disease, elderly.',
                    drugInteractions: 'MAOIs: Severe hypertensive crisis (CONTRAINDICATED). Beta-blockers: Exaggerated hypertension. Other sympathomimetics: Additive effects. TCAs: Enhanced vasopressor effects. Antihypertensives: Reduced efficacy.',
                    nursingConsiderations: '1) Check blood pressure before and during therapy. 2) Assess for contraindications (HTN, cardiac disease, glaucoma). 3) Educate about short-term use only. 4) Monitor for signs of hypertension/stimulation. 5) Warn about rebound congestion with nasal spray. 6) Consider pseudoephedrine if phenylephrine ineffective (with pharmacy consultation).',
                    patientEducation: 'Do not use for more than 3-5 days - prolonged use causes rebound congestion. Check blood pressure if you have hypertension. Do not take if you take MAOIs. May cause restlessness, difficulty sleeping - avoid taking close to bedtime. Stop and consult doctor if symptoms worsen or persist beyond 7 days.',
                    conditionSafetyExpanded: { hypertension: '⚠️ AVOID/CONTRAINDICATED', diabetes: 'CAUTION - may increase blood sugar', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', hyperthyroidism: 'CAUTION', cardiac_disease: '⚠️ AVOID', glaucoma: '⚠️ CONTRAINDICATED' }
                }
            },
            {
                id: 'salbutamol',
                name: 'Salbutamol (Albuterol)',
                ph_brands: ['Ventolin', 'Airomir', 'Respirol', 'Salbulin', 'ProAir'],
                uses: 'Acute bronchospasm, asthma relief, COPD exacerbation',
                origin: 'Short-acting beta-2 agonist developed in 1968',
                whenToGive: 'For acute bronchospasm relief; use as rescue inhaler; seek medical attention if frequent use needed',
                contraindications: 'Tachyarrhythmias, hypersensitivity; caution with hypertension, hyperthyroidism',
                conditionSafety: { hypertension: 'CAUTION', diabetes: 'CAUTION', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['asthma','bronchodilator','copd','breathing','rescue'],
                additionalInfo: {
                    genericNames: ['Salbutamol', 'Albuterol', 'Salbutamol Sulfate', 'Albuterol Sulfate'],
                    drugClass: 'Short-Acting Beta-2 Agonist (SABA), Bronchodilator, Sympathomimetic',
                    usesExpanded: 'Acute bronchospasm relief in asthma, exercise-induced bronchospasm (prevention), COPD exacerbations, hyperkalemia (off-label - drives K+ into cells), preterm labor (off-label). Used as "rescue inhaler" for quick relief.',
                    mechanismOfAction: 'Selective beta-2 adrenergic receptor agonist. Relaxes bronchial smooth muscle by increasing cAMP, causing bronchodilation. Also inhibits release of mediators from mast cells, increases mucociliary clearance, and decreases vascular permeability.',
                    originExpanded: 'Developed by Allen & Hanburys (now GSK) in 1968. First selective beta-2 agonist (previous bronchodilators had cardiac effects). Revolutionary treatment for asthma. "Salbutamol" used in UK/PH, "Albuterol" used in US.',
                    pharmacokinetics: 'Inhaled - Absorption: Small fraction absorbed from lungs and swallowed portion. Onset: 5-15 minutes. Peak: 30-60 minutes. Duration: 4-6 hours. Metabolism: Hepatic to inactive sulfate conjugate. Half-life: 2.5-5 hours. Excretion: Renal (primarily as metabolites).',
                    dosing: 'Acute bronchospasm - MDI: 1-2 puffs (90-180 mcg) every 4-6 hours as needed. Nebulizer: 2.5-5mg every 4-6 hours. Severe exacerbation: 4-8 puffs every 20 minutes for 3 doses. Pediatric: Similar dosing. If using >2 times/week for symptoms, asthma control is inadequate.',
                    whenToGiveExpanded: 'Use as "rescue" medication for sudden breathing difficulty. Shake inhaler before use. Use spacer for better delivery. Wait 1 minute between puffs if taking multiple. If no relief or needing increasingly frequent doses, seek immediate medical attention.',
                    sideEffects: 'Common: Tremor (fine trembling of hands), palpitations, tachycardia, headache, muscle cramps, nervousness. Rare: Hypokalemia (high doses), paradoxical bronchospasm (rare), hyperglycemia. Serious: Cardiac arrhythmias (overdose).',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to salbutamol or any component. Relative: Cardiac arrhythmias, tachycardia, hypertension, hyperthyroidism, diabetes mellitus, hypokalemia, seizure disorders, pregnancy (use only if benefit > risk).',
                    drugInteractions: 'Beta-blockers: Antagonize bronchodilator effect (avoid non-selective beta-blockers in asthma). MAOIs/TCAs: Enhanced cardiovascular effects. Diuretics: Additive hypokalemia. Other sympathomimetics: Additive effects. Digoxin: May increase risk of arrhythmias.',
                    nursingConsiderations: '1) Assess respiratory status (breath sounds, respiratory rate, O2 sat) before and after. 2) Teach proper inhaler technique with spacer. 3) Monitor heart rate and for tremors. 4) Track frequency of use - frequent need indicates poor control. 5) Ensure patient has rescue inhaler accessible at all times. 6) Rinse mouth after use (especially with steroid inhalers).',
                    patientEducation: 'Keep rescue inhaler with you at all times. Shake well before each use. Use a spacer for better delivery. If not getting relief or using more than twice weekly, your asthma may not be well controlled - see doctor. Common to feel shaky or have fast heartbeat after use. Track how often you use it and report to doctor.',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - may transiently increase BP', diabetes: 'CAUTION - may increase blood glucose', asthma: 'FIRST-LINE RESCUE', copd: 'FIRST-LINE RESCUE', ckd: 'SAFE', pregnancy: 'Category C - use if clearly needed', cardiac_disease: 'CAUTION' }
                }
            },
            {
                id: 'hydrocortisone-cream',
                name: 'Hydrocortisone Cream (1%)',
                ph_brands: ['Cortaid', 'Cortizone-10', 'Hydrocortisone Cream', 'Dermacort', 'Aveeno Hydrocortisone'],
                uses: 'Minor skin irritation, itching, rashes, eczema, insect bites, contact dermatitis',
                origin: 'Topical corticosteroid for anti-inflammatory and anti-itch effects',
                whenToGive: 'For minor skin inflammation; apply thin layer 2-4x daily; limit to 7 days without physician consult',
                contraindications: 'Bacterial/fungal/viral skin infections, open wounds, face/groin use without physician guidance',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['skin','rash','itching','steroid','topical'],
                additionalInfo: {
                    genericNames: ['Hydrocortisone', 'Cortisol', 'Hydrocortisone Acetate'],
                    drugClass: 'Topical Corticosteroid (Low Potency, Class VII), Anti-inflammatory, Antipruritic',
                    usesExpanded: 'Minor skin irritation, itching, rashes, eczema (mild), psoriasis (mild), seborrheic dermatitis, contact dermatitis (poison ivy/oak), insect bites, minor allergic skin reactions, anal/perianal itching, external feminine itching',
                    mechanismOfAction: 'Binds to intracellular glucocorticoid receptors, modifying gene transcription. Reduces inflammation by inhibiting phospholipase A2 (decreasing prostaglandins and leukotrienes), reducing capillary permeability, suppressing immune response, and decreasing histamine release from mast cells.',
                    originExpanded: 'Hydrocortisone (cortisol) is the naturally occurring glucocorticoid hormone produced by the adrenal cortex. First isolated in 1950s. Topical formulation developed for skin conditions. 1% concentration is the highest available OTC.',
                    pharmacokinetics: 'Absorption: Variable depending on site (1% scalp, 7% forehead, 30% scrotum), occlusion increases absorption. Systemic absorption minimal with 1% cream used appropriately. Metabolism: Primarily in skin, systemic portion metabolized hepatically. Excretion: Renal as metabolites.',
                    dosing: 'Apply thin film to affected area 2-4 times daily. Gently rub in. For OTC use, limit to 7 days unless directed by physician. Do not apply to large surface areas, broken skin, or use under occlusive dressings without medical supervision.',
                    whenToGiveExpanded: 'For temporary relief of minor skin irritation and itching. Apply after cleaning and drying skin. Use the least amount needed. Not for face, groin, or underarms unless directed by physician (increased absorption). Stop use if irritation worsens.',
                    sideEffects: 'Local: Burning, itching, irritation, dryness at application site. Prolonged use: Skin atrophy, striae, telangiectasia, purpura, acneiform eruptions, hypopigmentation, delayed wound healing. Systemic (rare with OTC use): HPA axis suppression with extensive use.',
                    contraindicationsExpanded: 'Absolute: Bacterial skin infections (impetigo), fungal infections (ringworm, athletes foot), viral skin infections (herpes, chickenpox), rosacea, perioral dermatitis. Relative: Face/groin/axillae (use lower potency shorter duration), children (increased absorption), wounds/ulcers.',
                    drugInteractions: 'Minimal systemic interactions with topical 1% use. Theoretically, other corticosteroids may have additive effects. May mask signs of skin infection if used inappropriately.',
                    nursingConsiderations: '1) Assess the skin condition - ensure not infected (bacterial, fungal, viral). 2) Teach proper application (thin layer, gently rub in). 3) Educate about limited duration (7 days OTC). 4) Monitor for signs of skin atrophy with prolonged use. 5) Advise avoiding face, groin, broken skin. 6) If no improvement in 7 days, refer to physician.',
                    patientEducation: 'Apply a thin layer and rub in gently. Do not use on face, groin, or armpits unless told by doctor. Do not cover with bandages unless directed. Stop use after 7 days unless doctor says otherwise. Do not use on cuts, wounds, or infected skin. If condition worsens or does not improve, see a doctor. This is NOT for treating infections.',
                    conditionSafetyExpanded: { hypertension: 'SAFE - topical', diabetes: 'SAFE - minimal systemic absorption', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Category C - use sparingly if needed', children: 'CAUTION - increased absorption' }
                }
            },
            {
                id: 'clotrimazole',
                name: 'Clotrimazole',
                ph_brands: ['Canesten', 'Lotrimin', 'Mycelex', 'Fungisol', 'Clotrimazole Cream'],
                uses: 'Fungal skin infections, athletes foot, ringworm, yeast infections, jock itch',
                origin: 'Imidazole antifungal developed in the 1960s',
                whenToGive: 'For superficial fungal infections; apply 2-3x daily for 2-4 weeks',
                contraindications: 'Hypersensitivity to imidazoles; avoid contact with eyes',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['fungal','antifungal','skin','ringworm','athletes foot'],
                additionalInfo: {
                    genericNames: ['Clotrimazole', '1-(o-Chloro-alpha,alpha-diphenylbenzyl)imidazole'],
                    drugClass: 'Imidazole Antifungal, Azole Antifungal',
                    usesExpanded: 'Tinea pedis (athletes foot), tinea cruris (jock itch), tinea corporis (ringworm), cutaneous candidiasis, vulvovaginal candidiasis (yeast infection), oral thrush (troche form), tinea versicolor, otomycosis (ear fungus)',
                    mechanismOfAction: 'Inhibits ergosterol synthesis by blocking lanosterol 14-alpha demethylase (CYP51), a fungal cytochrome P450 enzyme. Ergosterol is essential for fungal cell membrane integrity. Disruption causes increased permeability, leakage of cellular contents, and cell death. Fungistatic at low concentrations, fungicidal at higher concentrations.',
                    originExpanded: 'Developed by Bayer AG in Germany in 1969. One of the first imidazole antifungals. FDA approved in 1975. Available in multiple formulations (cream, solution, vaginal tablets, troches). Became OTC in 1990.',
                    pharmacokinetics: 'Topical - Absorption: Minimal systemic absorption (<0.5% through intact skin). Acts locally at site of application. Vaginal: <10% systemic absorption. Oral troche: Small amount swallowed absorbed. Metabolism: Hepatic. Half-life: Not clinically relevant for topical. Duration: Fungistatic effect lasts several hours.',
                    dosing: 'Topical cream/solution: Apply thin layer to affected area 2 times daily (morning and evening) for 2-4 weeks depending on infection. Athletes foot: 4 weeks. Jock itch/ringworm: 2 weeks. Continue for 2 weeks after symptoms resolve. Vaginal: 100-500mg intravaginally for 1-7 days depending on formulation.',
                    whenToGiveExpanded: 'Clean and dry affected area before application. Apply thin layer and rub in gently. Continue treatment for full duration even if symptoms improve to prevent recurrence. For athletes foot, continue 2 weeks after symptoms clear.',
                    sideEffects: 'Topical: Local burning, stinging, redness, itching, peeling, irritation, edema at application site. Vaginal: Mild burning/irritation, abdominal cramps, urinary frequency. Oral: Nausea, vomiting, altered liver function (rare with topical).',
                    contraindicationsExpanded: 'Absolute: Hypersensitivity to clotrimazole or other imidazoles/azoles. Relative: First trimester pregnancy (vaginal use - consult provider), contact lens use (some formulations contain ingredients irritating to eyes).',
                    drugInteractions: 'Topical: Minimal interactions. Vaginal: May damage latex condoms/diaphragms (oil-based formulations). Oral troches: May increase tacrolimus/sirolimus levels. Generally, systemic drug interactions not relevant for topical/vaginal use.',
                    nursingConsiderations: '1) Assess the infection - confirm it appears fungal (not bacterial). 2) Teach proper application and duration. 3) Emphasize completing full course. 4) Advise on hygiene (keep area dry, change socks frequently for athletes foot). 5) If no improvement in 4 weeks (2 weeks for jock itch), refer to physician. 6) For vaginal use, advise avoiding tampons during treatment.',
                    patientEducation: 'Clean and dry the affected area before applying. Use for the full treatment time even if symptoms improve early. For athletes foot, keep feet dry, change socks daily, wear breathable shoes. Wash hands before and after application. Do not cover with airtight bandages unless directed. If no improvement in 2-4 weeks, see a doctor.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE - but monitor, prone to fungal infections', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Topical SAFE; Vaginal - consult provider in 1st trimester' }
                }
            },
            {
                id: 'oral-rehydration-salts',
                name: 'Oral Rehydration Salts (ORS)',
                ph_brands: ['Hydrite', 'Pedialyte', 'Oresol', 'Glucolyte', 'Electrolit'],
                uses: 'Dehydration from diarrhea, vomiting, heat exposure, fluid replacement',
                origin: 'WHO-formulated solution for oral rehydration therapy developed in 1960s',
                whenToGive: 'For mild to moderate dehydration; small frequent sips; continue during diarrhea',
                contraindications: 'Severe dehydration (needs IV), intestinal obstruction, persistent vomiting',
                conditionSafety: { hypertension: 'CAUTION', diabetes: 'CAUTION', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['dehydration','diarrhea','vomiting','electrolytes','rehydration'],
                additionalInfo: {
                    genericNames: ['Oral Rehydration Salts', 'ORS', 'Oral Rehydration Solution', 'Electrolyte Solution'],
                    drugClass: 'Oral Rehydration Therapy (ORT), Electrolyte Replacement',
                    usesExpanded: 'Mild to moderate dehydration from acute diarrhea (gastroenteritis), vomiting, excessive sweating/heat exposure, exercise-induced dehydration, hangover recovery, maintenance of hydration during illness',
                    mechanismOfAction: 'Based on sodium-glucose cotransport mechanism: Glucose enhances sodium absorption in the small intestine through SGLT-1 transporter. Water follows sodium osmotically. The balanced electrolyte composition replaces losses and maintains osmotic balance. WHO formula optimized for maximum water and electrolyte absorption.',
                    originExpanded: 'Developed in the 1960s-70s during cholera epidemics in Bangladesh. WHO and UNICEF standardized the formula in 1975. Called "potentially the most important medical advance this century" by The Lancet (1978). Reduced childhood diarrhea mortality by 90% in developing countries. Low-osmolarity formula adopted in 2002.',
                    pharmacokinetics: 'Absorption: Rapid intestinal absorption due to glucose-sodium cotransport. Onset: Rehydration begins within 30 minutes. Components distributed according to body fluid compartments. Sodium and glucose absorbed in small intestine. Excess excreted renally.',
                    dosing: 'Mild dehydration: 50-100 mL/kg over 4 hours. Moderate dehydration: 100 mL/kg over 4 hours. Maintenance: 10 mL/kg for each watery stool. Infants: Teaspoon amounts frequently. Children: Small sips every few minutes. Adults: Cup amounts as tolerated. Continue until diarrhea stops + adequate urine output.',
                    whenToGiveExpanded: 'Begin at first sign of diarrhea or vomiting. Give in small, frequent amounts (teaspoons for infants, small sips for children/adults). If vomiting, wait 10 minutes and try again with smaller amounts. Continue regular feeding/breastfeeding alongside ORS. More effective than water, juice, or soda for rehydration.',
                    sideEffects: 'Common: Nausea if drunk too fast. Hypernatremia if mixed incorrectly (too concentrated). Hyperglycemia in diabetics. Fluid overload if over-administered in renal/cardiac disease. Generally very safe when used correctly.',
                    contraindicationsExpanded: 'Absolute: Severe dehydration (>10% body weight - needs IV), shock, unconsciousness, ileus, intestinal obstruction, intractable vomiting. Relative: Renal failure (electrolyte concerns), severe malnutrition (refeeding issues), hypernatremia.',
                    drugInteractions: 'Minimal drug interactions. Absorption of some medications may be affected during acute diarrhea. Glucose content should be considered in diabetic management. Does not interact directly with medications.',
                    nursingConsiderations: '1) Assess hydration status (skin turgor, mucous membranes, urine output, capillary refill). 2) Weigh patient if possible. 3) Ensure correct mixing if using powder (1 packet to 1 liter water). 4) Monitor intake and output. 5) Assess for signs of severe dehydration needing IV. 6) Educate on giving small frequent amounts if vomiting. 7) Continue breastfeeding/regular diet alongside.',
                    patientEducation: 'Mix exactly as directed on packet - not more or less water. Give small frequent sips, not large amounts at once. If vomiting, wait 10 minutes and try smaller amounts. Continue breastfeeding or regular diet. ORS does not stop diarrhea - it prevents dehydration. Seek medical help if: blood in stool, severe vomiting, no urine for 6+ hours, very drowsy, or condition worsens.',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - check sodium content', diabetes: 'CAUTION - contains glucose, monitor blood sugar', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - electrolyte concerns', heart_failure: 'CAUTION - fluid overload risk' }
                }
            },
            {
                id: 'simethicone',
                name: 'Simethicone',
                ph_brands: ['Gas-X', 'Mylicon', 'Phazyme', 'Degas', 'Flatulex'],
                uses: 'Gas, bloating, flatulence, abdominal discomfort from gas',
                origin: 'Anti-foaming agent that reduces surface tension of gas bubbles',
                whenToGive: 'For gas-related discomfort; take after meals and at bedtime',
                contraindications: 'None significant; considered very safe',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['gas','bloating','flatulence','digestive'],
                additionalInfo: {
                    genericNames: ['Simethicone', 'Dimethicone activated', 'Polydimethylsiloxane'],
                    drugClass: 'Antiflatulent, Antifoaming Agent, GI Defoamer',
                    usesExpanded: 'Relief of painful symptoms from excess gas in the GI tract (bloating, pressure, fullness, cramping), postoperative gas pain, infant colic (drops), adjunct to gastric imaging (reduces gas artifacts), adjunct before endoscopy',
                    mechanismOfAction: 'Acts as a surfactant/defoaming agent. Reduces surface tension of gas bubbles in the GI tract, causing them to coalesce (merge) into larger bubbles that can be more easily expelled by belching or passing flatus. Does not reduce gas production - only changes physical properties. Inert and not absorbed.',
                    originExpanded: 'Silicone-based compound developed mid-20th century. First used in industrial applications as anti-foaming agent. Pharmaceutical use recognized for GI gas relief. FDA approved for OTC use. One of the safest medications available.',
                    pharmacokinetics: 'Absorption: NOT absorbed from GI tract - acts purely locally (physical effect). Passes through GI tract unchanged. Onset: Within minutes. Duration: As long as in contact with gas. Excretion: Eliminated unchanged in feces. No systemic effects.',
                    dosing: 'Adults & children ≥12y: 40-125mg after meals and at bedtime (max 500mg/day). Children 2-12y: 40mg up to 4 times daily. Infants: 20mg (0.3mL drops) up to 4 times daily, with or after feeds. Chewable tablets should be chewed thoroughly.',
                    whenToGiveExpanded: 'Take after meals and at bedtime for best effect. For infant colic, give during or after feeding. Chew tablets thoroughly before swallowing for faster action. Can be used regularly or as needed. Safe for long-term use.',
                    sideEffects: 'Essentially no side effects due to lack of absorption. Rarely: Mild GI upset. No systemic effects. Considered one of the safest OTC medications. Safe for infants, pregnant/nursing women.',
                    contraindicationsExpanded: 'Essentially none. Hypersensitivity to simethicone (extremely rare). No known contraindications due to lack of systemic absorption.',
                    drugInteractions: 'None known. Because it is not absorbed, it does not interact with other medications systemically. May theoretically affect absorption of fat-soluble drugs, but not clinically significant.',
                    nursingConsiderations: '1) Assess source of GI discomfort - rule out serious causes (obstruction, perforation). 2) Reassure patient about excellent safety profile. 3) Advise chewing tablets thoroughly. 4) For infants, use calibrated dropper. 5) If symptoms persist or worsen, further evaluation needed. 6) Educate about dietary causes of gas.',
                    patientEducation: 'Chew tablets completely before swallowing. Very safe - even for babies and pregnant women. Works by making gas bubbles smaller and easier to pass. Does not reduce gas production - just helps expel it. If symptoms persist, see a doctor. Dietary changes may help reduce gas: avoid beans, carbonated drinks, eat slowly, reduce lactose if intolerant.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'SAFE - not absorbed', infants: 'SAFE - commonly used for colic' }
                }
            },
            {
                id: 'bisacodyl',
                name: 'Bisacodyl',
                ph_brands: ['Dulcolax', 'Fleet Laxative', 'Correctol', 'Bisalax', 'Magic Bullet'],
                uses: 'Constipation, bowel preparation before procedures',
                origin: 'Stimulant laxative that increases intestinal motility',
                whenToGive: 'For occasional constipation; take at bedtime for morning effect; not for daily use',
                contraindications: 'Intestinal obstruction, acute abdominal conditions, severe dehydration',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['constipation','laxative','bowel'],
                additionalInfo: {
                    genericNames: ['Bisacodyl', 'Bis(4-acetoxyphenyl)-2-pyridylmethane'],
                    drugClass: 'Stimulant Laxative, Diphenylmethane Derivative',
                    usesExpanded: 'Occasional constipation, bowel preparation before colonoscopy/surgery/radiological procedures, constipation due to opioids or immobility, neurogenic bowel (spinal cord injury), relief of fecal impaction (suppository)',
                    mechanismOfAction: 'Stimulates enteric neurons in the colonic wall, causing peristaltic contractions. Also inhibits water and electrolyte absorption in the intestine and stimulates secretion, resulting in fluid accumulation that further promotes evacuation. Acts primarily on the large intestine.',
                    originExpanded: 'Developed by Boehringer Ingelheim in 1953. First marketed in Germany. FDA approved. One of the most commonly used stimulant laxatives worldwide. Available in both oral and rectal (suppository) forms.',
                    pharmacokinetics: 'Absorption: Oral tablets are enteric-coated; minimal absorption (<5%). Converted to active metabolite (bis-(p-hydroxyphenyl)-pyridyl-2-methane) by intestinal bacteria and enzymes. Onset: Oral 6-12 hours, Suppository 15-60 minutes. Duration: Single bowel movement. Excretion: Minimal systemic; mostly fecal.',
                    dosing: 'Oral tablets (adults): 5-15mg once daily at bedtime. Take on empty stomach. Children 6-12y: 5mg. Suppository (adults): 10mg once daily. Children 6-12y: 5-10mg. Children 2-6y: 5mg. For bowel prep: Higher doses per protocol. Not for daily use beyond 1 week.',
                    whenToGiveExpanded: 'Take oral tablets at bedtime for morning bowel movement. Do NOT crush, chew, or take with milk/antacids (damages enteric coating causing stomach irritation). Suppositories work faster (15-60 min) for more urgent relief. Not for daily long-term use - can cause dependency.',
                    sideEffects: 'Common: Abdominal cramping, diarrhea, nausea. Suppository: Rectal irritation/burning. Prolonged use: Electrolyte imbalance (hypokalemia), dehydration, "lazy bowel" syndrome (laxative dependency), melanosis coli (harmless discoloration).',
                    contraindicationsExpanded: 'Absolute: Intestinal obstruction, ileus, acute abdominal conditions (appendicitis, inflammatory bowel disease flare), severe dehydration, undiagnosed abdominal pain/vomiting. Relative: Recent abdominal surgery, elderly (electrolyte concerns), children <2 years.',
                    drugInteractions: 'Antacids, milk, PPIs, H2 blockers: Can dissolve enteric coating prematurely (take 1 hour apart). Diuretics: Additive hypokalemia risk. Digoxin: Hypokalemia may enhance toxicity. Corticosteroids: Additive electrolyte loss.',
                    nursingConsiderations: '1) Assess bowel pattern and rule out obstruction. 2) Ensure patient does not crush/chew tablets or take with milk/antacids. 3) Monitor for cramping and adequate hydration. 4) Educate about expected timing (oral: morning, suppository: 15-60 min). 5) Warn against long-term daily use. 6) Monitor electrolytes if repeated use.',
                    patientEducation: 'Swallow tablets whole - do not crush or chew. Do not take with milk or antacids (wait 1 hour). Expect bowel movement 6-12 hours after oral dose. For suppository, retain as long as comfortable for best effect. May cause cramping. Increase fiber, fluids, and exercise for long-term bowel health. Not for daily use - only occasional constipation.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - monitor electrolytes', pregnancy: 'Category C - occasional use likely safe', ibd: 'AVOID during flare' }
                }
            },
            {
                id: 'zinc-supplements',
                name: 'Zinc Supplements',
                ph_brands: ['Zinc Sulfate', 'Soluzinc', 'Immunpro', 'Bewell-C Zinc', 'Cold-EEZE'],
                uses: 'Zinc deficiency, immune support, diarrhea in children (adjunct), wound healing',
                origin: 'Essential mineral supplement; WHO recommends for pediatric diarrhea',
                whenToGive: 'For zinc deficiency or as adjunct therapy in acute diarrhea (children); take with food to reduce GI upset',
                contraindications: 'Copper deficiency with prolonged high-dose use; avoid with certain antibiotics (reduces absorption)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['supplement','immune','diarrhea','zinc','vitamin'],
                additionalInfo: {
                    genericNames: ['Zinc Sulfate', 'Zinc Gluconate', 'Zinc Acetate', 'Zinc Picolinate', 'Elemental Zinc'],
                    drugClass: 'Essential Mineral Supplement, Trace Element',
                    usesExpanded: 'Zinc deficiency (acrodermatitis enteropathica, malabsorption, alcoholism), adjunct treatment of pediatric diarrhea (WHO-recommended), Wilson disease (high dose), immune support, wound healing, common cold (possibly reduces duration), age-related macular degeneration prevention, acne (adjunct)',
                    mechanismOfAction: 'Zinc is a cofactor for >300 enzymes involved in protein synthesis, DNA synthesis, cell division, wound healing, and immune function. In diarrhea, zinc restores intestinal mucosal integrity and enhances immune response. May also inhibit rhinovirus replication (cold lozenges).',
                    originExpanded: 'Zinc\'s essential role in human nutrition recognized in 1960s. WHO added zinc to ORS recommendation in 2004 after studies showed reduced diarrhea duration and severity in children. Named from German "Zink" (meaning pointed, referring to crystal shape).',
                    pharmacokinetics: 'Absorption: 20-40% absorbed from GI tract (reduced by phytates, fiber, calcium). Absorption better with picolinate/gluconate forms. Distribution: Found in all tissues; highest in muscle, bone, liver. Metabolism: Not metabolized. Excretion: Primarily fecal; small amount renal.',
                    dosing: 'RDA: Adults 8-11mg/day. Zinc deficiency: 25-50mg elemental zinc daily. Pediatric diarrhea (WHO): 10mg/day (<6 months), 20mg/day (≥6 months) for 10-14 days. Common cold: 75mg+ daily as lozenges. Upper limit: 40mg/day for adults (prolonged use).',
                    whenToGiveExpanded: 'Take with food to reduce GI upset. For diarrhea in children, start within 3 days of onset and continue for 10-14 days. For cold, zinc lozenges may be most effective within 24 hours of symptom onset. Space from antibiotics (quinolones, tetracyclines) by 2 hours.',
                    sideEffects: 'Common: Nausea, vomiting, metallic taste, diarrhea, stomach cramps (especially on empty stomach). Lozenges: Mouth irritation, altered taste. Chronic high doses: Copper deficiency (anemia, neutropenia), HDL reduction. Intranasal zinc: Loss of smell (anosmia - avoid!).',
                    contraindicationsExpanded: 'Relative: Copper deficiency (zinc inhibits copper absorption), chronic kidney disease (accumulation risk). Avoid intranasal zinc products (permanent anosmia risk). Caution with prolonged high doses >40mg/day.',
                    drugInteractions: 'Fluoroquinolones, tetracyclines: Reduced antibiotic absorption (take 2 hours apart). Penicillamine: Reduced effect. Thiazide diuretics: Increased zinc excretion. Calcium, iron: May reduce zinc absorption if taken together.',
                    nursingConsiderations: '1) Assess for zinc deficiency symptoms (poor wound healing, taste changes, skin lesions, frequent infections). 2) For pediatric diarrhea, combine with ORS. 3) Monitor copper levels with prolonged supplementation. 4) Educate about food timing to reduce GI upset. 5) Space from certain antibiotics. 6) Check for drug interactions.',
                    patientEducation: 'Take with food to prevent stomach upset. Do NOT use zinc nasal sprays (can cause permanent loss of smell). For colds, start at first sign of symptoms. If taking antibiotics, take zinc at least 2 hours apart. High doses over long periods can cause copper deficiency. For children with diarrhea, continue for 10-14 days as recommended.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - accumulation risk', pregnancy: 'SAFE at recommended doses', pediatric_diarrhea: 'WHO-RECOMMENDED' }
                }
            },
            {
                id: 'ascorbic-acid',
                name: 'Ascorbic Acid (Vitamin C)',
                ph_brands: ['Cecon', 'Celin', 'Fern-C', 'Bewell-C', 'Poten-Cee', 'Cee Plus'],
                uses: 'Vitamin C deficiency, immune support, antioxidant, wound healing',
                origin: 'Essential vitamin; deficiency causes scurvy; popularized for cold prevention',
                whenToGive: 'For deficiency or supplementation; daily dosing; high doses may cause GI upset',
                contraindications: 'History of kidney stones (high doses), hemochromatosis, G6PD deficiency (very high doses)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['vitamin','supplement','immune','antioxidant'],
                additionalInfo: {
                    genericNames: ['Ascorbic Acid', 'Vitamin C', 'L-ascorbic acid', 'Sodium Ascorbate', 'Calcium Ascorbate'],
                    drugClass: 'Water-Soluble Vitamin, Antioxidant, Dietary Supplement',
                    usesExpanded: 'Scurvy prevention and treatment, dietary supplementation, wound healing, iron absorption enhancement, immune support, common cold (may reduce duration/severity slightly), antioxidant protection, collagen synthesis, adjunct in methemoglobinemia',
                    mechanismOfAction: 'Essential cofactor for collagen synthesis (hydroxylation of proline/lysine), carnitine biosynthesis, and neurotransmitter synthesis. Potent antioxidant that scavenges free radicals. Enhances iron absorption by reducing ferric to ferrous iron. Supports immune cell function.',
                    originExpanded: 'Identified in 1932 by Albert Szent-Györgyi (Nobel Prize 1937). Deficiency causes scurvy (known since ancient times in sailors). Linus Pauling popularized megadose therapy in 1970s (controversial). "Ascorbic" means "without scurvy."',
                    pharmacokinetics: 'Absorption: Active transport in small intestine (saturable at ~200mg). Higher doses have decreased bioavailability. Distribution: Widely distributed; highest in leukocytes, adrenal glands, pituitary. Not stored significantly. Half-life: 10-20 days at normal intake. Excretion: Renal (as oxalate and unchanged).',
                    dosing: 'RDA: Adults 75-90mg/day (smokers add 35mg). Deficiency treatment: 100-200mg 3 times daily. Immune support: 200-1000mg daily. Upper limit: 2000mg/day (higher doses cause GI upset, oxalate stones). Pediatric: 15-45mg/day depending on age.',
                    whenToGiveExpanded: 'Can be taken anytime; food may reduce GI upset at high doses. Divide high doses throughout the day (better absorption). For iron deficiency, take with iron supplements to enhance absorption. Excess is excreted in urine (expensive urine!).',
                    sideEffects: 'Low doses: Generally well tolerated. High doses (>2g/day): Diarrhea, nausea, abdominal cramps, kidney stones (oxalate), headache. Rebound scurvy (if suddenly stopped after prolonged high doses). False-negative stool occult blood and glucose tests.',
                    contraindicationsExpanded: 'Relative: History of kidney stones (oxalate stones - limit to <1g/day), hemochromatosis and other iron overload conditions (enhances iron absorption), G6PD deficiency (very high IV doses can cause hemolysis), renal impairment.',
                    drugInteractions: 'Iron: Enhanced absorption (beneficial in deficiency). Warfarin: High doses may reduce anticoagulant effect. Aluminum antacids: Increases aluminum absorption. Aspirin: High doses increase aspirin levels. Estrogens: Increased estrogen levels. May interfere with some lab tests.',
                    nursingConsiderations: '1) Assess for scurvy symptoms (bleeding gums, petechiae, poor wound healing, fatigue). 2) Identify patients at risk (elderly, alcoholics, restricted diets). 3) Educate about realistic expectations (modest cold benefit). 4) Monitor for GI upset with high doses. 5) Warn about kidney stone risk with megadoses. 6) Advise gradual dose reduction if stopping high doses.',
                    patientEducation: 'Best obtained from fruits and vegetables (citrus, berries, peppers, broccoli). Supplements not necessary for most people with balanced diet. High doses (>2g) can cause stomach upset and kidney stones. If taking iron supplements, vitamin C helps absorption. Evidence for cold prevention is modest - may slightly reduce duration but not prevent colds.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - limit dose, oxalate concerns', kidney_stones: 'CAUTION - limit to <1g/day', hemochromatosis: 'AVOID - increases iron absorption' }
                }
            },
            {
                id: 'lagundi',
                name: 'Lagundi (Vitex negundo)',
                ph_brands: ['Ascof', 'Lagundi Tablet', 'Plemex', 'Lagundex', 'Ascof Lagundi'],
                uses: 'Cough (productive and non-productive), mild asthma symptoms, pharyngitis',
                origin: 'DOH-approved Philippine herbal medicine with bronchodilator properties',
                whenToGive: 'For cough relief; may be used as first-line for mild respiratory symptoms',
                contraindications: 'Pregnancy (traditional caution), hypersensitivity to plant',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['cough','herbal','philippine','respiratory','doh-approved'],
                additionalInfo: {
                    genericNames: ['Vitex negundo', 'Five-Leaved Chaste Tree', 'Lagundi Leaf Extract', 'Dangla'],
                    drugClass: 'Herbal Antitussive, Bronchodilator, Expectorant (DOH-Approved Herbal Medicine)',
                    usesExpanded: 'Cough (both productive and non-productive), mild asthma, pharyngitis, bronchitis, URTI symptoms, fever, rheumatism and body pain (traditional use), headache, boils and skin disorders (poultice)',
                    mechanismOfAction: 'Contains chrysoplenol D and other flavonoids that relax bronchial smooth muscle (bronchodilator effect). Also has expectorant, anti-inflammatory, and antimicrobial properties. May inhibit leukotriene and histamine release, contributing to anti-asthmatic effects.',
                    originExpanded: 'Native shrub widespread in the Philippines. Used in traditional Philippine medicine for generations. Became one of the 10 DOH-approved herbal medicines in 1997 under the Traditional Medicine Program. Scientifically validated for cough and asthma.',
                    pharmacokinetics: 'Limited pharmacokinetic data for herbal preparations. Active compounds (flavonoids, terpenes) absorbed from GI tract. Onset: 30-60 minutes for cough relief. Duration: 4-6 hours. Metabolism and excretion not fully characterized.',
                    dosing: 'Leaf decoction: 1-2 tablespoons of chopped fresh leaves in 2 glasses of water, boil to 1 glass, drink 1/3 cup 3 times daily. Syrup (Ascof): Adults: 10mL 3 times daily. Children: 5mL 3 times daily. Tablets/capsules: Follow product labeling (usually 300-600mg 3 times daily).',
                    whenToGiveExpanded: 'Can be used as first-line treatment for mild cough and respiratory symptoms. Take with or without food. Can be used for both dry and productive cough. For acute symptoms, may use for 7-14 days. If no improvement, seek medical evaluation.',
                    sideEffects: 'Generally well tolerated. Rare: Mild GI upset, skin rash (allergic reaction). No serious side effects reported in clinical studies at recommended doses.',
                    contraindicationsExpanded: 'Pregnancy and lactation (insufficient safety data - traditional caution). Hypersensitivity to Vitex negundo or related plants (Verbenaceae family). Use with caution in children under 2 years.',
                    drugInteractions: 'No significant drug interactions documented. As an herbal product, potential for interaction with other medications exists but is not well studied. Use caution if taking multiple medications.',
                    nursingConsiderations: '1) Assess cough character and duration. 2) Verify patient is not pregnant or breastfeeding. 3) Educate about proper preparation if using fresh leaves. 4) Monitor for allergic reactions. 5) Refer to physician if cough persists >2 weeks or is associated with fever, hemoptysis, or weight loss. 6) One of 10 DOH-approved herbal medicines.',
                    patientEducation: 'DOH-approved herbal medicine for cough. Can use for both dry and wet cough. If using fresh leaves, follow proper decoction instructions. Available as convenient syrup and tablet forms. Generally safe but avoid during pregnancy. See a doctor if cough persists more than 2 weeks or if you develop fever or cough up blood.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE - may help mild symptoms', copd: 'SAFE - may help symptoms', ckd: 'SAFE', pregnancy: 'AVOID - insufficient safety data', children: 'SAFE >2 years at appropriate dose' }
                }
            },
            {
                id: 'sambong',
                name: 'Sambong (Blumea balsamifera)',
                ph_brands: ['Sambong Tablet', 'Releaf Forte', 'Sambong Plus', 'Natatanging Gamot'],
                uses: 'Mild urinary tract infections, kidney stone dissolution (adjunct), diuretic',
                origin: 'DOH-approved Philippine herbal medicine with diuretic and anti-urolithiatic properties',
                whenToGive: 'For UTI symptoms or kidney stone prevention; increase fluid intake',
                contraindications: 'Severe renal impairment, pregnancy',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['uti','herbal','philippine','diuretic','kidney','doh-approved'],
                additionalInfo: {
                    genericNames: ['Blumea balsamifera', 'Ngai Camphor', 'Sambong Leaf Extract', 'Subsob'],
                    drugClass: 'Herbal Diuretic, Anti-urolithiatic, Anti-edema Agent (DOH-Approved Herbal Medicine)',
                    usesExpanded: 'Mild urinary tract infections, dissolution and prevention of kidney stones (calcium oxalate type), edema, hypertension (adjunct due to diuretic effect), rheumatism (traditional use), postpartum care, wound healing (poultice)',
                    mechanismOfAction: 'Contains flavonoids and sesquiterpenes with diuretic properties that increase urine output. Anti-urolithiatic effect through promotion of stone dissolution and prevention of calcium oxite crystal formation. Also has antimicrobial and anti-inflammatory properties.',
                    originExpanded: 'Native plant found throughout the Philippines, known locally as "sambong" or "subsob." Used in traditional Filipino medicine for centuries. One of the 10 DOH-approved herbal medicines since 1997. Scientifically studied for urological conditions.',
                    pharmacokinetics: 'Limited formal pharmacokinetic studies. Active components absorbed from GI tract. Diuretic effect noted within 1-2 hours. Duration of action: 4-6 hours. Excreted primarily through kidneys.',
                    dosing: 'Decoction: 1 cup of chopped fresh leaves (50g) boiled in 2 glasses of water, reduced to 1 glass. Drink 1/3 glass 3 times daily after meals. Tablets: Usually 500mg 3 times daily after meals. Continue for 2-4 weeks for kidney stones. Increase fluid intake.',
                    whenToGiveExpanded: 'Take after meals to reduce GI upset. Always encourage high fluid intake (8+ glasses daily) when using for UTI or kidney stones. Can be used as first-line for mild UTI symptoms. For kidney stones, usually used as adjunct to medical management.',
                    sideEffects: 'Generally well tolerated. May cause increased urination (expected diuretic effect). Rare: Mild GI upset, allergic reactions. No serious adverse effects reported at recommended doses.',
                    contraindicationsExpanded: 'Pregnancy (may have uterotonic effects), breastfeeding (insufficient safety data), severe renal impairment, dehydration, electrolyte imbalances. Use with caution in patients on diuretics or with heart failure.',
                    drugInteractions: 'Diuretics: Additive diuretic effect (monitor for dehydration, electrolyte imbalance). Lithium: May affect lithium levels due to diuretic effect. Other nephrotoxic drugs: Use with caution.',
                    nursingConsiderations: '1) Assess urinary symptoms and hydration status. 2) Encourage high fluid intake. 3) Monitor urine output. 4) Verify patient is not pregnant. 5) If symptoms persist beyond 2 weeks or worsen (fever, flank pain, hematuria), refer to physician. 6) One of 10 DOH-approved herbal medicines.',
                    patientEducation: 'DOH-approved herbal medicine for urinary conditions. Drink plenty of water (8+ glasses daily) while taking sambong. Take after meals. May notice increased urination - this is expected. See a doctor if you have fever, severe pain, blood in urine, or symptoms worsen. Not recommended during pregnancy. Continue treatment for recommended duration.',
                    conditionSafetyExpanded: { hypertension: 'SAFE - may help via diuretic effect', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - monitor renal function', pregnancy: 'AVOID', dehydration: 'AVOID - increase fluids first' }
                }
            },
            {
                id: 'naproxen',
                name: 'Naproxen',
                ph_brands: ['Aleve', 'Flanax', 'Naprosyn', 'Anaprox', 'Synflex'],
                uses: 'Pain, inflammation, arthritis, menstrual cramps, headache, fever',
                origin: 'NSAID introduced in 1976; longer duration of action than ibuprofen',
                whenToGive: 'For pain and inflammation; take with food; suitable for twice daily dosing',
                contraindications: 'Active peptic ulcer, severe renal/hepatic impairment, aspirin-sensitive asthma, cardiovascular disease',
                conditionSafety: { hypertension: 'CAUTION', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED' },
                tags: ['pain','nsaid','inflammation','arthritis','fever'],
                additionalInfo: {
                    genericNames: ['Naproxen', 'Naproxen Sodium', '(S)-(+)-6-methoxy-α-methyl-2-naphthaleneacetic acid'],
                    drugClass: 'Nonsteroidal Anti-inflammatory Drug (NSAID), Propionic Acid Derivative',
                    usesExpanded: 'Mild to moderate pain, inflammatory conditions (rheumatoid arthritis, osteoarthritis, ankylosing spondylitis, gout), primary dysmenorrhea, tendinitis, bursitis, fever, migraine (acute), dental pain',
                    mechanismOfAction: 'Non-selective COX-1 and COX-2 inhibitor, blocking prostaglandin synthesis. Results in anti-inflammatory, analgesic, and antipyretic effects. Has longer half-life than ibuprofen, allowing twice-daily dosing.',
                    originExpanded: 'Developed by Syntex Corporation. FDA approved in 1976 as prescription, OTC naproxen sodium (Aleve) approved in 1994. Naproxen sodium has faster onset than naproxen base. Considered to have slightly lower cardiovascular risk compared to some other NSAIDs.',
                    pharmacokinetics: 'Absorption: Rapid and complete (95% bioavailability). Peak: 1-2 hours (naproxen sodium), 2-4 hours (naproxen). Distribution: 99% protein-bound. Metabolism: Hepatic via CYP2C9 to 6-O-desmethyl naproxen (inactive). Half-life: 12-17 hours (allows twice-daily dosing). Excretion: 95% renal.',
                    dosing: 'Pain/dysmenorrhea: 500mg initially, then 250mg every 6-8 hours (max 1250mg first day, then 1000mg/day). OTC (Aleve): 220mg every 8-12 hours (max 660mg/day). Arthritis: 250-500mg twice daily. Take with food. Elderly: Use lowest effective dose.',
                    whenToGiveExpanded: 'Take with food, milk, or antacid to reduce GI irritation. Long half-life allows twice-daily dosing - advantage for chronic conditions like arthritis. Use lowest effective dose for shortest duration. For menstrual cramps, start at onset of bleeding.',
                    sideEffects: 'Common: GI upset, heartburn, nausea, headache, dizziness, drowsiness. Serious: GI bleeding/ulceration, cardiovascular events (MI, stroke - though lower than some NSAIDs), renal impairment, hepatotoxicity, severe skin reactions, fluid retention.',
                    contraindicationsExpanded: 'Absolute: Active GI bleeding or peptic ulcer, hypersensitivity to NSAIDs, aspirin-triad (asthma, rhinitis, nasal polyps), severe heart failure, post-CABG surgery, third trimester pregnancy. Relative: History of GI disease, renal/hepatic impairment, hypertension, cardiovascular disease.',
                    drugInteractions: 'Anticoagulants (warfarin): Increased bleeding risk. Aspirin: Reduced cardioprotection, increased GI risk. ACE inhibitors/ARBs: Reduced efficacy, increased renal risk. Lithium: Increased levels. Methotrexate: Increased toxicity. Diuretics: Reduced efficacy. Other NSAIDs: Avoid combination.',
                    nursingConsiderations: '1) Assess pain level before and after administration. 2) Monitor for GI bleeding (dark stools, epigastric pain). 3) Check renal function and BP, especially with prolonged use. 4) Ensure taken with food. 5) Educate about cardiovascular warning signs. 6) Lower CV risk than some NSAIDs, but caution still needed.',
                    patientEducation: 'Take with food or milk. Do not lie down for 30 minutes after taking. Avoid alcohol. Can take every 12 hours (longer-lasting than ibuprofen). Report black stools, persistent stomach pain, or unusual bleeding. Avoid if pregnant, especially in third trimester. Inform doctor before surgery.',
                    conditionSafetyExpanded: { hypertension: 'CAUTION - may elevate BP', diabetes: 'SAFE', asthma: 'CAUTION - if aspirin-sensitive', copd: 'SAFE', ckd: '⚠️ CONTRAINDICATED', pregnancy: '⚠️ CONTRAINDICATED in 3rd trimester', cardiovascular: 'CAUTION - lower risk than some NSAIDs' }
                }
            },
            {
                id: 'chlorpheniramine',
                name: 'Chlorpheniramine',
                ph_brands: ['Chlor-Trimeton', 'Neozep', 'Decolgen', 'Tuseran', 'Allergy Relief'],
                uses: 'Allergic rhinitis, common cold symptoms, urticaria, hay fever',
                origin: 'First-generation antihistamine introduced in 1949; common in combination cold medicines',
                whenToGive: 'For allergy/cold symptoms; causes drowsiness; avoid driving',
                contraindications: 'Narrow-angle glaucoma, urinary retention, MAOIs, elderly (increased sensitivity)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'CAUTION', ckd: 'SAFE' },
                tags: ['allergy','antihistamine','cold','sedating'],
                additionalInfo: {
                    genericNames: ['Chlorpheniramine Maleate', 'Chlorphenamine', 'CPM'],
                    drugClass: 'First-Generation Antihistamine (H1-receptor antagonist), Alkylamine Derivative, Sedating Antihistamine',
                    usesExpanded: 'Allergic rhinitis (seasonal and perennial), common cold symptoms (runny nose, sneezing), urticaria (hives), allergic conjunctivitis, hay fever, pruritus, adjunct in anaphylaxis, sedation (off-label)',
                    mechanismOfAction: 'Competitively blocks H1-histamine receptors, preventing histamine-mediated allergic responses. Readily crosses blood-brain barrier causing significant sedation. Also has anticholinergic (drying) effects that help reduce nasal secretions.',
                    originExpanded: 'Developed by Schering Corporation (now Merck). FDA approved in 1949. One of the first commercially available antihistamines. Very inexpensive and widely available. Common component in combination cold/flu medications.',
                    pharmacokinetics: 'Absorption: Well absorbed orally. Onset: 30-60 minutes. Peak: 2-6 hours. Duration: 4-6 hours. Distribution: Widely distributed, crosses BBB (causes sedation). Metabolism: Hepatic via CYP enzymes. Half-life: 12-24 hours. Excretion: Renal.',
                    dosing: 'Adults: 4mg every 4-6 hours (max 24mg/day). Extended-release: 8-12mg every 8-12 hours. Children 6-12y: 2mg every 4-6 hours (max 12mg/day). Children 2-6y: 1mg every 4-6 hours (max 6mg/day). Not recommended <2 years.',
                    whenToGiveExpanded: 'For allergy and cold symptoms. Take at bedtime if daytime drowsiness is problematic. Effective for drying nasal secretions. Sedating properties can be beneficial for nighttime dosing or when sleep is disrupted by symptoms.',
                    sideEffects: 'Common: Drowsiness (significant), dry mouth, urinary retention, constipation, blurred vision, dizziness, thickened bronchial secretions. Rare: Paradoxical excitation (children), hypersensitivity, blood dyscrasias.',
                    contraindicationsExpanded: 'Absolute: Narrow-angle glaucoma, MAOI use within 14 days, premature/newborn infants. Relative: Elderly (increased anticholinergic sensitivity), prostatic hypertrophy, urinary retention, GI obstruction, severe cardiovascular disease, asthma/COPD (may thicken secretions).',
                    drugInteractions: 'CNS depressants (alcohol, opioids, benzodiazepines): Enhanced sedation. MAOIs: Prolonged anticholinergic effects. Anticholinergic drugs: Additive effects. CYP inhibitors: May increase levels.',
                    nursingConsiderations: '1) Assess allergy symptoms before and after administration. 2) Warn about significant sedation - advise against driving. 3) Monitor for anticholinergic effects (dry mouth, urinary retention). 4) Use caution in elderly (Beers criteria). 5) Consider non-sedating alternatives for daytime use. 6) Monitor in children for paradoxical excitation.',
                    patientEducation: 'Causes significant drowsiness - do not drive or operate machinery. Avoid alcohol and other sedatives. May cause dry mouth - sip water or suck hard candy. Report difficulty urinating. Consider taking at bedtime. For daytime use, non-sedating antihistamines (loratadine, cetirizine) may be better options.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION - may thicken secretions', copd: 'CAUTION - anticholinergic effects', ckd: 'SAFE', pregnancy: 'Category B - may be used if needed', elderly: '⚠️ AVOID - Beers Criteria' }
                }
            },
            {
                id: 'dimenhydrinate',
                name: 'Dimenhydrinate',
                ph_brands: ['Dramamine', 'Bonamine', 'Travel-Ease', 'Gravol', 'Vertirex'],
                uses: 'Motion sickness, nausea, vomiting, vertigo',
                origin: 'Antihistamine/anticholinergic combination; diphenhydramine derivative',
                whenToGive: 'For motion sickness prevention; take 30 min before travel; causes drowsiness',
                contraindications: 'Narrow-angle glaucoma, urinary retention, newborns/premature infants',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'CAUTION', ckd: 'SAFE' },
                tags: ['motion sickness','nausea','antiemetic','travel'],
                additionalInfo: {
                    genericNames: ['Dimenhydrinate', 'Diphenhydramine theoclate', 'Dramamine'],
                    drugClass: 'Antihistamine-Anticholinergic, Antiemetic, Motion Sickness Agent',
                    usesExpanded: 'Prevention and treatment of motion sickness (car, sea, air), nausea and vomiting, vertigo and dizziness from vestibular disorders, Ménière disease symptoms',
                    mechanismOfAction: 'Dimenhydrinate is a salt of diphenhydramine and 8-chlorotheophylline. Blocks H1 histamine receptors and muscarinic cholinergic receptors in the vomiting center and vestibular system. The theophylline component was thought to counteract drowsiness but has minimal effect. Acts primarily on the vomiting center in the medulla.',
                    originExpanded: 'Developed by G.D. Searle & Company in 1949. Combines diphenhydramine with 8-chlorotheophylline. First effective OTC treatment for motion sickness. Trade name "Dramamine" comes from "drama" (originally tested on theater workers) and "amine."',
                    pharmacokinetics: 'Absorption: Well absorbed orally. Onset: 30-60 minutes (oral), 20-30 minutes (chewable). Peak: 1-2 hours. Duration: 4-6 hours. Distribution: Crosses BBB (causes sedation). Metabolism: Hepatic. Half-life: ~2.5 hours. Excretion: Renal.',
                    dosing: 'Prevention of motion sickness - Adults: 50-100mg 30 minutes before travel, then 50-100mg every 4-6 hours (max 400mg/day). Children 6-12y: 25-50mg every 6-8 hours (max 150mg/day). Children 2-6y: 12.5-25mg every 6-8 hours (max 75mg/day).',
                    whenToGiveExpanded: 'For motion sickness prevention, take 30 minutes to 1 hour before travel. Once motion sickness has started, may be less effective. Can redose during long trips. Take with food if GI upset occurs. Chewable forms act faster.',
                    sideEffects: 'Common: Drowsiness (significant), dry mouth, blurred vision, constipation, urinary retention. Rare: Paradoxical excitement (especially children), hypersensitivity, confusion (elderly), tinnitus.',
                    contraindicationsExpanded: 'Absolute: Neonates and premature infants (increased sensitivity), hypersensitivity. Relative: Narrow-angle glaucoma, prostatic hypertrophy, urinary obstruction, GI obstruction, asthma, COPD, elderly (increased CNS effects).',
                    drugInteractions: 'CNS depressants (alcohol, opioids, sedatives): Enhanced sedation. Anticholinergics: Additive effects. MAOIs: Enhanced anticholinergic effects. Aminoglycosides: May mask ototoxicity symptoms. Ototoxic drugs: May mask symptoms.',
                    nursingConsiderations: '1) Administer 30-60 minutes before travel. 2) Warn about significant drowsiness. 3) Assess for anticholinergic side effects. 4) Monitor for paradoxical excitement in children. 5) Ensure adequate hydration during travel. 6) May mask symptoms of ototoxicity - use caution if on ototoxic drugs.',
                    patientEducation: 'Take 30 minutes to 1 hour before travel for best effect. Causes drowsiness - do not drive. Avoid alcohol. May cause dry mouth. For long trips, may redose every 4-6 hours. Works best for prevention - less effective once motion sickness starts. Chewable forms may work faster.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'CAUTION - anticholinergic effects', ckd: 'SAFE', pregnancy: 'Category B - commonly used for hyperemesis', elderly: 'CAUTION - increased sensitivity', glaucoma: '⚠️ AVOID' }
                }
            },
            {
                id: 'povidone-iodine',
                name: 'Povidone-Iodine',
                ph_brands: ['Betadine', 'Isodine', 'Wokadine', 'Povidone Solution', 'Defensil', 'Videne'],
                uses: 'Wound antisepsis, skin disinfection, minor cuts and burns, surgical scrub',
                origin: 'Iodophor antiseptic developed in 1955; broad-spectrum antimicrobial',
                whenToGive: 'For wound cleaning and infection prevention; not for deep puncture wounds',
                contraindications: 'Iodine hypersensitivity, thyroid disorders (prolonged use), newborns, deep wounds',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['antiseptic','wound','topical','disinfectant'],
                additionalInfo: {
                    genericNames: ['Povidone-Iodine', 'PVP-I', 'Polyvinylpyrrolidone-Iodine', 'Iodopovidone'],
                    drugClass: 'Topical Antiseptic, Iodophor, Broad-Spectrum Antimicrobial',
                    usesExpanded: 'Wound disinfection (minor cuts, abrasions, burns), preoperative skin preparation, antiseptic hand scrub, vaginal infections (douches), oral antiseptic (gargle for pharyngitis), umbilical cord care, catheter care',
                    mechanismOfAction: 'Iodine complexed with polyvinylpyrrolidone (PVP) which slowly releases free iodine. Free iodine penetrates microbial cell walls and disrupts protein and nucleic acid structure. Broad-spectrum activity against bacteria (gram+ and gram-), fungi, viruses, protozoa, and spores.',
                    originExpanded: 'Developed by H.A. Shelanski and M.V. Shelanski in 1955. The iodophor complex provides sustained iodine release with less tissue irritation and staining than tincture of iodine. Became the gold standard for surgical skin preparation.',
                    pharmacokinetics: 'Minimal systemic absorption from intact skin. Absorption increases with damaged skin, mucous membranes, or prolonged/large-area use. Absorbed iodine is concentrated in thyroid, excreted renally. Local antimicrobial effect begins within 1 minute.',
                    dosing: 'Solution (10%): Apply to affected area 1-3 times daily. Preoperative: Apply and allow to dry (2-3 minutes). Gargle: Dilute to 1% (5ml in 50ml water), gargle for 30 seconds. Scrub: Use for 3-5 minutes. Avoid prolonged use over large areas.',
                    whenToGiveExpanded: 'Apply to clean wound after gentle washing. Allow to dry before covering with bandage. For preoperative skin prep, apply in concentric circles from incision site outward. Brown color indicates active iodine - if faded, reapply.',
                    sideEffects: 'Common: Skin staining (temporary), mild burning on application, skin irritation. Rare: Contact dermatitis, allergic reactions, systemic iodine absorption (thyroid effects with prolonged/extensive use), delayed wound healing (high concentrations).',
                    contraindicationsExpanded: 'Absolute: Iodine or povidone hypersensitivity, use on premature neonates. Relative: Thyroid disorders (Graves disease, Hashimoto), pregnancy (avoid large areas or prolonged use), breastfeeding, deep puncture wounds, severe burns (risk of absorption), renal impairment (chronic use).',
                    drugInteractions: 'Lithium: May enhance hypothyroid effect. Mercury compounds: Potential corrosive reaction. Hydrogen peroxide: Inactivates povidone-iodine. Silver-containing products: May reduce efficacy. Avoid mixing with other antiseptics.',
                    nursingConsiderations: '1) Assess for iodine allergy before use. 2) Clean wound with saline before applying. 3) Allow to dry completely before covering. 4) Monitor for signs of irritation or allergy. 5) Do not use on deep wounds or burns over large areas. 6) Avoid prolonged use in patients with thyroid disorders.',
                    patientEducation: 'Clean wound gently before applying. Allow to dry (brown color indicates active ingredient). Temporary skin staining is normal and will fade. Do not use on deep puncture wounds or animal bites - seek medical attention. Stop use and consult doctor if irritation or rash develops. Not for long-term use over large areas.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE - important for wound care', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION with prolonged use', pregnancy: 'CAUTION - avoid large areas', thyroid: 'CAUTION - monitor function', neonates: '⚠️ AVOID in premature infants' }
                }
            },
            {
                id: 'bacitracin-neomycin',
                name: 'Bacitracin/Neomycin/Polymyxin B',
                ph_brands: ['Neosporin', 'Triple Antibiotic Ointment', 'Polysporin', 'Bacitracin Plus', 'First Aid Antibiotic'],
                uses: 'Minor cuts, scrapes, burns; prevention of wound infection',
                origin: 'Triple antibiotic combination for broad-spectrum topical coverage',
                whenToGive: 'For minor wound care; apply 1-3 times daily; cover with bandage if needed',
                contraindications: 'Deep wounds, puncture wounds, animal bites, serious burns; neomycin allergy common',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['antibiotic','wound','topical','cuts','burns'],
                additionalInfo: {
                    genericNames: ['Bacitracin Zinc', 'Neomycin Sulfate', 'Polymyxin B Sulfate', 'Triple Antibiotic'],
                    drugClass: 'Topical Antibiotic Combination (Polypeptide + Aminoglycoside + Cationic Detergent)',
                    usesExpanded: 'Prevention of infection in minor cuts, scrapes, and burns. First-degree burns, abrasions, minor surgical wounds, skin grafts. NOT for treatment of established infections (requires systemic antibiotics).',
                    mechanismOfAction: 'Three antibiotics provide synergistic broad-spectrum coverage: Bacitracin inhibits bacterial cell wall synthesis (gram-positive coverage). Neomycin inhibits protein synthesis at 30S ribosomal subunit (gram-negative coverage). Polymyxin B disrupts bacterial cell membranes (gram-negative coverage, especially Pseudomonas).',
                    originExpanded: 'Bacitracin discovered in 1943 (named after patient Margaret Tracy). Neomycin discovered by Selman Waksman in 1949. Polymyxin discovered in 1947. The combination (Neosporin) was developed to provide broad-spectrum topical coverage.',
                    pharmacokinetics: 'Topical application - minimal systemic absorption from intact skin. Neomycin may be absorbed from damaged skin or large wounds (risk of ototoxicity/nephrotoxicity). Local antibiotic effect is primary mechanism.',
                    dosing: 'Clean wound gently first. Apply thin layer to affected area 1-3 times daily. May cover with sterile bandage. Continue until wound is healed or for up to 1 week. If no improvement or worsening after 1 week, seek medical attention.',
                    whenToGiveExpanded: 'For minor wounds only - cuts, scrapes, abrasions, minor burns. Apply after cleaning wound with soap and water or saline. Not a substitute for proper wound cleaning. Not for deep wounds, puncture wounds, animal bites, or infected wounds.',
                    sideEffects: 'Common: Local irritation, redness at application site. Neomycin allergy is common (affects ~3-6% of population) - presents as contact dermatitis (rash, itching, worsening redness). Rare: Systemic absorption with large wounds (neomycin ototoxicity/nephrotoxicity).',
                    contraindicationsExpanded: 'Absolute: Known allergy to any component (especially neomycin - common allergen). Relative: Deep puncture wounds, animal/human bites, serious burns (systemic absorption risk), infected wounds requiring systemic antibiotics.',
                    drugInteractions: 'Generally not significant with topical use. If extensive absorption occurs: Aminoglycosides (additive toxicity), loop diuretics (increased ototoxicity risk), neuromuscular blockers (enhanced effect).',
                    nursingConsiderations: '1) Clean wound thoroughly before application. 2) Ask about previous allergic reactions to antibiotic ointments (neomycin allergy common). 3) Apply thin layer only. 4) Monitor for signs of contact dermatitis. 5) Educate that this is for PREVENTION, not treatment of infection. 6) Refer if wound appears infected.',
                    patientEducation: 'Clean wound with soap and water first. Apply thin layer 1-3 times daily. Cover with bandage if desired. Stop use if rash, increased redness, or itching develops (may indicate allergy - neomycin allergy is common). Not for deep cuts, puncture wounds, animal bites, or obviously infected wounds. See doctor if wound worsens or doesn\'t improve in 1 week.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE - wound care important', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION with large wounds', neomycin_allergy: '⚠️ AVOID - use bacitracin only' }
                }
            },
            {
                id: 'docusate',
                name: 'Docusate Sodium',
                ph_brands: ['Colace', 'Dulcoease', 'Surfak', 'Stool Softener', 'Laxadin'],
                uses: 'Constipation prevention, stool softener, post-surgical bowel care',
                origin: 'Surfactant stool softener that increases water penetration into stool',
                whenToGive: 'For constipation prevention or hard stools; takes 1-3 days for effect; not for acute relief',
                contraindications: 'Intestinal obstruction, fecal impaction, nausea/vomiting, abdominal pain',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['constipation','stool softener','laxative'],
                additionalInfo: {
                    genericNames: ['Docusate Sodium', 'Dioctyl Sodium Sulfosuccinate', 'DSS', 'Docusate Calcium'],
                    drugClass: 'Stool Softener (Emollient Laxative), Surfactant, Anionic Surfactant',
                    usesExpanded: 'Prevention of constipation in at-risk patients, softening hard stools, post-operative bowel care, post-myocardial infarction (avoid straining), hemorrhoids, anal fissures, opioid-induced constipation (adjunct), patients on bed rest',
                    mechanismOfAction: 'Acts as a surfactant/detergent that reduces surface tension, allowing water and fats to penetrate the stool. Softens stool by increasing water and fat content. Does NOT stimulate peristalsis - purely a stool softener, not a stimulant laxative.',
                    originExpanded: 'Docusate was developed in the 1950s as the first commercial stool softener. The name comes from "dioctyl" (chemical structure). Available as sodium salt (Colace) or calcium salt (Surfak). One of the mildest laxatives available.',
                    pharmacokinetics: 'Onset: 1-3 days (not for acute constipation). Minimal systemic absorption. Works locally in the intestine. May enhance absorption of other drugs in the GI tract.',
                    dosing: 'Adults: 50-300mg daily in 1-4 divided doses. Usual: 100mg 1-2 times daily. Children 6-12y: 40-150mg daily. Children 3-6y: 20-60mg daily. Take with full glass of water. Effect takes 1-3 days.',
                    whenToGiveExpanded: 'For PREVENTION of constipation, not treatment of acute constipation. Ideal for patients who should avoid straining: post-surgical, post-MI, hemorrhoids, anal fissures. Take with plenty of water. Often used with opioids to prevent opioid-induced constipation.',
                    sideEffects: 'Generally very well tolerated. Mild cramping, diarrhea (if excessive dose), throat irritation (liquid forms), bitter taste. Rare: Rash. May enhance absorption of mineral oil (avoid combination).',
                    contraindicationsExpanded: 'Absolute: Intestinal obstruction, fecal impaction, acute abdominal pain, nausea and vomiting (may indicate obstruction). Relative: Concurrent use with mineral oil (increased absorption of mineral oil). Do not use for more than 1 week without medical advice.',
                    drugInteractions: 'Mineral oil: Avoid - docusate increases absorption of mineral oil (toxicity risk). May increase absorption of other drugs (theoretical). Generally safe with most medications.',
                    nursingConsiderations: '1) Assess bowel patterns and stool consistency. 2) Educate that effect takes 1-3 days - not for acute relief. 3) Ensure adequate fluid intake. 4) Assess for signs of obstruction before administering. 5) Common component of post-operative and post-MI bowel protocols. 6) Do not give with mineral oil.',
                    patientEducation: 'This is a stool SOFTENER, not a stimulant laxative - it takes 1-3 days to work. Drink plenty of water (8+ glasses daily). Not for immediate relief of constipation. Best used to prevent constipation, not treat it. May be taken daily for patients at risk. Do not use for more than 1 week without consulting a doctor.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'SAFE - often recommended', hemorrhoids: 'SAFE - reduces straining', post_MI: 'SAFE - prevents straining' }
                }
            },
            {
                id: 'calcium-carbonate',
                name: 'Calcium Carbonate',
                ph_brands: ['Tums', 'Calcimate', 'Caltrate', 'Calcium Supplement', 'Os-Cal', 'Calci-Aid'],
                uses: 'Antacid, heartburn, calcium supplementation, osteoporosis prevention',
                origin: 'Natural calcium compound used both as antacid and mineral supplement',
                whenToGive: 'As antacid: chew after meals; as supplement: take with food for absorption',
                contraindications: 'Hypercalcemia, kidney stones (calcium), severe renal impairment, digoxin use (caution)',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['antacid','calcium','supplement','heartburn','bones'],
                additionalInfo: {
                    genericNames: ['Calcium Carbonate', 'CaCO3', 'Precipitated Chalk', 'Calcite'],
                    drugClass: 'Antacid, Calcium Supplement, Phosphate Binder',
                    usesExpanded: 'Antacid for heartburn, acid indigestion, GERD symptoms. Calcium supplementation for osteoporosis prevention/treatment. Hyperphosphatemia in chronic kidney disease (as phosphate binder). Hypocalcemia. Pregnancy supplementation.',
                    mechanismOfAction: 'As antacid: Neutralizes gastric acid (CaCO3 + 2HCl → CaCl2 + H2O + CO2). Quick onset but short duration. As supplement: Provides eleite calcium for bone health, muscle function, nerve transmission. As phosphate binder: Binds dietary phosphate in GI tract.',
                    originExpanded: 'Calcium carbonate is a naturally occurring compound found in limestone, marble, and shells. One of the oldest antacids used. Contains 40% elemental calcium (highest among calcium salts). Tums introduced as antacid in 1930.',
                    pharmacokinetics: 'Antacid effect: Onset 5-10 minutes, duration 20-60 minutes. Calcium absorption: Best absorbed in acidic environment - take with food. 15-40% of calcium absorbed. Requires adequate vitamin D for optimal absorption. Excreted renally.',
                    dosing: 'Antacid: 500-1500mg chewed after meals and at bedtime (max 7500mg/day). Supplement: 500-600mg elemental calcium per dose, 2-3 times daily with meals (max 2500mg/day). Adjust for age, dietary intake, and vitamin D status.',
                    whenToGiveExpanded: 'As antacid: Chew tablets thoroughly after meals or when symptoms occur. As supplement: Take with food (stomach acid aids absorption). Divide doses (max 500-600mg per dose for optimal absorption). Do not take with high-fiber meals or iron supplements.',
                    sideEffects: 'Common: Constipation, bloating, gas (due to CO2 release). Excessive use: Hypercalcemia (nausea, vomiting, confusion), milk-alkali syndrome (rare), rebound acid hypersecretion. May cause kidney stones with chronic high doses.',
                    contraindicationsExpanded: 'Absolute: Hypercalcemia, hypercalciuria, severe kidney impairment, calcium-containing kidney stones. Relative: Digoxin therapy (hypercalcemia increases digoxin toxicity), achlorhydria (poor absorption), chronic use as antacid.',
                    drugInteractions: 'Tetracyclines, fluoroquinolones: Reduced absorption (separate by 2-4 hours). Iron supplements: Reduced iron absorption. Thyroid hormones: Reduced absorption. Digoxin: Hypercalcemia increases toxicity. Bisphosphonates: Reduced absorption (separate doses). Thiazide diuretics: Increased hypercalcemia risk.',
                    nursingConsiderations: '1) Distinguish between antacid and supplement use. 2) For supplements, assess dietary calcium intake first. 3) Monitor for constipation. 4) Check calcium and vitamin D levels in chronic users. 5) Many drug interactions - review medication list. 6) Educate on proper timing with other medications. 7) Contains 40% elemental calcium.',
                    patientEducation: 'As antacid: Chew tablets well, take after meals. As supplement: Take with food in divided doses. May cause constipation - increase fiber and water. Do not take with iron or certain antibiotics (separate by 2-4 hours). Contains highest amount of calcium among supplements. Ensure adequate vitamin D for absorption. Do not exceed recommended dose (can cause kidney stones).',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - use as phosphate binder may be appropriate', pregnancy: 'SAFE - often recommended', osteoporosis: 'SAFE - first-line supplement', digoxin_use: '⚠️ CAUTION' }
                }
            },
            {
                id: 'ferrous-sulfate',
                name: 'Ferrous Sulfate',
                ph_brands: ['Iberet', 'Feromin', 'Sangobion', 'Fer-In-Sol', 'Feosol', 'Ferro-Gradumet'],
                uses: 'Iron deficiency anemia, iron supplementation, pregnancy supplementation',
                origin: 'Iron salt supplement for treating and preventing iron deficiency',
                whenToGive: 'For iron deficiency; take on empty stomach if tolerated, or with food if GI upset occurs; vitamin C enhances absorption',
                contraindications: 'Hemochromatosis, hemosiderosis, hemolytic anemia, repeated blood transfusions',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['iron','anemia','supplement','blood'],
                additionalInfo: {
                    genericNames: ['Ferrous Sulfate', 'Iron(II) Sulfate', 'FeSO4', 'Ferrous Sulfate Heptahydrate'],
                    drugClass: 'Iron Supplement, Hematinic, Essential Mineral',
                    usesExpanded: 'Iron deficiency anemia (treatment and prevention), pregnancy supplementation, postpartum anemia, chronic blood loss (menorrhagia, GI bleeding), post-gastrectomy iron deficiency, pediatric growth periods, vegetarian/vegan supplementation',
                    mechanismOfAction: 'Provides ferrous iron (Fe2+) which is absorbed in the duodenum and upper jejunum. Iron is incorporated into hemoglobin for oxygen transport, myoglobin for muscle oxygen storage, and various enzymes. Absorption is enhanced in acidic environment and by vitamin C.',
                    originExpanded: 'Ferrous sulfate has been used for iron deficiency for over 200 years. Contains 20% elemental iron (325mg tablet = 65mg elemental iron). The most commonly prescribed and cost-effective iron supplement. Green vitriol was historically used for anemia before its active component was identified.',
                    pharmacokinetics: 'Absorption: 10-15% absorbed (increases to 20-30% in iron deficiency). Best absorbed on empty stomach in acidic environment. Peak serum iron: 2-4 hours. Distribution: Bound to transferrin. Storage: As ferritin/hemosiderin in liver, spleen, bone marrow. No excretion mechanism - balance maintained by absorption regulation.',
                    dosing: 'Adults (treatment): 325mg (65mg elemental) 2-3 times daily. Prevention: 325mg once daily. Pregnancy: 30-60mg elemental iron daily. Children: 3-6mg elemental/kg/day in divided doses. Take on empty stomach; with food if GI upset (reduces absorption by 40%). Vitamin C enhances absorption.',
                    whenToGiveExpanded: 'Take on empty stomach (1 hour before or 2 hours after meals) for best absorption. If GI upset occurs, take with food (reduces absorption but improves tolerance). Take with vitamin C (orange juice) to enhance absorption. Avoid taking with calcium, antacids, or dairy products.',
                    sideEffects: 'Common (dose-related): Nausea, constipation, diarrhea, abdominal pain, dark stools (normal), metallic taste. Rare: Hemosiderosis (chronic excess), stained teeth (liquid forms). GI effects main reason for non-compliance.',
                    contraindicationsExpanded: 'Absolute: Hemochromatosis, hemosiderosis, hemolytic anemia (increases iron without deficiency), thalassemia (unless concurrent iron deficiency), repeated blood transfusions (iron overload). Relative: Peptic ulcer disease, inflammatory bowel disease, parenteral iron preparations.',
                    drugInteractions: 'Antacids, calcium, dairy: Reduced iron absorption. Tetracyclines, fluoroquinolones: Mutual absorption reduction (separate by 2-4 hours). Levodopa, methyldopa: Reduced absorption. PPIs/H2 blockers: Reduced absorption. Tea, coffee: Tannins reduce absorption. Vitamin C: Enhanced absorption.',
                    nursingConsiderations: '1) Assess for signs of iron deficiency (pallor, fatigue, tachycardia, koilonychia). 2) Check hemoglobin/hematocrit and reticulocyte count. 3) Educate about GI side effects (major cause of non-compliance). 4) Warn about dark stools (normal). 5) Check for drug interactions. 6) Monitor response (reticulocyte increase in 5-10 days, Hgb increase in 2-4 weeks). 7) POISON RISK IN CHILDREN - keep out of reach.',
                    patientEducation: 'Take on empty stomach if possible, or with food if stomach upset. Take with vitamin C (orange juice) for better absorption. Avoid taking with milk, antacids, calcium, tea, or coffee. Stools will turn dark/black - this is normal. May cause constipation - increase fiber and water. Keep away from children - iron overdose is dangerous. Treatment usually continues 3-6 months to replenish iron stores.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'SAFE - monitor iron status', pregnancy: 'SAFE - routinely recommended', thalassemia: '⚠️ CAUTION - only if iron deficient', hemochromatosis: '⚠️ CONTRAINDICATED' }
                }
            },
            {
                id: 'multivitamins',
                name: 'Multivitamins',
                ph_brands: ['Enervon', 'Centrum', 'Stresstabs', 'Cherifer', 'Conzace', 'Myra E', 'Sangobion'],
                uses: 'Nutritional supplementation, vitamin deficiency prevention, general health maintenance',
                origin: 'Combination of essential vitamins and minerals for daily supplementation',
                whenToGive: 'For general supplementation; take with food; not a substitute for balanced diet',
                contraindications: 'Hypervitaminosis (excess of specific vitamins), iron overload conditions',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION' },
                tags: ['vitamin','supplement','multivitamin','nutrition'],
                additionalInfo: {
                    genericNames: ['Multiple Vitamins', 'Multivitamin Supplement', 'Vitamin and Mineral Supplement', 'MVI'],
                    drugClass: 'Nutritional Supplement, Vitamin Supplement, Dietary Supplement',
                    usesExpanded: 'Prevention of vitamin deficiencies, nutritional supplementation for inadequate dietary intake, pregnancy and lactation support, recovery from illness, elderly supplementation, vegetarian/vegan diets, malabsorption syndromes, post-bariatric surgery',
                    mechanismOfAction: 'Provides essential vitamins (A, B-complex, C, D, E, K) and often minerals (iron, zinc, calcium, etc.) that serve as cofactors for enzymatic reactions, antioxidants, and structural components. Each vitamin has specific functions: B-vitamins for energy metabolism, Vitamin C for collagen synthesis, Vitamin D for calcium absorption, etc.',
                    originExpanded: 'First multivitamin tablets introduced in the 1940s. Development followed discovery of individual vitamins in early 20th century. Popular Philippine brands include Enervon (B-complex + C), Centrum (complete), Stresstabs (B-complex + C + E), Cherifer (with growth factors), and Conzace (antioxidant combination).',
                    pharmacokinetics: 'Varies by vitamin: Water-soluble vitamins (B-complex, C) - absorbed in small intestine, excess excreted in urine, require daily intake. Fat-soluble vitamins (A, D, E, K) - require dietary fat for absorption, stored in liver and adipose tissue, risk of accumulation with excess intake.',
                    dosing: 'Usually 1 tablet daily with food. Take with meals to enhance absorption (especially fat-soluble vitamins). Some formulations designed for specific populations: prenatal, pediatric, senior, men\'s, women\'s. Do not exceed recommended dose.',
                    whenToGiveExpanded: 'Take with food to enhance absorption of fat-soluble vitamins and reduce GI upset. Best taken at same time daily. Not a substitute for balanced diet - supplements fill nutritional gaps, not replace food. Consider specific deficiencies before choosing formulation.',
                    sideEffects: 'Generally well tolerated at recommended doses. May cause: Nausea, upset stomach (especially on empty stomach), constipation (if iron-containing), bright yellow urine (riboflavin - normal). Excess fat-soluble vitamins can accumulate (A, D toxicity).',
                    contraindicationsExpanded: 'Absolute: Hypervitaminosis A or D, hemochromatosis (if iron-containing). Relative: Kidney disease (may need to avoid certain minerals), specific vitamin sensitivities. Avoid megadose formulations unless prescribed.',
                    drugInteractions: 'Vitamin K: Antagonizes warfarin. Iron: Reduces absorption of levothyroxine, tetracyclines, fluoroquinolones. Calcium: Interferes with iron and some antibiotics. Vitamin C: May interfere with certain lab tests. Folic acid: May mask B12 deficiency.',
                    nursingConsiderations: '1) Assess dietary intake and nutritional status. 2) Identify specific deficiencies before recommending. 3) Educate that supplements don\'t replace balanced diet. 4) Check for interactions with medications (especially warfarin). 5) Recommend appropriate formulation for patient population. 6) Monitor for signs of vitamin toxicity with excessive intake. 7) Special considerations for pregnancy (avoid excess Vitamin A).',
                    patientEducation: 'Take with food for better absorption. Not a substitute for healthy eating. One tablet daily is usually sufficient - more is not better. Fat-soluble vitamins (A, D, E, K) can accumulate if taken in excess. Bright yellow urine is normal (B2/riboflavin). If taking blood thinners, consult doctor (Vitamin K interaction). Store away from children (iron-containing vitamins are poisoning risk). Choose appropriate formula for your needs.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'SAFE', copd: 'SAFE', ckd: 'CAUTION - avoid high mineral content', pregnancy: 'Use PRENATAL formula', liver_disease: 'CAUTION - avoid excess Vitamin A', warfarin_use: 'CAUTION - Vitamin K interaction' }
                }
            },
            {
                id: 'benzydamine',
                name: 'Benzydamine',
                ph_brands: ['Difflam', 'Tantum Verde', 'Benzydamine Gargle'],
                uses: 'Sore throat pain relief, oral mucositis discomfort, local anti-inflammatory rinse',
                origin: 'Locally acting NSAID used as oromucosal spray or gargle',
                whenToGive: 'For sore throat or mouth pain as directed; do not swallow large amounts',
                contraindications: 'Hypersensitivity to benzydamine or NSAIDs; caution if unable to gargle safely',
                conditionSafety: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'SAFE', ckd: 'SAFE' },
                tags: ['sore throat','throat','lozenge','pharyngitis','analgesic','antiseptic','gargle'],
                additionalInfo: {
                    genericNames: ['Benzydamine hydrochloride'],
                    drugClass: 'Locally acting NSAID (oromucosal analgesic and anti-inflammatory)',
                    usesExpanded: 'Symptomatic relief of sore throat, pharyngitis-related pain, aphthous ulcers, and oral inflammation. Common in Philippine pharmacies as Difflam spray or gargle.',
                    mechanismOfAction: 'Local prostaglandin inhibition plus a membrane-stabilizing analgesic effect on oropharyngeal mucosa, with minimal systemic absorption when used correctly.',
                    dosing: 'Follow the product label. Typical adult gargle or spray intervals are every 1.5 to 3 hours as needed. Spit out after gargling unless the product instructs otherwise.',
                    whenToGiveExpanded: 'Use at the onset of sore throat discomfort. This does not replace checking for bacterial pharyngitis red flags such as high fever, drooling, trismus, or difficulty breathing.',
                    sideEffects: 'Oral numbness, stinging, dry mouth; rare hypersensitivity.',
                    contraindicationsExpanded: 'Known hypersensitivity. Avoid in young children who cannot gargle or spit safely unless the formulation is age-approved.',
                    nursingConsiderations: '1) Assess airway and swallowing. 2) Teach the spit-after-gargle technique. 3) Escalate red-flag throat symptoms to your CI or the physician. 4) Study reference only, not a prescribing decision.',
                    patientEducation: 'This relieves throat pain locally. Seek care for severe pain, high fever, rash, or breathing difficulty.',
                    conditionSafetyExpanded: { hypertension: 'SAFE', diabetes: 'SAFE', asthma: 'CAUTION', copd: 'SAFE', ckd: 'SAFE', pregnancy: 'Ask CI or physician' }
                }
            }
        ];

        const otcListEl = document.getElementById('otc-list');
        const otcDetailEl = document.getElementById('otc-detail');
        const otcSearch = document.getElementById('otc-search');

        function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"); }

        function highlight(text, term){
            if(!term) return text;
            const re = new RegExp(escapeRegex(term), 'ig');
            return text.replace(re, m => `<strong style="font-weight: 800; color: #22d3ee;">${m}</strong>`);
        }

        // OPTIMIZATION: Live analysis with debounced tracking
        let vitalSignsDebounceTimer = null;
        const VITAL_SIGNS_DEBOUNCE_MS = 500;
        let hasTrackedVitalsOpen = false;

        // OPTIMIZATION: Initialize live vital signs analysis on field change with proper event tracking
        function initVitalSignsLiveAnalysis() {
            const vitalFields = ['sys', 'dia', 'temp', 'hr', 'rr', 'age', 'pregnancies', 'pregnant', 'conditions'];
            vitalFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('change', () => {
                        // OPTIMIZATION: Track 'vitals', 'feature_open' on first interaction
                        if (!hasTrackedVitalsOpen) {
                            hasTrackedVitalsOpen = true;
                            trackUsageSafe('vitals', 'feature_open', {
                                trigger: 'field_changed',
                                field: fieldId
                            }, { minIntervalMs: 5000, rateKey: 'vitals_feature_open' });
                        }

                        // OPTIMIZATION: Debounce live analysis + tracking
                        if (vitalSignsDebounceTimer) {
                            clearTimeout(vitalSignsDebounceTimer);
                        }
                        vitalSignsDebounceTimer = setTimeout(() => {
                            const analysisResult = liveAnalyze();
                            
                            // OPTIMIZATION: Track 'vitals', 'result_generated' on debounced live analysis run (NOT per keystroke)
                            if (analysisResult && analysisResult.ok) {
                                trackUsageSafe('vitals', 'result_generated', {
                                    source: 'live_analysis',
                                    priority: analysisResult.priority,
                                    findings_count: analysisResult.findings_count,
                                    recommendation_count: analysisResult.recommendation_count,
                                    has_comorbidity: analysisResult.has_comorbidity,
                                    pregnant: analysisResult.pregnant
                                }, { minIntervalMs: 250, rateKey: `live_analysis_${Date.now()}` });
                            }
                            
                            vitalSignsDebounceTimer = null;
                        }, VITAL_SIGNS_DEBOUNCE_MS);
                    });
                }
            });
        }

        // State for OTC list preview - incremental loading
        let otcVisibleCount = 3;
        const OTC_INCREMENT = 3;
        window.otcDatabase = otcDatabase;
        // OPTIMIZATION: Debounce timer for OTC search input
        let otcSearchDebounceTimer = null;
        const OTC_SEARCH_DEBOUNCE_MS = 300;

        // IMPROVED SEARCH: Fuzzy/smart search helper with relevance ranking
        function smartSearch(query, item) {
            const q = query.toLowerCase().trim();
            if (!q) return { match: true, score: 0 };

            let score = 0;
            const name = item.name.toLowerCase();
            const brands = (item.ph_brands || []).map(b => b.toLowerCase()).join(' ');
            const uses = (item.uses || '').toLowerCase();
            const tags = (item.tags || []).map(t => t.toLowerCase()).join(' ');
            const additionalInfo = item.additionalInfo || {};
            const usesExpanded = (additionalInfo.usesExpanded || '').toLowerCase();
            const whenToGiveExpanded = (additionalInfo.whenToGiveExpanded || '').toLowerCase();
            
            // Extract all string fields from additionalInfo into deepText
            const deepText = Object.values(additionalInfo)
                .filter(val => typeof val === 'string')
                .map(val => val.toLowerCase())
                .join(' ');

            // Exact matches get highest score
            if (name === q) return { match: true, score: 1000 };
            if (brands.split(' ').includes(q)) return { match: true, score: 950 };

            // Starts with query
            if (name.startsWith(q)) score += 500;
            if (uses.startsWith(q)) score += 300;
            if (brands.startsWith(q)) score += 400;

            // Contains query
            if (name.includes(q)) score += 200;
            if (brands.includes(q)) score += 150;
            if (uses.includes(q)) score += 100;
            if (usesExpanded.includes(q)) score += 80;
            if (tags.includes(q)) score += 120;
            if (whenToGiveExpanded.includes(q)) score += 70;
            if (deepText.includes(q)) score += 30;

            // Fuzzy: check for partial word matches (e.g. 'fever' matches 'antipyretic')
            const queryWords = q.split(/\s+/);
            const allText = `${name} ${brands} ${uses} ${tags} ${usesExpanded} ${whenToGiveExpanded} ${deepText}`;
            queryWords.forEach(word => {
                if (word.length > 2 && allText.includes(word)) score += 40;
            });

            // Related symptom mapping (e.g. 'cough' → 'antitussive', 'diarrhea' → 'antidiarrheal')
            const symptomMap = {
                'cough': ['antitussive', 'decongestant', 'cold'],
                'asthma': ['bronchospasm', 'respiratory', 'breathing', 'broncho'],
                'breathing': ['respiratory', 'broncho', 'asthma', 'dyspnea'],
                'diarrhea': ['antidiarrheal', 'gastro', 'bowel', 'digestive'],
                'fever': ['antipyretic', 'temperature', 'thermal'],
                'pain': ['analgesic', 'ache', 'soreness', 'discomfort'],
                'painkiller': ['analgesic', 'pain relief'],
                'heartburn': ['antacid', 'reflux', 'gerd', 'acid'],
                'allergy': ['antihistamine', 'allergic', 'hives'],
                'nausea': ['antiemetic', 'vomiting', 'gastro'],
                'sore throat': ['throat', 'lozenge', 'pharyngitis', 'analgesic', 'antiseptic'],
                'throat': ['sore throat', 'lozenge', 'pharyngitis', 'analgesic'],
                'toothache': ['dental', 'analgesic', 'pain', 'tooth'],
                'constipation': ['laxative', 'stool', 'bowel', 'fiber'],
                'motion sickness': ['antiemetic', 'nausea', 'dimenhydrinate', 'meclizine', 'travel'],
                'rash': ['antihistamine', 'topical', 'skin', 'itch', 'dermatitis'],
                'skin': ['topical', 'rash', 'itch', 'dermatitis', 'wound'],
                'wound': ['antiseptic', 'wound', 'skin', 'iodine', 'povidone'],
                'wound care': ['antiseptic', 'wound', 'dressing', 'povidone']
            };
            if (symptomMap[q]) {
                symptomMap[q].forEach(related => {
                    if (allText.includes(related)) score += 60;
                });
            }

            return { match: score > 0, score };
        }

        function renderOTCList(filter){
            const q = (filter||'').trim().toLowerCase();
            // OPTIMIZATION: Use DocumentFragment for efficient DOM rendering
            const fragment = document.createDocumentFragment();
            
            // IMPROVED SEARCH: Smart search with relevance ranking + fuzzy fallback
            let matches = otcDatabase
                .map(item => ({ item, ...smartSearch(q, item) }))
                .filter(r => r.match)
                .sort((a, b) => b.score - a.score)
                .map(r => r.item);

            let usedFuzzy = false;
            if (q && matches.length === 0 && window.NursePathCalculators && typeof window.NursePathCalculators.fuzzyDrugFallback === 'function') {
                matches = window.NursePathCalculators.fuzzyDrugFallback(q, otcDatabase, 2);
                usedFuzzy = matches.length > 0;
            }

            if(matches.length === 0){
                const noMatch = document.createElement('div');
                noMatch.className = 'otc-empty';
                noMatch.textContent = 'No matches found. Try a brand name, generic, or symptom (e.g. fever, cough, sore throat).';
                fragment.appendChild(noMatch);
                otcListEl.innerHTML = '';
                otcListEl.appendChild(fragment);
                return;
            }

            if (usedFuzzy) {
                const hint = document.createElement('div');
                hint.className = 'otc-fuzzy-hint';
                hint.textContent = 'Showing close matches (typo-tolerant search).';
                fragment.appendChild(hint);
            }

            // If searching, show all results; otherwise respect the visible count limit
            const isSearching = q.length > 0;
            const itemsToShow = isSearching ? matches : matches.slice(0, otcVisibleCount);
            const hiddenCount = matches.length - otcVisibleCount;
            const selectedId = window.__nursepathSelectedOtc && window.__nursepathSelectedOtc.id;

            itemsToShow.forEach((item) => {
                const searchTerm = q;
                const title = highlight(item.name, searchTerm);
                const trade = highlight(item.ph_brands.join(', '), searchTerm);
                const usesPreview = highlight(item.uses, searchTerm);
                const initials = String(item.name || 'OTC')
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 3) || 'OTC';
                const tagRaw = (item.additionalInfo && item.additionalInfo.drugClass)
                    ? String(item.additionalInfo.drugClass).split(/[\/,(-]/)[0].trim()
                    : 'OTC';
                const tag = tagRaw.length > 14 ? `${tagRaw.slice(0, 13)}…` : tagRaw;

                const card = document.createElement('button');
                card.type = 'button';
                card.className = 'otc-med-card' + (selectedId && item.id === selectedId ? ' is-active' : '');
                card.dataset.otcId = item.id || '';
                card.style.setProperty('--accent', '#fbbf24');
                card.innerHTML = `
                    <span class="tool-hub-icon">${initials}</span>
                    <span class="otc-med-meta">
                        <span class="tool-hub-label">${title}</span>
                        <span class="tool-hub-desc">${trade}</span>
                        <span class="otc-med-uses">${usesPreview}</span>
                    </span>
                    <span class="tool-hub-tag">${tag}</span>`;
                card.onclick = () => showOTCDetail(item);
                fragment.appendChild(card);
            });

            // Show "Show More" button if not searching and there are more items to show
            if (!isSearching && hiddenCount > 0) {
                const showMoreBtn = document.createElement('button');
                showMoreBtn.type = 'button';
                showMoreBtn.className = 'otc-more-btn';
                const nextBatch = Math.min(OTC_INCREMENT, hiddenCount);
                showMoreBtn.innerHTML = `<span>Show ${nextBatch} more</span><span class="otc-remaining">${hiddenCount} left</span>`;
                showMoreBtn.onclick = () => {
                    otcVisibleCount += OTC_INCREMENT;
                    renderOTCList('');
                };
                fragment.appendChild(showMoreBtn);
            }
            
            // Show "Show Less" button if showing more than initial amount
            if (!isSearching && otcVisibleCount > OTC_INCREMENT) {
                const showLessBtn = document.createElement('button');
                showLessBtn.type = 'button';
                showLessBtn.className = 'otc-less-btn';
                showLessBtn.textContent = 'Show less';
                showLessBtn.onclick = () => {
                    otcVisibleCount = OTC_INCREMENT;
                    renderOTCList('');
                    otcListEl.scrollIntoView({behavior:'smooth', block:'start'});
                };
                fragment.appendChild(showLessBtn);
            }
            
            // OPTIMIZATION: Use DocumentFragment to batch DOM updates
            otcListEl.innerHTML = '';
            otcListEl.appendChild(fragment);
        }

        function calcIV() {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.calcIV === 'function') {
                return window.NursePathUIHelpers.calcIV();
            }
        }

        function calcBMI() {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.calcBMI === 'function') {
                return window.NursePathUIHelpers.calcBMI();
            }
        }

        function calcAOGEDD() {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.calcAOGEDD === 'function') {
                return window.NursePathUIHelpers.calcAOGEDD();
            }
        }

        function showPregnancyMilestones(currentWeeks, currentDays, calcDate, lmp) {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.showPregnancyMilestones === 'function') {
                return window.NursePathUIHelpers.showPregnancyMilestones(currentWeeks, currentDays, calcDate, lmp);
            }
        }

        function showOTCDetail(item, opts) {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.showOTCDetail === 'function') {
                return window.NursePathUIHelpers.showOTCDetail(item, opts);
            }
        }

        function hideOTCDetail(opts) {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.hideOTCDetail === 'function') {
                return window.NursePathUIHelpers.hideOTCDetail(opts);
            }
        }

        async function copyOTCReference() {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.copyOTCReference === 'function') {
                return window.NursePathUIHelpers.copyOTCReference();
            }
        }

        function switchOTCTab(tab) {
            if (window.NursePathUIHelpers && typeof window.NursePathUIHelpers.switchOTCTab === 'function') {
                return window.NursePathUIHelpers.switchOTCTab(tab);
            }
        }

        // OPTIMIZATION: Add 300ms debounce to search input for better performance
        otcSearch.addEventListener('input', (e) => {
            if (otcSearchDebounceTimer) {
                clearTimeout(otcSearchDebounceTimer);
            }
            otcSearchDebounceTimer = setTimeout(() => {
                renderOTCList(e.target.value);
                otcSearchDebounceTimer = null;
            }, OTC_SEARCH_DEBOUNCE_MS);
        });

        window.__nursepathBootApp = function () {
            if (!window.__nursepathAuthState || !window.__nursepathAuthState.authenticated || window.__nursepathAuthState.booted) {
                return;
            }
            renderOTCList('');
            if (typeof initLabRanges === 'function') initLabRanges();
            initVitalSignsLiveAnalysis();
            applyRoleVisibility();
            window.__nursepathAuthState.booted = true;
            window.__nursepathAuthState.pendingBoot = false;
            if (!hasTabAppInitLogged()) {
                trackUsageSafe('session', 'app_init', {
                    source: 'auth_boot'
                }, { minIntervalMs: 2000, rateKey: 'app_init_once_per_tab' });
                markTabAppInitLogged();
            }
        };

        if (window.__nursepathAuthState && window.__nursepathAuthState.pendingBoot) {
            window.__nursepathBootApp();
        }
    
